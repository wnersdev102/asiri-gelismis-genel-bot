const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mod-log')
    .setDescription('Sunucu için moderasyon log kanalını ayarla.')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Mod loglarının gideceği kanal')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const kanal = interaction.options.getChannel('kanal');
    if (!kanal.isTextBased()) {
      return interaction.reply({ content: '❌ Lütfen sadece metin kanalı seçiniz.', ephemeral: true });
    }
    croxydb.set(`modLog_${interaction.guild.id}`, kanal.id);

    const embed = new EmbedBuilder()
      .setTitle('✅ Moderasyon Log Kanalı Ayarlandı')
      .setDescription(`Mod logları bundan sonra ${kanal} kanalına gönderilecek.`)
      .setColor('#00FF00')
      .setTimestamp()
      .setFooter({ text: `Mod-Log Sistemi | ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
