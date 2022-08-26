const { QuickDB } = require('quick.db');
const db = new QuickDB();
const { marked } = require('marked');

module.exports = {
  execute: async (socket, args, io, send) => {

    if (!['3586618', '3670753', '5431535'].includes(socket.handshake.headers['x-replit-user-id'])) return send(`You can't use this command.`)

    if (!args.length) return send(`That's not a valid sub-command! Possible subcommands are:<br><br><pre><code>/admin warn</code></pre><br><pre><code>/admin (un)mute</code></pre><br><pre><code>/admin (un)ban<br></code></pre>`)

    if (!['warn', 'mute', 'ban', 'unmute', 'unban'].includes(args[0])) return send(`That's not a valid sub-command! Possible subcommands are:<br><br><pre><code>/admin warn</code></pre><br><pre><code>/admin (un)mute</code></pre><br><pre><code>/admin (un)ban<br></code></pre>`)

    let subcommand = args.shift();

    if (subcommand == "warn") {
      let client = (await io.fetchSockets()).filter(x => x.handshake.headers['x-replit-user-name'] == args[0])[0]

      if (!client) return send(`<code>${args[0]}</code> is not online - therefore I cannot verbally warn them.`)

      let uname = args.shift();
      
      send(`You have been warned by a moderator for <code>${args.join(' ') || 'No reason'}</code>.`, client)
      return send(`Warned <code>${uname}</code> for <code>${args.join(' ') || 'No reason'}</code>.`)
    } else if (subcommand == "mute") {
      // No need to check for if they are online - we can immediately edit database.

      let shadowBans = db.get('shadowBans')

      let uname = args.shift();

      if (!uname) return send(`You need to specify a username to shadow-ban/mute.`)
      
      if (Object.keys(shadowBans).includes(uname)) return send(`<code>${uname}</code> is already shadow-banned/muted!`)

      await db.set(`shadowBans.${uname}`, {
        status: true,
        reason: args.join(' ') || 'No reason'
      })

      return send(`Shadow-banned/muted <code>${uname}</code> for <code>${args.join(' ') || 'No reason'}</code>.`)
    } else if (subcommand == "unmute") {
      // No need to check for if they are online - we can immediately edit database.

      let shadowBans = db.get('shadowBans')

      let uname = args.shift();

      if (!uname) return send(`You need to specify a username to shadow-ban/mute.`)
      
      if (Object.keys(shadowBans).includes(uname) == false) return send(`<code>${uname}</code> is not shadow-banned/muted!`)

      await db.delete(`shadowBans.${uname}`)

      return send(`Unshadow-banned/unmuted <code>${uname}</code>.`)
    }
  }
}