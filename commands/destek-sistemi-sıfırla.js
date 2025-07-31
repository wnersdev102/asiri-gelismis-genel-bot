const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('destek-sistemi-sıfırla')
    .setDescription('Destek sistemini sıfırlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    const guildId = interaction.guild.id;

    const kontrol = db.get(`destekSistemi_${guildId}`);
    if (!kontrol) {
      return interaction.reply({
        content: '❌ Destek sistemi zaten ayarlı değil.',
        ephemeral: true
      });
    }

    db.delete(`destekSistemi_${guildId}`);
    db.delete(`destekLog_${guildId}`);
    db.delete(`destekYetkili_${guildId}`);

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle('Destek Sistemi Sıfırlandı')
      .setDescription('Destek sistemiyle ilgili tüm veriler başarıyla silindi.')
      .setTimestamp();

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
