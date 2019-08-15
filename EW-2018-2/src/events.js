module.exports = {
    ready: function() {
        console.log('Ready!')
    },
    createMessage: async function(message, client) {
        if(message.author.bot) return
        if(!message.content.startsWith(client.prefix)) return

        let [command, ...args] = message.content.toLowerCase().substring(client.prefix.length).trim().replace(/\s{2,}/g,' ').split(' ')
        message.args = args
        if(!message.member.roles.includes(client.playerRoleID) && command != 'role' && message.channel.guild.id == '543144213588738059') return message.channel.createMessage('You need a players role!')
        let commandFunc = client.commands.find(cmd => cmd.aliases.includes(command))
        if(commandFunc == undefined) return
        if(client.discmds.includes(commandFunc.aliases[0]) && message.author.id !== client.ownerID) return message.channel.createMessage('This command is disabled right now')

        //get DB user
        let user = await client.getUser(message.author.id)
        if(user == null) {
            user = await client.createUser(message.author.id)
        }
        if(user.balance == 0) {
            user.balance = 100
            await client.saveUser(user)
        }
        commandFunc.run(message, client, user)
            .catch(e => {
                console.log(e)
                message.channel.createMessage(`Something went wrong please try again later!`)
            })
        
    }
}