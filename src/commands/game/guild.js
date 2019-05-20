module.exports = {
    aliases: ['g'],
    desc: 'Remind me to make this work.',
    run: async function (message, client) {
        let user = client.getUser(message.author.id)
        let target = message.content.match(/[0-9]{17,18}/)
        if (target == null) target = message.author.id
        user = client.getUser(target)
        let member = message.channel.guild.members.find(m => m.id == target)
        switch (message.args[1]) {
            case 'create': {
                if (!message.member.roles.includes(client.roles.admin)) return message.channel.createMessage(`You don't have enough perms mah boi`)
                if (message.args[2] == undefined) return message.channel.createMessage(`Plz add guild name`)
                let guild = client.createGuild()
                let guildname = message.args.slice(2, message.args.length).join(' ')
                guild.name = guildname;
                guild.members.push(member.user.id)
                guild.leaderid = message.author.id;
                client.saveGuild(user)
                break;
            }
            default: {
                let memberValue = ''
                for (let member of guild.members) {
                    memberValue += client.users.get(member).tag + '\n'
                }
                let leader = client.users.get(guild.leaderid).tag;
                message.channel.createMessage({
                    content: `__**${guild.name} guild**__`,
                    embed: {
                        title: '**Leader:**',
                        description: leader,
                        fields: [
                            {
                                name: '**Members:**',
                                value: memberValue
                            }
                        ]
                    }
                })
            }
        }
    }
}