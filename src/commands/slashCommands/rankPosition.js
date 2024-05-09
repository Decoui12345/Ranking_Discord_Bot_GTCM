// Slash command deployment on hold for now until I find how to see if the user has 1 of the ranking roles and then display that in an embed
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('what-rank-is')
    .setDescription('Displays what rank someone is.')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('What rank is this user?')
            .setRequired(true)
    ),

    async execute(interaction) {
        const user = interaction.options.getMember('user');   

        const ranks = [ 
            '1197029346188214273', // testrole
            '1197029372616515676', // ofofofo
            '1197029383072915456' // oglyboogsd
        ];

        const userRank = [];
 // Check if the user has any of the specified roles
        ranks.forEach(roleId => {
            if (user.roles.cache.has(roleId)) {
               userRank.push(roleId);
            }
        });

// If user has at least one ranked role
    if (userRank.length > 0) {
        const roleMentions = userRank.map(roleId => `<@&${roleId}>`).join(', ');

            // If user has no ranked roles
        
                const whatRankE = new EmbedBuilder()
                .setTitle('Rank: ')
                .setDescription(`${user} is ${roleMentions} tier`)
                .setColor('Random')
                .setThumbnail(user.displayAvatarURL());

            await interaction.reply({ embeds: [whatRankE], ephemeral: true }); 
            }
            else {
                const noRole = new EmbedBuilder()
                .setTitle(`🛑 That user doesn't have the ranking roles.`)
                .setDescription('Please try again after they are either unranked or have a ranked role on them.');

                await interaction.reply({ embeds: [noRole], ephemeral: true });
            }

        }
};


/** module.exports = {
   

    async execute(interaction) {
        // Retrieve the specified user from the command options
        const user = interaction.options.getMember('user');

        // If user is not specified or not found
        if (!user) {
            return interaction.reply({
                content: 'Please specify a valid user.',
                ephemeral: true // Only visible to the user who issued the command
            });
        }

        // Extract the roles of the specified user
        const userRoles = user.roles.cache;

        // Map user's roles to their corresponding ranks
        const ranks = {
            '1197029346188214273': 'testrole',
            '1197029372616515676': 'ofofofo',
            '1197029383072915456': 'oglyboogsd',
            // Add more role ID to rank mappings as needed
        };

        // Filter user's roles to get only the ranked roles
        const rankedRoles = userRoles.filter(role => ranks.hasOwnProperty(role.id));

        // If user has no ranked roles
        if (rankedRoles.size === 0) {
            return interaction.reply({
                content: `${user} does not have any ranked roles.`,
                ephemeral: true
            });
        }

 **/