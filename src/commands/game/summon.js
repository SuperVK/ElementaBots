const tiers = require('../../../data/tiers.json')

module.exports = {
    desc: 'Summons a random hero',
    aliases: ['summon'],
    run: async function(message, client) {
        let user = client.getUser(message.author.id)
        let msg = ``
        if(!(message.args[0] == 'heroic' || message.args[0] == 'basic')) return message.channel.createMessage(`:x: Usage: `)
        let type = ''
        if(message.args[0] == 'heroic') {
            if(user.items.filter(s => s.toLowerCase().startsWith('heroic')).length < 1) return message.channel.createMessage(`You don't have the scroll`)
            if(!isNaN(message.args[2]) && message.args[2] < 11) {
                let loops = Number(message.args[2])
                if(loops > user.items.filter(s => s.toLowerCase().startsWith('heroic').length)) return message.channel.createMessage(`You dont have so many scrolls`)
                for(let i = 0; i < loops; i++) {

                }
            } else {
                let rng = Math.random()
                if(rng < 0.2) type = 'Legendary'
                else if(rng < 0.5) type = 'Elite'
                else type = 'Rare'
            }
        } else if(message.args[0] == 'basic') {
            if(user.items.findIndex(s => s.toLowerCase().startsWith('basic')) == -1) return message.channel.createMessage(`You don't have the scroll`)
            if(Math.random() > 0.5) type = 'Fodder'
            else type = 'Common'
        }
        let hero = tiers[type.toLowerCase()][Math.floor(Math.random()*tiers[type.toLowerCase()].length)]
        message.channel.createMessage(`Added ${type} ${hero} to your inventory`)
        user.heroes.push(hero)
        let index = user.items.findIndex(s => s.toLowerCase().startsWith(message.args[0]) == -1)
        user.items.splice(index, 1)
        client.saveUser(user)

           
    }
}
