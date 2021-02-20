module.exports = class ReadyHandler {
  get eventName() {
    return 'ready';
  }

  handle() {
    console.info('Bot is ready');
  }
}