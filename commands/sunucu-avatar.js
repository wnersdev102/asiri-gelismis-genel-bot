const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sunucu-avatar')
    .setDescription('Sunucunun avatarını gösterir.'),

  async execute(interaction) {
    const guild = interaction.guild;

    const serverAvatarURL = guild.iconURL({ dynamic: true, size: 2048 });

    const embed = new EmbedBuilder()
      .setTitle(`${guild.name} Sunucu Avatarı`)
      .setImage(serverAvatarURL)
      .setColor(0x00AEFF)
      .setTimestamp()
      .setFooter({
        text: 'Sunucu Avatarı',
        iconURL: interaction.client.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
