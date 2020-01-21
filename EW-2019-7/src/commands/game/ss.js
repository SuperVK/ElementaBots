module.exports = {
    aliases: ['ss'],
    desc: 'Works out if the hero is casting a Special Skill',
    run: async function(message, client) {
        if(isNaN(message.args[0])) return message.channel.createMessage(`That's not a number`)
        if(Number(message.args[0]) > 100) return message.channel.createMessage(`Can't have a number higher than 100`)
        message.delete()
        if(Math.random() < (Number(message.args[0])/100)) return message.channel.createMessage(`You cast a Special Skill!`)
        else return message.channel.createMessage(`You didn't cast a Special Skill!`)
    }
}
