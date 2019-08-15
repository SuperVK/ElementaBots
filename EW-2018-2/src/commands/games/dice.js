module.exports = {
    aliases: ['dice', 'd'],
    desc: 'Run the command without any arguments for more info.',
    run: async function(message, client, user) {
        let args = message.args
        if(args[0] == undefined) {
            message.channel.createMessage(`**Let\'s throw a dice.**
The game works as follows: You throw a dice, and I throw a dice (both 6 sided). If you throw a higher number than me, you will get your money doubled, if not, you will lose all your money
Usage: ${client.prefix}dice _bet_
            `)
            return
        }
        let bet;
        if(Number(args[0]) < 0 || isNaN(args[0]) || args[0] == '') {
            if(args[0] == 'all') {
                bet = user.balance
            } else {
                message.channel.createMessage('That\'s an invalid amount!')
                return
            }
            
        }
        if(Number(args[0]) > user.balance) {
            message.channel.createMessage('You don\'t even have so much money?')
            return
        }
        if(bet == undefined) bet = args[0]
        let userDice = Math.floor(Math.random() * 6) + 1
        let botDice = Math.floor(Math.random() * 6) + 1
        let msg = `**You bet for ${bet}<:gold:543746706630639617> that you would roll higher than me**\nYou rolled a ${userDice}.\nI rolled a ${botDice}.\n`
        if(userDice > botDice) {
            msg += `You rolled higher than the bot, which means your bet gets doubled!`
            user.balance = Number(user.balance) + Number(bet)
        } else if(userDice < botDice) {
            msg += `Aw, I rolled higher than you, you lost your bet.`
            user.balance = Number(user.balance) - Number(bet)
        } else {
            msg += `Oh, it's a tie, you won't lose nor gain money!`
        }
        message.channel.createMessage(msg)
        user.save()

        
    }
}