const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('boost-kanal-sıfırla')
    .setDescription('🚫 Boost log kanalını sıfırlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const kanalVar = db.has(`boostKanal_${interaction.guild.id}`);
    if (!kanalVar) {
      return interaction.reply({
        content: '❌ Boost kanalı zaten ayarlanmamış.',
        ephemeral: true
      });
    }

    db.delete(`boostKanal_${interaction.guild.id}`);

    const embed = new EmbedBuilder()
      .setTitle('✅ Başarıyla Sıfırlandı')
      .setDescription('Boost log kanalı başarıyla sıfırlandı.')
      .setColor('Red');

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
