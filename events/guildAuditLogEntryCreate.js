const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  name: 'guildAuditLogEntryCreate',
  async execute(entry) {
    const guild = entry.guild;

    const logKanalId = croxydb.get(`modLog_${guild.id}`);
    if (!logKanalId) return;
    const logKanal = guild.channels.cache.get(logKanalId);
    if (!logKanal) return;

    const executor = entry.executor;
    const target = entry.target;
    const reason = entry.reason || "Belirtilmemiş";

    let embed = new EmbedBuilder()
      .setAuthor({ name: executor.tag, iconURL: executor.displayAvatarURL() })
      .setTimestamp()
      .setFooter({ text: `ID: ${executor.id}` });

    switch (entry.action) {
      case AuditLogEvent.ChannelDelete:
        embed
          .setTitle('📁 Kanal Silindi')
          .setDescription(`**${target.name}** kanalı silindi.`)
          .addFields(
            { name: 'Silinen Kanal', value: `${target.name} (${target.id})`, inline: true },
            { name: 'Yetkili', value: `${executor.tag} (${executor.id})`, inline: true },
            { name: 'Sebep', value: reason, inline: false },
          )
          .setColor('Red');
        break;

      case AuditLogEvent.ChannelCreate:
        embed
          .setTitle('📁 Kanal Oluşturuldu')
          .setDescription(`**${target.name}** kanalı oluşturuldu.`)
          .addFields(
            { name: 'Oluşturulan Kanal', value: `${target.name} (${target.id})`, inline: true },
            { name: 'Yetkili', value: `${executor.tag} (${executor.id})`, inline: true },
            { name: 'Sebep', value: reason, inline: false },
          )
          .setColor('Green');
        break;

      case AuditLogEvent.RoleDelete:
        embed
          .setTitle('🔴 Rol Silindi')
          .setDescription(`**${target.name}** rolü silindi.`)
          .addFields(
            { name: 'Silinen Rol', value: `${target.name} (${target.id})`, inline: true },
            { name: 'Yetkili', value: `${executor.tag} (${executor.id})`, inline: true },
            { name: 'Sebep', value: reason, inline: false },
          )
          .setColor('Red');
        break;

      case AuditLogEvent.RoleCreate:
        embed
          .setTitle('🟢 Rol Oluşturuldu')
          .setDescription(`**${target.name}** rolü oluşturuldu.`)
          .addFields(
            { name: 'Oluşturulan Rol', value: `${target.name} (${target.id})`, inline: true },
            { name: 'Yetkili', value: `${executor.tag} (${executor.id})`, inline: true },
            { name: 'Sebep', value: reason, inline: false },
          )
          .setColor('Green');
        break;

      case AuditLogEvent.MessageDelete:
        embed
          .setTitle('🗑️ Mesaj Silindi')
          .setDescription(`Bir mesaj silindi.`)
          .addFields(
            { name: 'Mesaj İçeriği', value: entry.extra?.content || 'Mesaj içeriği alınamadı.', inline: false },
            { name: 'Kanal', value: `${entry.extra?.channel?.name || 'Bilinmiyor'} (${entry.extra?.channel?.id || 'Bilinmiyor'})`, inline: true },
            { name: 'Yetkili', value: `${executor.tag} (${executor.id})`, inline: true },
            { name: 'Sebep', value: reason, inline: false },
          )
          .setColor('Red');
        break;

      default:
        return;
    }

    logKanal.send({ embeds: [embed] }).catch(() => {});
  }
};
