const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const os = require('os');
const process = require('process');
const config = require('../ayarlar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('istatistik')
    .setDescription('Botun sistemsel istatistiklerini gösterir.'),

  async execute(interaction) {
    const uptime = process.uptime();
    const uptimeStr = `<t:${Math.floor(Date.now() / 1000 - uptime)}:R>`;
    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const totalGuilds = interaction.client.guilds.cache.size;
    const totalUsers = interaction.client.users.cache.size;
    const totalChannels = interaction.client.channels.cache.size;

    const embed = new EmbedBuilder()
      .setTitle('Bot İstatistikleri')
      .setColor(0x00AEFF)
      .setDescription(`
**🖥️ Sunucu Sayısı:** ${totalGuilds}\n
**👥 Kullanıcı Sayısı:** ${totalUsers}\n
**📺 Kanal Sayısı:** ${totalChannels}\n
**📶 Gecikme (Ping):** ${interaction.client.ws.ping}ms\n
**🧠 Bellek Kullanımı:** ${memoryUsage} MB\n
**⏳ Çalışma Süresi:** ${uptimeStr}\n
      `)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Destek Sunucusu')
        .setStyle(ButtonStyle.Link)
        .setURL(config.destekSunucusu),

      new ButtonBuilder()
        .setLabel('Yenile')
        .setCustomId('istatistik_yenile')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
