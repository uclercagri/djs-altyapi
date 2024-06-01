const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a member from the server.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for banning the member')
        .setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply('You do not have permission to ban members.');
    }

    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = interaction.guild.members.cache.get(target.id);
    if (!member) {
      return interaction.reply('The user is not a member of this server.');
    }

    await member.ban({ reason });

    const embed = new EmbedBuilder()
      .setTitle('🚫 Member Banned')
      .setDescription(`**${target.tag}** has been banned.`)
      .addFields(
        { name: 'Reason', value: reason, inline: true },
        { name: 'Banned by', value: interaction.user.tag, inline: true }
      )
      .setColor('#FF0000')
      .setTimestamp()
      .setThumbnail(target.avatarURL());

    await interaction.reply({ embeds: [embed] });
  },
};
