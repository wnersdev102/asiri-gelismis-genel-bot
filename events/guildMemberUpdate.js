const { EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember) {
    const eskiIsim = oldMember.nickname || oldMember.user.username;
    const yeniIsim = newMember.nickname || newMember.user.username;
    const allKeys = croxydb.all().filter(i => i.ID.startsWith(`durumRol_${newMember.guild.id}_`));

    if (!oldMember.premiumSince && newMember.premiumSince) {
      const kanalId = db.get(`boostKanal_${newMember.guild.id}`);
      if (kanalId) {
        const kanal = newMember.guild.channels.cache.get(kanalId);
        if (kanal) {
          const boostEmbed = new EmbedBuilder()
            .setTitle('🌟 Yeni Boost Geldi!')
            .setDescription(`🎉 ${newMember} adlı kullanıcı sunucuyu **boostladı**!\nHep birlikte teşekkür edelim!`)
            .setColor('Purple')
            .setTimestamp();

          kanal.send({ embeds: [boostEmbed] }).catch(() => {});
        }
      }
    }
    for (const key of allKeys) {
      const durum = key.ID.split(`durumRol_${newMember.guild.id}_`)[1];
      const { rolId, logKanalId } = key.data;
      const rol = newMember.guild.roles.cache.get(rolId);
      const logKanal = newMember.guild.channels.cache.get(logKanalId);
      if (!rol || !logKanal) continue;
      const kullaniciDurumuVar = yeniIsim.toLowerCase().includes(durum.toLowerCase());
      const roluVarMi = newMember.roles.cache.has(rolId);

      if (kullaniciDurumuVar && !roluVarMi) {
        await newMember.roles.add(rol).catch(() => {});
        try {
          await newMember.send(`📌 **${durum}** durumunu aldığınız için teşekkürler! Size **${rol.name}** rolü verildi.`);
        } catch (e) {
// boş kalsin
        }

        const embed = new EmbedBuilder()
          .setTitle('📥 Durum Rolü Verildi')
          .setDescription(`<@${newMember.id}> kullanıcısı "${durum}" durumunu aldı. <@&${rol.id}> rolü verildi.`)
          .setColor('Green')
          .setTimestamp();

        logKanal.send({ embeds: [embed] });
      } else if (!kullaniciDurumuVar && roluVarMi) {
        await newMember.roles.remove(rol).catch(() => {});
        try {
          await newMember.send(`🗑️ **${durum}** durumunuz kaldırıldı. **${rol.name}** rolünüz geri alındı.`);
        } catch (e) {
        }

        const embed = new EmbedBuilder()
          .setTitle('📤 Durum Rolü Kaldırıldı')
          .setDescription(`<@${newMember.id}> kullanıcısı artık "${durum}" durumuna sahip değil. <@&${rol.id}> rolü geri alındı.`)
          .setColor('Red')
          .setTimestamp();

        logKanal.send({ embeds: [embed] });
      }
    }
  }
};
