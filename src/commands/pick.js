module.exports = {
    aliases: ['pick'],
    desc: 'Picks someone',
    run: async function(message, client) {
        if(message.mentions.length != 2) return message.channel.createMessage(`Mention 2 people!`)
        if(Math.random() < 0.5) {
            return message.channel.createMessage(`${message.mentions[0].mention} is the attacker, and ${message.mentions[1].mention} is the defender.`)
        } else {
            return message.channel.createMessage(`${message.mentions[1].mention} is the attacker, and ${message.mentions[0].mention} is the defender.`)
        }
    }
}