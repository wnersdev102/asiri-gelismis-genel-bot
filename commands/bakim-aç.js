const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../ayarlar.json');

function parseDuration(input) {
  if (!input) return null;

  input = input.trim().toLowerCase();

  const regex = /^(\d+)(s|m|h)?$/;
  const match = input.match(regex);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2] || 'm'; // default dakika

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    default: return null;
  }
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds} saniye`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} dakika`;
  const hours = (minutes / 60).toFixed(1);
  return `${hours} saat`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bakim-aç')
    .setDescription('Botu bakım moduna alır (isteğe bağlı süre ile).')
    .addStringOption(option =>
      option.setName('süre')
        .setDescription('Bakım süresi (örn: 10m, 2h, 30s, veya sadece sayı dakikadır)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    if (userId !== config.sahipId) {
      return interaction.reply({ content: '🚫 Bu komutu sadece bot sahibi kullanabilir.', ephemeral: true });
    }

    const süreStr = interaction.options.getString('süre');
    const ayarlarPath = path.join(__dirname, '..', 'ayarlar.json');
    const ayarlar = JSON.parse(fs.readFileSync(ayarlarPath, 'utf8'));

    if (ayarlar.bakim) {
      return interaction.reply({ content: '⚠️ Bot zaten bakım modunda!', ephemeral: true });
    }

    let süreMs = null;
    if (süreStr) {
      süreMs = parseDuration(süreStr);
      if (süreMs === null) {
        return interaction.reply({ content: '❌ Süre formatı geçersiz! Örnek: 10m, 2h, 30s veya sadece sayı (dakika olarak)', ephemeral: true });
      }
    }

    ayarlar.bakim = true;
    fs.writeFileSync(ayarlarPath, JSON.stringify(ayarlar, null, 2), 'utf8');

    await interaction.reply({
      content: `🛠️ Bot bakım moduna alındı.${süreMs ? `\n⏳ Otomatik çıkış: **${formatDuration(süreMs)}** sonra.` : ''}`,
      ephemeral: false
    });

    if (süreMs) {
      setTimeout(() => {
        try {
          const guncelAyarlar = JSON.parse(fs.readFileSync(ayarlarPath, 'utf8'));
          guncelAyarlar.bakim = false;
          fs.writeFileSync(ayarlarPath, JSON.stringify(guncelAyarlar, null, 2), 'utf8');

          const logChannel = interaction.guild?.systemChannel;
          if (logChannel) {
            logChannel.send('✅ Bakım modu süresi doldu, bot normale döndü.');
          }
        } catch (err) {
          console.error('Bakım modu otomatik kapanırken hata:', err);
        }
      }, süreMs);
    }
  }
};
