const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
// const roleID =  ['1197029346188214273', '1197029372616515676', '1197029383072915456']; // testrole, ofofofo, oglyboogsd

module.exports = {
    data: new SlashCommandBuilder()
    .setName('update-ranks')
    .setDescription('For a ranker to update ranks after an event.')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('The user(s) you are updating')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName('role')
        .setDescription('The rank this user is getting.')
        .setRequired(true)
        .addChoices(
            { name: 'testrole', value: '1197029346188214273' },
			{ name: 'ofofofo', value: '1197029372616515676' },
			{ name: 'oglyboogsd', value: '1197029383072915456' },
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {

        try {

            const user = interaction.options.getMember('user')
            const roleid = interaction.options.getString('role')
            await user.roles.add(roleid)

            const updateRanksE = new EmbedBuilder()
                .setTitle('Rank update: ')
                .setDescription(`${user} was added into <@&${roleid}> tier`)

            await interaction.reply({ embeds: [updateRanksE] })

        } catch (error) {
            console.log(`Error in updateRanksE: ${error}`)
        }

    },
};

