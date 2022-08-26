(async () => {
	var selem = document.currentScript;
	let chat = document.getElementById("chat")
	chat.scrollTo(0, chat.scrollHeight);

	// var username = selem.attributes.u.value

	var username = selem.getAttribute("u")
	var socket = io();

	console.log(username)
	if (username == null || username == "") {
		console.log(username)
		document.getElementById("container").style.display = "none"
		document.getElementById("login").style.display = "flex"
	}

	// socket.on('LoadDatabaseMessages', (m) => {
	// 	m.map(ms => {
	// 		socket.emit('UserMessage', { author: ms.author, date: ms.date, content: m.content })
	// 	})
	// })

	socket.on('reload', () => {
		location.reload()
	})
	
	socket.on("PA", async u => {
		let chat = document.getElementById("chat")

		let a = document.createElement("div");

		a.innerHTML = u

		chat.appendChild(a)
		chat.scrollTo(0, chat.scrollHeight);
		
	})


	socket.on('UserMessage', async (message, shadowed) => {
		// console.log((await io.fetchSockets()).filter(x => x.handshake.headers['x-replit-user-name']))
		if (message.channel != selem.getAttribute('c')) return;
		function timeSince(timeStamp) {
			var now = new Date(),
				secondsPast = (now.getTime() - timeStamp) / 1000;
			if (secondsPast < 60) {
				return parseInt(secondsPast) + 's';
			}
			if (secondsPast < 3600) {
				return parseInt(secondsPast / 60) + 'm';
			}
			if (secondsPast <= 86400) {
				return parseInt(secondsPast / 3600) + 'h';
			}
			if (secondsPast > 86400) {
				day = timeStamp.getDate();
				month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
				year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
				return day + " " + month + year;
			}
		}
		let chat = document.getElementById("chat")
		let m = document.createElement("div")
		m.id = "message"
		m.innerHTML = `
		<div style="display:flex;align-items:center;${shadowed ? 'background-color:#ff0000;background-opacity:50%;' : ''}">
			<img class="pfp" src="${message.pfp}" />
			<span id="author">${message.author}</span>
		</div>
		<p id="text">${message.content}</p>
		`

		if(message.content.includes(`@${username}`)) {
			m.style.background = "#36331b"
			new Audio('https://2chat.bddy.repl.co/audio/receivemention.wav').play()
		}
		chat.appendChild(m)
		chat.scrollTo(0, chat.scrollHeight);
	});

	socket.on('UserAdd', (message) => {
		if (message.channel != selem.getAttribute('c')) return;
		let chat = document.getElementById("chat")
		let m = document.createElement("div")

		m.id = "message";

		m.innerHTML = `<p id="text">${s} has joined the channel.</p>`
	});


	let ipt = document.getElementById("sendmsg")
	let s = document.getElementById("smbt")

	ipt.focus()

	function send() {
		if (ipt.value.startsWith('/')) {
			socket.emit('SlashCommand', ipt.value)
			ipt.value = ""
			return
		}

			new Audio('https://2chat.bddy.repl.co/audio/sendmessage.wav').play()
		

		socket.emit("UserMessage", { channel: selem.getAttribute('c'), author: username, date: new Date().getTime(), content: ipt.value });
		ipt.value = ""
	}

	s.addEventListener("click", e => {
		if (ipt.value == "") return;
		send()
	})

	ipt.addEventListener('keydown', e => {
		if (ipt.value == "") return;
		if (e.key == "Enter") {
			send()
		}
	})

	socket.on('disconnect', (reason) => {
		if (reason == "io server disconnect") {
			let chat = document.getElementById("chat")
			let m = document.createElement("div")
			m.id = "message"
			m.innerHTML = `
  		<div style="display:flex;align-items:center;">
  			<img class="pfp" src="https://www.gravatar.com/avatar/70f68d9254a26e13edbd59e97869969b?d=https://repl.it/public/images/evalbot/evalbot_24.png&s=256" />
  			<span id="author">System <span id="bottag" style="margin-left: 10px">Verified Bot</span></span>
  		</div>
  		<p id="text">The websocket has been disconnected, or you have been kicked by an admin.</p>
  		`
			chat.appendChild(m)
			chat.scrollTo(0, chat.scrollHeight);
		}
	})
})();