const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hesap-koruma')
    .setDescription('Sunucuda hesap koruma sistemini açar veya kapatır ve log kanalını ayarlar.')
    .addStringOption(option =>
      option
        .setName('durum')
        .setDescription('Hesap koruma sistemini aç veya kapat')
        .setRequired(true)
        .addChoices(
          { name: 'Açık', value: 'acik' },
          { name: 'Kapalı', value: 'kapali' }
        )
    )
    .addChannelOption(option =>
      option
        .setName('log-kanal')
        .setDescription('Hesap koruma loglarının gönderileceği kanal')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const durum = interaction.options.getString('durum');
    const logKanal = interaction.options.getChannel('log-kanal');
    if (!logKanal.isTextBased()) {
      return interaction.reply({ content: '❌ Lütfen geçerli bir metin kanalı seçin.', ephemeral: true });
    }

    const sunucuId = interaction.guild.id;


    croxydb.set(`hesapKoruma_${sunucuId}`, {
      durum: durum === 'acik',
      logKanal: logKanal.id,
    });

    return interaction.reply({
      content: `✅ Hesap koruma sistemi **${durum === 'acik' ? 'açıldı' : 'kapatıldı'}**.\nLog kanalı: ${logKanal}`,
      ephemeral: false,
    });
  },
};
