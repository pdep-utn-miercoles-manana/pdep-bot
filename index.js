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

/**
 * Discord
 */
clients.on('ready', () => {
    console.log('Bot is ready');
});

clients.on('message', async message => {
    if (message.channel.name !== 'lobby') return;
    if (message.content[0] === '!') {
        if (message.member.roles.cache.some(r => r.name === "alumno")) {
            message.reply('Ya tiene asignado el rol alumno');
        } else {
            var mail = message.content.split('!')[1].trim();
            if (!validateEmail(mail)) {
                message.reply('Comando incorrecto. El formato del comando es: !<Mail>. Ejemplo: !juan.mesaglio@gmail.com');
            } else {
                estudiante.findOne({ mail: mail }, async function(err, estudiante) {
                    if (estudiante === null) {
                        message.reply(`El mail no existe en la base de datos. Revisa el mail que esta en el apartado de participantes del campus virtual**(tiene que estar exactamente igual como aparece ahi)** o comunicate con **Federico Scarpa** o **Juan Mesaglio**`);
                    } else {
                        if (!estudiante.verificado) {
                            message.member.setNickname(estudiante.nombreApellido).then(succ => {
                                message.reply('Rol **alumno** asignado, *mail* verificado correctamente, nombre asignado ' + `**${estudiante.nombreApellido}**`);
                                var member = message.guild.member(message.author);
                                var role = message.guild.roles.cache.find(role => role.name === "alumno");
                                message.guild.member(member).roles.add(role);
                                estudiante.verificado = true;
                                estudiante.save();
                            }).catch(err => {
                                message.reply('Tu rol es demasiado alto y el bot no tiene permisos para cambiarte el nombre. Comunicate con algun administrador');
                            });
                        } else {
                            message.reply('Tu mail ya fue verificado, si no es correcto comunicarse con **Federico Scarpa** o **Juan Mesaglio**');
                        }
                    }
                })
            }
        }
    }
});

clients.login(process.env.DISCORD_TOKEN);