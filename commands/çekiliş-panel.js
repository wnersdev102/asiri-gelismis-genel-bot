const {SlashCommandBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle,PermissionFlagsBits,} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('çekiliş-panel')
    .setDescription('Çekiliş başlatmak için panel gösterir.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),

  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('cekilis_baslat')
        .setLabel('🎉 Çekiliş Başlat')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: 'Aşağıdaki butona basarak çekiliş başlatabilirsiniz.',
      components: [row],
      ephemeral: true,
    });
  }
};
