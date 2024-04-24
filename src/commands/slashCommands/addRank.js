const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, InteractionResponse, Role, userMention, roleMention } = require('discord.js');
// const aREmbed = require('../embeds/aREmbed.js');
//

const addRankE = new EmbedBuilder() 
    .setTitle('Who was added into the ranks.')
    .setAuthor({ name: 'author' }) // Ranker who used slash command
    .setDescription(userMention + 'was added into' + roleMention)
    .setTimestamp()

module.exports = {
   /**
    * 
    * @param {Client} client 
    * @param {Interaction} interaction 
    * @returns 
    */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('user-being-ranked').value;
        
        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        // const targetRank = await interaction.guild.roles.fetch(Role);

        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
          }

        if (targetUser.roles.has('1197029346188214273')) {
            roleadded = "User already has Test Role."
        } else {
            targetUser.addRole('1197029346188214273');
            roleadded = "Added Test Role."
        }

        try {
            await targetUser.addRole('1197029346188214273');
            await interaction.editReply(`${user} was ranked into ${role}.`);
        } catch (error) {
            console.log(`There was an error while adding user to rank: ${error}`);
        }

    }, 



    data: new SlashCommandBuilder()
        .setName('add-rank')
        .setDescription('Add someone into the ranks.')
    // devOnly: Boolean
    // testOnly: Boolean,
    .addMentionableOption(option => 
        option.
            setName('user-being-ranked')
            .setDescription('The person you want to add into the ranks.')
            .setRequired(true)
    )
    .addRoleOption(option =>
        option.    
            setName('tier')
            .setDescription('The tier you are giving them.')
            .setRequired(true)
    ),
    // deleted: Boolean,

    //permissionsRequired: [PermissionFlagsBits.MuteMembers],
    //botPermissions: [PermissionFlagsBits.ManageRoles],
    

    // channel.send({ embeds: [aREmbed] }),

    async execute(interaction) {
        await interaction.channel.send({ embeds: [addRankE] });
    }
};