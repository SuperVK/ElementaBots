module.exports = {
    aliases: ['balance', 'bal'],
    desc: 'Shows your current balance',
    run: async function(message, client) {
        let user;
        let member;
        if(message.mentions[0] != undefined) {
            member = message.mentions[0]
            user = client.getUser(message.mentions[0].id)
        } else {
            member = message.member
            user = client.getUser(message.author.id)
        }

        switch(message.args[1]) {
            case 'add': {
                if(!message.member.roles.includes('543152954488782848')) return message.channel.createMessage(`You don't have the permission to use this command`)
                if(isNaN(message.args[3])) return message.channel.createMessage(`That's not a number; order: ${client.prefix}bal @mention bal gold 100`)
                if(message.args[2] == 'gold') user.gold += Number(message.args[3])
                else if(message.args[2] == 'amulets') user.amulets += Number(message.args[3])
                else if(message.args[2] == 'crystals') user.crystals += Number(message.args[3])
                else return message.channel.createMessage(`Can't find that valuta`)
                message.channel.createMessage(`Successfully added ${message.args[3]} ${message.args[2]} to ${member.username}'s account!`)
                client.saveUser(user)
                break;
            }
            case 'remove': {
                if(!message.member.roles.includes('543152954488782848')) return message.channel.createMessage(`You don't have the permission to use this command`)
                if(isNaN(message.args[3])) return message.channel.createMessage(`That's not a number; order: ${client.prefix}bal @mention bal gold 100`)
                if(message.args[2] == 'gold') user.gold += -Number(message.args[3])
                else if(message.args[2] == 'amulets') user.amulets += -Number(message.args[3])
                else if(message.args[2] == 'crystals') user.crystals += -Number(message.args[3])
                else return message.channel.createMessage(`Can't find that valuta`)
                message.channel.createMessage(`Successfully removed ${message.args[3]} ${message.args[2]} from ${member.username}'s account!`)
                client.saveUser(user)
                break;
            }
            default: {
                message.channel.createMessage(`**${member.username}'s balance**
Gold: ${user.gold} <:GoldCoin:564095857691983912>
Crystals: ${user.crystals} <:Crystal:583626058654416898>
Amulets: ${user.amulets} <:Amulet:583961738886774795>
        `)

            }
        }
    }
}
