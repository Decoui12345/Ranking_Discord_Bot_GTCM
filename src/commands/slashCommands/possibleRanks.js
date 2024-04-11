module.exports = {
    name: 'possible-ranks',
    description: 'Displays a list of all the tiers you can be in.',
    // devOnly: Boolean
    // testOnly: Boolean,
    //options: Object[],

    callback: (client, interaction) => {
        interaction.send.embed(embed);
    },
};