const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('croxydb');
const config = require('../ayarlar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('karaliste-sırala')
    .setDescription('Karalistede olan tüm kullanıcıları listeler (sadece bot sahibine özel)'),

  async execute(interaction) {
    if (interaction.user.id !== config.sahipId) {
      return interaction.reply({ content: '❌ Bu komutu sadece bot sahibi kullanabilir!', ephemeral: true });
    }

    const veriler = db.all();
    const karaliste = veriler.filter(data => data.ID.startsWith('karaliste_'));

    if (karaliste.length === 0) {
      return interaction.reply({ content: '✅ Karalistede hiç kullanıcı yok.', ephemeral: true });
    }

    const liste = karaliste.map((data, index) => {
      const userId = data.ID.replace('karaliste_', '');
      return `\`${index + 1}.\` <@${userId}> \`(${userId})\``;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('📛 Karalistede Olan Kullanıcılar')
      .setDescription(liste)
      .setColor('Red')
      .setFooter({ text: `Toplam: ${karaliste.length} kullanıcı` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
