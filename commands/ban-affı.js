const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban-affı')
    .setDescription('Sunucudaki tüm banlı kullanıcıların yasağını kaldırır.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: '❌ Bu komutu kullanmak için **Üyeleri Yasakla** yetkisine sahip olmalısın.',
        ephemeral: true,
      });
    }

    const bans = await interaction.guild.bans.fetch();
    const totalBans = bans.size;

    if (totalBans === 0) {
      return interaction.reply({
        content: 'Sunucuda banlı kullanıcı yok.',
        ephemeral: true,
      });
    }

    const confirmRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Evet, Hepsini Affet')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Vazgeç')
        .setEmoji('❌')
        .setStyle(ButtonStyle.Danger)
    );

    const confirmEmbed = new EmbedBuilder()
      .setTitle('⚠️ Ban Affı Onayı')
      .setDescription(`Bu işlem **${totalBans}** banlı kullanıcıyı affedecek.\nDevam etmek istediğinden emin misin?`)
      .setColor(0xFAA61A);

    const reply = await interaction.reply({
      embeds: [confirmEmbed],
      components: [confirmRow],
      ephemeral: true,
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30_000,
    });

    collector.on('collect', async (btn) => {
      if (btn.user.id !== interaction.user.id)
        return btn.reply({ content: '❌ Bu butonları sadece komutu kullanan kişi kullanabilir.', ephemeral: true });

      if (btn.customId === 'cancel') {
        collector.stop();
        return btn.update({
          content: 'Ban affı işlemi iptal edildi.',
          components: [],
          embeds: [],
        });
      }

      if (btn.customId === 'confirm') {
        collector.stop();

        const start = Date.now();
        let success = 0;
        let failed = 0;

        const statusMsg = await btn.update({
          content: 'Banlar kaldırılıyor, lütfen bekleyin...',
          components: [],
          embeds: [],
          fetchReply: true,
        });

        for (const ban of bans.values()) {
          try {
            const dmEmbed = new EmbedBuilder()
              .setTitle('Banın Kaldırıldı')
              .setDescription(`**${interaction.guild.name}** sunucusundaki yasağın kaldırıldı.`)
              .setColor(0x57F287)
              .setTimestamp()
              .setFooter({ text: `Affeden: ${interaction.user.tag}` });

            await ban.user.send({ embeds: [dmEmbed] }).catch(() => {});

            await interaction.guild.members.unban(ban.user.id, `Toplu ban affı: ${interaction.user.tag}`);
            success++;
          } catch (e) {
            failed++;
          }
        }

        const duration = ((Date.now() - start) / 1000).toFixed(2);

        const resultEmbed = new EmbedBuilder()
          .setTitle('Ban Affı Tamamlandı')
          .setDescription(`Toplam ${totalBans} kullanıcıdan:`)
          .addFields(
            { name: '🟢 Başarıyla Affedildi', value: `${success}`, inline: true },
            { name: '🔴 Hata Oluşanlar', value: `${failed}`, inline: true },
            { name: '⏱️ Süre', value: `${duration} saniye`, inline: true }
          )
          .setColor(0x57F287)
          .setTimestamp();

        await interaction.editReply({ embeds: [resultEmbed], content: null });
      }
    });

    collector.on('end', async (_, reason) => {
      if (reason === 'time') {
        try {
          await interaction.editReply({
            content: '⌛ Onay süresi doldu, işlem iptal edildi.',
            embeds: [],
            components: [],
          });
        } catch {}
      }
    });
  },
};
