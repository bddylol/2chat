module.exports = {
  execute: (socket, args) => {
    socket.emit('UserMessage', { 
      channel: socket.handshake.headers.referer.split('/')[4], 
      author: `System <span id="bottag" style="margin-left: 10px">Verified Bot</span>`, 
      date: new Date().getTime(), 
      content: 'Pong!',
      pfp: 'https://www.gravatar.com/avatar/70f68d9254a26e13edbd59e97869969b?d=https://repl.it/public/images/evalbot/evalbot_24.png&s=256'
    })
  }
}