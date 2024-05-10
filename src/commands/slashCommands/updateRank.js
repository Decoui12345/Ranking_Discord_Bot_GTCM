// TO TEST:
// Rank 1 user from unranked to a random rank (Should emit error saying their unranked and won't update roles, ephemeral)
// Rank 2+ users doing ^^^ (Should emit error saying they are unranked and won't update roles, ephemeral)
// Rank 1 user from unranked to something and 1+ user to different ranks (Should emit error saying they are unranked and won't update roles for anyone, ephemeral)
// Rank 1 user to the same rank and 1+ users to different ranks (Should emit error saying they are already ranked there and won't update roles for anyone, ephemeral)
// Rank 2+ users normally should say if they get promoted/demoted appropriately 
// IF BROKEN FIX DUH
const { MongoClient } = require('mongodb');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const testrole =  '1197029346188214273';
const ofofofo = '1197029372616515676';
const oglyboogsd = '1197029383072915456';


const uri = process.env.MONGODB_URI

const dbName = 'rankPosition';
const collectionName = 'rank_history';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('update-ranks')
    .setDescription('For a ranker to update ranks after an event.')
    .addUserOption(option =>
        option
            .setName('user1')
            .setDescription('The user(s) you are updating')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName('role1')
        .setDescription('The rank this user is getting.')
        .setRequired(true)
        .addChoices(
            { name: 'testrole', value: '1197029346188214273' },
			{ name: 'ofofofo', value: '1197029372616515676' },
			{ name: 'oglyboogsd', value: '1197029383072915456' },
        )
    )
    .addUserOption(option =>
        option
            .setName('user2')
            .setDescription('The user(s) you are updating')
            .setRequired(false)
    )
    .addStringOption(option =>
        option
        .setName('role2')
        .setDescription('The rank this user is getting.')
        .setRequired(false)
        .addChoices(
            { name: 'testrole', value: '1197029346188214273' },
			{ name: 'ofofofo', value: '1197029372616515676' },
			{ name: 'oglyboogsd', value: '1197029383072915456' },
        )
    )
  /**   .addUserOption(option =>
        option
            .setName('user3')
            .setDescription('The user(s) you are updating')
            .setRequired(false)
    )
    .addUserOption(option =>
        option
            .setName('user4')
            .setDescription('The user(s) you are updating')
            .setRequired(false)
    )
    .addUserOption(option =>
        option
            .setName('user5')
            .setDescription('The user(s) you are updating')
            .setRequired(false)
    )
    .addUserOption(option =>
        option
            .setName('user6')
            .setDescription('The user(s) you are updating')
            .setRequired(false)
    )
    .addUserOption(option =>
        option
            .setName('user7')
            .setDescription('The user(s) you are updating')
            .setRequired(false)
    )
    .addUserOption(option =>
        option
            .setName('user8')
            .setDescription('The user(s) you are updating')
            .setRequired(false)
    )
    .addUserOption(option =>
        option
            .setName('user9')
            .setDescription('The user(s) you are updating')
            .setRequired(false)
    ) **/
    
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const users = [
            interaction.options.getMember('user1'),
            interaction.options.getMember('user2'),
            // Add more users if needed
        ];

        const roleIds = [
            interaction.options.getString('role1'),
            interaction.options.getString('role2'),
            // Add more roles if needed
        ];

        // Might get rid of this and just roleIds cause they mean the same thing
        // Only used this var because it made more sense gramatically to me
        const userRoles = [
            interaction.options.getString('role1'),
            interaction.options.getString('role2'),
            // Add more roles if needed
        ];

        // MongoDB client initialization
        const client = new MongoClient(uri);

        // General embed for the updated ranks message
        const updateRanksE = new EmbedBuilder()
            .setTitle('Rank update:')
            .setColor('Random');

    
        const unrankedPlayers = [];
        const promotedPlayers = [];
        const demotedPlayers = [];
        // Check for already ranked players
        const rankedPlayers = users.filter((user, index) => user && user.roles.cache.has(roleIds[index]));
        let shouldUpdateRoles = true;

        // Error embed for ranked players
                if (rankedPlayers.length > 0) {
                    const alreadyRankedE = new EmbedBuilder()
                        .setTitle(`🛑 Error: Player is already ranked in the tier you tried.`)
                        .setDescription(`The following player(s) you tried to rank are already 
                                        ranked in the spot you wanted them to be: ${rankedPlayers.join(', ')}`)
                        .setColor('Red');
                    await interaction.reply({ embeds: [alreadyRankedE], ephemeral: true });
                    return;
                }

    
        // Check if any user is unranked
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (user && user.roles.cache.has(oglyboogsd)) {
                    unrankedPlayers.push(user);
                    shouldUpdateRoles = false; // Set to false if any user is unranked
                }
            }
    
        // If any user is unranked, display error message and return
                if (!shouldUpdateRoles) {
                    const unrankedPlayersE = new EmbedBuilder()
                        .setTitle('🛑 Error: Unranked player(s)')
                        .setColor('Red')
                        .setDescription(`Please use /add-rank to rank the following player(s): ${unrankedPlayers.join(', ')}`);
                    await interaction.reply({ embeds: [unrankedPlayersE], ephemeral: true });
                    return;
                }

        try {
            await client.connect();
            const database = client.db(dbName);
            const collection = database.collection(collectionName);

            const rankChanges = [];

            // Loop through users to update roles and push users to the empty arrays defined above

        // Loop through users to update roles and push users to the empty arrays defined above
        // Continue with role updates for all users
                for (let i = 0; i < users.length; i++) {
                    const user = users[i];
                    if (user) {
                        const role = `<@&${roleIds[i]}>`;
                        if (!user.roles.cache.has(roleIds[i])) {
                            await user.roles.add(roleIds[i]);
                            rankChanges.push({
                                userId: user.id,
                                username: user.user.tag,
                                role,
                                timestamp: new Date()
                            });
                            if (userRoles[i] === testrole) {
                                await user.roles.remove(ofofofo);
                                promotedPlayers.push({ user, role: userRoles[i] }); // Store both user and role
                            } else if (userRoles[i] === ofofofo) {
                                await user.roles.remove(testrole);
                                demotedPlayers.push({ user, role: userRoles[i] }); // Store both user and role
                            }
                        }
                    }
                }
                // Insert rank changes into MongoDB
                if (rankChanges.length > 0) {
                    await collection.insertMany(rankChanges);
                }
} finally {
    // Close MongoDB client connection
    await client.close();
}

        if (promotedPlayers.length > 0) {
            let promotionMessage = '';
            for (let i = 0; i < promotedPlayers.length; i++) {
                const { user, role } = promotedPlayers[i];
                promotionMessage += `- ${user} was moved up to <@&${role}> tier\n\n`;
            }
            updateRanksE.addFields({ name: 'Promotions:', value: promotionMessage });
        }
        
        if (demotedPlayers.length > 0) {
            let demotionMessage = '';
            for (let i = 0; i < demotedPlayers.length; i++) {
                const { user, role } = demotedPlayers[i];
                demotionMessage += `- ${user} was moved down to <@&${role}> tier\n\n`;
            }
            updateRanksE.addFields({ name: 'Demotions:', value: demotionMessage });
        }
       
        
       

        // Error embed for users that are unranked because i want people to use /add-rank
        // Might honestly just remove this logic idk tho
        if (unrankedPlayers.length > 0) {
            const unrankedPlayersE = new EmbedBuilder()
                .setTitle('🛑 Error: Unranked player(s)')
                .setColor('Red') // 'RED' instead of 'Red'
                .setDescription(`Please use /add-rank to rank the following player(s): ${unrankedPlayers.join(', ')}`);
            await interaction.reply({ embeds: [unrankedPlayersE], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [updateRanksE] });
        }
    }
};