const { EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    if (!message.guild || message.author?.bot) return;

    const modLogChannelId = croxydb.get(`modLog_${message.guild.id}`);
    if (!modLogChannelId) return;

    const channel = message.guild.channels.cache.get(modLogChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle('Mesaj Silindi')
      .setDescription(`Bir mesaj silindi.`)
      .addFields(
        { name: 'Kullanıcı', value: `${message.author.tag} (${message.author.id})` },
        { name: 'Kanal', value: `${message.channel}` },
        { name: 'Mesaj', value: message.content ? message.content.slice(0, 1024) : '[Resim veya medya]' },
      )
      .setColor('#ff0000')
      .setTimestamp();

    channel.send({ embeds: [embed] });
  }
};
