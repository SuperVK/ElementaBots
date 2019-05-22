module.exports = {
    aliases: ['guild', 'g'],
    desc: 'ok libtard',
    run: async function (message, client) {
        let user = client.getUser(message.author.id)
        switch (message.args[0]) {
            case 'create': {
                if (message.args[1] == undefined) return message.channel.createMessage(`Plz add guild name`)
                if(user.guildid != null) return message.channel.createMessage(`You are already in a guild`)
                let rawArgs = message.content.split(' ')
                let name = rawArgs.slice(2).join(' ')
                let guildid = client.createGuild(message.author.id, name)
                user.guildid = guildid
                client.saveUser(user)
                message.channel.createMessage(`Successfully created your guild with the name ${name}`)
                break;
            }
            case 'list': {
                console.log(client.getAllGuilds())
                break;
            }
            default: {
                if(user.guildid == null) return message.channel.createMessage(`You don't have a guild yet, make one or join one!`)
                let guild = client.getGuild(user.guildid)
                let membersmsg = `**Members:**\n`
                for(let memberid of guild.members) {
                    let member = message.channel.guild.members.find(m => m.id == memberid)
                    membersmsg += `${member.username}#${member.discriminator}\n`
                }
                let msg = `**${guild.name}**\n\n${membersmsg}`
                message.channel.createMessage(msg)
            }
        }
    }
}