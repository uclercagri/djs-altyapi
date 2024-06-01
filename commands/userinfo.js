const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Displays information about a user.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user you want information about')
        .setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('target') || interaction.user;
    const member = interaction.guild.members.cache.get(target.id);

    const userEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`User information - ${target.username}`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'General Information', value: '---' },
        { name: 'Username', value: `${target.tag}`, inline: true },
        { name: 'User ID', value: `${target.id}`, inline: true },
        { name: 'Server Information', value: '---' },
        { name: 'Join Date', value: `${member.joinedAt.toDateString()}`, inline: true },
        { name: 'Account Creation Date', value: `${target.createdAt.toDateString()}`, inline: true },
        { name: 'Roles', value: `${member.roles.cache.map(role => role).join(', ') || 'None'}`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'User Info Command', iconURL: interaction.client.user.avatarURL() });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('showAvatar')
          .setLabel('Show Avatar')
          .setStyle(ButtonStyle.Primary)
      );

    await interaction.reply({ embeds: [userEmbed], components: [row], ephemeral: true });

    const filter = i => i.customId === 'showAvatar' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'showAvatar') {
        const avatarEmbed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle(`${target.username}'s Avatar`)
          .setImage(target.displayAvatarURL({ dynamic: true, size: 512 }))
          .setTimestamp()
          .setFooter({ text: 'User Info Command', iconURL: interaction.client.user.avatarURL() });

        await i.update({ embeds: [userEmbed, avatarEmbed], components: [], ephemeral: true });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ content: 'No interaction received. Please try again.', components: [], ephemeral: true });
      }
    });
  },
};
