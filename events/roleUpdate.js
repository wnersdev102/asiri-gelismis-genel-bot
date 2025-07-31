const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  name: 'roleUpdate',
  async execute(oldRole, newRole) {
    const guild = newRole.guild;
    const logKanalId = croxydb.get(`modLog_${guild.id}`);
    if (!logKanalId) return;

    const logKanal = guild.channels.cache.get(logKanalId);
    if (!logKanal) return;

    try {
      const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.RoleUpdate, limit: 1 });
      const entry = auditLogs.entries.first();
      if (!entry) return;

      const { executor, reason } = entry;
      let changes = [];

      if (oldRole.name !== newRole.name)
        changes.push(`**İsim:** \`${oldRole.name}\` → \`${newRole.name}\``);

      if (oldRole.color !== newRole.color)
        changes.push(`**Renk:** \`${oldRole.color.toString(16)}\` → \`${newRole.color.toString(16)}\``);
      if (!oldRole.permissions.equals(newRole.permissions)) {
        changes.push('**İzinler değiştirildi.**');
      }

      if (changes.length === 0) return;

      const embed = new EmbedBuilder()
        .setTitle('🟠 Rol Güncellendi')
        .setDescription(`**${newRole.name}** rolü güncellendi.`)
        .addFields(
          { name: 'Değişiklikler', value: changes.join('\n') },
          { name: 'Yetkili', value: `${executor.tag} (${executor.id})`, inline: true },
          { name: 'Sebep', value: reason || 'Belirtilmemiş', inline: false }
        )
        .setColor('Orange')
        .setTimestamp();

      logKanal.send({ embeds: [embed] });
    } catch (error) {
      console.error('roleUpdate mod-log hatası:', error);
    }
  }
};


// ellerim kırıldı aq 4 defa hata aldım bu %100 çalışan umarım bu projenin hakkını alabilirim discord.gg/wnerscode