module.exports = {
    aliases: ['profile', 'inv', 'inventory'],
    desc: 'Muchos Profilos',
    run: async function(message, client) {
        let user = client.getUser(message.author.id)
        let target = message.content.match(/[0-9]{17,18}/)
        if(target == null) target = message.author.id 
        user = client.getUser(target)
        let member = message.channel.guild.members.find(m => m.id == target)
        switch(message.args[1]) {
            case 'additem': {
                if(!message.member.roles.includes(client.roles.admin)) return message.channel.createMessage(`You don't have enough perms mah boi`)
                if(message.args[2] == undefined) return message.channel.createMessage(`Plz add something add`)
                let itemname = message.args.slice(2, message.args.length).join(' ')
                user.items.push(itemname)
                client.saveUser(user)
                message.channel.createMessage(`Added ${itemname} to ${member.username}s profile`)
                break;
            }
            case 'addhero': {
                if(!message.member.roles.includes(client.roles.admin)) return message.channel.createMessage(`You don't have enough perms mah boi`)
                if(message.args[2] == undefined) return message.channel.createMessage(`Plz add something add`)
                let heronname = message.args.slice(2, message.args.length).join(' ')
                user.heroes.push(heronname)
                client.saveUser(user)
                message.channel.createMessage(`Added ${heroname} to ${member.username}s profile`)
                break;
            }
            default: {
                
                let heroValue = ''
                for(let hero of user.heroes) {
                    heroValue += hero + '\n'
                }
                if(user.heroes.length == 0) heroValue += 'None :(\n'
                let itemValue = ''
                for(let item of user.items) {
                    itemValue += item + '\n'
                }
                if(user.items.length == 0) itemValue += 'None :(\n'
                message.channel.createMessage({
                    content: `__**${message.channel.guild.members.find(m => m.id == target).username}'s profile**__`,
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