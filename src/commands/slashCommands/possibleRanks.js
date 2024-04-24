const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');



const possibleRanks = new SlashCommandBuilder()
    .setName('possible-ranks')
    .setDescription ('Displays a list of all the tiers you can be in.');
    

const possibleRanksE = new EmbedBuilder()
.setTitle('testing')
.setDescription('This is a test. Please work.');

interaction.channel.send(possibleRanksE);

