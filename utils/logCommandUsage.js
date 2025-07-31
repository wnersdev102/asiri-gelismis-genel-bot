const { EmbedBuilder } = require('discord.js');
const config = require('../ayarlar.json');

/**
 * @param {CommandInteraction} interaction 
 */
async function logCommandUsage(interaction) {
  try {
    const logKanalId = config.komutlogkanal;
    if (!logKanalId) return;

    const logKanal = interaction.guild.channels.cache.get(logKanalId);
    if (!logKanal) return;

    const embed = new EmbedBuilder()
      .setTitle('📝 Komut Kullanımı')
      .setColor('Blue')
      .addFields(
        { name: 'Kullanıcı', value: `${interaction.user.tag} (<@${interaction.user.id}>)`, inline: true },
        { name: 'Komut', value: `/${interaction.commandName}`, inline: true },
        { name: 'Kanal', value: `${interaction.channel}`, inline: true }
      )
      .setTimestamp();

    await logKanal.send({ embeds: [embed] });
  } catch (error) {
    console.error('Komut loglama hatası:', error);
  }
}

module.exports = logCommandUsage;
