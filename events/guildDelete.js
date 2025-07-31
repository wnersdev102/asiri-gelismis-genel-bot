const { EmbedBuilder } = require('discord.js');
const config = require('../ayarlar.json');

module.exports = {
  name: 'guildDelete',
  async execute(guild) {
    try {
      const logKanalId = config.eklendiChannel;
      const logKanal = guild.client.channels.cache.get(logKanalId);

      if (!logKanal) return;

      const embed = new EmbedBuilder()
        .setTitle('❌ Sunucudan Atıldım!')
        .setDescription(`Sunucu adı: **${guild.name}**\nSunucu ID: \`${guild.id}\`\nÜye sayısı: ${guild.memberCount}`)
        .setColor('Red')
        .setTimestamp();

      await logKanal.send({ embeds: [embed] });
    } catch (error) {
      console.error('guildDelete event hatası:', error);
    }
  }
};
