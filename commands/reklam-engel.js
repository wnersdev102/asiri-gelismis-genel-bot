const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('croxydb');
const reklamlar = require('../reklamlar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reklam-engel')
    .setDescription('Reklam engel sistemini açar veya kapatır.')
    .addStringOption(option =>
      option.setName('durum')
        .setDescription('Sistemi açmak mı yoksa kapatmak mı istiyorsunuz?')
        .setRequired(true)
        .addChoices(
          { name: 'Açık', value: 'açık' },
          { name: 'Kapalı', value: 'kapalı' }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    const durum = interaction.options.getString('durum');
    const guildId = interaction.guild.id;

    if (durum === 'açık') {
      db.set(`reklamEngel_${guildId}`, true);

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle('Reklam Engel Açıldı')
        .setDescription(`Artık mesajlarda şu kelimeler engellenecek:\n\n\`${reklamlar.join('`, `')}\``)
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      db.delete(`reklamEngel_${guildId}`);

      const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle('Reklam Engel Kapatıldı')
        .setDescription('Reklam mesaj engelleme sistemi devre dışı bırakıldı.')
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
