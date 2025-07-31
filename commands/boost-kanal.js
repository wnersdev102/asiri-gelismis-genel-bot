const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('boost-kanal')
    .setDescription('Boost log kanalını ayarla')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Boost loglarının gönderileceği kanal')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
  async execute(interaction) {
    const kanal = interaction.options.getChannel('kanal');
    db.set(`boostKanal_${interaction.guild.id}`, kanal.id);

    return interaction.reply({
      content: `✅ Boost kanalı başarıyla ${kanal} olarak ayarlandı!`,
      ephemeral: false // istersen true :)
    });
  }
};
