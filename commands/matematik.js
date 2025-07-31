const { SlashCommandBuilder, EmbedBuilder, InteractionCollector } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('matematik')
    .setDescription('Sana rastgele bir matematik sorusu sorar, cevapla bakalım!'),

  async execute(interaction) {
    const ops = ['+', '-', '*', '/'];
    const op = ops[Math.floor(Math.random() * ops.length)];

    let num1 = Math.floor(Math.random() * 50) + 1;
    let num2 = Math.floor(Math.random() * 50) + 1;
    if (op === '/') {
      num1 = num1 * num2;
    }
    let correctAnswer;
    switch (op) {
      case '+': correctAnswer = num1 + num2; break;
      case '-': correctAnswer = num1 - num2; break;
      case '*': correctAnswer = num1 * num2; break;
      case '/': correctAnswer = num1 / num2; break;
    }

    // Embed oluştur
    const embed = new EmbedBuilder()
      .setTitle('🧮 Matematik Sorusu')
      .setDescription(`Lütfen aşağıdaki işlemin sonucunu yazınız:\n**${num1} ${op} ${num2} = ?**`)
      .setColor('#5865F2')
      .setFooter({ text: '30 saniye içinde cevap veriniz!' });

    await interaction.reply({ embeds: [embed], ephemeral: false });
    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

    collector.on('collect', msg => {
      const answer = msg.content.trim();
      if (isNaN(answer)) {
        interaction.followUp({ content: '❌ Lütfen geçerli bir sayı girin.', ephemeral: true });
        return;
      }
      const parsedAnswer = parseFloat(answer);
      const isCorrect = Math.abs(parsedAnswer - correctAnswer) < 0.0001;

      if (isCorrect) {
        interaction.followUp({ content: `🎉 Tebrikler! Doğru cevap: **${correctAnswer}**`, ephemeral: false });
      } else {
        interaction.followUp({ content: `❌ Maalesef, doğru cevap: **${correctAnswer}**`, ephemeral: false });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp({ content: '⌛ Süre doldu, cevap alamadım.', ephemeral: true });
      }
    });
  }
};
