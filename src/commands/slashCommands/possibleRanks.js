const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('possible-ranks')
    .setDescription('Displays a list of all the tiers you can be in.'),

    async execute(interaction) {
        const roleID = ['1197029346188214273', '1197029372616515676', '1197029383072915456']; // testrole, ofofofo, oglyboogs
        const firstRole = roleID[0];
        const secondRole = roleID[1];
        const thirdRole = roleID[2];
        const roleMention = `<@&${firstRole}>\n\n` + `<@&${secondRole}>\n\n` + `<@&${thirdRole}>`;

        const possibleRanksE = new EmbedBuilder()
        .setTitle('Tiers:')
        .setDescription(`${roleMention}`)
        .addFields({ name: 'tseting', value: `${roleMention}`, inline: false })
        .setColor('Random');

        await interaction.reply({ embeds: [possibleRanksE], ephemeral: true });
    }
};
