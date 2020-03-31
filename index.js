/**
 * Imports
 */
const Discord = require('discord.js');
const clients = new Discord.Client();
const mongoose = require('mongoose');
const estudiante = require('./models/estudiantes.js');
require('dotenv').config()

/**
 * Mongoos
 */
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-lc5u9.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.MONGO_DATABASE });

/**
 * Auxiliares
 */
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email));
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

function checkComm(message, str) {
    var prefix = '!';
    return message.content.startsWith(prefix + str);
}

// asignacion de rol por letra de apellido
function assignGroup(message, apellido) {
    estudiante.findOne({ apellido: { $regex: new RegExp('^' + apellido, 'i') } }, function(err, estudiante) {
        if (estudiante === null) {
            message.reply('Ese apellido no esta en la base de datos. Reintenta o comunicate con algun administrador :confused:');
        } else {
            var newApellido = estudiante.apellido.toLowerCase();
            var nickname = message.guild.member(message.author).nickname.toLowerCase();
            if (!nickname.includes(newApellido)) {
                message.reply('Ese no es tu apellido :confused:');
                return;
            };
            if (message.member.roles.cache.some(r => r.name === "Alumnos A-B" || r.name === "Alumnos C-F" || r.name === "Alumnos G-L" || r.name === "Alumnos M-P" || r.name === "Alumnos Q-Z")) {
                message.reply('Ya tiene asignado el rol de grupo :stuck_out_tongue_closed_eyes:.');
                return;
            }
            var firstLetter = apellido[0].toUpperCase();
            if (firstLetter >= 'A' && firstLetter <= 'B') {
                assignRoleByName(message, 'Alumnos A-B');
                message.reply('Rol Alumnos A-B asignado.');
            } else if (firstLetter >= 'C' && firstLetter <= 'F') {
                assignRoleByName(message, 'Alumnos C-F');
                message.reply('Rol Alumnos C-F asignado.');
            } else if (firstLetter >= 'G' && firstLetter <= 'L') {
                assignRoleByName(message, 'Alumnos G-L');
                message.reply('Rol Alumnos G-L asignado.');
            } else if (firstLetter >= 'M' && firstLetter <= 'P') {
                assignRoleByName(message, 'Alumnos M-P');
                message.reply('Rol Alumnos M-P asignado.');
            } else if (firstLetter >= 'Q' && firstLetter <= 'Z') {
                assignRoleByName(message, 'Alumnos Q-Z');
                message.reply('Rol Alumnos Q-Z asignado.');
            }
        }
    });
}



// asignacion de rol por nombreDeRol
function assignRoleByName(message, roleName) {
    var member = message.guild.member(message.author);
    var role = message.guild.roles.cache.find(role => role.name === roleName);
    message.guild.member(member).roles.add(role);
}

// asignacion de rol y nombre por mail
function assignMail(message, mail) {
    if (message.member.roles.cache.some(r => r.name === "@estudiante")) {
        message.reply('Ya tiene asignado el rol estudiante');
    } else {
        if (!validateEmail(mail)) {
            message.reply('Formato de mail no valido.');
        } else {
            estudiante.findOne({ mail: mail }, function(err, estudiante) {
                if (estudiante === null) {
                    message.reply(`El mail no existe en la base de datos. Revisa el mail que esta en el apartado de participantes del campus virtual o comunicate con **Federico Scarpa** o **Juan Mesaglio** o **Felipe Calvo** o **Julian berbel**.`);
                } else {
                    if (!estudiante.verificado) {
                        message.member.setNickname(titleCase(estudiante.nombreApellido.toLowerCase())).then(succ => {
                            message.reply('Rol **estudiante** asignado, *mail* verificado correctamente, nombre asignado: ' + `**${titleCase(estudiante.nombreApellido.toLowerCase())}**. \nAhora tenes que usar el comando group, para ver como se usa ingresa el comando !help.`);
                            assignRoleByName(message, '@estudiante')
                            estudiante.verificado = true;
                            estudiante.save();
                        }).catch(err => {
                            message.reply('Tu rol es demasiado alto y el bot no tiene permisos para cambiarte el nombre. Comunicate con algun administrador.');
                        });
                    } else {
                        message.reply('Tu mail ya fue verificado, si no es correcto comunicarse con **Federico Scarpa** o **Juan Mesaglio** o **Felipe Calvo** o **Julian berbel**.');
                    }
                }
            })
        }
    }
}

function help(message) {
    let msg =
        "\n:clipboard: Help Menu: \n" +
        "!mail <mail>: Valida el mail,asigna rol y asigna el apodo\n" +
        "!group <apellido>: Asigna el rol de grupo\n";
    message.reply(msg);
}


/**
 * Discord
 */
clients.on('ready', () => {
    console.log('Bot is ready');
});

clients.on('message', message => {
    if (message.channel.name !== 'lobby') return;
    if (message.content[0] === '!') {
        if (checkComm(message, "mail")) {
            var cantidad = message.content.split(" ").length;
            if (cantidad != 2) {
                message.reply("Cantidad de parametros incorreta. Para ver los comando habilitados usar !help.");
                return;
            }
            var mail = message.content.split(" ")[1].trim();
            assignMail(message, mail);
        } else if (checkComm(message, "group")) {
            var cantidad = message.content.split(" ").length;
            if (cantidad != 2) {
                message.reply("Cantidad de parametros incorreta. Para ver los comando habilitados usar !help.");
                return;
            }
            var apellido = message.content.split(" ")[1].trim();
            assignGroup(message, apellido);
        } else if (checkComm(message, "help")) {
            help(message);
        } else if (checkComm(message, "")) {
            message.reply("Comando incorrecto. Para ver los comando habilitados usar !help.");
        }
    }
});

clients.on('message', message => {
    if (message.channel.name !== 'lobby') return;
});

clients.login(process.env.DISCORD_TOKEN);