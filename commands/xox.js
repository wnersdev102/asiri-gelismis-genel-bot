const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js');

const games = new Map();

function createBoardButtons(board) {
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const actionRow = new ActionRowBuilder();
    for (let j = 0; j < 3; j++) {
      const idx = i * 3 + j;
      const val = board[idx];
      actionRow.addComponents(
        new ButtonBuilder()
          .setCustomId(`xox_${idx}`)
          .setLabel(val === null ? '➖' : val)
          .setStyle(val === 'X' ? ButtonStyle.Danger : val === 'O' ? ButtonStyle.Success : ButtonStyle.Secondary)
          .setDisabled(val !== null)
      );
    }
    rows.push(actionRow);
  }
  return rows;
}

function checkWin(board, player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]    
  ];
  return wins.some(pattern => pattern.every(i => board[i] === player));
}

function checkDraw(board) {
  return board.every(cell => cell !== null);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xox')
    .setDescription('Tic Tac Toe oyunu başlatır.')
    .addUserOption(option => option
      .setName('ikincioyuncu')
      .setDescription('Oyun oynayacağın kişi')
      .setRequired(true)
    ),

  async execute(interaction) {
    const player1 = interaction.user;
    const player2 = interaction.options.getUser('ikincioyuncu');

    if (player2.bot) return interaction.reply({ content: 'Botlarla oynayamazsın!', ephemeral: true });
    if (player2.id === player1.id) return interaction.reply({ content: 'Kendinle oynayamazsın!', ephemeral: true });
    if (games.has(player1.id) || games.has(player2.id)) {
      return interaction.reply({ content: 'Zaten devam eden bir oyun var.', ephemeral: true });
    }
    const board = Array(9).fill(null);
    let turn = player1.id;
    let turnSymbol = 'X';

    const embed = new EmbedBuilder()
      .setTitle('🎲 Tic Tac Toe')
      .setDescription(`Sıra: <@${turn}> (${turnSymbol})\n\nOyunu kazanmak için 3'ü bir araya getir!`)
      .setColor('#5865F2');

    const message = await interaction.reply({
      embeds: [embed],
      components: createBoardButtons(board),
      fetchReply: true
    });

    games.set(player1.id, { board, turn, player1, player2, message });
    games.set(player2.id, { board, turn, player1, player2, message });
    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120000
    });

    collector.on('collect', async i => {
      if (![player1.id, player2.id].includes(i.user.id)) {
        return i.reply({ content: 'Sen oyuncu değilsin!', ephemeral: true });
      }
      if (i.user.id !== turn) {
        return i.reply({ content: `Sıra sende değil! Sıra <@${turn}>` , ephemeral: true });
      }

      const idx = parseInt(i.customId.split('_')[1]);
      if (board[idx] !== null) {
        return i.reply({ content: 'Bu kare zaten seçili!', ephemeral: true });
      }
      board[idx] = turnSymbol;
      if (checkWin(board, turnSymbol)) {
        const winEmbed = new EmbedBuilder()
          .setTitle('🎉 Oyun Bitti!')
          .setDescription(`<@${turn}> (${turnSymbol}) kazandı!`)
          .setColor('#57F287');

        await i.update({
          embeds: [winEmbed],
          components: createBoardButtons(board).map(row => row.setComponents(row.components.map(btn => btn.setDisabled(true))))
        });
        games.delete(player1.id);
        games.delete(player2.id);
        collector.stop();
        return;
      }
      if (checkDraw(board)) {
        const drawEmbed = new EmbedBuilder()
          .setTitle('🤝 Oyun Berabere!')
          .setDescription('Kimse kazanamadı, iyi mücadele!')
          .setColor('#FAA61A');

        await i.update({
          embeds: [drawEmbed],
          components: createBoardButtons(board).map(row => row.setComponents(row.components.map(btn => btn.setDisabled(true))))
        });

        games.delete(player1.id);
        games.delete(player2.id);
        collector.stop();
        return;
      }
      if (turn === player1.id) {
        turn = player2.id;
        turnSymbol = 'O';
      } else {
        turn = player1.id;
        turnSymbol = 'X';
      }

      const newEmbed = new EmbedBuilder()
        .setTitle('🎲 Tic Tac Toe')
        .setDescription(`Sıra: <@${turn}> (${turnSymbol})\n\nOyunu kazanmak için 3'ü bir araya getir!`)
        .setColor('#5865F2');

      await i.update({
        embeds: [newEmbed],
        components: createBoardButtons(board)
      });
    });

    collector.on('end', () => {
      if (games.has(player1.id)) {
        games.delete(player1.id);
        games.delete(player2.id);
      }
    });
  }
};
