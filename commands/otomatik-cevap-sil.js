const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('otomatik-cevap-sil')
    .setDescription('Otomatik cevap kaldır')
    .addStringOption(option =>
      option.setName('kelime')
        .setDescription('Silinecek tetikleyici kelime')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const kelime = interaction.options.getString('kelime').toLowerCase();
    const kontrol = db.has(`otocevap_${interaction.guild.id}_${kelime}`);

    if (!kontrol) {
      return interaction.reply({ content: '❌ Bu kelimeye ait bir otomatik cevap bulunamadı.', ephemeral: true });
    }

    db.delete(`otocevap_${interaction.guild.id}_${kelime}`);
    await interaction.reply({ content: `🗑️ "${kelime}" tetikleyicisi silindi.`, ephemeral: true });
  }
};
