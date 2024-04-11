const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'add-rank',
    description: 'Add someone into the ranks.',
    // devOnly: Boolean
    // testOnly: Boolean,
    // options: Object[],
    // deleted: Boolean,

    //permissionsRequired: [PermissionFlagsBits.MuteMembers],
    //botPermissions: [PermissionFlagsBits.ManageRoles],

    callback: (client, interaction) => {
        interaction.send.embed(embed);
    },
};