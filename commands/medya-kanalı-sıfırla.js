const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('medya-kanalı-sıfırla')
    .setDescription('Medya kanalı ayarını sıfırlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const medyaKanalId = db.get(`medyaKanal_${interaction.guild.id}`);

    if (!medyaKanalId) {
      return interaction.reply({
        content: '❌ Zaten ayarlanmış bir medya kanalı yok.',
        ephemeral: true
      });
    }

    db.delete(`medyaKanal_${interaction.guild.id}`);

    const embed = new EmbedBuilder()
      .setTitle('✅ Medya Kanalı Sıfırlandı')
      .setDescription('🗑️ Medya kanalı ayarı başarıyla kaldırıldı. Artık medya kontrolü yapılmayacak.')
      .setColor('Green')
      .setFooter({
        text: `İşlem yapan: ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      });

    await interaction.reply({ embeds: [embed] });
  }
};
