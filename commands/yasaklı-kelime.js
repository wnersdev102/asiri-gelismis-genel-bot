const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yasaklı-kelime')
    .setDescription('Yasaklı kelimeleri ayarlamanızı sağlar.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('ayarla')
        .setDescription('Yasaklı kelime ekler.')
        .addStringOption(option => option.setName('kelime').setDescription('Yasaklanacak kelimeyi girin').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('sıfırla')
        .setDescription('Tüm yasaklı kelimeleri sıfırlar.')),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'ayarla') {
      const kelime = interaction.options.getString('kelime').toLowerCase();
      let yasakliKelimeListesi = db.get(`yasakliKelime.${interaction.guild.id}`);
      if (!yasakliKelimeListesi) {
        yasakliKelimeListesi = [];
      }

      if (yasakliKelimeListesi.includes(kelime)) {
        return interaction.reply({
          content: `Bu kelime zaten yasaklı kelimeler arasında: \`${kelime}\``,
          ephemeral: true
        });
      }

      yasakliKelimeListesi.push(kelime);
      db.set(`yasakliKelime.${interaction.guild.id}`, yasakliKelimeListesi);
      const embed = new EmbedBuilder()
        .setTitle('Yasaklı Kelime Eklendi!')
        .setDescription(`\`${kelime}\` kelimesi yasaklı kelimeler listesine eklendi.`)
        .setColor(0x57F287)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'sıfırla') {
      db.delete(`yasakliKelime.${interaction.guild.id}`);
      const embed = new EmbedBuilder()
        .setTitle('Yasaklı Kelimeler Sıfırlandı!')
        .setDescription('Tüm yasaklı kelimeler başarıyla sıfırlandı.')
        .setColor(0xFF0000)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }
  },
};
