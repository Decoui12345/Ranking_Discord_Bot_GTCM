const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('possible-ranks')
    .setDescription('Displays a list of all the tiers you can be in.'),

    async execute(interaction) {
        console.log(`User: ${interaction.user.tag} executed the command: /possible-ranks.`);
        const roleID = [
            '1143694702042947614', // diamond
            '1143697130511409193', // plat
            '1143698998872514560', // gold
            '1143702378244219050', // silver
            '1143704641398386718', // iron
            '1201228978183221439', // copper
            '1143970454382596096', // unranked
        ];
        const firstRole = roleID[0];
        const secondRole = roleID[1];
        const thirdRole = roleID[2];
        const fourthRole = roleID[3];
        const fifthRole = roleID[4];
        const sixthRole = roleID[5];
        const seventhRole = roleID[6];
        const roleMention = `<@&${firstRole}>\n\n` + 
                            `<@&${secondRole}>\n\n` + 
                            `<@&${thirdRole}>\n\n` + 
                            `<@&${fourthRole}>\n\n` + 
                            `<@&${fifthRole}>\n\n` + 
                            `<@&${sixthRole}>\n\n` + 
                            `<@&${seventhRole}>\n\n` ;

        const possibleRanksE = new EmbedBuilder()
        .setTitle('Tiers:')
        .setDescription(`${roleMention}`)
        //.addFields({ name: 'tseting', value: `${roleMention}`, inline: false })
        .setColor('Random');

        await interaction.reply({ embeds: [possibleRanksE], ephemeral: true });
    }
};
