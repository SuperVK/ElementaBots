const privateCmds = ['eval', 'admin']

module.exports = {
    desc: 'Here you can find all of the the commands, but as you\'re reading this, so you already know that!',
    aliases: ['commands', 'cmds'],
    run: async function(message, client) {
        if(message.args[0] == undefined) {
            let msg = `All the commands:\n\n`
            for(let command of client.commands) {
                if(privateCmds.includes(command.aliases[0])) continue
                msg += `> ${command.aliases[0]}\n`
            }
            msg += `To get more info about a command do: ${client.prefix}commands command`
            message.channel.createMessage(msg)
        } else {
            let command = client.commands.find(cmd => cmd.aliases.includes(message.args[0]))
            if(command == undefined) return message.channel.createMessage(`:x: I can't find that command!`)
            message.channel.createMessage(`**${command.aliases[0]}:** ${command.desc.replace(/{prefix}/g, client.prefix)}`)
        }
        
    }
}