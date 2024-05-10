/**const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const testrole =  '1197029346188214273';
const ofofofo = '1197029372616515676';
const oglyboogsd = '1197029383072915456';

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
    .addUserOption(option =>
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
    )
    
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const user1 = interaction.options.getMember('user1');
        const user2 = interaction.options.getMember('user2');
        const allGivenUsers = interaction.options.getMember('user1', 'user2');
        const roleId1 = interaction.options.getString('role1');
        const roleId2 = interaction.options.getString('role2');
        // const allRankRoles =  ['1197029346188214273', '1197029372616515676', '1197029383072915456']; // testrole, ofofofo, oglyboogsd
        const userRole1 = interaction.options.getString('role1');
        const userRole2 = interaction.options.getString('role2');
        // const userRoles = user.roles.cache;
        // const hasRole = allRankRoles.some(allRankRoles => userRoles.has(allRankRoles));

        // If the user is already ranked, with their respective ranked role
        if (!user1.roles.cache.has(oglyboogsd) && !user2.roles.cache.has(oglyboogsd)) {
            try {

            // const user1 = interaction.options.getMember('user1')
            // const roleId1 = interaction.options.getString('role1')
            // Already ranked in the spot they're trying to rank them to
            if (user1.roles.cache.has(roleId1)) {
                interaction.reply({
                    content: `${user1} is already ranked in <@&${roleId1}>`,
                    ephemeral: true
                })
                return;
            };
        // if (hasRole) {
            //const roleToKeep = allRankRoles.find(allRankRoles => userRoles.has(allRankRoles));
            //const rolesToRemove = allRankRoles.filter(allRankRoles => allRankRoles !== roleToKeep);

            //user.roles.remove(rolesToRemove).then(() => {
            //    console.log(`Removed roles from ${user.displayName}`);
           // }).catch(console.error);
        //}
            await user1.roles.add(roleId1);
            /**if (interaction.options.getMember('user2')) {
            const userReply2 = async () => {
            if (!user2.roles.cache.has(oglyboogsd)) {

                const user2 = interaction.options.getMember('user2')
                // Already ranked in the spot they're trying to rank them to
                if (user2.roles.cache.has(roleId2)) {
                    interaction.reply({
                        content: `${user2} is already ranked in <@&${roleId2}>`,
                        ephemeral: true
                    })
                    return;
                }
            await user2.roles.add(roleId2)

           
            }}}

            
            try {
                if (user1) { 
                    if (userRole1 === testrole) {
                        try {
                             await user1.roles.remove(ofofofo);
                        } catch (error) {
                             console.log(`Error in trying to remove other ranked roles from user1: ${error}`);
                        };
                    } 
                     if (userRole1 === ofofofo) {
                         try {
                             await user1.roles.remove(testrole);
                         } catch (error) {
                             console.log(`Error in trying to remove other ranked roles from user1: ${error}`);
                         }}
                    };
                /** if (user2) { 
                        if (userRole2 === testrole) {
                            try {
                                 await user2.roles.remove(ofofofo);
                            } catch (error) {
                                 console.log(`Error in trying to remove other ranked roles from user2: ${error}`)
                            }
                        } 
                         if (userRole2 === ofofofo) {
                             try {
                                 await user2.roles.remove(testrole);
                             } catch (error) {
                                 console.log(`Error in trying to remove other ranked rolesfrom user2: ${error}`)
                             }}
                        } 
                } catch (error) {
                    console.log(`There was an error removing ranked roles from user1: ${error}`);
                };
            
             
            } catch (error) {
                console.log(`Error in updating ranks for user1: ${error}`)
            }
            /** else {
                const unrankedPlayerE1 = new EmbedBuilder()
                .setTitle('🛑 Error: Unranked player. User #1.')
                .setDescription(`Please use /add-rank to rank a new player: ${user1}`)
                .setColor('Red')
    
                await interaction.reply({ embeds: [unrankedPlayerE1], ephemeral: true });
            };
            // If the player isn't ranked yet
            
    
            //
            // FOR USER2
            //
    
            if (user2) {
                try {
                if (!user2.roles.cache.has(oglyboogsd)) { 
    
                    // const user2 = interaction.options.getMember('user2')
                    // Already ranked in the spot they're trying to rank them to
                    if (user2.roles.cache.has(roleId2)) {
                        interaction.reply({
                            content: `${user2} is already ranked in <@&${roleId2}>`,
                            ephemeral: true
                        })
                        return;
                    }
                await user2.roles.add(roleId2);
    
                try {
                if (user2) { 
                    if (userRole2 === testrole) {
                        try {
                             await user2.roles.remove(ofofofo);
                        } catch (error) {
                             console.log(`Error in trying to remove other ranked roles from user2: ${error}`);
                        };
                    } 
                     if (userRole2 === ofofofo) {
                         try {
                             await user2.roles.remove(testrole);
                         } catch (error) {
                             console.log(`Error in trying to remove other ranked rolesfrom user2: ${error}`);
                         }}
                    };
            } catch (error) {
                console.log(`There was an error removing ranked roles: ${error}`);
            };
        }
        } catch (error) {
            console.log(`Error in updating ranks for user2: ${error}`);
        };
        };
       
        const updateRanksE = new EmbedBuilder()
        .setTitle('Rank update: ')
        .setDescription(`${user1} was added into <@&${roleId1}> tier\n`)
        .setColor('Random')
        
        if (user2) {
           
            updateRanksE.setDescription(`${user1} was added into <@&${roleId1}> tier\n\n${user2} was added into <@&${roleId2}> tier`);
          }
    
    await interaction.reply({ embeds: [updateRanksE] });
        }
        else {
            const unrankedPlayers = new EmbedBuilder()
            .setTitle('🛑 Error: Unranked player(s).')
            .setDescription(`Please use /add-rank to rank a new player.`)
            .setColor('Red')
    
            if (user1.roles.cache.has(oglyboogsd)) {
                unrankedPlayers.setTitle('🛑 Error: Unranked player(s). User1.')
                unrankedPlayers.setDescription(`Please use /add-rank to rank a new player: ${user1}`)
            };
            if (user2.roles.cache.has(oglyboogsd)) {
                unrankedPlayers.setTitle('🛑 Error: Unranked player(s). User2.')
                unrankedPlayers.setDescription(`Please use /add-rank to rank a new player: ${user2}`)
            };
            if (user1.roles.cache.has(oglyboogsd) && user2.roles.cache.has(oglyboogsd) ) {
                unrankedPlayers.setTitle('🛑 Error: Unranked player(s). User1, User2.')
                unrankedPlayers.setDescription(`Please use /add-rank to rank a new player: ${user1}, ${user2}`)
            };
    
            await interaction.reply({ embeds: [unrankedPlayers], ephemeral: true });
        }
    
    }};**/
