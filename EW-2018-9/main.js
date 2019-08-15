const Discord = require('discord.js')
const client = new Discord.Client()
const prefix = 'ew!'
const config = require('./config.json')
let game = {}
let player
let opponent
let card

process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));

function clean(text) {
    if(typeof (text) === 'string') {
      return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
      }
    else {
          return text;
      }
}
const elements = {
    light: require('./cards-data/light.json'),
    wind: require('./cards-data/wind.json'),
    fire: require('./cards-data/fire.json'),
    thunder: require('./cards-data/thunder.json'),
    time: require('./cards-data/time.json'),
    earth: require('./cards-data/earth.json')
}
function initGame(message) {
    game = {
        playerOne: {
            attacked: false,
            member: message.mentions.members.first(),
            used: {},
            effect: {},
            shield: {},
            dead: 0
        },
        playerTwo: {
            attacked: false,
            member: message.mentions.members.last(),
            used: {},
            effect: {},
            shield: {},
            dead: 0
        },
        rounds: 0

    }
}
client.on('ready', () => console.log('ready!'))

client.on('message', async function(message){
    const args = message.content.toLowerCase().substring(prefix.length).split(' ');
    if(!message.content.toLowerCase().startsWith(prefix)) return
    switch (args[0]) {
        case 'ping': {
            const m = await message.channel.send('Pong?')
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
            return
            break;
        }
        case 'eval': {
			if(message.author.id !== '235450656335331328') return;
			try {
				const code = message.content.substring(7)
				let evaled = eval(code);

				if (typeof evaled !== 'string')evaled = require('util').inspect(evaled);

                 message.channel.send('Input: ```js\n' + code + ' ``` Ouput: ```js\n' + clean(evaled) + '\n```');
			    message.delete();
		    }
		    catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
			    message.delete();
            }
            return
			break;
        }
        case 'ducky': {
            message.channel.send('<:DARK_DUCK:398085702442549248>')
            break;
        }
        case 'startpractise': {
            if(message.mentions.members.size != 2) {
                message.channel.send('You need to tag 2 people!')
                return;
            }
            initGame(message)
            message.channel.send('created a new fight!')
            return
            break
        }
        case 'pass': {
            if(game.rounds == -1) {
                message.channel.send('There isn\'t a game going on?')
                return
            } 
            
            if(game[player].member.id != message.author.id) {
                message.channel.send('I don\'t think it\'s your turn')
                return
            }
            if(game.playerOne.member.id == message.author.id) {
                player = 'playerOne'
                opponent = 'playerTwo'
            } else {
                player = 'playerTwo'
                opponent = 'playerOne'
            }
            
            if(game[opponent].effect.isOn) {
                
                if(game[opponent].effect.rounds == 0) {
                    game[opponent].effect.isOn = false;
                    
                } else {
                    game[opponent].health -= game[opponent].effect.damage
                    game[opponent].effect.rounds--
                    setTimeout(() => {
                        message.channel.send(`Did ${game[opponent].effect.damage} to ${game[opponent].member.displayName} because of the effect`)
                    }, 500)
                }
                
            }
            if(game[player].effect.isOn) {
                message.channel.send(`Passed! You only earned 50<:Energy:428150256069246977> because the effect`)
                game[player].monster.energy += 50
            } else {
                message.channel.send(`Passed! Regained 70<:Energy:428150256069246977>`)
                game[player].monster.energy += 70
            }
            setTimeout(() => {
                message.channel.send(`**${game[opponent].member.displayName} your turn!**
**Health:** ${game[opponent].monster.health}
**Energy:** ${game[opponent].monster.energy}<:Energy:428150256069246977>
                `)
                let tmp;
                tmp = player
                player = opponent
                opponent = tmp
            }, 1000)
        }
    }
    if(elements[args[0]] != undefined) {
        if(elements[args[0]][args[1]] != undefined) {
            card = elements[args[0]][args[1]]
            if(args[1] == 'support' && args[2] == '2') {
                message.channel.send('I guess you mean support2? (it\'s one word!)')
                return
            }
            if(game.rounds != -1 && game.rounds != undefined) {
                if(args[1] != 'monster') {
                    if(game[player].member.id != message.author.id) {
                        message.channel.send('I don\'t think it\'s your turn')
                        return
                    }
                    if(game.playerOne.member.id == message.author.id) {
                        player = 'playerOne'
                        opponent = 'playerTwo'
                    } else {
                        player = 'playerTwo'
                        opponent = 'playerOne'
                    }
                    
                    switch (args[1]) {
                        case 'attack': {
                            if(game[player].effect.isOn && game[player].effect.damge == 0) {
                                message.channel.send('You\'re stunned, you cannot use attack nor effect')
                                return
                            } 
                            if(game[player].used.attack >= card.uses) {
                                message.channel.send('you have reached the max number of uses')
                                return
                            }
                            if((game[player].monster.energy - card.energy) < 0) {
                                message.channel.send('You don\'t have enough energy to do that')
                                return
                            }
                            if(game[opponent].shield.isOn) {
                                message.channel.send('The opponent has a shield activated!')
                                return
                            }
                            game[player].monster.energy -= card.energy
                            if(game[player].used.attack == undefined){
                                game[player].used.attack = 1
                            } else {
                                game[player].used.attack++
                            }
                            var crit = Math.floor(Math.random() * 10) + 1
                            var defMult = Math.floor(Math.random() * 10) + 1
                            console.log(game[player].monster.defence)
                            var defence = Number(game[player].monster.defence) * defMult
                            if(crit == 1) {
                                setTimeout(()=> {
                                    message.channel.send(`**Crit attack!**
${Number(card.critAttack) - defence} DMG dealt
you now have ${game[player].monster.energy}<:Energy:428150256069246977> left
                                    `)
                                    game[opponent].monster.health = Number(game[opponent].monster.health) - (Number(card.critAttack) - Number(defence))
                                }, 500)
                                
                            } else {
                                setTimeout(() => {
                                    message.channel.send(`**Attack!**
${Number(card.attack) - defence} DMG dealt
you now have ${game[player].monster.energy}<:Energy:428150256069246977> left
                                    `)
                                    game[opponent].monster.health = Number(game[opponent].monster.health) - (Number(card.attack) - Number(defence))
                                }, 500)
                                
                            }
                            break;
                        }
                        case 'support': {
                            if(args[2] == '2') {
                                message.channel.send('I guess you mean support2? (it\'s one word!)')
                                return
                            }
                            if(game[player].used.support >= card.uses) {
                                message.channel.send('you have reached the max number of uses')
                                return
                            }
                            if((game[player].monster.energy - card.energy) < 0) {
                                message.channel.send('You don\'t have enough energy to do that')
                                return
                            }
                            game[player].monster.energy -= card.energy
                            if(game[player].used.support == undefined){
                                game[player].used.support = 1
                            } else {
                                game[player].used.support++
                            }
                            game[player].monster.health = Number(game[player].monster.health) + Number(card.heal)
                            setTimeout(() => {
                                message.channel.send(`**Healed!**
You now have ${game[player].monster.health}HP
and ${game[player].monster.energy}<:Energy:428150256069246977>
                                `)
                            }, 750)
                            
                            break;
                        }
                        case 'support2': {
                            if(game[player].used.support >= card.uses) {
                                message.channel.send('you have reached the max number of uses')
                                return
                            }
                            if((game[player].monster.energy - card.energy) < 0) {
                                message.channel.send('You don\'t have enough energy to do that')
                                return
                            }
                            game[player].monster.energy -= card.energy
                            if(game[player].used.support2 == undefined){
                                game[player].used.support2 = 1
                            } else {
                                game[player].used.support2++
                            }
                            if(card.energyAdd != undefined) {
                                if(game[player].effect.isOn) {
                                    game[player].monster.energy = Number(game[player].monster.energy) + (Number(card.energyAdd) - 20)
                                } else {
                                    game[player].monster.energy = Number(game[player].monster.energy) + Number(card.energyAdd)
                                }
                                setTimeout(() => {
                                    message.channel.send(`**refilled!**
    You now have ${game[player].monster.health}HP
    and ${game[player].monster.energy}<:Energy:428150256069246977>
                                    `)
                                }, 750)
                            } else {
                                game[player].shield = {
                                    isOn: true,
                                    rounds: card.rounds + 1
                                }
                                message.channel.send(`**Shield activated!**
It will last for ${card.rounds} more rounds
                                `)
                            }
                            
                            break;
                        }
                        case 'effect': {
                            if(game[player].effect.isOn && game[player].effect.damage == 0) {
                                message.channel.send('You\'re stunned, you cannot use attack nor effect')
                                return
                            } 
                            if(game[player].used.effect >= card.uses) {
                                message.channel.send('you have reached the max number of uses')
                                return
                            }
                            if((game[player].monster.energy - card.energy) < 0) {
                                message.channel.send('You don\'t have enough energy to do that')
                                return
                            }
                            game[player].monster.energy -= card.energy
                            if(game[player].used.effect == undefined){
                                game[player].used.effect = 1
                            } else {
                                game[player].used.effect++
                            }
                            game[opponent].effect = {
                                isOn: true,
                                rounds: Number(card.rounds),
                                damage: Number(card.attack)
                            }
                            game[opponent].health = Number(game[opponent].health) - game[opponent].effect.damage
                            
                            if(game[opponent].effect.damage == 0) {
                                setTimeout(() => message.channel.send(`You've stun ${game[opponent].member.displayName} for ${game[opponent].effect.rounds} rounds`), 600)
                            } else {
                                game[opponent].effect.rounds--
                                setTimeout(() => message.channel.send(`Actived an effect on the opponent for **${game[opponent].effect.rounds}** rounds`), 600)
                                
                            }
                            break;
                        }
                    }
                    if(game[opponent].effect.isOn) {
                        if(game[opponent].effect.rounds == 0) {
                            game[opponent].effect.isOn = false;
                            
                        } else {
                            game[opponent].health -= game[opponent].effect.damage
                            game[opponent].effect.rounds--
                            if(game[opponent].effect.damage != 0) {
                                setTimeout(() => {
                                    message.channel.send(`Did ${game[opponent].effect.damage} to ${game[opponent].member.displayName} because of the effect`)
                                }, 500)
                            }
                        }
                        
                    }
                    if(game[player].shield.isOn) {
                        if(game[player].shield.rounds == 0) {
                            game[player].shield.isOn = false;
                            
                        } else {
                            game[player].shield.rounds--
                        }
                    }
                    setTimeout(() => {
                        if(game[opponent].monster.health < 0) {
                            game[opponent].monster.health = 0
                            game[opponent].dead++
                            if(game[opponent].dead = 2) {
                                message.channel.send(`**${game[player].member.displayName}** has won, **${game[opponent].member.displayName}** has lost!`)
                                game.rounds = -1
                            }
                        } else {
                            game[opponent].dead = 0
                        }
                        message.channel.send(`**${game[opponent].member.displayName} your turn!**
**Health:** ${game[opponent].monster.health}
**Energy:** ${game[opponent].monster.energy}<:Energy:428150256069246977>
                        `)
                        let tmp;
                        tmp = player
                        player = opponent
                        opponent = tmp
                    }, 1000)
                } else if(args[1] == 'monster'){
                    if(game.rounds != 0) {
                        message.channel.send('You can only give in this at the start of the game')
                    }
                    game.playerOne.element = args[0]
                    if(message.member.id == game.playerOne.member.id) {
                        game.playerOne.monster = elements[args[0]].monster
                    } else if(message.member.id == game.playerTwo.member.id){
                        game.playerTwo.monster = elements[args[0]].monster
                    }
                    if(game.playerOne.monster != undefined && game.playerTwo.monster != undefined) {
                        
                        if(game.playerOne.monster.speed > game.playerTwo.monster.speed) {
                            player = 'playerOne'
                        } else if(game.playerOne.monster.speed < game.playerTwo.monster.speed) {
                            player = 'playerTwo'
                        } else {
                            let randomNum = Math.floor(Math.random() * 2)
                            if(randomNum == 0) {
                                player = 'playerOne'
                            } else player = 'playerTwo'
                        }
                        setTimeout(() => {
                            message.channel.send(`**Game starting**
${game[player].member.nickname} your turn is first!
                        `)
                        }, 1000)
                        

                    }
                }
                
            }

            const embed = new Discord.RichEmbed()
                .setTitle(elements[args[0]][args[1]].name)
                .setImage(elements[args[0]][args[1]].url)
                .setColor(elements[args[0]].color)
            message.channel.send(embed)
            
        } else {
            message.channel.send('I couldn\'t find that card...')
        }

    }
})

client.login(config.token)
