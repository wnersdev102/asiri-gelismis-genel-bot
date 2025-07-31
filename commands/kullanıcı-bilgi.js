const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kullanıcı-bilgi')
    .setDescription('Kullanıcı bilgilerini gösterir.'),

  async execute(interaction) {
    const user = interaction.user;

    // reis valla uğraşasım gelmedi eklemedim ana menü vb direk menü kalsın
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('kullanici_bilgi_menu')
        .setPlaceholder('Kullanıcı Bilgileri Seçin')
        .addOptions([
          {
            label: 'Kullanıcı İsmi ve Avatarı',
            description: 'Kullanıcının ismini ve avatarını gösterir.',
            value: 'username_avatar',
          },
          {
            label: 'Kullanıcı Bannerı',
            description: 'Kullanıcının bannerını gösterir.',
            value: 'user_banner',
          },
          {
            label: 'Hesap Oluşturulma Tarihi',
            description: 'Kullanıcının hesap oluşturulma tarihini gösterir.',
            value: 'account_creation',
          },
          {
            label: 'Yenile',
            description: 'Bilgileri yeniler.',
            value: 'refresh',
          },
          {
            label: 'Sil',
            description: 'Seçim menüsünü siler.',
            value: 'delete',
          },
        ])
    );


    await interaction.reply({
      content: 'Lütfen kullanıcı bilgilerini seçin:',
      components: [row],
    });
  },


  async handleInteraction(interaction) {
    if (!interaction.isStringSelectMenu()) return;

    const user = interaction.user;
    const value = interaction.values[0];

    if (value === 'username_avatar') {
      const embed = new EmbedBuilder()
        .setTitle(`${user.username} Avatar ve Kullanıcı Bilgisi`)
        .setDescription(`Kullanıcı İsmi: **${user.username}**\nKullanıcı ID: **${user.id}**`)
        .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
        .setColor(0x00AEFF);
      await interaction.update({ embeds: [embed], components: [] });
    }

    else if (value === 'user_banner') {
      try {
        const bannerUrl = await user.fetch().then(u => u.bannerURL({ size: 2048 }));
        const embed = new EmbedBuilder()
          .setTitle(`${user.username} Banner Bilgisi`)
          .setDescription(`Kullanıcı Bannerı`)
          .setImage(bannerUrl)
          .setColor(0x00AEFF);
        await interaction.update({ embeds: [embed], components: [] });
      } catch (error) {
        await interaction.update({ content: 'Kullanıcı bannerı bulunamadı!', components: [] });
      }
    }

    else if (value === 'account_creation') {
      const creationDate = user.createdAt.toLocaleDateString();
      const embed = new EmbedBuilder()
        .setTitle(`${user.username} Hesap Bilgisi`)
        .setDescription(`Hesap Oluşturulma Tarihi: **${creationDate}**`)
        .setColor(0x00AEFF);
      await interaction.update({ embeds: [embed], components: [] });
    }

    else if (value === 'refresh') {
      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('kullanici_bilgi_menu')
          .setPlaceholder('Kullanıcı Bilgileri Seçin')
          .addOptions([
            {
              label: 'Kullanıcı İsmi ve Avatarı',
              description: 'Kullanıcının ismini ve avatarını gösterir.',
              value: 'username_avatar',
            },
            {
              label: 'Kullanıcı Bannerı',
              description: 'Kullanıcının bannerını gösterir.',
              value: 'user_banner',
            },
            {
              label: 'Hesap Oluşturulma Tarihi',
              description: 'Kullanıcının hesap oluşturulma tarihini gösterir.',
              value: 'account_creation',
            },
            {
              label: 'Yenile',
              description: 'Bilgileri yeniler.',
              value: 'refresh',
            },
            {
              label: 'Sil',
              description: 'Seçim menüsünü siler.',
              value: 'delete',
            },
          ])
      );
      await interaction.update({ content: 'Lütfen kullanıcı bilgilerini seçin:', components: [row] });
    }

    else if (value === 'delete') {
      await interaction.update({ content: 'Menü silindi.', components: [] });
    }
  },
};
