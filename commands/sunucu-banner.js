const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sunucu-banner')
    .setDescription('Sunucunun banner görselini gösterir.'),

  async execute(interaction) {
    const guild = interaction.guild;
    const banner = guild.bannerURL({ size: 2048 });

    if (!banner) {
      return interaction.reply({
        content: '❌ Bu sunucunun bir banner görseli yok.',
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`${guild.name} Sunucu Bannerı`)
      .setImage(banner)
      .setColor(0x5865F2)
      .setFooter({ text: `Sunucu ID: ${guild.id}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
