// TO TEST:
// Rank 1 user from unranked to a random rank (Should emit error saying their unranked and won't update roles, ephemeral)
// Rank 2+ users doing ^^^ (Should emit error saying they are unranked and won't update roles, ephemeral)
// Rank 1 user from unranked to something and 1+ user to different ranks (Should emit error saying they are unranked and won't update roles for anyone, ephemeral)
// Rank 1 user to the same rank and 1+ users to different ranks (Should emit error saying they are already ranked there and won't update roles for anyone, ephemeral)
// Rank 2+ users normally should say if they get promoted/demoted appropriately 
// IF BROKEN FIX DUH
/**const { MongoClient } = require('mongodb');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } = require('discord.js');
require('dotenv').config();
const logChannelId = '1161364718846488627';
const testrole = '1197029346188214273';
const ofofofo = '1197029372616515676';
const oglyboogsd = '1197029383072915456';

const rankNames = {
    '1197029346188214273': 'test role',
    '1197029372616515676': 'ofofofo',
    '1197029383072915456': 'oglyboogsdofjsf'
};

const uri = process.env.MONGODB_URI;
const dbName = 'rankPosition';
const collectionName = 'rank_history';
const ldbName = 'test';
const leaderboardCollectionName = 'users';
const leaderboardChannelId = '1161365791493603439';
const leaderboardMessageId = '1242940537397313646';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update-ranks')
        .setDescription('For a ranker to update ranks after an event.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        await interaction.deferReply();
        console.log(`Ranker: ${interaction.user.tag} executed the command.`);

        const users = [];
        const roleIds = [];

        for (let i = 1; i <= 9; i++) {
            const user = interaction.options.getMember(`user${i}`);
            const role = interaction.options.getString(`role${i}`);

            if (user && role) {
                users.push(user);
                roleIds.push(role);
            } else if ((user && !role) || (!user && role)) {
                const usersAndRoles = new EmbedBuilder()
                    .setTitle(`🛑 Error: If User${i}/Role${i} is provided, User${i}/Role${i} must also be specified.`)
                    .setDescription(`Please add the desired user/role to ${user || `<@&${role}>`}.`)
                    .setColor('Red');
                await interaction.editReply({ embeds: [usersAndRoles], ephemeral: true });
                return;
            }
        }

        if (users.length === 0) {
            await interaction.editReply({ content: 'At least one user and role must be specified.', ephemeral: true });
            return;
        }

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
            const leaderboardCollection = database.collection(leaderboardCollectionName);

            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (user) {
                    const role = `<@&${roleIds[i]}>`;
                    try {
                        if (!user.roles.cache.has(roleIds[i])) {
                            const position = interaction.options.getInteger(`position${i}`) || -1; // Default position to -1 if not specified
                            await user.roles.add(roleIds[i]);
                            rankChanges.push({
                                userId: user.id,
                                username: user.user.tag,
                                role,
                                position,
                                timestamp: new Date()
                            });

                            const leaderboardEntry = {
                                userId: user.id,
                                username: user.user.tag,
                                rank: role,
                                position,
                                timestamp: new Date()
                            };

                            await leaderboardCollection.updateOne(
                                { userId: user.id },
                                { $set: leaderboardEntry },
                                { upsert: true }
                            );

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
    
            const logChannel = interaction.client.channels.cache.get(logChannelId);
    
            async function logEmbeds(logChannel) {
                let fieldCount = 1;
                let currentEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .addFields({ name: 'Ranker that executed the command:', value: `${interaction.user}` })
                    .setTimestamp()
                    .setAuthor({ name: 'Rank update Logs', iconURL: interaction.user.avatarURL() });
    
                for (let i = 0; i < users.length; i++) {
                    if (fieldCount + 3 > 25) {
                        await logChannel.send({ embeds: [currentEmbed] });
                        currentEmbed = new EmbedBuilder()
                            .setColor('Random')
                            .addFields({ name: 'Ranker that executed the command:', value: `${interaction.user}` })
                            .setTimestamp()
                            .setAuthor({ name: 'Rank update Logs', iconURL: interaction.user.avatarURL() });
                        fieldCount = 1;
                    }
                    currentEmbed.addFields(
                        { name: `User${i + 1}`, value: `${users[i]}`, inline: true },
                        { name: `Role${i + 1}`, value: `<@&${roleIds[i]}>`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true });
                    fieldCount += 3;
                }
    
                if (fieldCount > 0) {
                    await logChannel.send({ embeds: [currentEmbed] });
                }
            }
    
            if (logChannel instanceof TextChannel) {
                await logEmbeds(logChannel);
            } else {
                console.error('Invalid log channel or log channel is not a text channel.');
            }
    
            // Update leaderboard
            try {
                client = new MongoClient(uri);
                await client.connect();
    
                const database = client.db(ldbName);
                const leaderboardCollection = database.collection(leaderboardCollectionName);
    
                const leaderboard = await leaderboardCollection.find().sort({ rank: 1, position: 1 }).toArray();
                if (leaderboard.length === 0) {
                    console.error('No ranked users found.');
                    return;
                }
    
                const groupedLeaderboard = leaderboard.reduce((acc, entry) => {
                    const rankName = rankNames[entry.rank];
                    if (!acc[rankName]) {
                        acc[rankName] = [];
                    }
                    acc[rankName].push(entry);
                    return acc;
                }, {});
    
                const leaderboardMessage = Object.entries(groupedLeaderboard).map(([rank, users]) => {
                    return `**${rank}**\n${users.map(user => `<@${user.userId}> (${user.position})`).join('\n')}\n\n`;
                }).join('\n');
    
                const leaderboardChannel = interaction.client.channels.cache.get(leaderboardChannelId);
                if (!leaderboardChannel) {
                    console.error('Invalid leaderboard channel or leaderboard channel is not a text channel.');
                    return;
                }
    
                const leaderboardMessageToUpdate = await leaderboardChannel.messages.fetch(leaderboardMessageId);
                if (leaderboardMessageToUpdate) {
                    await leaderboardMessageToUpdate.edit(leaderboardMessage);
                } else {
                    console.error('Leaderboard message not found.');
                }
            } catch (error) {
                console.error('Failed to update leaderboard:', error);
            } finally {
                if (client) {
                    await client.close();
                }
            }
        }
    };
    
    for (let i = 1; i <= 8; i++) {
        module.exports.data.addUserOption(option =>
            option
                .setName(`user${i}`)
                .setDescription(`The user ${i} you are updating`)
                .setRequired(i === 1))
            .addStringOption(option =>
                option
                    .setName(`role${i}`)
                    .setDescription(`The rank user ${i} is getting.`)
                    .setRequired(i === 1)
                    .addChoices(
                        { name: 'testrole', value: testrole },
                        { name: 'ofofofo', value: ofofofo }
                    ))
            .addIntegerOption(option =>
                option
                    .setName(`position${i}`)
                    .setDescription(`The position user ${i} will occupy in the rank (optional).`)
                    .setRequired(false));
    }
    

















/**const { MongoClient } = require('mongodb');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } = require('discord.js');
require('dotenv').config();
const logChannelId = '1161364718846488627';
const testrole = '1197029346188214273';
const ofofofo = '1197029372616515676';
const oglyboogsd = '1197029383072915456';

const rankNames = {
    '1197029346188214273': 'test role',
    '1197029372616515676': 'ofofofo',
    '1197029383072915456': 'oglyboogsdofjsf'
};

const uri = process.env.MONGODB_URI;
const dbName = 'rankPosition';
const collectionName = 'rank_history';
const leaderboardCollectionName = 'leaderboard';
const leaderboardChannelId = '1161365791493603439';
const leaderboardMessageId = '1242887769739759738';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update-ranks')
        .setDescription('For a ranker to update ranks after an event.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        await interaction.deferReply();
        console.log(`Ranker: ${interaction.user.tag} executed the command.`);

        const users = [];
        const roleIds = [];

        for (let i = 1; i <= 9; i++) {
            const user = interaction.options.getMember(`user${i}`);
            const role = interaction.options.getString(`role${i}`);

            if (user && role) {
                users.push(user);
                roleIds.push(role);
            } else if ((user && !role) || (!user && role)) {
                const usersAndRoles = new EmbedBuilder()
                    .setTitle(`🛑 Error: If User${i}/Role${i} is provided, User${i}/Role${i} must also be specified.`)
                    .setDescription(`Please add the desired user/role to ${user || `<@&${role}>`}.`)
                    .setColor('Red');
                await interaction.editReply({ embeds: [usersAndRoles], ephemeral: true });
                return;
            }
        }

        if (users.length === 0) {
            await interaction.editReply({ content: 'At least one user and role must be specified.', ephemeral: true });
            return;
        }

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
            const leaderboardCollection = database.collection(leaderboardCollectionName);

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

                            const leaderboardEntry = {
                                userId: user.id,
                                username: user.user.tag,
                                rank: role,
                                timestamp: new Date()
                            };

                            await leaderboardCollection.updateOne(
                                { userId: user.id },
                                { $set: leaderboardEntry },
                                { upsert: true }
                            );

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

        const logChannel = interaction.client.channels.cache.get(logChannelId);

        async function logEmbeds(logChannel) {
            let fieldCount = 1;
            let currentEmbed = new EmbedBuilder()
                .setColor('Random')
                .addFields({ name: 'Ranker that executed the command:', value: `${interaction.user}` })
                .setTimestamp()
                .setAuthor({ name: 'Rank update Logs', iconURL: interaction.user.avatarURL() });

            for (let i = 0; i < users.length; i++) {
                if (fieldCount + 3 > 25) {
                    await logChannel.send({ embeds: [currentEmbed] });
                    currentEmbed = new EmbedBuilder()
                        .setColor('Random')
                        .addFields({ name: 'Ranker that executed the command:', value: `${interaction.user}` })
                        .setTimestamp()
                        .setAuthor({ name: 'Rank update Logs', iconURL: interaction.user.avatarURL() });
                    fieldCount = 1;
                }
                currentEmbed.addFields(
                    { name: `User${i + 1}`, value: `${users[i]}`, inline: true },
                    { name: `Role${i + 1}`, value: `<@&${roleIds[i]}>`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true });
                fieldCount += 3;
            }

            if (fieldCount > 0) {
                await logChannel.send({ embeds: [currentEmbed] });
            }
        }

        if (logChannel instanceof TextChannel) {
            await logEmbeds(logChannel);
        } else {
            console.error('Invalid log channel or log channel is not a text channel.');
        }

        // Update leaderboard
        try {
            client = new MongoClient(uri);
            await client.connect();

            const database = client.db(dbName);
            const leaderboardCollection = database.collection(leaderboardCollectionName);

            const leaderboard = await leaderboardCollection.find().sort({ rank: 1, timestamp: 1 }).toArray();
            if (leaderboard.length === 0) {
                console.error('No ranked users found.');
                return;
            }

            const groupedLeaderboard = leaderboard.reduce((acc, entry) => {
                const roleId = entry.rank.replace(/<@&|>/g, ''); // Remove <@& and > from the role ID
                const rankName = rankNames[roleId];
                if (!acc[rankName]) {
                    acc[rankName] = [];
                }
                acc[rankName].push(`<@${entry.userId}>`);
                return acc;
            }, {});

            let leaderboardMessage = '**Leaderboard**\n\n';
            for (const [rank, users] of Object.entries(groupedLeaderboard)) {
                leaderboardMessage += `**${rank}**\n`;
                leaderboardMessage += users.join(', ') + '\n\n';
            }

            const leaderboardChannel = interaction.client.channels.cache.get(leaderboardChannelId);
            if (!leaderboardChannel) {
                console.error('Invalid leaderboard channel or leaderboard channel is not a text channel.');
                return;
            }

            const leaderboardMessageToUpdate = await leaderboardChannel.messages.fetch(leaderboardMessageId);
            if (leaderboardMessageToUpdate) {
                await leaderboardMessageToUpdate.edit(leaderboardMessage);
            } else {
                console.error('Leaderboard message not found.');
            }
        } catch (error) {
            console.error('Failed to update leaderboard:', error);
        } finally {
            if (client) {
                await client.close();
            }
        }
    }
};

for (let i = 1; i <= 9; i++) {
    module.exports.data.addUserOption(option =>
        option
            .setName(`user${i}`)
            .setDescription(`The user ${i} you are updating`)
            .setRequired(i === 1))
        .addStringOption(option =>
            option
                .setName(`role${i}`)
                .setDescription(`The rank user ${i} is getting.`)
                .setRequired(i === 1)
                .addChoices(
                    { name: 'testrole', value: testrole },
                    { name: 'ofofofo', value: ofofofo }
                ));
}





















const { MongoClient } = require('mongodb');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } = require('discord.js');
require('dotenv').config();
const logChannelId = '1161364718846488627';
// rank roles in order highest to lowest
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
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        await interaction.deferReply();
        // Log who executed the command
        console.log(`Ranker: ${interaction.user.tag} executed the command.`);

        const users = [];
        const roleIds = [];

// Adds users and roles to arrays defined above as well as checks to see if given users/roles are the correct amount, error if not


        for (let i = 1; i <= 9; i++) {
            const user = interaction.options.getMember(`user${i}`);
            const role = interaction.options.getString(`role${i}`);

            if (user && role) {
                users.push(user);
                roleIds.push(role);
            } else if ((user && !role) || (!user && role)) {
                const usersAndRoles = new EmbedBuilder()
                    .setTitle(`🛑 Error: If User${i}/Role${i} is provided, User${i}/Role${i} must also be specified.`)
                    .setDescription(`Please add the desired user/role to ${ user || `<@&${role}>` }.`)
                    .setColor('Red');
                await interaction.editReply({ embeds: [usersAndRoles], ephemeral: true });
                return;
            }
        }

        if (users.length === 0) {
            await interaction.editReply({ content: 'At least one user and role must be specified.', ephemeral: true });
            return;
        }

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
// Sees if the user is already ranked in the role they were given
        const rankedPlayers = users.filter((user, index) => user && user.roles.cache.has(roleIds[index]));
// Error code for players already in the spot they were given
        if (rankedPlayers.length > 0) {
            const alreadyRankedE = new EmbedBuilder()
                .setTitle('🛑 Error: Player is already ranked in the tier you tried.')
                .setDescription(`The following player(s) you tried to rank are already ranked: ${rankedPlayers.join(', ')}`)
                .setColor('Red');
            await interaction.editReply({ embeds: [alreadyRankedE] });
            return;
        }
// Adds unranked users to an array to be called for an embed later on
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
// Updates the roles, removing, adding, also logging it into MongoDB
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


// All the info for promoted, demoted, and unranked players to send in an embed

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

        // Function to send embeds
        async function logEmbeds(logChannel) {
            let fieldCount = 1;
            let currentEmbed = new EmbedBuilder()
                .setColor('Random')
                .addFields({ name: 'Ranker that executed the command:', value: `${interaction.user}` })
                .setTimestamp()
                .setAuthor({ name: 'Rank update Logs', iconURL: interaction.user.avatarURL() });

            for (let i = 0; i < users.length; i++) {
                if (fieldCount + 3 > 25) {
                    // Send the current embed and start a new one
                    await logChannel.send({ embeds: [currentEmbed] });
                    currentEmbed = new EmbedBuilder()
                        .setColor('Random')
                        .addFields({ name: 'Ranker that executed the command:', value: `${interaction.user}` })
                        .setTimestamp()
                        .setAuthor({ name: 'Rank update Logs', iconURL: interaction.user.avatarURL() });
                    fieldCount = 1;
                }
                currentEmbed.addFields(
                    { name: `User${i + 1}`, value: `${users[i]}`, inline: true },
                    { name: `Role${i + 1}`, value: `<@&${roleIds[i]}>`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true });
                fieldCount += 3;
            }

            // Send the last embed if it has any fields
            if (fieldCount > 0) {
                await logChannel.send({ embeds: [currentEmbed] });
            }
        }

        // Check if the log channel exists and is a text channel
        if (logChannel instanceof TextChannel) {
            await logEmbeds(logChannel);
        } else {
            console.error('Invalid log channel or log channel is not a text channel.');
        }
    },
    };

// Add user and role options to the SlashCommandBuilder
for (let i = 1; i <= 9; i++) {
    module.exports.data.addUserOption(option =>
        option
            .setName(`user${i}`)
            .setDescription(`The user ${i} you are updating`)
            .setRequired(i === 1)) // Only user1 is required
        .addStringOption(option =>
            option
                .setName(`role${i}`)
                .setDescription(`The rank user ${i} is getting.`)
                .setRequired(i === 1) // Only role1 is required
                .addChoices(
                    { name: 'testrole', value: testrole },
                    { name: 'ofofofo', value: ofofofo }
                ));
}; **/











