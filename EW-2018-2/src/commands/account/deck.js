module.exports = {
    desc: 'Change and see your deck! .deck swap for changing your deck',
    aliases: ['deck'],
    run: async function(message, client, user) {
        switch(message.args[0]) {
            case 'add':
            case 'deploy': {
                if(user.deck.length >= 4) return message.channel.createMessage(`4 heroes is the max, please remove or swap heroes!`)
                if(message.args[1] == 'all') {
                    if(user.deck.length != 0) return message.channel.createMessage(`You can only do this with no heroes in the deck, do .deck remove all to.. well remove all`)
                    if(user.element == undefined) return message.channel.createMessage(`You can only this when you have an element, join one with .profile setelement element_name`)
                    user.deck = client.heroes.filter(h => h.pack == user.element).map(h => h.name).slice(0, 4)
                    user.save()
                    message.channel.createMessage(`Succesfully deployed all the default heroes`)
                    return
                }
                let hero = client.heroes.find(h => h.name.toLowerCase().startsWith(message.args[1]))
                if(hero == undefined) return message.channel.createMessage(`I can't find that hero...`)
                if(!user.ownedHeroes.includes(hero.name)) return message.channel.createMessage(`You don't own that hero...`)
                if(user.deck.includes(hero.name)) return message.channel.createMessage(`You already have this hero in your deck!`)
                user.deck.push(hero.name)
                user.save()
                message.channel.createMessage(`Succesfully added ${hero.name} to the deck`)
                break;
            }
            case 'delete':
            case 'remove': {
                if(message.args[1] == 'all') {
                    user.deck = []
                    user.save()
                    message.channel.createMessage(`Succesfully removed all the heroes from your deck`)
                    return
                }
                if(user.deck.length == 0) return message.channel.createMessage(`You don't have any heroes in your deck... Who are you trying remove lmao?`)
                let heroIndex = user.deck.findIndex(h => h.toLowerCase().startsWith(message.args[1]))
                if(heroIndex == -1) return message.channel.createMessage(`That hero isn't your deck...`)
                let hero = user.deck.find(h => h.toLowerCase().startsWith(message.args[1]))
                user.deck.splice(heroIndex, 1)
                user.save()
                message.channel.createMessage(`Succesfully removed ${hero} from the deck!`)
                break;
            }
            default: {
                if(user.deck.length == 0) return message.channel.createMessage(`Your deck is empty, you can deploy heroes with .deck deploy hero_name, or deploy all your element heroes with .deck deploy all!`)

                let msg = `**Current deck layout!**\n\n`
                for(let hero of user.deck) {
                    msg += `> ${hero}\n`
                }
                msg += `\nChange it with .deck remove and .deck deploy, to see all the heroes you own do .bag, to see all the heroes in the game use .cards!`
                message.channel.createMessage(msg)
            }
        }
    }
}
