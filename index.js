const express = require("express");
const http = require("http");
const wss = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const path = require("path");
const app = express();
const server = http.Server(app);
const ws = wss(server, {
	cors: {
		origin: ["https://admin.socket.io"],
		credentials: true
	}
});
const io = ws;
const dontsaythat = require('./dontsaythat')
const { QuickDB } = require('quick.db');
const { marked } = require('marked');
const db = new QuickDB();
const ejs = require("ejs");
const users = [];
const Filter = require('bad-words'),
	filter = new Filter();


// marked.use({
// 	tokenizer: {
		
// 	}
// })

filter.addWords(...dontsaythat)
filter.removeWords('god', 'poop', 'crap', 'goddamn', 'scrap')

const { name } = require('./package.json')

instrument(ws, {
	auth: {
		type: "basic",
		username: "admin",
		password: require('bcrypt').hashSync(process.env.ADMIN_UI_PASSWORD, 10)
	},
});

const admin = ws.of('/admin')

const nsps = {
	'/': ws.of('/'),
	'/admin': ws.of('/admin'),
	'/voice': ws.of('/voice')
}

const { '/admin': adminNsp, '/voice': voiceNsp } = nsps

let betaTesters = [
	"haroon",
	"bddy",
	"Platformer22",
	"zplusfour",
	"21natzil",
	"IroncladDev",
	"Cleverbot",
	"connor",
	"RayhanADev",
	"apollo130",
	"DillonB07",
	"yeshsgsvgs"
]

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