/**const { MongoClient } = require('mongodb');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } = require('discord.js');
//const { rankNames } = require('./leaderboard');
require('dotenv').config();
const logChannelId = '1161364718846488627';
const testrole = '1197029346188214273';
const ofofofo = '1197029372616515676';
const oglyboogsd = '1197029383072915456';

const rankNames = {
    '1197029346188214273': 'test role',
    '1197029372616515676': 'ofofofo',
    '1197029383072915456': 'oglyboogsdofjsf'
};

const uri = process.env.MONGODB_URI;
const dbName = 'rankPosition';
const collectionName = 'rank_history';
const leaderboardCollectionName = 'leaderboard';
const leaderboardChannelId = '1161365791493603439'; // Replace with your leaderboard channel ID
const leaderboardMessageId = '1242887769739759738'; // Replace with your leaderboard message ID


module.exports = {
    data: new SlashCommandBuilder()
        .setName('update-ranks')
        .setDescription('For a ranker to update ranks after an event.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        await interaction.deferReply();
        console.log(`Ranker: ${interaction.user.tag} executed the command.`);

        const users = [];
        const roleIds = [];

        for (let i = 1; i <= 9; i++) {
            const user = interaction.options.getMember(`user${i}`);
            const role = interaction.options.getString(`role${i}`);

            if (user && role) {
                users.push(user);
                roleIds.push(role);
            } else if ((user && !role) || (!user && role)) {
                const usersAndRoles = new EmbedBuilder()
                    .setTitle(`🛑 Error: If User${i}/Role${i} is provided, User${i}/Role${i} must also be specified.`)
                    .setDescription(`Please add the desired user/role to ${ user || `<@&${role}>` }.`)
                    .setColor('Red');
                await interaction.editReply({ embeds: [usersAndRoles], ephemeral: true });
                return;
            }
        }

        if (users.length === 0) {
            await interaction.editReply({ content: 'At least one user and role must be specified.', ephemeral: true });
            return;
        }

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
            const leaderboardCollection = database.collection(leaderboardCollectionName);

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

                            const leaderboardEntry = {
                                userId: user.id,
                                username: user.user.tag,
                                rank: role,
                                timestamp: new Date()
                            };

                            await leaderboardCollection.updateOne(
                                { userId: user.id },
                                { $set: leaderboardEntry },
                                { upsert: true }
                            );

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

        const logChannel = interaction.client.channels.cache.get(logChannelId);

        async function logEmbeds(logChannel) {
            let fieldCount = 1;
            let currentEmbed = new EmbedBuilder()
                .setColor('Random')
                .addFields({ name: 'Ranker that executed the command:', value: `${interaction.user}` })
                .setTimestamp()
                .setAuthor({ name: 'Rank update Logs', iconURL: interaction.user.avatarURL() });

            for (let i = 0; i < users.length; i++) {
                if (fieldCount + 3 > 25) {
                    await logChannel.send({ embeds: [currentEmbed] });
                    currentEmbed = new EmbedBuilder()
                        .setColor('Random')
                        .addFields({ name: 'Ranker that executed the command:', value: `${interaction.user}` })
                        .setTimestamp()
                        .setAuthor({ name: 'Rank update Logs', iconURL: interaction.user.avatarURL() });
                    fieldCount = 1;
                }
                currentEmbed.addFields(
                    { name: `User${i + 1}`, value: `${users[i]}`, inline: true },
                    { name: `Role${i + 1}`, value: `<@&${roleIds[i]}>`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true });
                fieldCount += 3;
            }

            if (fieldCount > 0) {
                await logChannel.send({ embeds: [currentEmbed] });
            }
        }
        
        if (logChannel instanceof TextChannel) {
            await logEmbeds(logChannel);
        } else {
            console.error('Invalid log channel or log channel is not a text channel.');
        }

        // Update leaderboard
        try {
            client = new MongoClient(uri);
            await client.connect();


            const database = client.db(dbName);
            const leaderboardCollection = database.collection(leaderboardCollectionName);

            const leaderboard = await leaderboardCollection.find().sort({ rank: 1, timestamp: 1 }).toArray();
            if (leaderboard.length === 0) {
                console.error('No ranked users found.');
                return;
            }

            // console.log('rankNames:', rankNames);
            const groupedLeaderboard = leaderboard.reduce((acc, entry) => {
                const roleId = entry.rank.replace(/<@&|>/g, ''); // Remove <@& and > from the role ID
                // console.log('Role ID:', roleId);

                const rankName = rankNames[roleId];
                if (!acc[rankName]) {
                    acc[rankName] = [];
                }
                acc[rankName].push(`<@${entry.userId}>`);
                return acc;
            }, {});

            let leaderboardMessage = '**Leaderboard**\n\n';
            for (const [rank, users] of Object.entries(groupedLeaderboard)) {
                leaderboardMessage += `**${rank}**\n`;
                leaderboardMessage += users.join(', ') + '\n\n';
            }

            const leaderboardChannel = interaction.client.channels.cache.get(leaderboardChannelId);
            if (!leaderboardChannel) {
                console.error('Invalid leaderboard channel or leaderboard channel is not a text channel.');
                return;
            }

            const leaderboardMessageToUpdate = await leaderboardChannel.messages.fetch(leaderboardMessageId);
            if (leaderboardMessageToUpdate) {
                await leaderboardMessageToUpdate.edit(leaderboardMessage);
            } else {
                console.error('Leaderboard message not found.');
            }
        } catch (error) {
            console.error('Failed to update leaderboard:', error);
        } finally {
            if (client) {
                await client.close();
            }
        }
    }
};

for (let i = 1; i <= 9; i++) {
    module.exports.data.addUserOption(option =>
        option
            .setName(`user${i}`)
            .setDescription(`The user ${i} you are updating`)
            .setRequired(i === 1))
        .addStringOption(option =>
            option
                .setName(`role${i}`)
                .setDescription(`The rank user ${i} is getting.`)
                .setRequired(i === 1)
                .addChoices(
                    { name: 'testrole', value: testrole },
                    { name: 'ofofofo', value: ofofofo }
                ));
}
**/