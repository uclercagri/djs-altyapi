const { REST, Routes, ActivityType } = require('discord.js');
const mongo = require('../database/mongo'); 

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Bot is online as ${client.user.tag}!`);

    const commands = client.commands.map(command => command.data.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
      console.log('Started refreshing application (/) commands.');
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands },
      );
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }

    mongo().then(() => {
      console.log('Connected to MongoDB');
    }).catch(console.error);

    client.user.setPresence({
      activities: [{ name: 'I am being developed', type: ActivityType.Playing }],
      status: 'idle',
    });
  },
};
