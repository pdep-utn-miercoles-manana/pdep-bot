module.exports = class ReadyHandler {

  static get eventName() {
    return 'ready';
  }

  static handle() {
    console.info('Bot is ready');
  }

}