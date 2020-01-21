const heroes = require('../../../data/heroes.json')

module.exports = {
    aliases: ['upgrade', 'up'],
    desc: 'Check the game info for the upgrade requirements',
    run: async function(message, client) {
        let user = client.getUser(message.author.id)
        let name = message.args.join(' ')
        let uphero = heroes.find(h => h.name.toLowerCase() == name)
        if(message.args[0] == undefined) return message.channel.createMessage(`Please specify the hero you want to upgrade in the message!`)
        if(uphero == undefined) return message.channel.createMessage(`This hero hasn't been implemented yet!`)
        if(uphero.upgrades == null) return message.channel.createMessage(`You can't upgrade this hero!`)
        
        let newheroinv = []
        for(let hero of user.heroes) {
            let heroobj = heroes.find(h => h.name == hero)
            if(heroobj == undefined) return message.channel.createMessage(`You own a hero that prevents you from upgrading, as it isn't in the data set yet!`)
            newheroinv.push(heroobj)
        }
        for(let upReq of uphero.upgrades) {
            let amount = Number(upReq.substring(0, 1))
            let heroname = upReq.substring(2)
            for(let i = 0; i < amount; i++) {
                if(heroname.startsWith('&')) {
                    let index = newheroinv.findIndex(h => h.type.toLowerCase() == heroname.substring(1).toLowerCase())
                    if(index == -1) return message.channel.createMessage(`You don't have enough ${heroname.substring(1)}s`)
                    newheroinv.splice(index, 1)
                } else {
                    let index = newheroinv.findIndex(h => h.name.toLowerCase() == heroname.toLowerCase())
                    if(index == -1) return message.channel.createMessage(`You don't have enough ${heroname}`)
                    newheroinv.splice(index, 1)
                }
            }
        }
        user.heroes = newheroinv.map(h => h.name)
        let upgradesTo = `${Number(uphero.name.substring(0, 1))+1}${uphero.name.substring(1)}`
        user.heroes.push(upgradesTo)
        message.channel.createMessage(`Successfully upgraded ${uphero.name} to ${upgradesTo}`)
        client.saveUser(user)
        
    }
}