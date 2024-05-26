const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } = require('discord.js');
const { MongoClient } = require('mongodb');
const { getLeaderboardMessage } = require('../../utility/leaderboardUtils');
require('dotenv').config();
const leaderboardChannelId = process.env.LEADERBOARD_CHANNEL_ID;
const leaderboardMessageId = process.env.LEADERBOARD_MESSAGE_ID;

const logChannelId = '1144074199716073492';
// const diamondTierGamer = '1143694702042947614';
// const platinumTierGamer = '1143698998872514560';
// const goldTierGamer = '1143697130511409193';
// const silverTierGamer = '1143704641398386718';
// const ironTierGamer = '1143702378244219050';
// const copperTierGamer = '1201228978183221439';
// const unranked = '1143970454382596096';

const uri = process.env.MONGODB_URI;
const dbName = 'rankPosition';
const collectionName = 'rank_history';

const rankRoles = {
    diamondTierGamer:  '1143694702042947614',
    platinumTierGamer:  '1143698998872514560',
    goldTierGamer:  '1143697130511409193',
    silverTierGamer:  '1143704641398386718',
    ironTierGamer:  '1143702378244219050',
    copperTierGamer:  '1201228978183221439',
    unranked:  '1143970454382596096'
};

const RANK_CHOICES = [
    { name: 'diamondTierGamer', value: rankRoles.diamondTierGamer },
    { name: 'platinumTierGamer', value: rankRoles.platinumTierGamer },
    { name: 'goldTierGamer', value: rankRoles.goldTierGamer },
    { name: 'silverTierGamer', value: rankRoles.silverTierGamer },
    { name: 'ironTierGamer', value: rankRoles.ironTierGamer },
    { name: 'copperTierGamer', value: rankRoles.copperTierGamer },
    // { name: 'unranked', value: rankRoles.unranked },
];

const MAX_USERS = 8;

