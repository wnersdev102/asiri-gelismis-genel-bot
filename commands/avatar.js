const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Kullanıcı avatarını gösterir.'),

  async execute(interaction) {
    const user = interaction.user;

    const embed = new EmbedBuilder()
      .setTitle(`${user.username} Avatarı`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setColor(0x00AEFF)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Avatarı Yeni Sekmede Aç')
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ dynamic: true, size: 2048 })),
      
      new ButtonBuilder()
        .setLabel('Profilime Git')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/users/${user.id}`) // link eleme ha
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
