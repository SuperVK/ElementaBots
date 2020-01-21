class Battle {
    constructor(player1, player2, username1, username2, channelID, client) {
        this.channelID = channelID
        this.client = client
        this.player1 = {
            id: player1.id,
            name: username1,
            deck: [],
            energy: 50
        }
        for(let heroName of player1.deck) {
            let hero = client.heroes.find(h => h.name == heroName)
            this.player1.deck.push({
                name: hero.name,
                pack: hero.pack,
                hp: hero.hp,
                attack: hero.attack,
                energy: hero.energy,
                url: hero.url
            })
        }
        this.player2 = {
            id: player2.id,
            name: username2,
            deck: [],
            energy: 50
        }
        for(let heroName of player2.deck) {
            let hero = client.heroes.find(h => h.name == heroName)
            this.player2.deck.push({
                name: hero.name,
                pack: hero.pack,
                hp: hero.hp,
                attack: hero.attack,
                energy: hero.energy,
                url: hero.url
            })
        }

        this.mainMsgId = ``
        this.lastMessageId = ``
        this.actionlog = []
        this.turn = 'None'
        this.opponent = 'None'
    }
    async init() {
        //checks
        if(this.player1.deck.length == 0) return this.sendMsg(`${this.player1.name} has no deck made yet, make it with ${this.client.prefix}deck`)
        if(this.player2.deck.length == 0) return this.sendMsg(`${this.player2.name} has no deck made yet, make it with ${this.client.prefix}deck`)

        this.turn = 'player1'
        this.opponent = 'player2'
        this.mainMsgId = (await this.client.bot.createMessage(this.channelID, this.getStats())).id
        this.lastMessageId = (await this.sendMsg(`<@${this[this.turn].id}> your turn first! Attack using: ${this.client.prefix}fight attack your_hero opponent_hero`)).id
    }
    async attack(msg) {
        if(msg.author.id != this[this.turn].id) return this.sendErrMsg(msg, `It's not your turn`)
        let hero1 = this[this.turn].deck.find(h => h.name.toLowerCase().startsWith(msg.args[1]))
        if(hero1 == undefined) return this.sendErrMsg(msg,`I can't find the first hero!`)
        let hero2 = this[this.opponent].deck.find(h => h.name.toLowerCase().startsWith(msg.args[1+hero1.name.split(' ').length]))
        if(hero2 == undefined) return this.sendErrMsg(msg,`I can't find the second hero!`)
        let critChance = Math.random()
        let attack;
        if(critChance < 0.3) {
            let critChance2 = (Math.floor(Math.random()*4)+1)/10
            if(critChance < 0.05) {
                let totalMultiplier = 2 + critChance2
            } else {
                let totalMultiplier = 1 + critChance2
            }
        } else {
            attack = hero1.attack
        }
        hero2.hp -= hero1.attack
        if(hero2.hp <= 0) {
            this.actionlog.push(`${this[this.turn].name} killed ${hero2.name} with ${hero1.name} (-${hero1.attack}HP)`)
            this[this.opponent].splice(this[this.opponent].deck.findIndex(h => h.name == hero2.name), 1)
            if(this[this.opponent].deck.length == 0) {
                this.actionlog.push(`${this[this.turn].name} won!`)
                this.updateStats()
            }
            
        } else {
            this.actionlog.push(`${this[this.turn].name} attacked ${hero2.name} with ${hero1.name} (-${hero1.attack}HP)`)
        }
        this.updateStats()
        msg.delete()
        this.client.bot.deleteMessage(this.channelID, this.lastMessageId)
        this.lastMessageId = (await this.sendMsg(`<@${this[this.opponent].id}> your turn! Attack using: ${this.client.prefix}fight attack your_hero opponent_hero`)).id
        this.turn = this.turn == 'player1' ? 'player2' : 'player1'
        this.opponent = this.opponent == 'player1' ? 'player2' : 'player1'
    }
    getStats() {

        let msg = `**${this.player1.name}** vs **${this.player2.name}**
\`\`\`md
Actionlog
-----------\n`
        for(let action of this.actionlog) {
            msg += action + '\n'
        }
        

        msg += '\n'

        for(let i = 1; i < 3; i++) {
            msg += `\n${this['player'+ i].name}'s deck (${this['player' + i].energy}⚡)\n${'-'.repeat(this['player' + i].name.length + 10 + String(this['player' + i].energy).length)}
+------------+--------+--------+--------+
| <Hero>     |<Health>|<Damage>|<Energy>|
+------------+--------+--------+--------+
`
            for(let hero of this['player'+ i].deck) {
                let name
                if(hero.name.length > 11) {
                    name = hero.name.split('').slice(0, 9).join('') + `..`
                } else {
                    name = hero.name
                }
                msg += `| ${name}${' '.repeat(11-name.length)}| ${hero.hp}${' '.repeat(7-hero.hp.toString().length)}| ${hero.attack}${' '.repeat(7-hero.attack.toString().length)}| ${hero.energy}${' '.repeat(7-hero.energy.toString().length)}| 
+------------+--------+--------+--------+\n`
            }
        }

        

        msg += '```'
        return msg
    }
    updateStats() {
        this.client.bot.editMessage(this.channelID, this.mainMsgId, this.getStats())
    }
    async sendErrMsg(originalMsg, content) {
        let errMsg = await this.sendMsg(content)
        setTimeout(function() {
            errMsg.delete()
            originalMsg.delete()
        }, 2.5 * 1000)
    }
    async sendMsg(msg) {
        return await this.client.bot.createMessage(this.channelID, msg)
    }
}

module.exports = Battle