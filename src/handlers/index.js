const handlers = [
  require('./ready')
]

module.exports = class DiscordHandler {

  static configure(discordClient) {
    handlers.forEach((Handler) => {
      const handler = new Handler();
      discordClient.on(handler.eventName, handler.handle);
    })
  }

}