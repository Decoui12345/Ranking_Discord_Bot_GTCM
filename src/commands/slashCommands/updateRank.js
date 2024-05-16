// TO TEST:
// Rank 1 user from unranked to a random rank (Should emit error saying their unranked and won't update roles, ephemeral)
// Rank 2+ users doing ^^^ (Should emit error saying they are unranked and won't update roles, ephemeral)
// Rank 1 user from unranked to something and 1+ user to different ranks (Should emit error saying they are unranked and won't update roles for anyone, ephemeral)
// Rank 1 user to the same rank and 1+ users to different ranks (Should emit error saying they are already ranked there and won't update roles for anyone, ephemeral)
// Rank 2+ users normally should say if they get promoted/demoted appropriately 
// IF BROKEN FIX DUH
const { MongoClient } = require('mongodb');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } = require('discord.js');
require('dotenv').config();
const logChannelId = '1161364718846488627';

const testrole = '1197029346188214273';
const ofofofo = '1197029372616515676';
const oglyboogsd = '1197029383072915456';

const uri = process.env.MONGODB_URI;
const dbName = 'rankPosition';
const collectionName = 'rank_history';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update-ranks')
        .setDescription('For a ranker to update ranks after an event.')
// 1st user
        .addUserOption(option =>
            option
                .setName('user1')
                .setDescription('The user you are updating')
                .setRequired(true))

        .addStringOption(option =>
            option
                .setName('role1')
                .setDescription('The rank this user is getting.')
                .setRequired(true)
                .addChoices(
                    { name: 'testrole', value: testrole },
                    { name: 'ofofofo', value: ofofofo }
                ))
