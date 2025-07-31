const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../ayarlar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bakim-kapat')
    .setDescription('Botun bakım modunu kapatır.'),

  async execute(interaction) {
    const userId = interaction.user.id;
    if (userId !== config.sahipId) {
      return interaction.reply({ content: '🚫 Bu komutu sadece bot sahibi kullanabilir.', ephemeral: true });
    }

    const ayarlarPath = path.join(__dirname, '..', 'ayarlar.json');
    const ayarlar = JSON.parse(fs.readFileSync(ayarlarPath, 'utf8'));

    if (!ayarlar.bakim) {
      return interaction.reply({ content: '⚠️ Bot zaten bakım modunda değil!', ephemeral: true });
    }

    ayarlar.bakim = false;
    fs.writeFileSync(ayarlarPath, JSON.stringify(ayarlar, null, 2), 'utf8');

    await interaction.reply({ content: '✅ Bakım modu kapatıldı, bot artık normal çalışıyor.', ephemeral: false });
  }
};