module.exports = {
    data: (() => {
        const command = new SlashCommandBuilder()
        .setName('update-ranks')
        .setDescription('Updating the ranks of the given users.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
        
        for (let i = 1; i <= MAX_USERS; i++) {
            command
            .addUserOption(option =>
                option
                .setName(`user${i}`)
                .setDescription(`User ${i} whose position you're changing.`)
                .setRequired(i === 1)
            )
            .addStringOption(option =>
                option
                .setName(`rank${i}`)
                .setDescription(`The rank for user ${i}.`)
                .setRequired(i === 1)
                .addChoices(...RANK_CHOICES)
            )
            .addIntegerOption(option =>
                option
                .setName(`position${i}`)
                .setDescription(`The new position for user ${i}.`)
                .setRequired(i === 1)
            );
        }
        
        return command;
    })(),
    async execute(interaction) {
        
        await interaction.deferReply();
        const logChannel = await interaction.client.channels.fetch(logChannelId);
        // Log the update
        const logEmbed = new EmbedBuilder()
        .setTitle('🛑Leaderboard Failed to update')
        .setDescription('There was an error with updating the latest ranks and positions.')
        .setColor('Red')
        .setTimestamp(); 
        
        console.log(`Ranker: ${interaction.user.tag} executed the command.`);
        
        const users = [];
        const errors = [];
        
        for (let i = 1; i <= MAX_USERS; i++) {
            const user = interaction.options.getMember(`user${i}`);
            const rank = interaction.options.getString(`rank${i}`);
            const position = interaction.options.getInteger(`position${i}`);
            
            if (user || rank || position !== null) {
                // If any of the three options are provided, check if all are provided
                if (!user || !rank || position === null) {
                    errors.push(`User ${i}`);
                } else {
                    users.push({ user, rank, position });
                }
            }
        }
        
        if (errors.length > 0) {
            const errorSupplyUserRankPositionE = new EmbedBuilder()
            .setTitle('🛑 Error: Missing Information')
            .setDescription(`The following fields are missing: ${errors.join(', ')}. Please provide all required users, ranks, and positions.`)
            .setColor('Red');
            
            await interaction.editReply({ embeds: [errorSupplyUserRankPositionE] });
            
            const logEmbedMissingInfo = new EmbedBuilder()
            .setTitle('Missing Information in Command Execution')
            .setDescription(`User ${interaction.user.tag} did not provide required fields: ${errors.join(', ')}.`)
            .setColor('Red')
            .setTimestamp();
            
            if (logChannel instanceof TextChannel) {
                await logChannel.send({ embeds: [logEmbedMissingInfo] });
            }
            
            return;
        }
        
        if (users.length === 0) {
            await interaction.editReply({ content: 'At least one user, rank, and position must be specified.', ephemeral: true });
            await logChannel.send({ embeds: [logEmbed] });
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
            await logChannel.send({ embeds: [logEmbed] });
            return;
        }
        
        
        // Check for duplicate positions within the same role
        const positionCheck = {};
        for (let i = 0; i < users.length; i++) {
            const { rank, position } = users[i];
            const key = `${rank}-${position}`;
            if (positionCheck[key]) {
                const duplicatePositionError = new EmbedBuilder()
                .setTitle('🛑 Error: Duplicate positions detected')
                .setDescription(`Two or more users are trying to be placed in the same position (${position}) within the same rank (<@&${rank}>). Please correct the positions and try again.`)
                .setColor('Red');
                await interaction.editReply({ embeds: [duplicatePositionError], ephemeral: true });
                await logChannel.send({ embeds: [logEmbed] });
                return;
            }
            positionCheck[key] = true;
        }
        
        const updateRanksE = new EmbedBuilder()
            .setTitle('Rank Update:')
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
        const rankUpdates = [];
        const positionChanges = [];
        
        for (const { user, rank, position } of users) {
            const currentPositionData = await getCurrentPositionFromDatabase(user.id);
            
            if (!currentPositionData) {
                await insertUserRankAndPosition(user.id, rank, position);
                rankUpdates.push({ user, newRank: rank });
                continue;
            }
            
            const { currentRank, currentPosition } = currentPositionData;
            
            if (rank !== currentRank) {
                await moveUserToNewRank(user.id, currentRank, currentPosition, rank, position);
                rankUpdates.push({ user, newRank: rank });
            } else {
                let shiftDirection;
                if (position > currentPosition) {
                    shiftDirection = 'downward';
                    positionChanges.push({ user, direction: 'down', newRank: rank });
                } else if (position < currentPosition) {
                    shiftDirection = 'upward';
                    positionChanges.push({ user, direction: 'up', newRank: rank  });
                    //console.log('Rank at:', rank)
                } else {
                    await interaction.editReply(`User ${user.user.tag} is already at the specified position within the rank.`);
                    continue;
                }
                
                await shiftUserPositionsWithinRank(rank, currentPosition, position, shiftDirection);
                await updateUserPositionInRank(user.id, rank, position);
            }
        }
        try{
        for (const { user, newRank } of rankUpdates) {
            const userRoles = user.roles.cache;
            const newRoleId = newRank;
        // await interaction.editReply('User positions within the ranks updated successfully!');
        const ranks = Object.values(rankRoles).filter(rank => rank !== rankRoles.unranked);

                        for (const rank of ranks) {
                            if (newRoleId === rank && userRoles.has(rank)) {
                                await user.roles.remove(rank);
                                if (rank < newRoleId) {
                                    promotedPlayers.push({ user, role: newRoleId });
                                } else {
                                    demotedPlayers.push({ user, role: newRoleId });
                                }
                            }
                        }

                        if (!userRoles.has(newRoleId)) {
                            await user.roles.add(newRoleId);
                            if (userRoles.has(rankRoles.unranked)) {
                                await user.roles.remove(rankRoles.unranked);
                                unrankedPlayers.push({ user, role: newRoleId });
                            }
                        }

                        rankChanges.push({
                            userId: user.id,
                            username: user.user.tag,
                            role: `<@&${newRoleId}>`,
                            position: newPosition,
                            timestamp: new Date()
                        });
                    }} catch (error) {
                        console.error(`Failed to modify roles for user ${user.user.tag}:`, error);
                        const updatingRole = new EmbedBuilder()
                            .setTitle('🛑 Error: Something went wrong while updating roles.')
                            .setDescription(`An error occurred while updating roles for ${user}. Please try again later.`)
                            .setColor('Red');
                        await interaction.editReply({ embeds: [updatingRole], ephemeral: true });
                        await logChannel.send({ embeds: [logEmbed] });
                        return;
                    }
        
        try {
            const database = client.db(dbName);
            const collection = database.collection(collectionName);
            
            if (rankChanges.length > 0) {
                await collection.insertMany(rankChanges);
            }
        } catch (error) {
            console.error('Failed to insert rank changes into MongoDB:', error);
            const mongoDBErrorInsert = new EmbedBuilder()
            .setTitle(`🛑 Error: Something went wrong while trying to insert data to the DB`)
            .setDescription('An error occurred while inserting rank data to the database. Please try again later.');
            await interaction.editReply({ embeds: [mongoDBErrorInsert], ephemeral: true });
            await logChannel.send({ embeds: [logEmbed] });
            return;
        } finally {
            try {
                await client.close();
            } catch (error) {
                console.error('Failed to close MongoDB connection:', error);
            }
        }
        const promotionMessages = [];
            const demotionMessages = [];
            //const positionChangeMessages = [];

            if (promotedPlayers.length > 0) {
                for (const { user, role } of promotedPlayers) {
                    promotionMessages.push(`- ${user} was moved up to <@&${role}> tier`);
                }
            }

            if (demotedPlayers.length > 0) {
                for (const { user, role } of demotedPlayers) {
                    demotionMessages.push(`- ${user} was moved down to <@&${role}> tier`);
                }
            }

            if (positionChanges.length > 0) {
                for (const { user, direction, newRank } of positionChanges) {
                    const changeMessage = `- ${user} moved ${direction} within <@&${newRank}> rank.`;
                    if (direction === 'up') {
                        promotionMessages.push(changeMessage);
                    } else {
                        demotionMessages.push(changeMessage);
                    }
                }
            }

            if (promotionMessages.length > 0) {
                updateRanksE.addFields({ name: 'Promotions:', value: promotionMessages.join('\n') });
            }

            if (demotionMessages.length > 0) {
                updateRanksE.addFields({ name: 'Demotions:', value: demotionMessages.join('\n') });
            }

            if (unrankedPlayers.length > 0) {
                const unRankedPlayerMessage = unrankedPlayers.map(({ user, role }) => `- ${user} was added into tiers at <@&${role}>`).join('\n');
                unrankedPlayersE.addFields({ name: 'Newly Ranked players:', value: unRankedPlayerMessage });
            }

                    const embedsToSend = [];
                if (promotedPlayers.length > 0 || demotedPlayers.length > 0 || positionChanges.length > 0) {
                    embedsToSend.push(updateRanksE);
                }
                if (unrankedPlayers.length > 0) {
                    embedsToSend.push(unrankedPlayersE);
                }
                
                if (embedsToSend.length > 0) {
                    await interaction.editReply({ embeds: embedsToSend });
                } else {
                    await interaction.editReply({ content: 'No changes were made. Users are in the position you wanted them to be at. If this is a mistake please try again.', ephemeral: true });
                }
        
        
        // Update leaderboard message
        const leaderboardChannel = interaction.client.channels.cache.get(leaderboardChannelId);
        if (leaderboardChannel) {
            const leaderboardMessage = await leaderboardChannel.messages.fetch(leaderboardMessageId);
            if (leaderboardMessage) {
                const leaderboardContent = await getLeaderboardMessage();
                await leaderboardMessage.edit(leaderboardContent);
            } else {
                console.error('Leaderboard message not found.');
                await logChannel.send({ embeds: [logEmbed] });
            }
        } else {
            console.error('Invalid leaderboard channel or not a text channel.');
            await logChannel.send({ embeds: [logEmbed] });
        };
        
        //const logChannel = await interaction.client.channels.fetch(logChannelId);
        // Log the update
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
            .setTitle('Leaderboard Updated')
            .setDescription('The leaderboard has been updated with the latest ranks and positions.')
            .setColor('Blue')
            .setTimestamp();
            
            try {
                await logChannel.send({ embeds: [logEmbed] });
            } catch (error) {
                console.error('Failed to send log message:', error);
                await logChannel.send({ embeds: [logEmbed] });
            }
        }
        

        async function logEmbeds(logChannel) {
            let fieldCount = 1;
            let currentEmbed = new EmbedBuilder()
                .setColor('Random')
                .addFields({ name: 'Ranker that executed the command:', value: `${interaction.user}` })
                .setTimestamp()
                .setAuthor({ name: 'Rank update Logs', iconURL: interaction.user.avatarURL() });

                for (let i = 0; i < users.length; i++) {
                    if (fieldCount + 4 > 25) {
                        await logChannel.send({ embeds: [currentEmbed] });
                        currentEmbed = new EmbedBuilder()
                            .setColor('Random')
                            .addFields({ name: 'Ranker that executed the command:', value: `${interaction.user}` })
                            .setTimestamp()
                            .setAuthor({ name: 'Rank update Logs', iconURL: interaction.user.avatarURL() });
                        fieldCount = 1;
                    }
                    currentEmbed.addFields(
                        { name: `User${i + 1}`, value: `${users[i].user}`, inline: true },
                        { name: `Rank${i + 1}`, value: `<@&${users[i].rank}>`, inline: true },
                        { name: `Position${i + 1}`, value: `${users[i].position}`, inline: true }),
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
                await logChannel.send({ embeds: [logEmbed] });
            }
       // }

async function getCurrentPositionFromDatabase(userId) {
    const mongoURI = process.env.MONGODB_URI;
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const db = client.db('rankPosition');
        const user = await db.collection('users').findOne({ userId });
        return user ? { currentRank: user.rank, currentPosition: user.position } : null;
    } finally {
        await client.close();
    }
}

async function shiftUserPositionsWithinRank(rank, currentPosition, newPosition, shiftDirection) {
    const mongoURI = process.env.MONGODB_URI;
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const db = client.db('rankPosition');

        if (shiftDirection === 'upward') {
            await db.collection('users').updateMany(
                { rank, position: { $gte: newPosition, $lt: currentPosition } },
                { $inc: { position: 1 } }
            );
        } else if (shiftDirection === 'downward') {
            await db.collection('users').updateMany(
                { rank, position: { $gt: currentPosition, $lte: newPosition } },
                { $inc: { position: -1 } }
            );
        }
    } finally {
        await client.close();
    }
}

async function updateUserPositionInRank(userId, rank, newPosition) {
    const mongoURI = process.env.MONGODB_URI;
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const db = client.db('rankPosition');
        await db.collection('users').updateOne(
            { userId, rank },
            { $set: { position: newPosition } }
        );
    } finally {
        await client.close();
    }
}

