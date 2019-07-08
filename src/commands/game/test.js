module.exports = {
    aliases: ['test'],
    desc: 'Currently Used For Testing Purposes',
    run: async function(message, client) {
      if(Number(message.Args[0] === 1976)) return message.channel.createMessage('WTF how you know this code...u hacker :p')
    }
}
