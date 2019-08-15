module.exports = {
    desc: 'Pong?',
    aliases: ['ping', 'pong'],
    run: async function(message, client) {

        let latency = client.bot.shards.find(s => s.id == client.bot.guildShardMap[message.channel.guild.id]).latency

        message.channel.createMessage('Ping?').then(msg => {
            msg.edit(`Pong! Total latency: \`${msg.timestamp-message.timestamp}ms\``)
        })
    }
}