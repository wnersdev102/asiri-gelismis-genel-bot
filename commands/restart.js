const { SlashCommandBuilder } = require('discord.js');
const config = require('../ayarlar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Botu yeniden başlatır.'),
  
  async execute(interaction) {
    if (interaction.user.id !== config.sahipId) {
      return interaction.reply({ content: '🚫 Bu komutu sadece bot sahibi kullanabilir.', ephemeral: true });
    }

    await interaction.reply({ content: '🔄 Bot yeniden başlatılıyor...', ephemeral: true });

    // reis botu kapatıyor ztn yani botu run.bat başlatığın zmn zaten yeniliyor
    process.exit(0);
  }
};
