const {Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
const db = require('croxydb');
const config = require('../ayarlar.json');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const karaListe = db.get(`karaliste_${interaction.user.id}`);
        if (karaListe) {
          return interaction.reply({
            content: `🚫 Bu botu kullanman yasaklandı.\n**Sebep:** ${karaListe}`,
            ephemeral: true
          });
        }

        if (config.bakim && interaction.user.id !== config.sahipId) {
          return interaction.reply({
            content: '🔧 Bot şu anda bakımda. Lütfen daha sonra tekrar deneyin.',
            ephemeral: false
          });
        }

        const command = client.commands.get(interaction.commandName);
        if (command) await command.execute(interaction, client);
        return;
      }
      if (interaction.isButton()) {
        const kayitData = db.get(`kayitSistemi_${interaction.guild.id}`);
        if (!kayitData) return;

        const [action, userId] = interaction.customId.split('_');
        const targetMember = interaction.guild.members.cache.get(userId);
        if (!targetMember) return;

        if (!interaction.member.roles.cache.has(kayitData.kayitYetkili)) {
          return interaction.reply({ content: '❌ Bu işlemi yapamazsın.', ephemeral: true });
        }

        if (action === 'kayitEt') {
          const modal = new ModalBuilder()
            .setCustomId(`kayitModal_${userId}`)
            .setTitle('Kayıt Formu');

          const isimInput = new TextInputBuilder()
            .setCustomId('isim')
            .setLabel('İsim')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const yasInput = new TextInputBuilder()
            .setCustomId('yas')
            .setLabel('Yaş')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder().addComponents(isimInput),
            new ActionRowBuilder().addComponents(yasInput)
          );

          await interaction.showModal(modal);
        }

        if (action === 'kov') {
          await targetMember.kick('Kayıt ekranında kovuldu.');
          await interaction.reply({ content: `❌ <@${userId}> sunucudan atıldı.`, ephemeral: false });

          const logKanal = interaction.guild.channels.cache.get(kayitData.kayitLog);
          if (logKanal) logKanal.send(`❌ <@${userId}> kayıt ekranından kovuldu.`);
        }

        if (action === 'cinsiyet') {
          const cinsiyet = interaction.customId.split('_')[2];
          const yeniIsim = db.get(`kayitIsim_${userId}`);
          if (!yeniIsim) {
            return interaction.reply({ content: '⛔ Önce isim ve yaş girilmeli.', ephemeral: true });
          }

          await targetMember.setNickname(yeniIsim).catch(() => {});
          await targetMember.roles.remove(kayitData.kayitsizRol).catch(() => {});
          await targetMember.roles.add(cinsiyet === 'erkek' ? kayitData.erkekRol : kayitData.kizRol).catch(() => {});

          db.delete(`kayitIsim_${userId}`);

          await interaction.update({
            content: `✅ <@${userId}> başarıyla \`${yeniIsim}\` olarak kayıt edildi (${cinsiyet}).`,
            components: [],
          });

          const logKanal = interaction.guild.channels.cache.get(kayitData.kayitLog);
          if (logKanal) {
            logKanal.send(
              `✅ <@${userId}> kayıt edildi.\n📛 İsim: \`${yeniIsim}\`\n🎭 Cinsiyet: **${cinsiyet.toUpperCase()}**\n👮 Kayıt Eden: <@${interaction.user.id}>`
            );
          }
        }
      }
      if (interaction.isModalSubmit()) {
        const [modalId, userId] = interaction.customId.split('_');
        if (modalId === 'kayitModal') {
          const isim = interaction.fields.getTextInputValue('isim');
          const yas = interaction.fields.getTextInputValue('yas');
          const yeniIsim = `${isim} | ${yas}`;
          db.set(`kayitIsim_${userId}`, yeniIsim);

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`cinsiyet_${userId}_erkek`)
              .setLabel('Erkek')
              .setEmoji('👦')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId(`cinsiyet_${userId}_kiz`)
              .setLabel('Kız')
              .setEmoji('👧')
              .setStyle(ButtonStyle.Danger)
          );

          await interaction.reply({
            content: `✅ İsim alındı: \`${yeniIsim}\`\nLütfen cinsiyet seçimi yapınız:`,
            components: [row],
            ephemeral: true,
          });
        }

        if (interaction.customId === 'otomatik_cevap_ekle') {
          const kelime = interaction.fields.getTextInputValue('kelime').toLowerCase();
          const cevap = interaction.fields.getTextInputValue('cevap');
          db.set(`otocevap_${interaction.guild.id}_${kelime}`, cevap);

          await interaction.reply({
            content: `✅ Artık biri "**${kelime}**" yazarsa bot şu cevabı verecek:\n\n${cevap}`,
            ephemeral: true
          });
        }
      }
    } catch (err) {
      console.error(`⛔ interactionCreate hatası:\n`, err);
      if (interaction.replied || interaction.deferred) {
        interaction.followUp({ content: '❌ Bir hata oluştu.', ephemeral: true }).catch(() => {});
      } else {
        interaction.reply({ content: '❌ Bir hata oluştu.', ephemeral: true }).catch(() => {});
      }
    }
  },
};