async function insertUserRankAndPosition(userId, rank, position) {
    const mongoURI = process.env.MONGODB_URI;
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const db = client.db('rankPosition');

        // Shift the positions of existing users in the new rank
        await db.collection('users').updateMany(
            { rank, position: { $gte: position } },
            { $inc: { position: 1 } }
        );

        await db.collection('users').insertOne({
            userId,
            rank,
            position
        });
    } finally {
        await client.close();
    }
}

async function moveUserToNewRank(userId, currentRank, currentPosition, newRank, newPosition) {
    const mongoURI = process.env.MONGODB_URI;
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const db = client.db('rankPosition');

        // Remove the user from the current rank
        await db.collection('users').deleteOne({ userId, rank: currentRank });

        // Shift positions of users in the old rank
        await db.collection('users').updateMany(
            { rank: currentRank, position: { $gt: currentPosition } },
            { $inc: { position: -1 } }
        );

        // Shift positions of users in the new rank
        await db.collection('users').updateMany(
            { rank: newRank, position: { $gte: newPosition } },
            { $inc: { position: 1 } }
        );

        // Insert the user into the new rank
        await db.collection('users').updateOne(
            { userId },
            { $set: { rank: newRank, position: newPosition } },
            { upsert: true }
        );
    } finally {
        await client.close();
    }
}}};