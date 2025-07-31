const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('etiket-kanal')
    .setDescription('Yeni katılanları etiketleyecek kanal ayarlarsınız.')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Yeni gelen üyeleri etiketleyecek kanalı seçin.')
        .setRequired(true)),

  async execute(interaction) {
    const kanal = interaction.options.getChannel('kanal');

    if (kanal.type !== 'GUILD_TEXT') {
      return interaction.reply({
        content: 'Lütfen bir metin kanalı seçin.',
        ephemeral: true
      });
    }
    const welcomeChannelId = kanal.id;
    db.set(`welcomeChannel_${interaction.guild.id}`, welcomeChannelId);

    const embed = new EmbedBuilder()
      .setTitle('Kanal Başarıyla Ayarlandı!')
      .setDescription(`Yeni katılan üyeler **${kanal}** kanalında etiketlenecek!`)
      .setColor(0x00AEFF)
      .setFooter({ text: 'Etiketleme Kanalı Ayarlandı', iconURL: interaction.client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  },
};
