const tiers = require('../../../data/tiers.json')

module.exports = {
    desc: 'Summons a random hero',
    aliases: ['summon'],
    run: async function(message, client) {
        let user = client.getUser(message.author.id)
        let loops = 1
        if(!isNaN(message.args[1])) loops = Number(message.args[1])
        if(loops > 10 || loops < 1) return message.channel.createMessage(`You can't summon more than 10 or less than 1`)
        let type = message.args[0]
        if(type != 'basic' && type != 'heroic') return message.channel.createMessage(`:x: Usage: ${client.prefix}summon <basic|heroic> [amount]`)

        if(user.items.filter(i => i.toLowerCase().startsWith(type)).length < loops) return message.channel.createMessage(`You don't have ${loops} ${type} scrolls`)

        let msg = `**Opening ${Math.ceil(loops)} ${type} scrolls**\n`
        for(let i = 0; i < loops; i++) {
            let rarity = ``
            if(type == 'basic') {
                let rng = Math.random()
                if(rng > 0.5) rarity = 'fodder'
                else rarity = 'common'
                
            } else {
                let rng = Math.random()
                if(rng > 0.5) rarity = 'rare'
                else if(rng > 0.2) rarity = 'elite'
                else rarity = 'legendary'
            }
            let hero = tiers[rarity][Math.floor(Math.random()*tiers[rarity].length)]
            msg += `${i+1}. Summoned ${rarity} hero: ${hero}\n`
            let index = user.items.findIndex(i => i.toLowerCase().startsWith(type))
            if(index == -1) msg += `Something went wrong!\n`
            user.items.splice(index, 1)
            user.heroes.push(hero)
        }
        message.channel.createMessage(msg)
        client.saveUser(user)
    }
}
