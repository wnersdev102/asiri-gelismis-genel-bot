const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('otomatik-cevap')
    .setDescription('Otomatik cevap ekle')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('otomatik_cevap_ekle')
      .setEmoji('📝') // reis başka emoji bulamadım
      .setTitle('Otomatik Cevap Ekle');

    const kelimeInput = new TextInputBuilder()
      .setCustomId('kelime')
      .setLabel('Tetikleyici Kelime')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const cevapInput = new TextInputBuilder()
      .setCustomId('cevap')
      .setLabel('Botun Vereceği Cevap')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row1 = new ActionRowBuilder().addComponents(kelimeInput);
    const row2 = new ActionRowBuilder().addComponents(cevapInput);

    modal.addComponents(row1, row2);
    await interaction.showModal(modal);
  }
};
