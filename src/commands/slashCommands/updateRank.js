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
        const user = interaction.options.getMember('user')
        const allRankRoles =  ['1197029346188214273', '1197029372616515676', '1197029383072915456']; // testrole, ofofofo, oglyboogsd
        const userRole = interaction.options.getString('role');
        // const userRoles = user.roles.cache;
        // const hasRole = allRankRoles.some(allRankRoles => userRoles.has(allRankRoles));

        // If the user is already ranked, with their respective ranked role
        if (!user.roles.cache.has('1197029383072915456')) try {

            const user = interaction.options.getMember('user')
            const roleId = interaction.options.getString('role')
            // Already ranked in the spot they're trying to rank them to
            if (user.roles.cache.has(roleId)) {
                interaction.reply({
                    content: `${user} is already ranked in <@&${roleId}>`,
                    ephemeral: true
                })
                return;
            }
        // if (hasRole) {
            //const roleToKeep = allRankRoles.find(allRankRoles => userRoles.has(allRankRoles));
            //const rolesToRemove = allRankRoles.filter(allRankRoles => allRankRoles !== roleToKeep);

            //user.roles.remove(rolesToRemove).then(() => {
            //    console.log(`Removed roles from ${user.displayName}`);
           // }).catch(console.error);
        //}
            await user.roles.add(roleId)

            const updateRanksE = new EmbedBuilder()
                .setTitle('Rank update: ')
                .setDescription(`${user} was added into <@&${roleId}> tier`)
                .setColor('Random')

            await interaction.reply({ embeds: [updateRanksE] })
        
        } catch (error) {
            console.log(`Error in updateRanksE: ${error}`)
        }
        // If the player isn't ranked yet
        else {
            const unrankedPlayerE = new EmbedBuilder()
            .setTitle('🛑 Error: Unranked player.')
            .setDescription('Please use /add-rank to rank a new player.')
            .setColor('Red')

            await interaction.reply({ embeds: [unrankedPlayerE], ephemeral: true })
        }
        if (userRole === '1197029346188214273') {
            try {
                await user.roles.remove('1197029372616515676');
            } catch (error) {
                console.log(`Error in trying to remove other ranked roles: ${error}`)
            }
        } else if (userRole === '1197029372616515676') {
            try {
                await user.roles.remove('1197029346188214273');
            } catch (error) {
                console.log(`Error in trying to remove other ranked roles: ${error}`)
            }}

    }
}
