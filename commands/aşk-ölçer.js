const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('aşk-ölçer')
    .setDescription('İki kullanıcı arasındaki aşkı ölçer')
    .addUserOption(option =>
      option.setName('birinci')
        .setDescription('Birinci kullanıcı')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('ikinci')
        .setDescription('İkinci kullanıcı')
        .setRequired(true)),
  
  async execute(interaction) {
    const user1 = interaction.options.getUser('birinci');
    const user2 = interaction.options.getUser('ikinci');

    const lovePercent = Math.floor(Math.random() * 101);

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('https://cdn.pixabay.com/photo/2017/08/07/14/43/heart-2607513_960_720.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = '40px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${user1.username} ❤️ ${user2.username}`, 50, 80);

    const heart = await Canvas.loadImage('https://cdn-icons-png.flaticon.com/512/833/833472.png');
    ctx.drawImage(heart, 50, 100, 100, 100);

    ctx.font = '50px Arial';
    ctx.fillStyle = '#ff0055';
    ctx.fillText(`${lovePercent}%`, 400, 150);

    const attachment = {
      attachment: canvas.toBuffer(),
      name: 'ask-olcer.png'
    };

    const embed = new EmbedBuilder()
      .setTitle('💖 Aşk Ölçer')
      .setDescription(`${user1} ve ${user2} arasındaki aşk oranı:`)
      .setColor('#ff0055')
      .setImage('attachment://ask-olcer.png');

    await interaction.reply({ embeds: [embed], files: [attachment] });
  }
};
