// ✅(Created SC) What ranks are there?
// Who is in ... tier?
// ✅(Created SC)Let me rank ... into ... tier
// ✅(Created SC)When setting the rank of someone that updates their role
/* When asking for the rank of someone specific or the whole tier
group you ask for that role's list of members and it should output 
that info in a clean list */
// Create some sort of audit log either a new message/embed or in the actual audit log itself
// ✅(Created SC)Automatically takes away unranked role or any other tier role if there is a change to their roles testing testing
// Maybe the ability for people to complain about certain ranks, etc
// have a channel dedicated to displaying current ranks 
// ✅(Created SC)add history to rankPosition
// rank comparison
// more in-depth rank history for rankPosition EX: a second page that someone could look at to see all the tiny changes in their ranks
            // not necessarily between each different tier
// take users off ranks/afk tier
// comp ping
/**const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Client, Collection, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const { connectToMongoDB } = require('../database');
const { clientId, testServer } = require('../config.json')

require('../populateDatabase')(client);
client.commands = new Collection();


// Load commands

const loadCommands = (directory) => {
    const commandFiles = fs.readdirSync(directory, { withFileTypes: true });
    for (const file of commandFiles) {
        if (file.isDirectory()) {
            loadCommands(path.join(directory, file.name));
        } else if (file.name.endsWith('.js')) {
            const command = require(path.join(directory, file.name));
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                console.log(`Loaded command: ${command.data.name}`);
            } else {
                console.log(`[WARNING] The command at ${file.name} is missing a required "data" or "execute" property.`);
            }
        }
    }
};

const foldersPath = path.join(__dirname, 'commands');
loadCommands(foldersPath);

const loadEvents = (directory) => {
    const eventFiles = fs.readdirSync(directory).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(directory, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
};

loadEvents(path.join(__dirname, 'events'));
/**const foldersPath = path.join(__dirname, 'commands');
 const commandFolders = fs.readdirSync(foldersPath);
 
 for (const folder of commandFolders) {
     const commandsPath = path.join(foldersPath, folder);
     const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
     for (const file of commandFiles) {
         const filePath = path.join(commandsPath, file);
         const command = require(filePath);
         // Set a new item in the Collection with the key as the command name and the value as the exported module
         if ('data' in command && 'execute' in command) {
             client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    
    // Load events
    
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }**
    
    
    // Start the bot
    async function startBot() {
        try {
            await connectToMongoDB(); // Connect to MongoDB
            await client.login(process.env.TOKEN); // Login to Discord
        } catch (error) {
            console.error('Error starting bot:', error);
            process.exit(1); // Exit the process if an error occurs
        }
    }
    
    startBot();
    **/
   const mongoose = require('mongoose');
   const seedDatabase = require('../databaseSeeder'); 
   // MongoDB connection
   async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
       } catch (error) {
           console.error('Error connecting to MongoDB:', error);
           process.exit(1); // Exit the process if connection fails
       }
   }
   
   
   
   require('dotenv').config();
   const { Client, Collection, IntentsBitField } = require('discord.js');
   const fs = require('fs');
   const path = require('path');
   
   // Create a new Discord client instance
   const client = new Client({
       intents: [
           IntentsBitField.Flags.Guilds,
           IntentsBitField.Flags.GuildMembers,
           IntentsBitField.Flags.GuildMessages,
           IntentsBitField.Flags.MessageContent,
        ],
    }); 
    
    
    client.commands = new Collection();
    
    // Load commands
    
    const loadCommands = (directory) => {
        const commandFiles = fs.readdirSync(directory, { withFileTypes: true });
        for (const file of commandFiles) {
            if (file.isDirectory()) {
                loadCommands(path.join(directory, file.name));
            } else if (file.name.endsWith('.js')) {
                const command = require(path.join(directory, file.name));
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    console.log(`Loaded command: ${command.data.name}`);
                } else {
                    console.log(`[WARNING] The command at ${file.name} is missing a required "data" or "execute" property.`);
                }
            }
        }
    };
    
    const foldersPath = path.join(__dirname, 'commands');
    loadCommands(foldersPath);
    
    const loadEvents = (directory) => {
        const eventFiles = fs.readdirSync(directory).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const filePath = path.join(directory, file);
            const event = require(filePath);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    };
    
    loadEvents(path.join(__dirname, 'events'));

    
    // Connect to MongoDB and login to Discord
    async function startBot() {
        await connectToMongoDB();
        await client.login(process.env.TOKEN);
        await seedDatabase();
    }
    
    startBot();
    /**const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Load events

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}**/

