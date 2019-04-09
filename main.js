const Client = require('./src/client')
const config = require('./config.json')

const client = new Client(config.prefix, config.token)

client.start()