ws.on("connection", socket => {
  if (!socket.handshake.headers['x-replit-user-name']) socket.disconnect();
	// socket.handshake.headers.referer.split('/')[4]
	// if (socket.handshake.headers.referer instanceof String && socket.handshake.headers.referer.split('/')[4] == "debug-see-all-rooms") return socket.emit("UserMessage", { 
	//     channel: "debug-see-all-rooms",
	//     author: `System <span id="bottag" style="margin-left: 10px">Verified Bot</span>`, 
	//     date: new Date().getTime(), 
	//     content: "No. Just no.",
	//     pfp: 'https://www.gravatar.com/avatar/70f68d9254a26e13edbd59e97869969b?d=https://repl.it/public/images/evalbot/evalbot_24.png&s=256'
	//   })

	// socket.join(socket.handshake.headers.referer instanceof String ? socket.handshake.headers.referer.split('/')[4] : 'debug-see-all-rooms')
	socket.join(socket.handshake.headers.referer.split('/')[4])
  if (["DazaSealos", "EastonPrewitt1"].includes(socket.handshake.headers['x-replit-user-name'])) {return socket.disconnect();}
	socket.on('reload', async u => {
		if (['bddy', 'haroon'].includes(socket.handshake.headers['x-replit-user-name']) == false) return;
		ws.emit('reload')
	})
	socket.on('PA', async u => {
		if (['bddy', 'haroon'].includes(socket.handshake.headers['x-replit-user-name']) == false) return;
		let html = `
<div id="PA" style="
    position: fixed;
    background: rgba(0,0,0,.3);
    height: 100%;
    width: 100%;
    ">
        <div style="
            position: absolute;
            display: flex;
            flex-direction: column;
            gap: 10px;
            top: 50%;
            left: 50%;
            border-radius: 7px;
            transform: translate(-50%, -50%);
            width: 50%;
            /* height: 35%; */
            background:
            var(--background-2);
            padding: 15px;
            ">
            <h2>Public Announcement from</h2>
            <p>${u.m}</p>
    <a style="
        width: 100%;
        height: 25px;
        border-radius: 7px;
        background: var(--accent-1);
        display: flex;
        align-items: center;
        padding: 19px;
        justify-content: center;
        cursor: pointer;
        " onclick="document.getElementById('PA').remove()">Close</a>
            </div>
    </div>
	`
		ws.emit('PA', html)
	})
	socket.on('SlashCommand', async _ => {
		function send(msg, target = socket) {
			target.emit('UserMessage', {
				channel: socket.handshake.headers.referer.split('/')[4],
				author: `System <span id="bottag" style="margin-left: 10px">Verified Bot</span>`,
				date: new Date().getTime(),
				content: msg,
				pfp: 'https://www.gravatar.com/avatar/70f68d9254a26e13edbd59e97869969b?d=https://repl.it/public/images/evalbot/evalbot_24.png&s=256'
			})
		}
		try {
			let args = _.slice(1).split(' ')
			let cmd = args.shift();

			let cmds = require('fs').readdirSync('./slashcmds').filter(x => x.endsWith('.js'))

			if (cmds.includes(`${cmd}.js`)) {
				let exportVariable;
				eval(
					require('fs').readFileSync(`./slashcmds/${cmd}.js`).toString()
						.replaceAll('module.exports', 'exportVariable')
						.replaceAll('exports', 'exportVariable')
				)

				exportVariable.execute(socket, args, ws, send)
			}
		} catch (err) {
			console.log(err)
		}
	})
	socket.on("UserMessage", async message => {
		message.pfp = socket.handshake.headers['x-replit-user-profile-image'] || "https://www.gravatar.com/avatar/70f68d9254a26e13edbd59e97869969b?d=https://repl.it/public/images/evalbot/evalbot_24.png&s=256";

		const newTitles = {
			"bddy": [
        "Lead Dev",
        "Loyal",
				`<img src="https://assets.tumblr.com/pop/src/assets/images/download-on-the-appstore/en-8c4986ee.svg" width="100px" height="20px" />`,
				"Admin"
      ],
			"haroon": [
        "Lead Dev",
        "Loyal",
				"Admin"
      ],
      "Cleverbot": [
        "Verified Bot",
        "Loyal"
      ],
      "RayhanADev": [
        "Furret.CSS Theme Creator",
        "Loyal"
      ],
      "HyperHacker": [
        "Loyal"
      ],
      "Bookie0": [
        "Loyal"
      ],
      "21natzil": [
        "Loyal",
        `<span style="display:flex;align-items:center;">Zwack&nbsp;<img src='https://cdn.discordapp.com/emojis/451912829142827008.webp?size=16'></span>`
      ],
      "DillonB07": [
        "Mac App Builder",
        "Loyal",
        "Helper",
				"Admin"
      ],
      "redsox200729": [
        "Loyal"
      ]
		}

		const emojis = {
			"bddy": "https://storage.googleapis.com/replit/images/1654871865103_c37e9b4f4dbbc3efc3720a0b950432e2.gif",
			"apollo130": "https://storage.googleapis.com/replit/images/1657818394846_f1de31a595befad8efc261c951f9dfd4.png",
			"haroon": "https://storage.googleapis.com/replit/images/1655396152278_c41bd5ce982f9e3a14d27f041d89edbc.png"
		}
		// wiat confusion
		const username = socket.handshake.headers['x-replit-user-name']
		const msg = message.content

    let titles = newTitles[username] ? '<span style="margin-left:5px;" id="bottag">'+newTitles[username].join('</span><span style="margin-left:5px;" id="bottag">')+'</span>' : ''

		message.author = `${socket.handshake.headers['x-replit-user-name']}&nbsp;&nbsp;${titles}${betaTesters.includes(socket.handshake.headers['x-replit-user-name']) ? '<span id="bottag" style="margin-left: 5px">Beta Tester</span>' : ''}`

		message.content = message.content.replaceAll("<", "&lt;").replaceAll(">", "&gt;")

    for (let key in emojis) {
			message.content = message.content.replaceAll(`:${key}:`, `<img src='${emojis[key]}' class='emoji' />`)
		}
		//message.content = DOMPurify.sanitize(message.content)
		message.content = marked.parse(message.content)
		message.content = filter.clean(message.content);

		// doing emojis

		// haroon why wont hthis work omg

		// ending emojis

		let shadowBans = await db.get('shadowBans')

		message.raw = {}

		message.raw.content = msg
		message.raw.author = username

		if (Object.keys(shadowBans).includes(username)) {
			let adminSocks = (await io.fetchSockets()).filter(x => ['3586618', '3670753', '5431535'].includes(x.handshake.headers['x-replit-user-id']))

			if (adminSocks.length) {
				adminSocks.forEach(sock => {
					sock.emit("UserMessage", message, true)
				})
			}

			return socket.emit("UserMessage", message)
		}

		ws.to(message.channel).emit("UserMessage", message);
		await db.push('messages-' + message.channel, message);
		if (message.channel == "spam") return;
		console.log(`(#${message.channel}) ${username}: ${msg}`)
	});
});

app.use(express.static("public"));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.set('trust proxy', 1)

app.get("/", async (req, res) => {
	let cachedMessages = await db.get('messages-lobby');
	let cpt = req.query['compact'] || true
	const username = req.get("X-Replit-User-Name") || null;
	res.render("index", {
		user: {
			name: username
		},
		// cpt,
		// cachedMessages,
		name
	});
});

app.get('/login', (req, res) => {
	res.redirect('https://replit.com/auth_with_repl_site?domain=2chat.bddy.repl.co')
})

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
		cachedMessages,
		name
	});
});

