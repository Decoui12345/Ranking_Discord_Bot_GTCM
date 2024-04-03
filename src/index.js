// What ranks are there?
// Who is in ... tier?
// Let me rank ... into ... tier
// When setting the rank of someone that updates their role
/* When asking for the rank of someone specific or the whole tier
group you ask for that role's list of members and it should output 
that info in a clean list */
// Create some sort of audit log either a new message/embed or in the actual audit log itself
// Automatically takes away unranked role or any other tier role if there is a change to their roles testing testing
require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],

});

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);
});


client.login(process.env.TOKEN);
