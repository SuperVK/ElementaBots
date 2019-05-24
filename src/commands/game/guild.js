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
            case 'inv':
            case 'invite': {
                if(user.guildid == null) return message.channel.createMessage(`You aren't in a guild`)
                if(message.content.match(/[0-9]{17,18}/) == undefined) return message.channel.createMessage(`You need to tag who you want to invite in the message`)
                let guild = client.getGuild(user.guildid)
                if(guild.members.length > 10) return message.channel.createMessage(`You've reached the max member count of 10!`)
                if(guild.leaderid != message.author.id) return message.channel.createMessage(`Only the leader of the guild can invite people!`)
                let id = message.content.match(/[0-9]{17,18}/)[0]
                client.guildInvs.push({
                    userid: id,
                    guildid: user.guildid
                })
                message.channel.createMessage(`Successfully invited <@${id}> to ${guild.name}`)
                setTimeout(() => {
                    let index = client.guildInvs.findIndex(i => i.userid == id)
                    client.guildInvs.splice(index, 1)
                    message.channel.createMessage(`Invitations for ${guild.name} to <@${id}> expired`)
                }, 1000*60*5)
                break;
            }
            case 'join': {
                let invitation = client.guildInvs.find(i => i.userid == message.author.id)
                if(invitation == undefined) return message.channel.createMessage(`You haven't been invited to a guild, or it expired`)
                if(user.guildid != null) return message.channel.createMessage(`You are in a guild currently, please leave first!`)
                user.guildid = invitation.guildid
                let guild = client.getGuild(invitation.guildid)
                guild.members.push(message.author.id)
                client.saveUser(user)
                console.log(guild.members)
                client.saveGuild(guild)
                message.channel.createMessage(`Successfully joined ${guild.name}`)
                break;
            }
            case 'kick': {

            }
            case 'leave': {
                if(user.guildid == null) return message.channel.createMessage(`You aren't in a guild`)
                let guild = client.getGuild(user.guildid)
                if(guild.leaderid == message.author.id) return message.channel.createMessage(`You can't leave the guild you own!`)
                let index = guild.members.findIndex(m => m == message.author.id)
                guild.members.splice(index, 1)
                user.guildid = null
                client.saveUser(user)
                client.saveGuild(guild)
                message.channel.createMessage(`Successfully left ${guild.name}`)
                break;
            }
            case 'rename': {
                if(user.guildid == null) return message.channel.createMessage(`You aren't in a guild`)
                let guild = client.getGuild(user.guildid)
                if(guild.leaderid != message.author.id) return message.channel.createMessage(`Only the owner can rename the name of the guild`)
                let rawArgs = message.content.split(' ')
                let name = rawArgs.slice(2).join(' ')
                guild.name = name
                client.saveGuild(guild)
                message.channel.createMessage(`Successfully renamed the guild to ${guild.name}`)
                break;
            }
            case 'list': {
                
                let guilds = client.getAllGuilds()
                let fields = []
                for(guild of guilds) {
                    let leader = message.channel.guild.members.find(m => m.id == guild.leaderid)
                    fields.push({
                        name: guild.name,
                        value: `${guild.members.length} members | ${leader.username}#${leader.discriminator}`
                    })
                }
                message.channel.createMessage({
                    content: `**All guilds**`,
                    embed: {
                        fields: fields
                    }
                })
                break;
            }
            default: {
                if(user.guildid == null) return message.channel.createMessage(`You don't have a guild yet, make one or join one!`)
                let guild = client.getGuild(user.guildid)
                let membersvalue = ``
                for(let memberid of guild.members) {
                    let member = message.channel.guild.members.find(m => m.id == memberid)
                    membersvalue += `${member.username}#${member.discriminator}\n`
                }
                message.channel.createMessage({
                    content: `**${guild.name}**`,
                    embed: {
                        title: `Members:`,
                        description: membersvalue
                    }
                })
            }
        }
    }
}