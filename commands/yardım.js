const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require('discord.js');
const config = require('../ayarlar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yardım')
    .setDescription('Tüm komutları listeler.'),

  async execute(interaction) {
    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('yardim_menu')
        .setPlaceholder('🔽 Bir kategori seçin')
        .addOptions([
          { label: '🎮 Eğlence', value: 'eglence', description: 'Eğlenceli komutlar burada.' },
          { label: '🛠️ Moderasyon', value: 'moderasyon', description: 'Yetkili araçları.' },
          { label: '⚙️ Sistem', value: 'sistem', description: 'Sunucu sistemleri.' },
          { label: '🎉 Çekiliş & Etkileşim', value: 'cekilis', description: 'Çekiliş ve kullanıcı etkileşimi.' },
          { label: '📈 Seviye & Kayıt', value: 'seviye_kayit', description: 'Seviye ve kayıt sistemi komutları.' },
          { label: '🌐 Bilgi & Araçlar', value: 'bilgi', description: 'Kullanışlı bilgi komutları.' }
        ])
    );
    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Destek Sunucusu')
        .setEmoji('📌')
        .setStyle(ButtonStyle.Link)
        .setURL(config.destekSunucusu),
      new ButtonBuilder()
        .setLabel('Botu Davet Et')
        .setEmoji('➕')
        .setStyle(ButtonStyle.Link)
        .setURL(config.botDavet)
    );
    await interaction.deferReply({ ephemeral: true });
    const botPing = Date.now() - interaction.createdTimestamp;
    const websocketPing = interaction.client.ws.ping;

    const yardımEmbed = new EmbedBuilder()
      .setTitle('Yardım Menüsü')
      .setDescription(`Aşağıdan bir kategori seçerek komutlara ulaşabilirsin.\n\n📡 Bot İstatistikleri:\nPing: **${botPing}ms**\nWebSocket: **${websocketPing}ms**\n\n🚀 En Çok Kullanılan Komutlar:\n**/toplu-ban**: Bot bulunduğu tüm sunuculardan o üyeyi banlar.\n**/otomatik-cevap**: İstediğiniz cevabı eklersiniz, bot da yanıt verir.\n**/otorol-ayarla**: Otomatik rol ayarlarsınız.`)
      .setColor(0x00AEFF)
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({ text: `Komut isteyen: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    const msg = await interaction.editReply({
      embeds: [yardımEmbed],
      components: [menu, buttonRow]
    });
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 60_000
    });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id)
        return i.reply({ content: 'Bu menü sana ait değil!', ephemeral: true });

      let embed = new EmbedBuilder().setColor(0x00AEFF);

      switch (i.values[0]) {
        case 'eglence':
          embed
            .setTitle('🎮 Eğlence Komutları')
            .setDescription([
              '`/adam-asmaca`',
              '`/afk`',
              '`/aranıyor`',
              '`/aşk-ölçer`',
              '`/avatar`',
              '`/matematik`',
              '`/zar-at`'
            ].join('\n'));
          break;

        case 'moderasyon':
          embed
            .setTitle('🛠️ Moderasyon Komutları')
            .setDescription([
              '`/ban`', '`/ban-affı`', '`/ban-list`',
              '`/karaliste-ekle`', '`/karaliste-çıkar`', '`/karaliste-kontrol`', '`/karaliste-sırala`',
              '`/rol ver`', '`/rol al`', '`/rol bilgi`',
              '`/mute ver`', '`/mute al`',
              '`/toplu-ban`', '`/unban`',
              '`/uyarı ver`', '`/uyarı al`'
            ].join('\n'));
          break;

        case 'sistem':
          embed
            .setTitle('⚙️ Sistem Komutları')
            .setDescription([
              '`/bakim-aç`', '`/bakim-kapat`',
              '`/caps-engel`', '`/küfür-engel`', '`/spam-engel`',
              '`/oto-tag`', '`/oto-tag-sıfırla`',
              '`/otorol-ayarla`', '`/otorol-sıfırla`',
              '`/yasaklı-kelime-ayarla`', '`/yasaklı-kelime-sıfırla`',
              '`/mod-log`', '`/mod-log-sıfırla`',
              '`/giriş-çıkış`', '`/giriş-çıkış-sıfırla`',
              '`/etiket-kanal`', '`/durum-rol`',
              '`/buton-rol`'
            ].join('\n'));
          break;

        case 'cekilis':
          embed
            .setTitle('🎉 Çekiliş & Etkileşim')
            .setDescription([
              '`/çekiliş-başlat`', '`/çekiliş-panel`', '`/çekiliş-durdur`',
              '`/aşk-ölçer`', '`/otomatik-cevap`', '`/otomatik-cevap-sil`'
            ].join('\n'));
          break;

        case 'seviye_kayit':
          embed
            .setTitle('📈 Seviye & Kayıt')
            .setDescription([
              '`/kayıt erkek`', '`/kayıt kız`',
              '`/kayıt sistemi-ayarla`', '`/kayıt sistemi-sıfırla`',
              '`/seviye-sistemi-ayarla`', '`/seviye-sistemi-sıfırla`',
              '`/seviye-ver`', '`/seviyem`'
            ].join('\n'));
          break;

        case 'bilgi':
          embed
            .setTitle('🌐 Bilgi & Araç Komutları')
            .setDescription([
              '`/ping`', '`/sil`', '`/banner`', '`/kullanıcı-bilgi`',
              '`/kurucu`', '`/hava-durumu`', '`/depremler`',
              '`/emoji-ekle`', '`/emoji-çek`', '`/emojiler`',
              '`/sunucu-avatar`', '`/sunucu-banner`', '`/sunucu-bilgi`',
              '`/restart`', '`/davetlerim`',
              '`/davet-sistemi`', '`/davet-sistemi-sıfırla`',
              '`/destek-sistemi`', '`/destek-sistemi-sıfırla`',
              '`/hesap-koruma`',
              '`/bom-kanal`', '`/bom-kanal-sıfırla`',
              '`/sayısaymaca-kanal`', '`/sayısaymaca-kanal-sıfırla`',
              '`/medya-kanalı`', '`/medya-kanalı-sıfırla`',
              '`/mute sistemi-ayarla`', '`/mute sistemi-sıfırla`',
              '`/uyarı sistemi-ayarla`', '`/uyarı sistrmi-sıfırla`',
              '`/boost-kanal`', '`/boost-kanalı-sıfırla`'
            ].join('\n'));
          break;
      }
      await i.update({ embeds: [embed], components: [menu, buttonRow] });
    });

    collector.on('end', () => {
      menu.components[0].setDisabled(true);
      msg.edit({ components: [menu, buttonRow] }).catch(() => { });
    });
  }
};
