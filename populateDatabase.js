const { GuildMember } = require('discord.js');
const { saveMemberRank } = require('./database'); // Assuming you have a function to save member ranks in your database
const { clientId, testServer } = require('./config.json');

module.exports = async function populateDatabase(client) {
    async function populateDatabaseWithRanks(guild) {
        try {
            // Fetch all members in the guild
            await guild.members.fetch();

            // Retrieve rank roles from the guild
            const rankRoles = [
                { id: '1197029346188214273', name: 'testrole' },
                { id: '1197029372616515676', name: 'ofofofo' },
                { id: '1197029383072915456', name: 'oglyboogsd' },
                // Add more rank roles as needed
            ];

            // Iterate through each member
            guild.members.cache.forEach(async (member) => {
                // Determine the member's highest rank
                let highestRank = 'No Rank'; // Default value if member has no rank
                rankRoles.forEach((role) => {
                    if (member.roles.cache.has(role.id)) {
                        highestRank = role.name;
                    }
                });

                // Save the member's rank to the database
                await saveMemberRank(member.id, highestRank);
            });

            console.log('Database populated with member ranks successfully.');
        } catch (error) {
            console.error('Error populating database with member ranks:', error);
        }
    }

    // Event handler for the ready event
    client.once('ready', () => {
        console.log('Bot is ready.');

        // Get the guild once the bot is ready
        const guild = client.guilds.cache.get('1161364531960877057'); // Replace 'your_guild_id' with the actual guild ID
        if (guild) {
            populateDatabaseWithRanks(guild);
        } else {
            console.error('Guild not found.');
        }
    });
};
