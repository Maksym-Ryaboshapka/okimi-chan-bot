import TelegramBot from "node-telegram-bot-api";

const TOKEN = '8264275218:AAHvaLVcCNRBsbDN-LOf1ouIc7pVaNu3UaU';
const bot = new TelegramBot(TOKEN, { polling: true });

// Store counter for each inline message
const counters = {};

// Handle inline query - when user types @botname
bot.on('inline_query', async (query) => {
  const results = [
    {
      type: 'article',
      id: '1',
      title: '👆 Counter Button',
      description: 'A simple counter you can click',
      thumb_url: 'https://cdn-icons-png.flaticon.com/512/1827/1827951.png',
      input_message_content: {
        message_text: '👆 Click the button below!\n\nCount: 0'
      },
      reply_markup: {
        inline_keyboard: [
          [
            { text: '➕ Increment', callback_data: 'increment' },
            { text: '➖ Decrement', callback_data: 'decrement' }
          ],
          [
            { text: '🔄 Reset', callback_data: 'reset' }
          ]
        ]
      }
    },
    {
      type: 'article',
      id: '2',
      title: '🎲 Dice Roller',
      description: 'Roll a dice',
      thumb_url: 'https://cdn-icons-png.flaticon.com/512/1998/1998108.png',
      input_message_content: {
        message_text: '🎲 Click to roll the dice!'
      },
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎲 Roll Dice', callback_data: 'roll' }]
        ]
      }
    },
    {
      type: 'article',
      id: '3',
      title: '🎨 Color Picker',
      description: 'Pick your favorite color',
      thumb_url: 'https://cdn-icons-png.flaticon.com/512/2088/2088617.png',
      input_message_content: {
        message_text: '🎨 Choose your color:'
      },
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔴 Red', callback_data: 'color_red' },
            { text: '🟢 Green', callback_data: 'color_green' },
            { text: '🔵 Blue', callback_data: 'color_blue' }
          ],
          [
            { text: '🟡 Yellow', callback_data: 'color_yellow' },
            { text: '🟣 Purple', callback_data: 'color_purple' },
            { text: '🟠 Orange', callback_data: 'color_orange' }
          ]
        ]
      }
    }
  ];

  await bot.answerInlineQuery(query.id, results, {
    cache_time: 0
  });
});

// Handle button clicks
bot.on('callback_query', async (query) => {
  const data = query.data;
  const messageId = query.inline_message_id;

  try {
    // Counter buttons
    if (data === 'increment' || data === 'decrement' || data === 'reset') {
      if (!counters[messageId]) {
        counters[messageId] = 0;
      }

      if (data === 'increment') {
        counters[messageId]++;
      } else if (data === 'decrement') {
        counters[messageId]--;
      } else if (data === 'reset') {
        counters[messageId] = 0;
      }

      await bot.editMessageText(
        `👆 Click the button below!\n\nCount: ${counters[messageId]}`,
        {
          inline_message_id: messageId,
          reply_markup: {
            inline_keyboard: [
              [
                { text: '➕ Increment', callback_data: 'increment' },
                { text: '➖ Decrement', callback_data: 'decrement' }
              ],
              [
                { text: '🔄 Reset', callback_data: 'reset' }
              ]
            ]
          }
        }
      );

      await bot.answerCallbackQuery(query.id, {
        text: `Count: ${counters[messageId]}`
      });
    }

    // Dice roller
    else if (data === 'roll') {
      const diceValue = Math.floor(Math.random() * 6) + 1;
      const diceEmoji = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][diceValue - 1];

      await bot.editMessageText(
        `🎲 You rolled: ${diceEmoji} (${diceValue})`,
        {
          inline_message_id: messageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: '🎲 Roll Again', callback_data: 'roll' }]
            ]
          }
        }
      );

      await bot.answerCallbackQuery(query.id, {
        text: `You got ${diceValue}!`
      });
    }

    // Color picker
    else if (data.startsWith('color_')) {
      const color = data.replace('color_', '');
      const colorEmojis = {
        red: '🔴',
        green: '🟢',
        blue: '🔵',
        yellow: '🟡',
        purple: '🟣',
        orange: '🟠'
      };

      const emoji = colorEmojis[color];
      const colorName = color.charAt(0).toUpperCase() + color.slice(1);

      await bot.editMessageText(
        `${emoji} You selected: ${colorName}!\n\nPick another color:`,
        {
          inline_message_id: messageId,
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🔴 Red', callback_data: 'color_red' },
                { text: '🟢 Green', callback_data: 'color_green' },
                { text: '🔵 Blue', callback_data: 'color_blue' }
              ],
              [
                { text: '🟡 Yellow', callback_data: 'color_yellow' },
                { text: '🟣 Purple', callback_data: 'color_purple' },
                { text: '🟠 Orange', callback_data: 'color_orange' }
              ]
            ]
          }
        }
      );

      await bot.answerCallbackQuery(query.id);
    }

  } catch (error) {
    if (error.message.includes('message is not modified')) {
      await bot.answerCallbackQuery(query.id, {
        text: '✓ Already selected'
      });
    } else {
      console.error('Error:', error.message);
      await bot.answerCallbackQuery(query.id, {
        text: '❌ Error occurred'
      });
    }
  }
});

// Start command
bot.onText(/\/start/, async (msg) => {
  const botInfo = await bot.getMe();
  bot.sendMessage(msg.chat.id,
    `🤖 *Inline Bot Demo*\n\n` +
    `📝 How to use:\n` +
    `1. Go to any chat\n` +
    `2. Type @${botInfo.username}\n` +
    `3. Choose an option\n` +
    `4. Send and interact!\n\n` +
    `✨ Works in any chat!`,
    { parse_mode: 'Markdown' }
  );
});

console.log('✅ Bot is running...');
console.log('📝 Enable Inline Mode in @BotFather if you haven\'t!');