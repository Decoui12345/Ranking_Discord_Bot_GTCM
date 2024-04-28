// Slash command deployment on hold for now until I find how to see if the user has 1 of the ranking roles and then display that in an embed
const { SlashCommandBuilder, EmbedBuilder, Message } = require('discord.js');

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
        // const role = message.guild.roles.cache.find(role => role.id === '1197029346188214273');
        const role = '1197029346188214273' 
        const roleID =  ['1197029346188214273', '1197029372616515676', '1197029383072915456']; // testrole, ofofofo, oglyboogsdo

        if(`${interaction.options.getUser('user')}`.has(role)){
            const noRole = new EmbedBuilder()
            .setTitle(`🛑 That user doesn't have the ranking roles.`)
            .setDescription('Please try again after they are either unranked or have a ranked role on them.');

            await interaction.reply({ embeds: [noRole], ephemeral: true });
        }
        else {
            const roleMention = `<@&${roleID}>`;
            const whatRankE = new EmbedBuilder()
            .setTitle('Rank: ')
            .setDescription(`${interaction.options.getUser('user')} is ${roleMention} tier`)
            .setColor('Random');

        await interaction.reply({ embeds: [whatRankE], ephemeral: true }); 
        }

    }
};