const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const otorolData = croxydb.get(`otorol.${member.guild.id}`);
    const girisCikisData = croxydb.get(`girisCikis.${member.guild.id}`);
    const etiketKanalId = croxydb.get(`welcomeChannel_${member.guild.id}`);
    const kayitData = croxydb.get(`kayitSistemi_${member.guild.id}`);
    const otoTag = croxydb.get(`otoTag_${member.guild.id}`);

    if (member.user.bot && otorolData?.botRol) {
      const rol = member.guild.roles.cache.get(otorolData.botRol);
      if (rol) {
        await member.roles.add(rol).catch(() => {});
        const kanal = member.guild.channels.cache.get(girisCikisData?.girisKanal);
        if (kanal) kanal.send(`${member.user.tag} (BOT) sunucuya katıldı. **${rol.name}** rolü verildi.`);
      }
    }

    if (!member.user.bot && otorolData?.uyeRol) {
      const rol = member.guild.roles.cache.get(otorolData.uyeRol);
      if (rol) {
        await member.roles.add(rol).catch(() => {});
        const kanal = member.guild.channels.cache.get(girisCikisData?.girisKanal);
        if (kanal) kanal.send(`${member.user.tag} sunucuya katıldı. **${rol.name}** rolü verildi.`);
      }
    }

    if (girisCikisData?.girisKanal) {
  const kanal = member.guild.channels.cache.get(girisCikisData.girisKanal);
  if (kanal) {
    const total = member.guild.memberCount;

    const welcomeEmbed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle('🎉 Yeni Üye!')
      .setDescription(`${member.user.tag} aramıza katıldı!`)
      .addFields(
        { name: 'Toplam Üye Sayısı', value: `**${total}**`, inline: false }
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    kanal.send({ embeds: [welcomeEmbed] });
  }
    }

    if (etiketKanalId) {
      const kanal = member.guild.channels.cache.get(etiketKanalId);
      if (kanal) kanal.send(`<@${member.id}>`);
    }

    if (kayitData) {
      const kayitKanal = member.guild.channels.cache.get(kayitData.kayitKanal);
      if (kayitKanal) {
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`kayitEt_${member.id}`).setLabel('Kayıt Et').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId(`kov_${member.id}`).setLabel('Kov').setStyle(ButtonStyle.Danger)
        );

        kayitKanal.send({
          content: `<@&${kayitData.kayitYetkili}> ➤ <@${member.id}> adlı kullanıcı sunucuya katıldı. Kayıt işlemini başlatmak için aşağıdaki butonları kullan.`,
          components: [row]
        });
      }
    }

if (otoTag && !member.user.bot) {
  let baseUsername = member.user.username.replace(/[^a-zA-Z0-9ğüşöçİĞÜŞÖÇ\s]/g, '');
  let newName = `${baseUsername} ${otoTag}`;
  
  if (newName.length > 32) {
    const maxBaseLength = 32 - otoTag.length - 1;
    newName = `${baseUsername.slice(0, maxBaseLength)} ${otoTag}`;
  }

  try {
    await member.setNickname(newName);
  } catch (err) {
    console.warn(`⛔ Oto-tag nickname ayarlanamadı (${member.user.tag}): ${err.message}`);
  }
}


    try {
      const invitesBefore = croxydb.get(`invitesBefore_${member.guild.id}`) || {};
      const invitesNow = await member.guild.invites.fetch();
      let usedInvite = null;

      invitesNow.forEach(inv => {
        const prev = invitesBefore[inv.code] || 0;
        if (inv.uses > prev) usedInvite = inv;
      });

      if (!usedInvite) return;

      const inviter = usedInvite.inviter;
      const inviteLink = `https://discord.gg/${usedInvite.code}`;
      const inviterTotalUses = invitesNow
        .filter(i => i.inviter?.id === inviter.id)
        .reduce((sum, inv) => sum + inv.uses, 0);

      const davetLogChannelId = croxydb.get(`davetLog_${member.guild.id}`);
      const logChannel = member.guild.channels.cache.get(davetLogChannelId);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setTitle('📥 Yeni Davet Alındı')
        .setColor('#2F3136')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: '📥 Davet Edilen', value: `<@${member.id}>`, inline: true },
          { name: '🙋 Davet Eden', value: `<@${inviter.id}>`, inline: true },
          { name: '🔗 Davet Linki', value: `[Tıkla](${inviteLink})`, inline: true },
          { name: '📅 Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
          { name: '⭐ Toplam Davet', value: `${inviterTotalUses}`, inline: true }
        )
        .setFooter({ text: `Davet Sistemi | ${member.guild.name}`, iconURL: member.guild.iconURL() })
        .setTimestamp();

      logChannel.send({ embeds: [embed] });
      const newInvites = {};
      invitesNow.forEach(inv => {
        newInvites[inv.code] = inv.uses;
      });
      croxydb.set(`invitesBefore_${member.guild.id}`, newInvites);
    } catch (err) {
      console.error('⛔ Davet log embed hatası:', err);
    }
  }
};
