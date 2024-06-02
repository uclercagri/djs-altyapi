const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user.')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('The ID of the user to unban')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const userId = interaction.options.getString('userid');
    const guild = interaction.guild;

    try {
      const ban = await guild.bans.fetch(userId);
      if (ban) {
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('confirm-unban')
              .setLabel('Confirm Unban')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId('cancel-unban')
              .setLabel('Cancel')
              .setStyle(ButtonStyle.Secondary)
          );

        await interaction.reply({ content: `Are you sure you want to unban <@${userId}>?`, components: [row] });
      } else {
        await interaction.reply({ content: `User with ID ${userId} is not banned.`, ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `An error occurred while trying to fetch ban for ID ${userId}.`, ephemeral: true });
    }
  },
};
