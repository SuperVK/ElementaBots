module.exports = {
    desc: 'Gives you the Player role',
    aliases: ['role'],
    run: async function(message, args) {
        if(args[0] == undefined) return message.channel.createMessage(`What role do you want to be given?`)
        switch (args[0]) {
            case 'player':
                if(message.member.roles.includes('464508961752612894')) return message.channel.createMessage(`You already have that role!`)
                message.member.addRole('464508961752612894')
                message.channel.createMessage(`Successfully applied the Player role!`)
                break;
        
            default:
                message.channel.createMessage(`Can't find that role...`)
                break;
        }
    }
}