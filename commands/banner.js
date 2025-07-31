const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kullanıcı-banner')
    .setDescription('Kullanıcı bannerını gösterir.'),

  async execute(interaction) {
    const user = interaction.user;

    const bannerUrl = user.bannerURL({ dynamic: true, size: 2048 });

    if (!bannerUrl) {
      return interaction.reply('Bu kullanıcının bir bannerı yok.');
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.username} Bannerı`)
      .setImage(bannerUrl)
      .setColor(0x00AEFF)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Bannerı Yeni Sekmede Aç')
        .setStyle(ButtonStyle.Link)
        .setURL(bannerUrl),

      new ButtonBuilder()
        .setLabel('Profilime Git')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/users/${user.id}`) // link eleme ha
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
