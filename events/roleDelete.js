const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  name: 'roleDelete',
  async execute(role) {
    const guild = role.guild;
    const logKanalId = croxydb.get(`modLog_${guild.id}`);
    if (!logKanalId) return;

    const logKanal = guild.channels.cache.get(logKanalId);
    if (!logKanal) return;

    try {
      const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.RoleDelete, limit: 1 });
      const entry = auditLogs.entries.first();
      if (!entry) return;

      const { executor, reason } = entry;

      const embed = new EmbedBuilder()
        .setTitle('🔴 Rol Silindi')
        .setDescription(`**${role.name}** rolü silindi.`)
        .addFields(
          { name: 'Rol', value: `${role.name} (${role.id})`, inline: true },
          { name: 'Yetkili', value: `${executor.tag} (${executor.id})`, inline: true },
          { name: 'Sebep', value: reason || 'Belirtilmemiş', inline: false }
        )
        .setColor('Red')
        .setTimestamp();

      logKanal.send({ embeds: [embed] });
    } catch (error) {
      console.error('roleDelete mod-log hatası:', error);
    }
  }
};
