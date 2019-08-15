module.exports = {
    desc: 'Give people money.',
    aliases: ['give', 'donate', 'g'],
    run: async function(message, client, user) {
        let args = message.args
        if(args[0] == undefined || args[1] == undefined || targetID == undefined || isNaN(args[1])) return message.channel.createMessage('Something went wrong! Usage: `.give @SuperVK 100`')
        let targetID = args[0].match(/\d{17,18}/)[0]
        let donation = Number(args[1])
        if(donation < 0) return message.channel.createMessage(`You can't give negative values!`)
        if(donation > user.balance) return message.channel.createMessage(`You can't give more than you have!`)
        let target = await client.getUser(targetID)
        target.balance += donation
        user.balance -= donation
        message.channel.createMessage(`You succesfully gave ${message.member.guild.members.find(m => m.id == targetID).username} ${donation} gold!`)
        client.saveUser(target)
        client.saveUser(user)
    }
}