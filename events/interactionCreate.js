const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    } else if (interaction.isButton()) {
      const { customId } = interaction;

      if (customId === 'confirm-unban') {
        const userId = interaction.message.content.match(/<@(\d+)>/)[1];
        const guild = interaction.guild;

        try {
          await guild.bans.remove(userId);
          await interaction.update({ content: `Successfully unbanned <@${userId}>.`, components: [] });
        } catch (error) {
          console.error(error);
          await interaction.update({ content: `Failed to unban <@${userId}>.`, components: [] });
        }
      } else if (customId === 'cancel-unban') {
        await interaction.update({ content: `Unban request cancelled.`, components: [] });
      }
    }
  },
};
