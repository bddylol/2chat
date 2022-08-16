const express = require("express");
const http = require("http");
const wss = require("socket.io");
const path = require("path");
const app = express();
const server = http.Server(app);
const ws = wss(server);
const dontsaythat = require('./dontsaythat')
const { QuickDB } = require('quick.db');
const { marked } = require('marked');
const db = new QuickDB();
const ejs = require("ejs");
const users = [];
const Filter = require('bad-words'),
	filter = new Filter({ emptyList: true });

filter.addWords(...dontsaythat)




ws.on("connection", socket => {
	socket.on('PA', async u => {
		if (u.name !== "bddy") return;
		let html = `
		<div id="pa">
			<div style="display:flex;background-color: #ad2121;padding: 9px 10px;gap: 10px;flex-direction: column;">
	    <h2>Public Announcement</h2>
		<span>${u.m}</span></div>
		</div>
	`
		io.emit('PA', html)
	})
	socket.on("UserMessage", async message => {
		let resp = await require("node-fetch")("https://replit.com/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "Mozilla/5.0",
				"X-Requested-With": "2Chat",
				Referer: "https://replit.com"
			},
			body: JSON.stringify({
				query:
					"query userByUsername($username: String!) { user: userByUsername(username: $username) { image } }",
				variables: { username: message.author }
			})
		}).then(res => res.json());

		let data = resp.data || {};
		message.pfp = data.user
			? data.user.image
			: "https://www.gravatar.com/avatar/70f68d9254a26e13edbd59e97869969b?d=https://repl.it/public/images/evalbot/evalbot_24.png&s=256";

		const titles = {
			"bddy": "[Developer] [kool kid] [Verified] ",
			"haroon": "[Developer] [Verified] ",
			"Apollo130": "[Tester] ",
			"zplusfour": "[Tester] "
		}

		const emojis = {
			"bddy": "https://storage.googleapis.com/replit/images/1654871865103_c37e9b4f4dbbc3efc3720a0b950432e2.gif",
			"apollo130": "https://storage.googleapis.com/replit/images/1657818394846_f1de31a595befad8efc261c951f9dfd4.png",
			"haroon": "https://storage.googleapis.com/replit/images/1655396152278_c41bd5ce982f9e3a14d27f041d89edbc.png"
		}
		// wiat confusion
		const username = message.author
		const msg = message.content

		for (let key in emojis) {
			message.content = message.content.replaceAll(`:${key}:`, `<img src='${emojis[key]}' class='emoji' />`)
		}

		message.author = `${titles[message.author] || ''}${message.author}`

		// message.content = message.content.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
		message.content = message.content.replaceAll("style=", "")
		message.content = message.content.replaceAll("style =", "")
		message.content = message.content.replaceAll("style = ", "")
		message.content = message.content.replaceAll("<script>", "")
		message.content = message.content.replaceAll("</script>", "")
		message.content = message.content.replaceAll("<style>", "")
		message.content = message.content.replaceAll("</style>", "")
		message.content = message.content.replaceAll("onclick", "")
		message.content = message.content.replaceAll("keydown", "")
		message.content = message.content.replaceAll("keyup", "")
		message.content = message.content.replaceAll("onload", "")
		message.content = marked.parse(message.content)
		message.content = filter.clean(message.content);

		// doing emojis

		// haroon why wont hthis work omg

		// ending emojis

		ws.emit("UserMessage", message);
		await db.push('messages-' + message.channel, message)
		console.log(`(#${message.channel}) ${username}: ${msg}`)
	});
});

app.use(express.static("public"));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

let whitelist = ["bddy", "zplusfour", "RayhanADev", "haroon", 'discordaddict'];

app.get("/", async (req, res) => {
	let cachedMessages = await db.get('messages-lobby');
	let cpt = req.query['compact'] || true
	const username = req.get("X-Replit-User-Name") || null;
	res.render("index", {
		user: {
			name: username
		},
		cpt,
		cachedMessages
	});
});

