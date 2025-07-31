const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oto-tag')
    .setDescription('Sunucuya katılanların isminin sonuna otomatik tag ekler.')
    .addStringOption(option =>
      option.setName('tag')
        .setDescription('Eklenecek tag (örn: | Tag)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const tag = interaction.options.getString('tag').trim();

    if (tag.length > 15) {
      return interaction.reply({ content: '❌ Tag çok uzun! Maksimum 15 karakter olabilir.', ephemeral: true });
    }

    croxydb.set(`otoTag_${interaction.guild.id}`, tag);

    return interaction.reply({ content: `✅ Oto-tag başarıyla "${tag}" olarak ayarlandı. Sunucuya katılanların isimlerinin sonuna otomatik eklenecek.`, ephemeral: false });
  }
};
