const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emoji-ekle')
    .setDescription('Sunucuya emoji ekler.')
    .addStringOption(option =>
      option.setName('isim')
        .setDescription('Eklemek istediğiniz emojinin ismini girin.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Eklemek istediğiniz emojinin URL\'sini girin.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const emojiName = interaction.options.getString('isim');
    const emojiURL = interaction.options.getString('url');

    try {
      const guild = interaction.guild;
      const emoji = await guild.emojis.create(emojiURL, emojiName);

      const embed = new EmbedBuilder()
        .setTitle('Emoji Başarıyla Eklendi!')
        .setDescription(`Emoji başarıyla **${emoji.name}** adıyla sunucunuza eklendi. \nEmoji: ${emoji}`)
        .setColor(0x00AEFF)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: 'Bir hata oluştu. Lütfen geçerli bir emoji URL\'si girdiğinizden emin olun.',
        ephemeral: true
      });
    }
  }
};
