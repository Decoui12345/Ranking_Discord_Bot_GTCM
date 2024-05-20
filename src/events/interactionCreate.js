const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (!interaction.isCommand()) return; // Looks for commands like slash commands now not just chat inputs

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
            }

            await command.execute(interaction);
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
        }
    },
};

/** 
const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            // Handle slash commands
            if (interaction.isCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);

                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
                }

                await command.execute(interaction);
            }
            // Handle modal submissions
            else if (interaction.isModalSubmit()) {
                const command = interaction.client.commands.get('update-ranks');
                if (command) {
                    await command.modalSubmit(interaction);
                } else {
                    console.error('No command matching update-ranks for modal submission was found.');
                    return interaction.reply({ content: 'An error occurred while processing this form.', ephemeral: true });
                }
            }
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.reply({ content: 'An error occurred while processing this interaction.', ephemeral: true });
        }
    },
};
**/
