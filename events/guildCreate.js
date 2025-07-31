const { EmbedBuilder } = require('discord.js');
const config = require('../ayarlar.json');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    try {
      const logKanalId = config.eklendiChannel;
      const logKanal = guild.client.channels.cache.get(logKanalId);
      if (logKanal) {
        const embed = new EmbedBuilder()
          .setTitle('🤖 Yeni Sunucuya Eklendim!')
          .setDescription(`Sunucu adı: **${guild.name}**\nSunucu sahibi: <@${guild.ownerId}>\nSunucu ID: \`${guild.id}\`\nÜye sayısı: ${guild.memberCount}`)
          .setColor(0x00AE86)
          .setTimestamp();

        await logKanal.send({ embeds: [embed] });
      }
      const owner = await guild.fetchOwner().catch(() => null);
      if (owner) {
        await owner.send(
          `🎉 Merhaba! Botum **${guild.name}** adlı sunucunuza eklendi. Yardım için /yardım komutunu kullanabilirsiniz.`
        ).catch(() => { });
      }
    } catch (error) {
      console.error('guildCreate event hatası:', error);
    }
  }
};
