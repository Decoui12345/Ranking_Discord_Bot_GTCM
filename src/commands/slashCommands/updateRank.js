// TO TEST:
// Rank 1 user from unranked to a random rank (Should emit error saying their unranked and won't update roles, ephemeral)
// Rank 2+ users doing ^^^ (Should emit error saying they are unranked and won't update roles, ephemeral)
// Rank 1 user from unranked to something and 1+ user to different ranks (Should emit error saying they are unranked and won't update roles for anyone, ephemeral)
// Rank 1 user to the same rank and 1+ users to different ranks (Should emit error saying they are already ranked there and won't update roles for anyone, ephemeral)
// Rank 2+ users normally should say if they get promoted/demoted appropriately 
// IF BROKEN FIX DUH
/** const { MongoClient } = require('mongodb');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

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
        .addUserOption(option =>
            option.setName('user1')
                .setDescription('The user you are updating')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('role1')
                .setDescription('The rank this user is getting.')
                .setRequired(true)
                .addChoices(
                    { name: 'testrole', value: testrole },
                    { name: 'ofofofo', value: ofofofo },
                    // { name: 'oglyboogsd', value: oglyboogsd },
                ))
        .addUserOption(option =>
            option.setName('user2')
                .setDescription('The second user you are updating')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('role2')
                .setDescription('The rank this user is getting.')
                .setRequired(false)
                .addChoices(
                    { name: 'testrole', value: testrole },
                    { name: 'ofofofo', value: ofofofo },
                    // { name: 'oglyboogsd', value: oglyboogsd },
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        await interaction.deferReply();

        const users = [
            interaction.options.getMember('user1'),
            interaction.options.getMember('user2'),
        ];

        const roleIds = [
            interaction.options.getString('role1'),
            interaction.options.getString('role2'),
        ];

        const client = new MongoClient(uri);

        const updateRanksE = new EmbedBuilder()
            .setTitle('Rank update:')
            .setColor('Random');

        const unrankedPlayersE = new EmbedBuilder()
            .setTitle('🎉 New ranked players!!! 🎉')
            .setColor('Green');

        const unrankedPlayers = [];
        const promotedPlayers = [];
        const demotedPlayers = [];

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
            if (user && user.roles.cache.has(oglyboogsd)) {
                unrankedPlayers.push({ user, role: roleIds[i] });
            }
        }

        try {
            await client.connect();
            const database = client.db(dbName);
            const collection = database.collection(collectionName);

            const rankChanges = [];

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
                }
            }

            if (rankChanges.length > 0) {
                await collection.insertMany(rankChanges);
            }
        } finally {
            await client.close();
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
    // Send the message with embeds and make it visible to everyone
        await interaction.editReply({ embeds: embedsToSend });
        } else {
            // If no changes were made, send a message indicating that and keep it ephemeral
            await interaction.editReply({ content: 'No changes were made.' });
        }
    }
}; **/



const { MongoClient } = require('mongodb');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

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
            .setColor('Random');

        const unrankedPlayersE = new EmbedBuilder()
            .setTitle('🎉 New ranked players!!! 🎉')
            .setColor('Green');

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
    }
};
