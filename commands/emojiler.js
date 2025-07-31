const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emojiler')
    .setDescription('Sunucudaki tüm emojileri listeler.'),

  async execute(interaction) {
    const guild = interaction.guild;
    const emojis = guild.emojis.cache;

    if (emojis.size === 0) {
      return interaction.reply({
        content: 'Sunucuda hiç emoji bulunmamaktadır.',
        ephemeral: true
      });
    }

    let emojiList = '';
    emojis.forEach(emoji => {
      emojiList += `${emoji} - \`:${emoji.name}:\`\n`;
    });


    const embed = new EmbedBuilder()
      .setTitle('Sunucudaki Emojiler')
      .setDescription(emojiList)
      .setColor(0x00AEFF)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
