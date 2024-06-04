const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const cron = require('node-cron');
//const moment = require('moment-timezone');
const REMINDER_CHANNEL_ID = '1166953869293654146'; // Replace with your channel ID



module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-reminder-start')
        .setDescription('Starts the automatic reminder for the events.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),



        async execute(interaction) {
            const eventPingRoleId = '1156687290895179797';
       // Function to schedule a task
       const scheduleTask = (time, days) => {
        const [hour, minute] = time.split(':');
        return cron.schedule(`0 ${minute} ${hour} * * ${days}`, async () => {
            const channel = await interaction.client.channels.fetch(REMINDER_CHANNEL_ID);
            if (channel) {
                channel.send(`<@&${eventPingRoleId}> Event in 1 hour and 30 minutes`);
            } else {
                console.error('Channel not found!');
            }
        }, {
            timezone: 'America/New_York' // Set the timezone to EST
        });
    };

    // Stop any existing reminder tasks
    if (global.reminderTasks) {
        global.reminderTasks.forEach(task => task.stop());
    }

    // Schedule reminders for 3:30 PM, 6:00 PM, and 8:30 PM EST on Monday, Wednesday, and Friday
    const days = '1,3,5'; // Monday, Wednesday, Friday
    global.reminderTasks = [
        scheduleTask('15:30', days), // 15:30
        scheduleTask('18:00', days), // 18:00
        scheduleTask('20:30', days), // 20:30
    ];

        await interaction.reply({ content: 'Reminders have been set for every Monday, Wednesday, and Friday at 3:30 PM, 6:00 PM, and 8:30 PM EST.', ephemeral: true});
    
        }
};