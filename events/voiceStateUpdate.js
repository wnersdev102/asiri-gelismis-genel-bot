const db = require('croxydb');

const sesXpMap = new Map();

module.exports = (client) => {
  client.on('voiceStateUpdate', async (oldState, newState) => {
    if (!newState.guild) return;
    if (newState.member.user.bot) return;

    const guildId = newState.guild.id;
    const userId = newState.member.id;
    const sesXp = db.get(`ayar.sesXp_${guildId}`) || 0;
    const logKanalId = db.get(`ayar.log_${guildId}`);

    if (oldState.channelId !== newState.channelId) {
      if (sesXpMap.has(userId)) {
        clearInterval(sesXpMap.get(userId));
        sesXpMap.delete(userId);
      }

      if (newState.channelId) {
        const interval = setInterval(() => {
          const member = newState.guild.members.cache.get(userId);
          if (!member || !member.voice.channel) {
            clearInterval(interval);
            sesXpMap.delete(userId);
            return;
          }

          let xp = db.get(`xp_${guildId}_${userId}`) || 0;
          let level = db.get(`level_${guildId}_${userId}`) || 1;

          xp += sesXp;
          const neededXp = level * 100;

          if (xp >= neededXp) {
            xp -= neededXp;
            level++;
            if (logKanalId) {
              const logKanal = newState.guild.channels.cache.get(logKanalId);
              if (logKanal) logKanal.send(`🎉 ${member} ses kanalında seviye atladı! Yeni seviye: ${level}`);
            }
          }

          db.set(`xp_${guildId}_${userId}`, xp);
          db.set(`level_${guildId}_${userId}`, level);
        }, 60000);

        sesXpMap.set(userId, interval);
      }
    }
  });

  process.on('exit', () => {
    sesXpMap.forEach(i => clearInterval(i));
  });
};
