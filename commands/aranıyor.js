const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('aranıyor')
    .setDescription('Birisini ARANIYOR olarak gösterir!'),

  async execute(interaction) {
    await interaction.deferReply();
    const width = 700;
    const height = 250;
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#8B0000');
    gradient.addColorStop(1, '#FF4500');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    const avatarURL = interaction.user.displayAvatarURL({ extension: 'png', size: 256 });
    const avatar = await Canvas.loadImage(avatarURL);
    const avatarX = 50;
    const avatarY = 25;
    const avatarSize = 200;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#FFFFFF';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2 - 8, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 7;
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🔍 ARANIYOR!', width - 300, height / 2 - 20);
    ctx.font = 'bold 40px Arial';
    ctx.fillText(interaction.user.tag, width - 300, height / 2 + 50);
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'aranıyor.png' });
    await interaction.editReply({ files: [attachment] });
  }
};
