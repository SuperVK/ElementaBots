module.exports = {
    aliases: ['inv', 'inventory'],
    desc: 'Shows what items and heroes you own',
    run: async function (message, client) {
        let user = client.getUser(message.author.id)
        let target = message.content.match(/[0-9]{17,18}/)
        if (target == null) target = message.author.id
        user = client.getUser(target)
        let member = message.channel.guild.members.find(m => m.id == target)
        switch (message.args[1]) {
            case 'additem': {
                if (!message.member.roles.includes(client.roles.admin)) return message.channel.createMessage(`You don't have the permission to use this command`)
                if (message.args[2] == undefined) return message.channel.createMessage(`Make sure to say the item you want to add!`)
                let rawArgs = message.content.split(' ')
                let amount = Number(rawArgs[3])
                let itemname;
                if(isNaN(amount)) {
                    amount = 1
                    itemname = rawArgs.slice(3).join(' ')
                } else {
                    itemname = rawArgs.slice(4).join(' ')
                }
        
                for(let i = 0; i < amount; i++) user.items.push(itemname)
                client.saveUser(user)
                message.channel.createMessage(`Added ${amount}x ${itemname} to ${member.username}'s inventory`)
                break;
            }
            case 'addhero': {
                if (!message.member.roles.includes(client.roles.admin)) return message.channel.createMessage(`You don't have the permission to use this command`)
                if (message.args[2] == undefined) return message.channel.createMessage(`Make sure to say the hero you want to add!`)
                let rawArgs = message.content.split(' ')
                let amount = Number(rawArgs[3])
                let heroname
                if(isNaN(amount)) {
                    amount = 1
                    heroname = rawArgs.slice(3).join(' ')
                } else {
                    heroname = rawArgs.slice(4).join(' ')
                }
                
                for(let i = 0; i < amount; i++) user.heroes.push(heroname)
                client.saveUser(user)
                message.channel.createMessage(`Added ${amount}x ${heroname} to ${member.username}'s inventory`)
                break;
            }
            case 'removeitem': {
                if (!message.member.roles.includes(client.roles.admin)) return message.channel.createMessage(`You don't have the permission to use this command`)
                if (message.args[2] == undefined) return message.channel.createMessage(`Make sure to say the item you want to add!`)
                let rawArgs = message.content.split(' ')
                let itemname = rawArgs.slice(3).join(' ')
                let index = user.items.findIndex(i => i.toLowerCase() == itemname.toLowerCase())
                if(index == -1) return message.channel.createMessage(`Can't find that hero`)
                user.items.splice(index, 1)
                client.saveUser(user)
                message.channel.createMessage(`Removed ${itemname} from ${member.username}'s inventory`)
                break;
            }
            case 'removehero': {
                if (!message.member.roles.includes(client.roles.admin)) return message.channel.createMessage(`You don't have the permission to use this command`)
                if (message.args[2] == undefined) return message.channel.createMessage(`Make sure to say the item you want to add!`)
                let rawArgs = message.content.split(' ')
                let heroname = rawArgs.slice(3).join(' ')
                user.heroes.splice(user.heroes.findIndex(i => i.toLowerCase() == heroname.toLowerCase()), 1)
                client.saveUser(user)
                message.channel.createMessage(`Removed ${heroname} from ${member.username}'s inventory`)
                break;
            }
            default: {

                let heroValue = ''
                for (let i in user.heroes) {
                    let hero = user.heroes[i]

                    if(user.heroes.filter(it => it.toLowerCase() == hero.toLowerCase()).length > 1) {
                        if(user.heroes.findIndex(it => it.toLowerCase() == hero.toLowerCase()) == i) heroValue += `${hero} ${user.heroes.filter(it => it.toLowerCase() == hero.toLowerCase()).length}x\n`
                    } else heroValue += hero + '\n'
                }
                if (user.heroes.length == 0) heroValue += 'None :(\n'
                let itemValue = ''
                for (let i in user.items) {
                    let item = user.items[i]
                    //stacking
                    if(user.items.filter(it => it.toLowerCase() == item.toLowerCase()).length > 1) {
                        if(user.items.findIndex(it => it.toLowerCase() == item.toLowerCase()) == i) itemValue += `${item} ${user.items.filter(it => it.toLowerCase() == item.toLowerCase()).length}x\n`
                    } else itemValue += item + '\n'
                }
                if (user.items.length == 0) itemValue += 'None :(\n'
                message.channel.createMessage({
                    content: `__**${message.channel.guild.members.find(m => m.id == target).username}'s inventory**__`,
                    embed: {
                        title: '**Heroes:**',
                        description: heroValue,
                        fields: [
                            {
                                name: '**Items:**',
                                value: itemValue
                            }
                        ]
                    }
                })
            }
        }
    }
}
