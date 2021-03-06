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
            createUser: this.db.prepare('INSERT INTO users (id, items, heroes, gold, crystals, amulets) VALUES (?, \'[]\', \'[]\', 0, 0, 0)'),
            saveUser: this.db.prepare('UPDATE users SET items=?, heroes=?, guildid=?, gold=?, amulets=?, crystals=? WHERE id=?'),
            guild: this.db.prepare('SELECT * FROM guilds WHERE id=?'),
            allGuilds: this.db.prepare('SELECT * FROM guilds'),
            createGuild: this.db.prepare('INSERT INTO guilds (id, leaderid, members, name) VALUES (?, ?, ?, ?)'),
            saveGuild: this.db.prepare('UPDATE guilds SET members=?, leaderid=?, name=? WHERE id=?')
        }
        this.loadCommands()

        // {
        //     userid: id,
        //     guildid: id
        // }
        this.guildInvs = []
        this.roles = {
            fightMod: '565193595527888906',
            admin: '543152954488782848'
        }
    }
    loadCommands() {
        var categories = fs.readdirSync(__dirname + '/commands')
        for (var i in categories) {
            var category = categories[i]
            var commands = fs.readdirSync(__dirname + '/commands/' + category)
            for (var j in commands) {
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
        if (user == undefined) return this.createUser(id)
        user.heroes = JSON.parse(user.heroes)
        //for old ways of storing heroes
        for(let i in user.heroes) if(user.heroes[i].search(/[0-9]\*/) == -1) user.heroes[i] = '1* '+ user.heroes[i]   
        user.items = JSON.parse(user.items)
        return user
    }

    createUser(id) {
        this.statements.createUser.run(id)
        return this.getUser(id)
    }

    saveUser(user) {
        this.statements.saveUser.run(JSON.stringify(user.items), JSON.stringify(user.heroes), user.guildid, user.gold, user.amulets, user.crystals, user.id)
    }

    getAllGuilds() {
        let guilds = this.statements.allGuilds.all()
        for(let guild of guilds) {
            guild.members = JSON.parse(guild.members)
        }
        return guilds
    }

    getGuild(id) {
        let guild = this.statements.guild.get(id)
        if (guild == undefined) return this.createGuild(id)
        guild.members = JSON.parse(guild.members)
        return guild
    }

    createGuild(leaderid, name) {
        let id = this._generateRandomCode()
        this.statements.createGuild.run(id, leaderid, JSON.stringify([leaderid]), name)
        return id
    }

    saveGuild(guild) {
        this.statements.saveGuild.run(JSON.stringify(guild.members), guild.leaderid, guild.name, guild.id)
    }

    start() {

        this.bot.on('ready', () => console.log('Ready!'))
        this.bot.on('error', console.error)
        this.bot.on('messageCreate', (message) => {
            events.createMessage(message, this)
        })
        this.bot.on('messageReactionAdd', (message, emoji, userID) => {
            events.reactionAdd(message, emoji, userID, this)
        })
        this.bot.on('guildMemberRemove', (guild, member) => {
            events.guildMemberRemove(guild, member, this)
        })
        this.bot.connect()
    }
    _generateRandomCode() {
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
        let token = ''
        for(let i=0;i<10;i++) {
        token += chars[Math.round(Math.random()*chars.length)]
        }
        return token
}
}

module.exports = Client