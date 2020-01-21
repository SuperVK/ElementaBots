module.exports = {
    desc: 'Join a guild',
    aliases: ['guild', 'g'],
    run: async function(message, client, user) {
        if(user.guild == null && message.args[0] != 'create' && message.args[0] != 'join') return message.channel.createMessage(`You aren't in a guild, make one (.guild create name) or join one (get invited with .guild invite)`)
        switch(message.args[0]) {
            case 'invite': {
                if(message.args[1] == undefined || message.args[1].match(/\d{17,18}/) == undefined) return message.channel.createMessage('Tag the user you want to invite!')
                if(user.guild.owner != message.author.id) return message.channel.createMessage(`You must be the owner to do this!`)
                if(user.guild.members.length >= 7) return message.channel.createMessage(`You can only have a maxium of 7 people in your guild!`)
                targetID = message.args[1].match(/\d{17,18}/)[0]
                client.guildData.invitations.push({
                    guildID: user.guild.id,
                    userID: targetID
                })
                message.channel.createMessage(`<@${targetID}> you've been invited to **${user.guild.name}**, do \`.guild join\` to join! Invitation runs out in 60 seconds!`)
                setTimeout(async function() {
                    let index = client.guildData.invitations.findIndex((i) => i.userID == targetID && i.guildID == user.guild.id)
                    if(index == -1) return
                    client.guildData.invitations.splice(index, 1)
                    let disUser = await client.bot.getRESTUser(targetID)
                    message.channel.createMessage(`${disUser.username} didn't respond in time and the invite has been canceled!`)
                }, 60*1000)
                break;

            }
            case 'join': {
                if(user.guild != null) return message.channel.createMessage(`You're already in a guild! Leave that one first (\`.guild leave\`)`)
                let index = client.guildData.invitations.findIndex(i => i.userID == message.author.id)
                let invite = client.guildData.invitations[index]
                if(invite == undefined) return message.channel.createMessage(`You haven't been invited! Maybe it ran it out?`)
                client.guildData.invitations.splice(index, 1)
                let guild = await client.getGuild(invite.guildID)
                guild.members.push(message.author.id)
                user.guild = guild
                message.member.addRole(guild.roleID)
                message.member.addRole('543546856999878657')
                message.channel.createMessage(`Successfully joined **${guild.name}**`)
                user.save()
                client.saveGuild(guild)
                break;

            }
            case 'leave': {
                if(user.guild.owner == message.author.id) return message.channel.createMessage(`You can't leave your own guild!`)
                let guild = user.guild
                message.member.removeRole(guild.roleID)
                message.member.removeRole('543546856999878657')
                user.guild.members.splice(user.guild.members.findIndex(id => id == message.author.id), 1)
                await client.saveGuild(user.guild)
                user.guild = null
                user.save()
                message.channel.createMessage(`Succesfully left ${guild.name}`)
                break;
            }
            case 'disband': 
            case 'delete': {
                if(user.guild.owner != message.author.id) return message.channel.createMessage(`Only the guild owner can delete guilds!`)
                if(client.guildData.deleteRequests.find(g => g == user.guild.id) == undefined) {
                    client.guildData.deleteRequests.push(user.guild.id)
                    message.channel.createMessage(`Are you sure you want to delete your guild? Doing this will kick all members. If you are sure, run .guild ${message.args[0]} again!`)
                } else {
                    message.member.removeRole('543185788565848085')
                    client.guildData.deleteRequests.splice(client.guildData.deleteRequests.findIndex(g => g == user.guild.id), 1)
                    for(let memberID of user.guild.members) {
                        let gUser = await client.getUser(memberID)
                        gUser.guild = null
                        client.saveUser(gUser)
                    }
                    client.deleteGuild(user.guild.id)
                    message.channel.createMessage(`Successfully deleted ${user.guild.name}`)
                    user.guild = null
                    user.save()
                    
                }
                break;
            }
            case 'create': {
                if(message.args[1] == undefined) return message.channel.createMessage('You need to specify a name!')
                let name = message.content.substring(message.content.split(' ')[0].length + 1 + message.args[0].length + 1)
                let role = await message.channel.guild.createRole({name: name})
                message.member.addRole(role.id)
                message.member.addRole('543546856999878657')
                message.member.addRole('543185788565848085')
                client.createGuild(name, message.author.id, role.id)
                message.channel.createMessage(`Successfully created your guild!`)
                break;
            }
            case 'members': {
                let msg = `**Members of ${user.guild.name}:**\n`
                for(let member of user.guild.members) {
                    let disUser = await client.bot.getRESTUser(member)
                    msg += `> ${disUser.username}#${disUser.discriminator}\n`
                }
                message.channel.createMessage(msg)
                break;
            }
            default: {
                message.channel.createMessage(`**${user.guild.name}**
Members: ${user.guild.members.length}/7
Balance: ${user.guild.balance}
                `)
            }
        }
    }
}