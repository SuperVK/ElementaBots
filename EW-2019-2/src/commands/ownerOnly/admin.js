module.exports = {
    aliases: ['admin'],
    desc: 'Nothing.',
    run: async function(message, client, user) {
        let args = message.args
        if(!message.member.roles.includes(client.adminRoleID)) return 
        switch (args[0]) {
            case 'setcash': {
                let targetID = args[1].match(/\d{17,18}/)[0]
                
                if(args[1] == undefined || args[2] == undefined || targetID == undefined || isNaN(args[2])) return message.channel.createMessage('Something went wrong!')
                let target = await client.getUser(targetID)
                target.balance = Number(args[2])
                message.channel.createMessage(`Done! Set ${targetID} golds to ${args[2]} gold`)
                client.saveUser(target)
                
                break;
            }

            case 'addcash': {
                let targetID = args[1].match(/\d{17,18}/)[0]
                
                if(args[1] == undefined || args[2] == undefined || targetID == undefined || isNaN(args[2])) return message.channel.createMessage('Something went wrong!')
                let target = await client.getUser(targetID)
                target.balance += Number(args[2])
                message.channel.createMessage(`Done! Gave ${targetID} ${args[2]} gold`)
                client.saveUser(target)
                
                break;
            }
        
            default:
                break;
        }
    }
}