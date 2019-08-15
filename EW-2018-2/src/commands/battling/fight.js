const Battle = require('../../structures/battle.js')

module.exports = {
    desc: 'Fight someone! use .fight @mention',
    aliases: ['fight', 'battle'],
    run: async function(message, client, user) {
        let battle = client.battles.find(b => b.channelID == message.channel.id)

        if(message.mentions.length != 0) {
            if(battle != undefined) return message.channel.createMessage(`There is already a battle going on in this channel, you can't create another one!`)
            //if(message.author.id == message.mentions[0].id) return message.channel.createMessage(`You can't.. find yourself??`)
            let username1 = message.author.username
            let username2 = message.mentions[0].username
            let user2 = await client.getUser(message.mentions[0].id)
            battle = new Battle(user, user2, username1, username2, message.channel.id, client)
            client.battles.push(battle)
            message.channel.createMessage(`<@${message.mentions[0].id}>, you have been challenged by **${message.author.username}** to accept, do ${client.prefix}fight accept`)
            setTimeout(function() {
                if(battle.turn == 'None') {
                    let bIndex = client.battles.findIndex(b => b.channelID == message.channel.id)
                    client.battles.splice(bIndex, 1)
                    return message.channel.createMessage(`The battle invite ran out...`)
                } else {
                    return
                }
            }, 60*1000)
        } else {
            if(battle == undefined) return message.channel.createMessage(`There's no battle going on in this channel`)
            switch(message.args[0]) {
                case 'stats': {
                    battle.stats()
                    break;
                }
                case 'join': 
                case 'accept': {
                    if(battle.turn != 'None') return message.channel.createMessage(`The battle has already started`)
                    if(battle.player2.id != message.author.id) return message.channel.createMessage(`You aren't invited!`)
                    battle.init()
                    break;
                }
                case 'attack': {
                    if(!(battle.player1.id == message.author.id || battle.player2.id == message.author.id)) return message.channel.createMessage(`You aren't in this game, you can't interfere!`)
                    battle.attack(message)
                }
            }
        }
    }
}