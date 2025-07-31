const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rol')
    .setDescription('Rol yönetimi komutları.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('ver')
        .setDescription('Bir kullanıcıya rol ver.')
        .addUserOption(option =>
          option.setName('kullanıcı')
            .setDescription('Rol verilecek kullanıcıyı seçin.')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option.setName('rol')
            .setDescription('Verilecek rolü seçin.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('al')
        .setDescription('Bir kullanıcıdan rol alın.')
        .addUserOption(option =>
          option.setName('kullanıcı')
            .setDescription('Rolü alınacak kullanıcıyı seçin.')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option.setName('rol')
            .setDescription('Alınacak rolü seçin.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('bilgi')
        .setDescription('Rol hakkında bilgi alın.')
        .addRoleOption(option =>
          option.setName('rol')
            .setDescription('Bilgi alınacak rolü seçin.')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'ver') {
      const kullanıcı = interaction.options.getUser('kullanıcı');
      const rol = interaction.options.getRole('rol');

      const member = await interaction.guild.members.fetch(kullanıcı.id);

      if (member.roles.cache.has(rol.id)) {
        return interaction.reply({
          content: `${kullanıcı.tag} zaten ${rol.name} rolüne sahip.`,
          ephemeral: true
        });
      }

      await member.roles.add(rol);
      return interaction.reply({
        content: `${kullanıcı.tag} adlı kullanıcıya başarıyla ${rol.name} rolü verildi.`,
        ephemeral: true
      });
    }

    if (subcommand === 'al') {
      const kullanıcı = interaction.options.getUser('kullanıcı');
      const rol = interaction.options.getRole('rol');

      const member = await interaction.guild.members.fetch(kullanıcı.id);

      if (!member.roles.cache.has(rol.id)) {
        return interaction.reply({
          content: `${kullanıcı.tag} adlı kullanıcıda ${rol.name} rolü yok.`,
          ephemeral: true
        });
      }

      await member.roles.remove(rol);
      return interaction.reply({
        content: `${kullanıcı.tag} adlı kullanıcıdan başarıyla ${rol.name} rolü alındı.`,
        ephemeral: true
      });
    }

    if (subcommand === 'bilgi') {
      const rol = interaction.options.getRole('rol');

      const embed = new EmbedBuilder()
        .setTitle(`${rol.name} Rolü Hakkında Bilgi`)
        .setColor(rol.color)
        .addFields(
          { name: 'Rol ID', value: rol.id },
          { name: 'Rol Rengi', value: rol.color.toString() },
          { name: 'Rol Oluşturulma Tarihi', value: rol.createdAt.toDateString() },
          { name: 'Roldeki Üyeler', value: `${rol.members.size} kişi` }
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
