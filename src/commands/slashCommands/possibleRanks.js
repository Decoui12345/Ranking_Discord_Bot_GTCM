const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('possible-ranks')
    .setDescription('Displays a list of all the tiers you can be in.'),

    async execute(interaction) {
        const possibleRanksE = new EmbedBuilder()
        .setTitle('testing')
        .setDescription('This is a test. Please work.');

        await interaction.reply({ embeds: [possibleRanksE] });
    }
};