app.get('/download', (req, res) => {
	res.render('download', {
		name
	})
})

app.get("/lg", (req, res) => {
	res.send(
		`		<script authed="location.href = '/' " src="https://auth.util.repl.co/script.js"></script>`
	);
});


// Start Voice Chat
let VoiceChat_Whitelisted_Users = [
	"haroon",
	"bddy",
	"Platformer22",
	"zplusfour",
	"21natzil",
	"IroncladDev",
	"soren",
	"MRXXX999",
	'REAPERVIRUS',
  "DillonB07",
  "yeshsgsvgs",
	"Raadsel"
] // disable whitelist tmrw? ok no imma add myself if u dont mind - yeshgvs

const VoiceChat_Current_Users = new Map();
const VoiceChat_User_States = new Map();

app.get("/voice/:channel", async (req, res) => {
	const username = req.get("X-Replit-User-Name") || null;
	if (!VoiceChat_Whitelisted_Users.includes(username)) return res.send("Voice Chat is whitelisted to certian users.")
	res.render("voice", {
		channel: req.params.channel,
		user: {
			name: username
		},
		name
	});
});

voiceNsp.on('connection', async (socket) => {
	if (!socket.handshake.headers['x-replit-user-id']) return;
	let user = {
		id: socket.handshake.headers['x-replit-user-id'],
		name: socket.handshake.headers['x-replit-user-name'],
		img: socket.handshake.headers['x-replit-user-profile-image'] || "https://www.gravatar.com/avatar/70f68d9254a26e13edbd59e97869969b?d=https://repl.it/public/images/evalbot/evalbot_24.png&s=256"
	}
	let curChannel;
	socket.on('voice.join', (channel) => {
		socket.join(channel)
		curChannel = channel
		if (!VoiceChat_Current_Users.has(channel)) VoiceChat_Current_Users.set(channel, new Map());
		let curUsers = VoiceChat_Current_Users.get(channel)
		socket.emit('voice.users', Object.fromEntries(curUsers))
		voiceNsp.to(channel).emit('voice.join', user)
		curUsers.set(socket.id, user)
		let UserState = Object.assign(user, user)
		UserState.muted = UserState.deafened = false
		VoiceChat_User_States.set(socket.id, UserState)
    	socket.on('voice.data', (dataUri) => {
  		if (VoiceChat_User_States.get(socket.id).muted) return;
  		let deaf = Object.keys(Object.fromEntries(VoiceChat_User_States)).filter(x => VoiceChat_User_States.get(x).deafened && VoiceChat_Current_Users.get(curChannel).has(x))
  		voiceNsp.except(socket.id).except(deaf).to(curChannel).emit('voice.data', user, dataUri)
  	})
  
  	socket.on('voice.mute', (state) => {
  		let UserState = VoiceChat_User_States.get(socket.id)
  
  		UserState.muted = state
  
  		VoiceChat_User_States.set(socket.id, UserState)
  	})
  
  	socket.on('voice.deaf', (state) => {
  		let UserState = VoiceChat_User_States.get(socket.id)
  
  		UserState.deafened = state
  
  		VoiceChat_User_States.set(socket.id, UserState)
  	})
  
  	socket.on('voice.leave', () => {
  		socket.leave(curChannel)
  		voiceNsp.except(socket.id).to(curChannel).emit('voice.leave', user)
  		try {
  			(VoiceChat_Current_Users.get(curChannel) || new Map()).delete(socket.id)
  		} catch (err) {
  			console.log(err)
  		}
  	})
  	socket.on('disconnecting', () => {
  		socket.leave(curChannel)
  		voiceNsp.except(socket.id).to(curChannel).emit('voice.leave', user)
  		try {
  			(VoiceChat_Current_Users.get(curChannel) || new Map()).delete(socket.id)
  		} catch (err) {
  			console.log(err)
  		}
  	})
	});
})

// End Voice Chat







app.get('/logout', (req, res) => {
	res.cookie("REPL_AUTH", "")
	res.redirect('/')
})




app.get("*", (req, res) => {
	res.render('404', {
		url: req.url,
		name
	})
})

server.listen(80);

process.on('unhandledRejection', (e) => {
	console.error(e)
	require('fs').appendFileSync('./err.txt', e + '\n' + e.stack  +Date.now() + '\n--------------\n\n')
});
process.on('uncaughtException', (e) => {
	console.error(e)
	require('fs').appendFileSync('./err.txt', e + '\n' + e.stack  +Date.now() + '\n--------------\n\n')
});

// process.stderr.pipe(require('fs').createWriteStream('./err.txt'))