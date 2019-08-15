module.exports = {
    desc: 'The users leaderboard',
    aliases: ['leaderboard', 'lb'],
    run: async function(message, client, user) {
        let res = await client.dbConn.query('SELECT * FROM users ORDER BY balance DESC')
        let msg = `**Leaderboard**\n`
        for(let i in res) {
            let user = res[i]
            let disUser = await client.bot.getRESTUser(user.id)
            msg += `${Number(i)+1}. ${disUser.username}#${disUser.discriminator}: \`${user.balance}\`\n`
            if(i == 9) break;
        }
        message.channel.createMessage(msg)
    }
}