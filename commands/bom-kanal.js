const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

const activeGames = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bom-kanal')
    .setDescription('Belirtilen kanalda Bom oyununu başlatır.')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Bom oyununun oynanacağı kanal')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');

    if (activeGames.has(channel.id)) {
      return interaction.reply({ content: 'Bu kanalda zaten bir Bom oyunu aktif!', ephemeral: true });
    }
    activeGames.set(channel.id, {
      currentNumber: 1,
      players: [],
      lastPlayerId: null,
      gameChannel: channel,
    });

    await interaction.reply({ content: `${channel} kanalında Bom oyunu başladı! Sıra sizde, lütfen sırayla 1, 2, 3... yazın. 5, 10, 15, 20’de "bom" yazmayı unutmayın! Başkalarının sırasını çalmayın.`, ephemeral: true });
  },

  activeGames,
};
