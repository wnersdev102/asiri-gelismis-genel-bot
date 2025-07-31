// commands/adam-asmaca.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const kelimeler = require('../kelimeler.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adam-asmaca')
    .setDescription('Adam asmaca oyunu başlatır.'),

  async execute(interaction) {
    const channel = interaction.channel;

    const word = kelimeler[Math.floor(Math.random() * kelimeler.length)].toLowerCase();
    let display = '_'.repeat(word.length).split('');
    let lives = 6;
    const guessed = new Set();

    const embed = () => new EmbedBuilder()
      .setTitle('🪢 Adam Asmaca')
      .setDescription(`Kelime: **${display.join(' ')}**\nYanlış hak: **${lives}**\nTahmin edilen: ${[...guessed].join(', ') || 'Yok'}`)
      .setColor('#0099ff');

    await interaction.reply({ embeds: [embed()] });

    const filter = m => m.author.id === interaction.user.id && /^[a-zA-ZğüşöçİĞÜŞÖÇ]$/i.test(m.content);
    const collector = channel.createMessageCollector({ filter, time: 120000 });

    collector.on('collect', m => {
      const letter = m.content.toLowerCase();
      if (guessed.has(letter)) return;
      guessed.add(letter);

      if (word.includes(letter)) {
        [...word].forEach((ch,i) => { if (ch === letter) display[i] = letter; });
        if (!display.includes('_')) {
          channel.send(`🎉 Tebrikler, **${word}** kelimesini buldun!`);
          collector.stop('win');
        }
      } else {
        lives--;
        if (lives <= 0) {
          channel.send(`☠️ Maalesef hakkın bitti. Doğru kelime: **${word}**`);
          collector.stop('lose');
        }
      }
      m.delete().catch(() => {});
      interaction.fetchReply().then(msg => msg.edit({ embeds: [embed()] }));
    });

    collector.on('end', (_, reason) => {
      if (!['win','lose'].includes(reason)) {
        channel.send('⏰ Zaman doldu! Oyunu bitir.');
      }
    });
  }
};
