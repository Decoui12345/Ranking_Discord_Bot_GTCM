const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
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

        // General embed for the updated ranks message
        const updateRanksE = new EmbedBuilder()
            .setTitle('Rank update:')
            .setColor('Random');

    
        const unrankedPlayers = [];
        const promotedPlayers = [];
        const demotedPlayers = [];
        // Check for already ranked players
        const rankedPlayers = users.filter((user, index) => user && user.roles.cache.has(roleIds[index]));

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
        // Loop through users to update roles and push users to the empty arrays defined above
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (user) {
                if (user.roles.cache.has(oglyboogsd)) {
                    unrankedPlayers.push(user);
                } else {
                    if (!user.roles.cache.has(roleIds[i])) {
                        await user.roles.add(roleIds[i]);
                        if (userRoles[i] === testrole) {
                            await user.roles.remove(ofofofo);
                            promotedPlayers.push(user);
                        } else if (userRoles[i] === ofofofo) {
                            await user.roles.remove(testrole);
                            demotedPlayers.push(user);
                        }
                    }
                }
            }
        }

        if (promotedPlayers.length > 0) {
            let promotionMessage = '';
            for (let i = 0; i < promotedPlayers.length; i++) {
                const user = promotedPlayers[i];
                promotionMessage += `- ${user} was moved up to <@&${roleIds[i]}> tier\n\n`;
            }
            updateRanksE.addFields({ name: 'Promotions:', value: promotionMessage });
        }
        
        if (demotedPlayers.length > 0) {
            let demotionMessage = '';
            for (let i = 0; i < demotedPlayers.length; i++) {
                const user = demotedPlayers[i];
                demotionMessage += `- ${user} was moved down to <@&${roleIds[i]}> tier\n\n`;
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