module.exports = {
    desc: 'A place for viewing all the cards!',
    aliases: ['cards', 'card'],
    run: async function(message, client, user) {
        if(message.args[0] == undefined) {
            let msg = `**All the packs:**\n\n`
            for(let pack of client.packs) {
                msg += `> ${pack.name}\n`
            }
            msg += `Do .cards *pack* to get all the heroes in that pack! Eg: .cards bubbles`
            message.channel.createMessage(msg)
        } else {
            let heroes = client.heroes.filter(el => {
                if(el.pack.toLowerCase().startsWith(message.args[0]) && el.name.toLowerCase().startsWith(message.args[1])) return true
                if(el.name.toLowerCase().startsWith(message.args[0])) return true
                if(el.pack.toLowerCase().startsWith(message.args[0]) && message.args[1] == undefined) return true
            })
            //check if all the heroes are from the same pack
            if(heroes.length > 1 && heroes.filter(el => heroes[0].pack == el.pack).length == heroes.length) {
                let msg = `**All the heroes in ${heroes[0].pack}:**\n\n`
                for(let hero of heroes) {
                    msg += `> ${hero.name}\n`
                }
                msg += `Do .card(s) *hero* to get info about the hero! Eg: .card aquifis`
                message.channel.createMessage(msg)
            } else if(heroes.length != 0) {
                let hero = heroes[0]
                message.channel.createMessage({
                    embed: {
                        title: hero.name,
                        color: parseInt(client.packs.find(p => p.name = hero.pack.toLowerCase()).color.substring(1), 16),
                        image: {
                            url: hero.url
                        }
                    }
                })
            } else {
                message.channel.createMessage(`I couldn't find that pack or hero`)
            }
            
        }
    }
}
