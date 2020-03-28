var channelKeyword = process.env.DISCORD_CHANNEL_KEYWORD || "";
var channelSecret = process.env.DISCORD_CHANNEL_SECRET;
const Discord = require('discord.js');
const client = new Discord.Client();
// Load `*.js` under modules directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
require('fs').readdirSync(__dirname + '/modules/').forEach(function (file) {
	if (file.match(/\.js$/) !== null && file !== 'index.js') {
		var name = file.replace('.js', '');
		exports[name] = require('./modules/' + file);
	}
});

client.once('ready', () => {
	console.log('Ready!');
});

client.login(channelSecret);

client.on('message', message => {
	if (message.author.bot === false &&  message.content != "") {
		//	console.log('message.content ' + message.content);
		//	console.log('channelKeyword ' + channelKeyword);
		let rplyVal = {};
		let msgSplitor = (/\S+/ig);
		let mainMsg = message.content.match(msgSplitor); //定義輸入字串
		let trigger = mainMsg[0].toString().toLowerCase(); //指定啟動詞在第一個詞&把大階強制轉成細階
		let privatemsg = 0;
		//訊息來到後, 會自動跳到analytics.js進行骰組分析
		//如希望增加修改骰組,只要修改analytics.js的條件式 和ROLL內的骰組檔案即可,然後在HELP.JS 增加說明.

		try {
			if (trigger == "dr") {
				privatemsg = 1;
				mainMsg.shift();
				trigger = mainMsg[0].toString().toLowerCase();
			}
			if (channelKeyword != "" && trigger == channelKeyword) {
				mainMsg.shift();
				rplyVal = exports.analytics.parseInput(mainMsg.join(' '));
			} else {
				if (channelKeyword == "") {
					rplyVal = exports.analytics.parseInput(mainMsg.join(' '));
				}
			}

		} catch (e) {
			console.log('catch error');
			console.log('Request error: ' + e.message);
		}
		if (rplyVal && rplyVal.text) {
			if (privatemsg == 1) {
				message.channel.send("<@" + message.author.id + "> 暗骰進行中");
				message.author.send(rplyVal.text);;
			} else {
				message.channel.send("<@" + message.author.id + ">\n" + rplyVal.text)
			}
			//console.log("rplyVal: " + rplyVal);
		} else {
			console.log('Do not trigger');
		}
	}
});

//Set Activity 可以自定義正在玩什麼
client.on('ready', () => {
  client.user.setPresence({
      game: {
        name: 'bothelp',
        type: 3
      }
  });
})
