const exec = require('child_process');
const Promise = require('bluebird');

const Message = require('../models/message');
const Student = require('../models/student');
const Validator = require('../models/validator');

Promise.promisifyAll(exec, {multiArgs: true});

class MessageHandler {

  dispatch(message) {
    const command = this[`__${message.command}`];
    if (typeof command !== 'function') throw new Error(`El comando **${message.command}** no existe.`)
    return Promise
      .resolve()
      .then(() => command(message.argument, message));
  }

  __mail(email, message) {
    Validator.email(email, 'El email ingresado no es válido.');
    Validator.conditionFails(message.hasRole(Student.MAIL_VERIFIED_ROLE_NAME), `La persona ya tiene el rol ${Student.MAIL_VERIFIED_ROLE_NAME} asignado.`);
    return Student.findOne({ email: email })
      .exec()
      .tap((student) => Validator.exists(student, 'El mail ingresado no se encuentra en la base de datos.'))
      .tap((student) => Validator.conditionFails(student.isVerified, 'El mail ya fue verificado.'))
      .tap((student) => message.setNickname(student.fullName()))
      .tap((student) => message.setRole(Student.MAIL_VERIFIED_ROLE_NAME))
      .tap((student) => student.verify())
      .then((student) => `Rol **${Student.MAIL_VERIFIED_ROLE_NAME}** asignado a **${student.fullName()}** con *mail* verificado correctamente.`)
  }

  __ping(pong) {
    return `:ping_pong: ${pong}`;
  }

  __echo(echo) {
    return echo;
  }

  __ghci(argument) {
    const expression = argument.startsWith(':') ? argument : `pp $ ${argument}`;
    const commands = ['exec', '-i', 'haskell', 'bash', '-c', 'timeout 5 ghci prettify.hs <<< $0', expression];
    return exec
      .execFileAsync('docker', commands)
      .spread((stdout, stderr) => `Expresión evaluada:\n\`\`\`haskell\n ${stderr.trim() || stdout.split('\n')[3]}\`\`\``)
      .catch((err) => {
        console.log(err);
        return Promise.reject(new Error("No se pudo ejecutar por timeout."));
      });
  }

  static get eventName() {
    return 'message';
  }

  static handle(message, handler = new MessageHandler()) {
    const msg = new Message(message)
    return Promise.resolve(msg)
      .tap(() => msg.validateProcess())
      .then(() => handler.dispatch(msg))
      .then((resp) => msg.reply(resp))
      .catch((err) => err.message === 'Message not processed', () => {})
      .catch((err) => msg.reply(err.message));
  }

}

module.exports = MessageHandler;
