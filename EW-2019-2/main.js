require('dotenv').config()
const Client = require('./src/client.js')
const config = require('./config.json')

const bot = new Client(config.prefix, config.discmds, config.ids)
bot.start()