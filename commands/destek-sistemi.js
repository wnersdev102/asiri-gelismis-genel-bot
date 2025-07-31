const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('destek-sistemi')
    .setDescription('Destek sistemi kurar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option.setName('destek-kanal')
        .setDescription('Destek menüsünün gönderileceği kanal')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('yetkili-rol')
        .setDescription('Destek biletlerini görecek yetkili rolü')
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('destek-log')
        .setDescription('Kapatılan bilet loglarının gönderileceği kanal')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const destekKanal = interaction.options.getChannel('destek-kanal');
    const yetkiliRol = interaction.options.getRole('yetkili-rol');
    const logKanal = interaction.options.getChannel('destek-log');

    db.set(`destek_yetkili_${interaction.guild.id}`, yetkiliRol.id);
    db.set(`destek_log_${interaction.guild.id}`, logKanal.id);

    const embed = new EmbedBuilder()
      .setTitle('🎫 Destek Sistemi')
      .setDescription('Aşağıdaki menüden destek talebi oluşturabilirsin.')
      .setColor(0x00AEFF);

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('destek_menu')
        .setPlaceholder('Bir destek türü seçin')
        .addOptions(
          { label: 'Genel Destek', value: 'genel', description: 'Genel yardım al.' },
          { label: 'Şikayet', value: 'sikayet', description: 'Bir şeyi şikayet et.' },
          { label: 'Başvuru', value: 'basvuru', description: 'Bir başvuru yap.' }
        )
    );

    await destekKanal.send({ embeds: [embed], components: [menu] });
    await interaction.reply({ content: '✅ Destek sistemi kuruldu.', ephemeral: true });

    client.on(Events.InteractionCreate, async i => {
      if (i.isStringSelectMenu() && i.customId === 'destek_menu') {
        const destekTip = i.values[0];
        const kanalAd = `destek-${i.user.username}`.replace(/ /g, '-').toLowerCase();

        const kanal = await i.guild.channels.create({
          name: kanalAd,
          type: ChannelType.GuildText,
          parent: i.channel.parentId || null,
          permissionOverwrites: [
            { id: i.guild.roles.everyone.id, deny: ['ViewChannel'] },
            { id: i.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
            { id: db.get(`destek_yetkili_${i.guild.id}`), allow: ['ViewChannel', 'SendMessages'] },
          ]
        });

        const kapanis = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('destek_kapat')
            .setLabel('Bileti Kapat')
            .setEmoji('🔒')
            .setStyle(ButtonStyle.Danger)
        );

        await kanal.send({
          content: `<@${i.user.id}> | <@&${db.get(`destek_yetkili_${i.guild.id}`)}>`,
          embeds: [
            new EmbedBuilder()
              .setTitle('🎫 Destek Talebi Açıldı')
              .setDescription(`Konu: **${destekTip}**`)
              .setColor(0x2ecc71)
          ],
          components: [kapanis]
        });

        await i.reply({ content: `✅ Talebin açıldı: <#${kanal.id}>`, ephemeral: true });
      }

      if (i.isButton() && i.customId === 'destek_kapat') {
        await i.channel.send('🔒 Bilet kapatılıyor...');

        const logKanal = i.guild.channels.cache.get(db.get(`destek_log_${i.guild.id}`));
        if (logKanal) {
          const logEmbed = new EmbedBuilder()
            .setTitle('📪 Bilet Kapatıldı')
            .setDescription(`Kapatan: <@${i.user.id}>\nKanal: \`${i.channel.name}\``)
            .setColor(0xe74c3c)
            .setTimestamp();

          await logKanal.send({ embeds: [logEmbed] });
        }

        setTimeout(() => {
          i.channel.delete().catch(() => null);
        }, 3000);
      }
    });
  }
};
