require('dotenv').config();

const config = require('config');

const handlers = [
  require('./ready-handler'),
  require('./message-handler'),
]

module.exports = class DiscordHandler {

  static login(discordClient) {
    return discordClient.login(config.discord.token);
  }
  
  static configure(discordClient) {
    handlers.forEach((Handler) => discordClient.on(Handler.eventName, Handler.handle))  
  }  

}