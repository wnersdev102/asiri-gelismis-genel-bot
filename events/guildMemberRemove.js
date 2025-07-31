const { EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const girisCikisData = croxydb.get(`girisCikis.${member.guild.id}`);
    if (!girisCikisData) return;
    const inviterId = croxydb.get(`memberInvitedBy_${member.guild.id}_${member.id}`);
    if (inviterId) {
      const inviterInvitesKey = `invitesCount_${member.guild.id}_${inviterId}`;
      let currentCount = croxydb.get(inviterInvitesKey) || 0;
      currentCount = Math.max(0, currentCount - 1);
      croxydb.set(inviterInvitesKey, currentCount);
    }

    croxydb.delete(`memberInvitedBy_${member.guild.id}_${member.id}`);

    if (girisCikisData.cikisKanal) {
      const kanal = member.guild.channels.cache.get(girisCikisData.cikisKanal);
      if (kanal) {
        const totalMembers = member.guild.memberCount;
        const embed = new EmbedBuilder()
          .setTitle('Bir Üye Sunucudan Ayrıldı!')
          .setDescription(`**${member.user.tag}** sunucudan ayrıldı. Şu anda sunucuda toplam **${totalMembers} üye** kaldık.`)
          .setColor(0xFF0000)
          .setTimestamp();

        kanal.send({ embeds: [embed] });
      }
    }
  },
};
