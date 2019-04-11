const Eris = require('eris')
const fs = require('fs')
const events = require('./events.js')
const sqlite = require('better-sqlite3')

class Client {
    constructor(prefix, token) {
        this.prefix = prefix
        this.bot = new Eris(token)
        this.commands = []
        this.db = sqlite('./db.sqlite')
        this.statements = {
            user: this.db.prepare('SELECT * FROM users WHERE id=?'),
            createUser: this.db.prepare('INSERT INTO users (id, items, heroes) VALUES (?, \'[]\', \'[]\')'),
            saveUser: this.db.prepare('UPDATE users SET items=?, heroes=? WHERE id=?')
        }
        this.loadCommands()

        this.roles = {
            fightMod: '565193595527888906',
            admin: '543152954488782848'
        }
    }
    loadCommands() {
        var categories = fs.readdirSync(__dirname + '/commands')
        for(var i in categories) {
            var category = categories[i]
            var commands = fs.readdirSync( __dirname + '/commands/' + category)
            for(var j in commands) {
                var command = commands[j]
                this.commands.push(require(`${__dirname}/commands/${category}/${command}`))
            }
        }
    }
    loadMessages() {
        this.bot.getMessage('564198315995037717', '564198665552527375')
    }
    getUser(id) {
        let user = this.statements.user.get(id)
        if(user == undefined) return this.createUser(id)
        user.heroes = JSON.parse(user.heroes)
        user.items = JSON.parse(user.items)
        return user
    }

    createUser(id) {
        this.statements.createUser.run(id)
        return this.getUser(id)
    }

    saveUser(user) {
        this.statements.saveUser.run(JSON.stringify(user.items), JSON.stringify(user.heroes), user.id)
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