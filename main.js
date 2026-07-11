module.exports = function(bot, database, settings, consoleDisplay, userStates, helpers, getStartMessage) {
    
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.username || msg.from.first_name;
        
        consoleDisplay.logCommand(userId, userName, 'start');
        
        bot.sendPhoto(chatId, settings.panel, {
            caption: getStartMessage(userId, userName),
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📋 MENU', callback_data: 'show_menu' }]
                ]
            }
        });
    });

    bot.onText(/\/menu/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.username || msg.from.first_name;
        const status = helpers.getUserStatus(userId);
        
        consoleDisplay.logCommand(userId, userName, 'menu');
        
        bot.sendPhoto(chatId, settings.panel, {
            caption: helpers.showAllCommands(chatId),
            parse_mode: 'HTML'
        });
    });

    bot.on('callback_query', async (callbackQuery) => {
        const msg = callbackQuery.message;
        const userId = callbackQuery.from.id;
        const userName = callbackQuery.from.username || callbackQuery.from.first_name;
        const data = callbackQuery.data;
        const status = helpers.getUserStatus(userId);
        
        if (data === 'show_menu') {
            try {
                await bot.editMessageCaption(helpers.showAllCommands(chatId), {
                    chat_id: msg.chat.id,
                    message_id: msg.message_id,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🏠 HOME', callback_data: 'show_home' }]
                        ]
                    }
                });
            } catch (error) {
                console.log('Error editing message:', error.message);
            }
        }
        
        if (data === 'show_home') {
            try {
                await bot.editMessageCaption(getStartMessage(userId, userName), {
                    chat_id: msg.chat.id,
                    message_id: msg.message_id,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '📋 MENU', callback_data: 'show_menu' }]
                        ]
                    }
                });
            } catch (error) {
                console.log('Error editing message:', error.message);
            }
        }
        
        bot.answerCallbackQuery(callbackQuery.id);
    });

    bot.onText(/\/myprem/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.username || msg.from.first_name;
        
        consoleDisplay.logCommand(userId, userName, 'myprem');
        
        let statusMessage = '';
        
        const owners = Array.isArray(settings.ownerId) ? settings.ownerId : [settings.ownerId];
        if (owners.includes(userId)) {
            statusMessage = `<b>👑 OWNER</b>\n\n🆔 ${userId}\n⭐ Owner\n👥 Premium: ${database.getPremiumUsers().length}\n🎫 Access: ${database.getAccessUsers().length}`;
        } else if (database.isPremium(userId)) {
            statusMessage = `<b>⭐ PREMIUM</b>\n\n🆔 ${userId}\n✅ Active`;
        } else if (database.hasAccess(userId)) {
            const access = database.getUserAccess(userId);
            statusMessage = `<b>🎫 ACCESS USER</b>\n\n🆔 ${userId}\n🎫 Remaining: ${access}`;
        } else {
            statusMessage = `<b>🔒 REGULAR</b>\n\n🆔 ${userId}\n⭐ Status: Regular\n\nHubungi @${settings.dev}`;
        }
        
        bot.sendPhoto(chatId, settings.panel, {
            caption: statusMessage,
            parse_mode: 'HTML'
        });
    });

    bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.username || msg.from.first_name;
        
        consoleDisplay.logCommand(userId, userName, 'help');
        
        bot.sendPhoto(chatId, settings.panel, {
            caption: `<b>❓ HELP</b>\n\n/start - Start\n/myprem - Check status\n/reportacc - Report account\n/reportch - Report channel\n\n👑 @${settings.dev}`,
            parse_mode: 'HTML'
        });
    });
};