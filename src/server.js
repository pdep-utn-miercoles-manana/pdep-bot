
const Discord = require('discord.js');
const DiscordHandler = require('./handlers');

const client = new Discord.Client();

DiscordHandler.configure(client);

client.login(process.env.DISCORD_TOKEN);