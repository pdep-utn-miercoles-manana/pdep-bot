module.exports = class Message {

  constructor (aMessage) {
    this.message = aMessage;
    this.COMMAND_PREFIX = '!';
  }

  reply(aText) {
    this.message.reply(aText);
  }

  setNickname(fullName) {
    this.message.member.setNickname(fullName);
  }

  setRole(roleName) {
    const member = this.message.guild.member(this.message.author);
    const role = this.message.guild.roles.cache.find(role => role.name === roleName);
    this.message.guild.member(member).roles.add(role);
  }

  hasRole(aRole) {
    return this.message.member.roles.cache.some((role) => role.name === aRole);
  }  

  parse() {
    return this.message.content.match(/^!(?<command>\w+)\s+(?<argument>.+)/).groups;
  }  

  validateProcess() {
    if (this.message.content[0] !== this.COMMAND_PREFIX) {
      throw new Error('Message not processed');
    };
  }

  get command() {
    return this.parse().command;
  }

  get argument() {
    return this.parse().argument;
  }

}