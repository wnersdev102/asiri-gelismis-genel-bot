const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sayısaymaca-ayarla')
    .setDescription('Sayısaymaca oyunu için kanal ayarlar')
    .addChannelOption(option =>
      option
        .setName('kanal')
        .setDescription('Sayısaymaca oyunu için kanal seçin')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const kanal = interaction.options.getChannel('kanal');
    const guildId = interaction.guild.id;

    db.set(`sayisaymacaKanal_${guildId}`, kanal.id);

    return interaction.reply({ content: `✅ Sayısaymaca kanalı başarıyla ${kanal} olarak ayarlandı!`, ephemeral: true });
  }
};