app.get("/channels/:channel", async (req, res) => {
	let cachedMessages = await db.get('messages-' + req.params.channel);
	let cpt = req.query['compact'] || true
	const username = req.get("X-Replit-User-Name") || null;
	res.render("channels", {
		channel: req.params.channel,
		user: {
			name: username
		},
		cpt,
		cachedMessages
	});
});

// app.get("/channels/example", async (req, res) => {
// 	let cachedMessages = await db.get('messages-example');
// 	let cpt = req.query['compact'] || true
// 	const username = req.get("X-Replit-User-Name") || null;
// 	res.render("channels/example", {
// 		user: {
// 			name: username
// 		},
// 		cpt,
// 		cachedMessages
// 	});
// });

app.get('/download', (req, res) => {
	res.render('download')
})

app.get("/lg", (req, res) => {
	res.send(
		`		<script authed="location.href = '/' " src="https://auth.util.repl.co/script.js"></script>`
	);
});


// Start Voice Chat
let VoiceChat_Whitelisted_Users = [
	"haroon",
	"bddy"
]

const VoiceChat_Current_Users = new Map();
const VoiceChat_User_States = new Map();

app.get("/voice/:channel", async (req, res) => {
	const username = req.get("X-Replit-User-Name") || null;
	if (!VoiceChat_Whitelisted_Users.includes(username)) return res.send("Voice Chat is whitelisted to certian users.")
	res.render("voice", {
		channel: req.params.channel,
		user: {
			name: username
		}
	});
});

ws.on('connection', async (socket) => {
	if (!socket.handshake.headers['x-replit-user-id']) return;
  let resp = await require("node-fetch")("https://replit.com/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "Mozilla/5.0",
				"X-Requested-With": "2chat",
				Referer: "https://replit.com"
			},
			body: JSON.stringify({
				query:
					"query userByUsername($username: String!) { user: userByUsername(username: $username) { image } }",
				variables: { username: socket.handshake.headers['x-replit-user-name'] }
			})
		}).then(res => res.json());
  let data = resp.data || {};
	let user = {
		id: socket.handshake.headers['x-replit-user-id'],
		name: socket.handshake.headers['x-replit-user-name'],
    img: data.user
			? data.user.image
			: "https://www.gravatar.com/avatar/70f68d9254a26e13edbd59e97869969b?d=https://repl.it/public/images/evalbot/evalbot_24.png&s=256"
	}
	let curChannel;
	socket.on('voice.join', (channel) => {
		socket.join(channel)
		curChannel = channel
    if (!VoiceChat_Current_Users.has(channel)) VoiceChat_Current_Users.set(channel, new Map());
    let curUsers = VoiceChat_Current_Users.get(channel)
		socket.emit('voice.users', Object.fromEntries(curUsers))
		ws.to(channel).emit('voice.join', user)
		curUsers.set(socket.id, user)
    let UserState = Object.assign(user, user)
    UserState.muted = UserState.deafened = false
		VoiceChat_User_States.set(socket.id, UserState)
	});

	socket.on('voice.data', (dataUri) => {
    let deaf = Object.keys(Object.fromEntries(VoiceChat_User_States)).filter(x => VoiceChat_User_States.get(x).deafened && VoiceChat_Current_Users.get(curChannel).has(x))
		ws.except(socket.id).except(deaf).to(curChannel).emit('voice.data', user, dataUri)
	})

  socket.on('voice.mute', () => {
    let UserState = VoiceChat_User_States.get(socket.id)

    UserState.muted = !UserState.muted

    VoiceChat_User_States.set(socket.id, UserState)
  })

	socket.on('voice.leave', () => {
		socket.leave(curChannel)
		ws.except(socket.id).to(curChannel).emit('voice.leave', user)
		VoiceChat_Current_Users.delete(socket.id)
	})
	socket.on('disconnecting', () => {
		socket.leave(curChannel)
		ws.except(socket.id).to(curChannel).emit('voice.leave', user)
		VoiceChat_Current_Users.delete(socket.id)
	})
})

// End Voice Chat







app.get('/logout', (req, res) => {
	res.cookie("REPL_AUTH", "")
  res.redirect('/')
})




app.get("*", (req, res) => {
	res.render('404', {
		url: req.url
	})
})

server.listen(80);
