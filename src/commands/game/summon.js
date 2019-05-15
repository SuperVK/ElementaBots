const tiers = require('../../../data/tiers.json')

module.exports = {
    desc: 'Scroll troll',
    aliases: ['summon'],
    run: async function(message, client) {
        let user = client.getUser(message.author.id)
        
        if(!(message.args[0] == 'heroic' || message.args[0] == 'basic')) return message.channel.createMessage(`:x: Usage: `)
        let type = ''
        if(message.args[0] == 'heroic') {
            if(user.items.findIndex(s => s.toLowerCase().startsWith('heroic')) == -1) return message.channel.createMessage(`You don't have`)
            let rng = Math.random()
            if(rng > 1/3) type = 'legendary'
            else if(rng > 2/3) type = 'Elite'
            else type = 'Rare'
        } else if(message.args[0] == 'basic') {
            if(user.items.findIndex(s => s.toLowerCase().startsWith('basic')) == -1) return message.channel.createMessage(`You don't have`)
            if(Math.random() > 0.5) type = 'fodder'
            else type = 'common'
        }
        let hero = tiers[type][Math.floor(Math.random()*tiers[type].length)]
        message.channel.createMessage(`Added ${hero} from type ${type} to your account`)
        user.heroes.push(hero)
        client.saveUser(user)

           
    }
}