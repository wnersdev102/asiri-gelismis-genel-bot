const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const zarResimleri = {
  1: 'https://i.imgur.com/1.png',
  2: 'https://i.imgur.com/2.png',
  3: 'https://i.imgur.com/3.png',
  4: 'https://i.imgur.com/4.png',
  5: 'https://i.imgur.com/5.png',
  6: 'https://i.imgur.com/6.png',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zar-at')
    .setDescription('Zar atar ve sonucunu gösterir! 🎲'),

  async execute(interaction) {
    const zar = Math.floor(Math.random() * 6) + 1;

    const embed = new EmbedBuilder()
      .setTitle('🎲 Zar Atıldı!')
      .setDescription(`🎲 Sonuç: **${zar}**`)
      .setImage(zarResimleri[zar])
      .setColor('#5865F2')
      .setFooter({ text: `İyi şanslar, ${interaction.user.username}!`, iconURL: interaction.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  },
};
