const Eris = require('eris')
const fs = require('fs')
const events = require('./events.js')

class Client {
    constructor(prefix, token) {
        this.prefix = prefix
        this.bot = new Eris(token)
        this.commands = []
        this.loadCommands()
    }
    loadCommands() {
        
        var commands = fs.readdirSync( __dirname + '/commands/')
        for(var j in commands) {
            var command = commands[j]
            this.commands.push(require(`${__dirname}/commands/${command}`))
        }
        
    }
    loadMessages() {
        this.bot.getMessage('564198315995037717', '564198665552527375')
    }
    start() {
        
        this.bot.on('ready', () => console.log('Ready!'))
        this.bot.on('error', console.error)
        this.bot.on('messageCreate', (message) => {
            events.createMessage(message, this)
        })
        this.bot.on('messageReactionAdd', (message, emoji, userID) => {
            events.reactionAdd(message, emoji, userID)
        })
        this.bot.connect()
    }
}

module.exports = Client