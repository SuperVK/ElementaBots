module.exports = {
    aliases: ['profile', 'inv', 'inventory'],
    desc: 'Muchos Profilos',
    run: async function(message, client) {
        switch(message.args[1]) {
            case 'additem': {

                if(message.args[2] == undefined) return message.channel.createMessage(`Plz add something add`)

                user.items

                message.channel.createMessage(``)
                break;
            }
            default: {
                let user = client.getUser(message.author.id)
                let target = message.content.match(/[0-9]{17,18}/)
                if(target == null) target = message.author.id 
                user = client.getUser(target)
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