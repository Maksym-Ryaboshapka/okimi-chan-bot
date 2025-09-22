const onStart = async (bot, msg) => {
  await bot.sendMessage(msg.chat.id, "Тут будет стартовое соо");
};

module.exports = onStart;