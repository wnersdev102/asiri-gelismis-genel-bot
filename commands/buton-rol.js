const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buton-rol')
    .setDescription('Belirtilen roller için etkileşimli buton oluşturur.')
    .addStringOption(opt =>
      opt.setName('roller')
        .setDescription('Rolleri boşlukla ayır (örn: @Üye @VIP)')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('buton-renk')
        .setDescription('Buton rengi: Primary, Success, Danger, Secondary')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('buton-emoji')
        .setDescription('Buton emojisi (isteğe bağlı)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const { guild, options, user } = interaction;
    const rollerInput = options.getString('roller').trim();
    const renkInput = options.getString('buton-renk').toLowerCase();
    const emojiInput = options.getString('buton-emoji')?.trim();

    const styleMap = {
      primary: ButtonStyle.Primary,
      success: ButtonStyle.Success,
      danger: ButtonStyle.Danger,
      secondary: ButtonStyle.Secondary
    };
    const style = styleMap[renkInput];
    if (!style) {
      return interaction.reply({ content: '❌ Geçersiz buton rengi! Geçerli değerler: `Primary`, `Success`, `Danger`, `Secondary`', ephemeral: true });
    }

    const rolList = rollerInput.split(/\s+/).map(nameOrId =>
      guild.roles.cache.get(nameOrId) || guild.roles.cache.find(r => r.name === nameOrId)
    ).filter(r => r && r.editable);

    if (!rolList.length) {
      return interaction.reply({ content: '❌ Geçerli ve yönetilebilir rol bulunamadı.', ephemeral: true });
    }

    const customId = `rolButon_${interaction.id}`;
    croxydb.set(customId, rolList.map(r => r.id));

    const button = new ButtonBuilder()
      .setCustomId(customId)
      .setLabel('Rol Al / Bırak')
      .setEmoji('🎭')
      .setStyle(style);
    if (emojiInput) button.setEmoji(emojiInput);

    const row = new ActionRowBuilder().addComponents(button);
    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Wners | Buton Rol Sistemi', iconURL: guild.iconURL() })
      .setDescription(`📌 Aşağıdaki butona basarak belirtilen rolleri alabilir veya kaldırabilirsiniz.\n\n${rolList.map(r => `> 🎯 ${r}`).join('\n')}`)
      .setColor(style === ButtonStyle.Success ? 0x57F287 : style === ButtonStyle.Danger ? 0xED4245 : style === ButtonStyle.Primary ? 0x5865F2 : 0x747F8D)
      .setFooter({ text: `Oluşturan: ${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
  }
};
