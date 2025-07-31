const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emoji-çek')
    .setDescription('Başka bir sunucudaki tüm emojileri bu sunucuya çeker.')
    .addStringOption(option =>
      option.setName('sunucu-id')
        .setDescription('Emojilerini çekmek istediğiniz sunucunun ID\'sini girin.')
        .setRequired(true)),

  async execute(interaction) {
    const serverId = interaction.options.getString('sunucu-id');
    
    try {
      const guild = await interaction.client.guilds.fetch(serverId);
      const emojis = guild.emojis.cache;

      if (emojis.size === 0) {
        return interaction.reply({
          content: 'Bu sunucuda hiç emoji bulunmamaktadır.',
          ephemeral: true
        });
      }

      if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
        return interaction.reply({
          content: 'Bu sunucuya emoji ekleme yetkim yok.',
          ephemeral: true
        });
      }

      for (const [id, emoji] of emojis) {
        try {
          await interaction.guild.emojis.create(emoji.url, emoji.name);
        } catch (error) {
          console.error(`Emoji eklenemedi: ${emoji.name}`, error);
        }
      }

      return interaction.reply({
        content: `${emojis.size} emoji başarıyla sunucunuza eklendi!`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Sunucuya bağlanırken bir hata oluştu:', error);
      return interaction.reply({
        content: 'Verilen sunucu ID\'sine bağlanılamadı. Lütfen geçerli bir sunucu ID\'si girin.',
        ephemeral: true
      });
    }
  }
};
