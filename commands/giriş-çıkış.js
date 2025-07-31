const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType
} = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giriş-çıkış')
    .setDescription('Sunucudaki giriş ve çıkış kanallarını ayarlayın.')
    .addChannelOption(option =>
      option.setName('giris-kanal')
        .setDescription('Giriş kanalı seçin.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('cikis-kanal')
        .setDescription('Çıkış kanalı seçin.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    const girisKanal = interaction.options.getChannel('giris-kanal');
    const cikisKanal = interaction.options.getChannel('cikis-kanal');

    // Güvenlik amacıyla tekrar kontrol (aşağıdaki addChannelTypes zaten filtreliyor)
    if (girisKanal.type !== ChannelType.GuildText || cikisKanal.type !== ChannelType.GuildText) {
      return interaction.reply({
        content: '❌ Lütfen sadece metin kanalları seçin!',
        ephemeral: true
      });
    }

    croxydb.set(`girisCikis.${interaction.guild.id}`, {
      girisKanal: girisKanal.id,
      cikisKanal: cikisKanal.id
    });

    const embed = new EmbedBuilder()
      .setTitle('✅ Giriş/Çıkış Kanalları Ayarlandı')
      .setDescription(
        `📥 Giriş kanalı: <#${girisKanal.id}>\n📤 Çıkış kanalı: <#${cikisKanal.id}>`
      )
      .setColor(0x57F287)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
