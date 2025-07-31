const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('toplu-ban')
    .setDescription('Botun bulunduğu tüm sunucularda belirtilen kullanıcıyı banlar.')
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Banlanacak kullanıcı')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ Bu komutu kullanmak için **Yönetici** yetkisine sahip olmalısın.',
        ephemeral: true
      });
    }

    const user = interaction.options.getUser('kullanıcı');
    const client = interaction.client;

    let banlananSunucular = [];
    let banlanamayanSunucular = [];

    for (const [guildId, guild] of client.guilds.cache) {
      try {
        const member = await guild.members.fetch(user.id).catch(() => null);
        if (!member) continue;

        if (!guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
          banlanamayanSunucular.push(guild.name);
          continue;
        }

        await member.ban({ reason: `Toplu ban komutu kullanıldı.` });
        banlananSunucular.push(guild.name);
      } catch (err) {
        banlanamayanSunucular.push(guild.name);
      }
    }

    const embed = new EmbedBuilder()
      .setTitle('🔨 Toplu Ban Sonucu')
      .setColor('Red')
      .addFields(
        {
          name: '✅ Banlanan Sunucular',
          value: banlananSunucular.length
            ? banlananSunucular.map(s => `• ${s}`).join('\n')
            : 'Yok',
          inline: true
        },
        {
          name: '⚠️ Banlanamayan Sunucular',
          value: banlanamayanSunucular.length
            ? banlanamayanSunucular.map(s => `• ${s}`).join('\n')
            : 'Yok',
          inline: true
        }
      )
      .setFooter({ text: `İşlemi yapan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
