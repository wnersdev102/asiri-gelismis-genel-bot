const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../ayarlar.json');
const db = require('croxydb');
const reklamlar = require('../reklamlar.json');
const kufurler = require('../kufurler.json');
const yasakliKelimeler = db.get('yasakliKelimeler') || [];

const activeGames = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const guildId = message.guild.id;
    const userId = message.author.id;
    const content = message.content.toLowerCase();
    const mesajXp = db.get(`ayar.mesajXp_${guildId}`) || 0;
    const logKanalId = db.get(`ayar.log_${guildId}`);

    if (mesajXp > 0) {
      let xp = db.get(`xp_${guildId}_${userId}`) || 0;
      let level = db.get(`level_${guildId}_${userId}`) || 1;

      xp += mesajXp;
      const neededXp = level * 100;

      if (xp >= neededXp) {
        xp -= neededXp;
        level++;
        if (logKanalId) {
          const logKanal = message.guild.channels.cache.get(logKanalId);
          if (logKanal) logKanal.send(`🎉 ${message.author} mesaj atarak seviye atladı! Yeni seviye: ${level}`);
        }
      }

      db.set(`xp_${guildId}_${userId}`, xp);
      db.set(`level_${guildId}_${userId}`, level);
    }
    const afkData = db.get(`afk_${userId}`);
    if (afkData) {
      db.delete(`afk_${userId}`);
      return message.reply(`🏷️ AFK modundan çıktın. Hoş geldin geri!`);
    }

    const mentionedMember = message.mentions.members.first();
    if (mentionedMember) {
      const afkInfo = db.get(`afk_${mentionedMember.id}`);
      if (afkInfo) {
        const elapsedMs = Date.now() - afkInfo.timestamp;
        const minutes = Math.floor(elapsedMs / 60000);
        const seconds = Math.floor((elapsedMs % 60000) / 1000);
        const sure = minutes > 0 ? `${minutes} dakika ${seconds} saniye` : `${seconds} saniye`;

        return message.reply(`🔕 **${mentionedMember.user.username}** şu anda AFK. Sebep: _${afkInfo.reason}_ - ${sure} önce ayarlandı.`);
      }
    }
    if (yasakliKelimeler.some(kelime => content.includes(kelime))) {
      try {
        await message.delete();
        return message.channel.send({
          content: `${message.author}, yasaklı kelime kullandınız!`
        }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
      } catch (err) {
        console.error('Yasaklı kelime mesajı silinemedi:', err);
      }
    }
    if (content === `<@${config.clientId}>` || content === `<@!${config.clientId}>`) {
      const embed = new EmbedBuilder()
        .setTitle('👋 Merhaba!')
        .setDescription(`Merhaba ben **${config.botAdi}**! Yardım için __/yardım__ komutunu kullanabilirsin.`)
        .setColor(0x00AEFF)
        .setFooter({
          text: 'Botunuz tarafından desteklenmektedir.',
          iconURL: message.client.user.displayAvatarURL()
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('Destek Sunucusu')
          .setStyle(ButtonStyle.Link)
          .setURL(config.destekSunucusu),
        new ButtonBuilder()
          .setLabel('Botu Davet Et')
          .setStyle(ButtonStyle.Link)
          .setURL(config.botDavet)
      );

      return message.reply({ embeds: [embed], components: [row] });
    }
    const cevaplar = {
      "sa": "as",
      "selam": "hoş geldin!",
      "naber": "iyiyim sen?",
      "günaydın": "sana da günaydın!",
      "iyi geceler": "tatlı rüyalar!"
    };

    if (cevaplar[content]) {
      return message.reply(cevaplar[content]);
    }
    const reklamEngelAktif = db.get(`reklamEngel_${guildId}`);
    if (reklamEngelAktif) {
      const isReklam = reklamlar.some(kelime => content.includes(kelime));
      if (isReklam) {
        try {
          await message.delete();
          return message.channel.send({
            content: `${message.author}, reklam yapmak yasaktır!`
          }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        } catch (err) {
          console.error('Reklam mesajı silinemedi:', err);
        }
      }
    }
    const kufurEngelAktif = db.get(`kufurEngel_${guildId}`);
    if (kufurEngelAktif) {
      const isKufur = kufurler.some(kelime => content.includes(kelime));
      if (isKufur) {
        try {
          await message.delete();
          return message.channel.send({
            content: `${message.author}, küfürlü dil kullanmak yasaktır!`
          }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        } catch (err) {
          console.error('Küfürlü mesaj silinemedi:', err);
        }
      }
    }
    const capsEngelAktif = db.get(`capsEngel_${guildId}`);
    if (capsEngelAktif && message.content === message.content.toUpperCase() && message.content.length > 5) {
      try {
        await message.delete();
        return message.channel.send({
          content: `${message.author}, büyük harf kullanımı yasaktır! Lütfen küçük harf kullanın.`
        }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
      } catch (err) {
        console.error('Mesaj silinemedi:', err);
      }
    }
    const spamEngelAktif = db.get(`spamEngel_${guildId}`);
    if (spamEngelAktif) {
      const spamMesajLimit = 5;
      const spamMesajlar = db.get(`spam_${userId}`) || [];
      const currentTime = Date.now();
      spamMesajlar.push(currentTime);
      db.set(`spam_${userId}`, spamMesajlar);

      const filteredMessages = spamMesajlar.filter(time => currentTime - time < 5000);
      if (filteredMessages.length > spamMesajLimit) {
        try {
          await message.delete();
          return message.channel.send({
            content: `${message.author}, çok fazla mesaj gönderdiniz! Lütfen spam yapmayın.`
          }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        } catch (err) {
          console.error('Spam mesajı silinemedi:', err);
        }
      }
    }
    const medyaKanalId = db.get(`medyaKanal_${guildId}`);
    if (medyaKanalId && message.channel.id === medyaKanalId) {
      const hasAttachment = message.attachments.size > 0;
      const isMediaLink = /(https?:\/\/.*\.(?:png|jpe?g|gif|mp4|webp|mov|avi|webm))/i.test(message.content);

      if (!hasAttachment && !isMediaLink) {
        try {
          await message.delete();
          const uyari = await message.channel.send({
            content: `${message.author}, bu kanal sadece **medya (resim, video, gif)** içindir. Lütfen metin mesajı atmayın.`
          });
          setTimeout(() => uyari.delete().catch(() => {}), 5000);
        } catch (err) {
          console.error('Medya kanalı mesajı silinemedi:', err);
        }
        return;
      }
    }
    const otomatikCevap = db.get(`otocevap_${guildId}_${content}`);
    if (otomatikCevap) {
      return message.reply(otomatikCevap).catch(() => {});
    }
    const game = activeGames.get(message.channel.id);
    if (!game) return;

    const { currentNumber, players, started } = game;
    if (!started) {
      game.started = true;
      activeGames.set(message.channel.id, game);
      if (logKanalId) {
        const logChannel = message.guild.channels.cache.get(logKanalId);
        if (logChannel) {
          logChannel.send(`🎮 Bom oyunu başladı! Sıra: 1`);
        }
      }
    }
    let expectedContent = '';
    if ([5, 10, 15, 20].includes(currentNumber)) {
      expectedContent = 'bom';
    } else {
      expectedContent = currentNumber.toString();
    }

    if (content !== expectedContent) {
      try {
        await message.delete();
        const uyari = await message.channel.send({
          content: `${message.author}, bu kanala sadece sıradaki sayı ya da "bom" yazabilirsiniz! Sıra: ${expectedContent}`
        });
        setTimeout(() => uyari.delete().catch(() => {}), 5000);
      } catch (err) {
        console.error('Yanlış mesaj silinemedi:', err);
      }
      return;
    }
    if (!players.includes(userId)) {
      players.push(userId);
    }
    const currentPlayerId = players[(currentNumber - 1) % players.length];
    if (userId !== currentPlayerId) {
      try {
        await message.delete();
        const uyarı = await message.channel.send({
          content: `${message.author}, sıran değil! Lütfen sıranı bekle.`
        });
        setTimeout(() => uyarı.delete().catch(() => {}), 5000);
      } catch (err) {
        console.error('Sıra dışı mesaj silinemedi:', err);
      }
      return;
    }

    try {
      await message.react('✅');
    } catch (err) {
      console.error('Emoji reaksiyonu eklenemedi:', err);
    }

    game.currentNumber++;

    if (game.currentNumber > 30000) {
      activeGames.delete(message.channel.id);
      message.channel.send('🎉 Bom oyunu bitti! Hepinize teşekkürler!');
    } else {
      activeGames.set(message.channel.id, game);
    }
  },
  activeGames,
};
