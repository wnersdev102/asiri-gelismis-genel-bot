const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('otorol-ayarla')
    .setDescription('Sunucuya yeni üye katıldığında otomatik rol ataması yapar.')
    .addRoleOption(option =>
      option.setName('üye-rol')
        .setDescription('Üyeye atanacak rolü seçin.')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('bot-rol')
        .setDescription('Botun rolünü belirleyin (mesaj kanalı vb.)')
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Botun mesaj atacağı kanalı belirleyin.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    const uyeRol = interaction.options.getRole('üye-rol');
    const botRol = interaction.options.getRole('bot-rol');
    const kanal = interaction.options.getChannel('kanal');


    if (!uyeRol || !botRol || !kanal) {
      return interaction.reply({
        content: '❌ Lütfen geçerli seçenekler giriniz.',
        ephemeral: true,
      });
    }

    croxydb.set(`otorol.${interaction.guild.id}`, {
      uyeRol: uyeRol.id,
      botRol: botRol.id,
      kanal: kanal.id,
    });

    const embed = new EmbedBuilder()
      .setTitle('✅ Otorol Ayarları Başarıyla Yapılandırıldı')
      .setDescription(`
        Yeni üyeye **${uyeRol.name}** rolü verilecek.
        Bot için **${botRol.name}** rolü atanacak.
        Bot mesajlarını **${kanal.name}** kanalında gönderecek.
      `)
      .setColor(0x57F287)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
