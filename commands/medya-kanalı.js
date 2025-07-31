const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('medya-kanalı')
    .setDescription('Sadece medya içeriği için kullanılacak kanalı ayarlar.')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Medya kanalı olarak ayarlanacak kanal')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const kanal = interaction.options.getChannel('kanal');
    if (kanal.type !== 0) {
      return interaction.reply({
        content: '❌ Sadece yazı kanalı seçebilirsin.',
        ephemeral: true
      });
    }

    db.set(`medyaKanal_${interaction.guild.id}`, kanal.id);

    const embed = new EmbedBuilder()
      .setTitle('🖼️ Medya Kanalı Ayarlandı!')
      .setDescription(`📸 Medya kanalı başarıyla ${kanal} olarak ayarlandı.\nKullanıcılar burada yalnızca resim, video veya gif paylaşmalı.`)
      .setColor('Blue')
      .setFooter({ text: `${interaction.user.username} tarafından ayarlandı`, iconURL: interaction.user.displayAvatarURL() });

    return interaction.reply({ embeds: [embed] });
  }
};
