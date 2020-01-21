function clean(text) {
    if (typeof (text) === 'string') {
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    } else {
        return text;
    }
}

module.exports = {
    aliases: ['eval'],
    desc: 'Nothing',
    run: async function (message, client, user) {
        if (message.author.id !== '235450656335331328') return
        let code;
        try {
            code = message.content.substring(5 + client.prefix.length);
            let evaled = eval(code);

            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

            message.channel.createMessage('Input: ```js\n' + code + ' ``` Ouput: ```js\n' + clean(evaled) + '\n```');
            message.delete();
        } catch (err) {
            message.channel.createMessage(`Input: \`\`\`js\n${clean(code)}\n\`\`\`\`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            message.delete();
        }
    }
}