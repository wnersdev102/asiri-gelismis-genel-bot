const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('davet-sistemi')
    .setDescription('Davet sistemi log kanalını ayarlar.')
    .addChannelOption(option =>
      option.setName('log-kanal')
        .setDescription('Davet loglarının gönderileceği kanal')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.PublicThread)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({ content: '🚫 Bu komutu kullanmak için **Sunucuyu Yönet** yetkisine sahip olmalısın!', ephemeral: true });
    }

    const kanal = interaction.options.getChannel('log-kanal');

    if (!kanal.isTextBased()) {
      return interaction.reply({ content: '❌ Lütfen geçerli bir metin kanalı seç!', ephemeral: true });
    }

    croxydb.set(`davetLog_${interaction.guild.id}`, kanal.id);

    await interaction.reply({ content: `✅ Davet sistemi log kanalı başarıyla ${kanal} olarak ayarlandı!`, ephemeral: false });
  }
};
