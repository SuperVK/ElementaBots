module.exports = {
    ready: function() {
        console.log('Ready!')
    },
    createMessage: async function(message, client) {
        if(message.author.bot) return
        if(!message.content.startsWith(client.prefix)) return

        let [command, ...args] = message.content.toLowerCase().substring(client.prefix.length).trim().replace(/\s{2,}/g,' ').split(' ')
        message.args = args
        //if(!message.member.roles.includes(client.playerRoleID) && command != 'role' && message.channel.guild.id == '543144213588738059') return message.channel.createMessage('You need a players role!')
        let commandFunc = client.commands.find(cmd => cmd.aliases.includes(command))
        if(commandFunc == undefined) return
        //if(client.discmds.includes(commandFunc.aliases[0]) && message.author.id !== client.ownerID) return message.channel.createMessage('This command is disabled right now')

        commandFunc.run(message, client)
            .catch(e => {
                console.log(e)
                message.channel.createMessage(`Something went wrong please try again later!`)
            })
        
    },
    reactionAdd(message, emoji, userID) {
        switch(emoji.name) {
            case '💻': {
                message.channel.guild.addMemberRole(userID, '564346526223040514', 'Reacted to emoji')
                break;
            }
        }
    },
    guildMemberRemove(guild, member, client) {
        if(guild.id == '543144213588738059') client.bot.createMessage('543153735677902858', `${member.user.username}#${member.user.discriminator} has left the server!`)
    }
}