const { REST, Routes } = require('discord.js');
const { clientId, testServer } = require('./config.json');
require('dotenv').config();

const rest = new REST().setToken(process.env.TOKEN);

// ...
const commandId = '1233213226687397968'
// for guild-based commands
rest.delete(Routes.applicationGuildCommand(clientId, testServer, commandId))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(clientId, commandId))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);