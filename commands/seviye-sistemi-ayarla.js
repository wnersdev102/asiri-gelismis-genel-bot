const { SlashCommandBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seviye-sistemi-ayarla')
    .setDescription('Seviye sistemini ayarlarsın.')
    .addChannelOption(option => 
      option.setName('log')
        .setDescription('Log kanalı')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('mesaj_xp')
        .setDescription('Mesaj başı XP')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('ses_xp')
        .setDescription('Ses dakikası başı XP')
        .setRequired(true)),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const logKanal = interaction.options.getChannel('log');
    const mesajXp = interaction.options.getInteger('mesaj_xp');
    const sesXp = interaction.options.getInteger('ses_xp');

    db.set(`ayar.log_${guildId}`, logKanal.id);
    db.set(`ayar.mesajXp_${guildId}`, mesajXp);
    db.set(`ayar.sesXp_${guildId}`, sesXp);

    await interaction.reply(`✅ Seviye sistemi ayarlandı!
📨 Mesaj XP: \`${mesajXp}\`
🎤 Ses XP/dakika: \`${sesXp}\`
📃 Log Kanalı: ${logKanal}`);
  }
};
