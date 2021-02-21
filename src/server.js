
const Discord = require('discord.js');
const Promise = require('bluebird');

const DiscordHandler = require('./handlers');
const Mongoose = require('./helpers/mongoose');

Promise
  .resolve(new Discord.Client())
  .tap(Mongoose.logEvents)
  .tap(Mongoose.connectDB)
  .tap(DiscordHandler.configure)
  .tap(DiscordHandler.login);