// 2nd user
        .addUserOption(option =>
            option
                .setName('user2')
                .setDescription('The second user you are updating')
                .setRequired(false))

        .addStringOption(option =>
            option
                .setName('role2')
                .setDescription('The rank this user is getting.')
                .setRequired(false)
                .addChoices(
                    { name: 'testrole', value: testrole },
                    { name: 'ofofofo', value: ofofofo }
                ))

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        await interaction.deferReply();
        // Log who executed the command
        console.log(`Ranker: ${interaction.user.tag} executed the command.`);

        const user1 = interaction.options.getMember('user1');
        const user2 = interaction.options.getMember('user2');

        const role1 = interaction.options.getString('role1');
        const role2 = interaction.options.getString('role2');
        
        if (!user1 || !role1) {
            await interaction.editReply({ content: 'User1 and Role1 are required options.', ephemeral: true });
            return;
        }
        
        if (user2 && !role2) {
            const usersAndRoles = new EmbedBuilder()
                .setTitle(`🛑 Error: If User2 is provided, Role2 must also be specified.`)
                .setDescription(`Please add the desired role to ${user2}.`)
                .setColor('Red');
            await interaction.editReply({ embeds: [usersAndRoles], ephemeral: true });
            return;
        }

        const users = [user1, user2];
        const roleIds = [role1, role2];

        let client;
        try {
            client = new MongoClient(uri);
            await client.connect();
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            const mongoDBError = new EmbedBuilder()
                .setTitle(`🛑 Error: Something went wrong while trying to connect to the DB`)
                .setDescription('An error occurred while connecting to the database. Please try again later.');
            await interaction.editReply({ embeds: [mongoDBError], ephemeral: true });
            return;
        }

        const updateRanksE = new EmbedBuilder()
            .setTitle('Rank update:')
            .setColor('Random')
            .setTimestamp();

        const unrankedPlayersE = new EmbedBuilder()
            .setTitle('🎉 New ranked players!!! 🎉')
            .setColor('Green')
            .setTimestamp();

        const unrankedPlayers = [];
        const promotedPlayers = [];
        const demotedPlayers = [];
        const rankChanges = [];

        const rankedPlayers = users.filter((user, index) => user && user.roles.cache.has(roleIds[index]));

        if (rankedPlayers.length > 0) {
            const alreadyRankedE = new EmbedBuilder()
                .setTitle('🛑 Error: Player is already ranked in the tier you tried.')
                .setDescription(`The following player(s) you tried to rank are already ranked: ${rankedPlayers.join(', ')}`)
                .setColor('Red');
            await interaction.editReply({ embeds: [alreadyRankedE] });
            return;
        }

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (user) {
                try {
                    if (user.roles.cache.has(oglyboogsd)) {
                        unrankedPlayers.push({ user, role: roleIds[i] });
                    }
                } catch (error) {
                    console.error(`Failed to check roles for user ${user.user.tag}:`, error);
                    const unrankedRole = new EmbedBuilder()
                        .setTitle(`🛑 Error: Something went wrong while checking roles.`)
                        .setDescription(`An error occurred while checking roles for ${user}. Please try again later.`);
                    await interaction.editReply({ embeds: [unrankedRole], ephemeral: true });
                    return;
                }
            }
        }

        try {
            const database = client.db(dbName);
            const collection = database.collection(collectionName);

            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (user) {
                    const role = `<@&${roleIds[i]}>`;
                    try {
                        if (!user.roles.cache.has(roleIds[i])) {
                            await user.roles.add(roleIds[i]);
                            rankChanges.push({
                                userId: user.id,
                                username: user.user.tag,
                                role,
                                timestamp: new Date()
                            });
                            if (user.roles.cache.has(oglyboogsd)) {
                                await user.roles.remove(oglyboogsd);
                            } else if (roleIds[i] === testrole) {
                                await user.roles.remove(ofofofo);
                                promotedPlayers.push({ user, role: roleIds[i] });
                            } else if (roleIds[i] === ofofofo) {
                                await user.roles.remove(testrole);
                                demotedPlayers.push({ user, role: roleIds[i] });
                            }
                        }
                    } catch (error) {
                        console.error(`Failed to modify roles for user ${user.user.tag}:`, error);
                        const updatingRole = new EmbedBuilder()
                            .setTitle(`🛑 Error: Something went wrong while updating roles.`)
                            .setDescription(`An error occurred while updating roles for ${user}. Please try again later.`);
                        await interaction.editReply({ embeds: [updatingRole], ephemeral: true });
                        return;
                    }
                }
            }

            try {
                if (rankChanges.length > 0) {
                    await collection.insertMany(rankChanges);
                }
            } catch (error) {
                console.error('Failed to insert rank changes into MongoDB:', error);
                const mongoDBErrorInsert = new EmbedBuilder()
                    .setTitle(`🛑 Error: Something went wrong while trying to insert data to the DB`)
                    .setDescription('An error occurred while inserting rank data to the database. Please try again later.');
                await interaction.editReply({ embeds: [mongoDBErrorInsert], ephemeral: true });
                return;
            }
        } finally {
            try {
                await client.close();
            } catch (error) {
                console.error('Failed to close MongoDB connection:', error);
            }
        }

        if (promotedPlayers.length > 0) {
            const promotionMessage = promotedPlayers.map(({ user, role }) => `- ${user} was moved up to <@&${role}> tier`).join('\n\n');
            updateRanksE.addFields({ name: 'Promotions:', value: promotionMessage });
        }

        if (demotedPlayers.length > 0) {
            const demotionMessage = demotedPlayers.map(({ user, role }) => `- ${user} was moved down to <@&${role}> tier`).join('\n\n');
            updateRanksE.addFields({ name: 'Demotions:', value: demotionMessage });
        }

        if (unrankedPlayers.length > 0) {
            const unRankedPlayerMessage = unrankedPlayers.map(({ user, role }) => `- ${user} was added into tiers at <@&${role}>`).join('\n\n');
            unrankedPlayersE.addFields({ name: 'Newly Ranked players:', value: unRankedPlayerMessage });
        }

        const embedsToSend = [];
        if (promotedPlayers.length > 0 || demotedPlayers.length > 0) {
            embedsToSend.push(updateRanksE);
        }
        if (unrankedPlayers.length > 0) {
            embedsToSend.push(unrankedPlayersE);
        }

        if (embedsToSend.length > 0) {
            await interaction.editReply({ embeds: embedsToSend });
        } else {
            await interaction.editReply({ content: 'No changes were made.', ephemeral: true });
        }
        
        
        // Fetch the channel where you want to send the log 
    const logChannel = interaction.client.channels.cache.get(logChannelId);
    
    const logEmbed = new EmbedBuilder()
    .setColor('Random')
    .addFields(
        { name: 'Ranker that executed the command:', value: `${interaction.user}`},
        { name: 'User1', value: `${user1}`, inline: true },
        { name: 'Role1', value: `<@&${role1}>`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true })
    .setTimestamp()
    .setAuthor({ name: 'Rank update Logs', iconURL: interaction.user.avatarURL() });

if (user2 && role2) {
    logEmbed.addFields(
        { name: 'User2', value: `${user2}`, inline: true },
        { name: 'Role2', value: `<@&${role2}>`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true });
}
    // Check if the log channel exists and is a text channel
    if (logChannel instanceof TextChannel) {
        // Send the log embed to the log channel
        logChannel.send({ embeds: [logEmbed] })
            .then(() => console.log('Log sent to the log channel.'))
            .catch(error => console.error('Failed to send log to the log channel:', error));
    } else {
        console.error('Invalid log channel or log channel is not a text channel.');
    }
    }
};
