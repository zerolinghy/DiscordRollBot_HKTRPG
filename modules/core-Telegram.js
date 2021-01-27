"use strict";
if (!process.env.TELEGRAM_CHANNEL_SECRET) {
	return;
}
exports.analytics = require('./core-analytics');
const Telegraf = require('telegraf');
const TGclient = new Telegraf(process.env.TELEGRAM_CHANNEL_SECRET);
const channelKeyword = process.env.TELEGRAM_CHANNEL_KEYWORD || '';
//var TGcountroll = 0;
//var TGcounttext = 0;
var TargetGM = (process.env.mongoURL) ? require('../roll/z_DDR_darkRollingToGM').initialize() : '';
const EXPUP = require('./level').EXPUP || function () {};
const courtMessage = require('./logs').courtMessage || function () {};
const joinMessage = "你剛剛添加了HKTRPG 骰子機械人! \
						\n輸入 1D100 可以進行最簡單的擲骰.\
						\n輸入 Bothelp 觀看詳細使用說明.\
						\n如果你需要幫助, 加入支援頻道.\
						\n(http://bit.ly/HKTRPG_DISCORD)\
						\n有關TRPG資訊, 可以到網站\
						\n(http://www.hktrpg.com/)";


const telegrafGetChatMembers = require('telegraf-getchatmembers');
TGclient.catch((err) => {
	console.log('bot error: ', err);
});
//TGclient.use(telegrafGetChatMembers)
TGclient.on('text', async (ctx) => {
	if (ctx.message.from.is_bot) return;
	//console.log(ctx.getChatMembers(ctx.chat.id) //[Members]
	//	ctx.getChatMembers() //[Members]
	//	telegrafGetChatMembers.check(ctx.chat.id) //[Members]
	//	telegrafGetChatMembers.all //[Chats]
	let groupid = '',
		userid = '',
		displayname = '',
		channelid = '',
		membercount = 0,
		titleName = '';
	let TargetGMTempID = [];
	let TargetGMTempdiyName = [];
	let TargetGMTempdisplayname = [];
	//得到暗骰的數據, GM的位置
	if (ctx.message.from.username) displayname = ctx.message.from.username;
	//是不是自己.ME 訊息
	//TRUE 即正常
	let displaynamecheck = true;
	let userrole = 1;
	//console.log('TG: ', message)
	//console.log('ctx.chat.id', ctx.chat.id)
	//頻道人數
	if (ctx.chat && ctx.chat.id) {
		membercount = await ctx.getChatMembersCount(ctx.chat.id) - 1;
	}
	if (ctx.message && ctx.message.chat && ctx.message.chat.title)
		titleName = ctx.message.chat.title
	if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
		let memberData = await telegrafGetChatMembers.check(ctx.chat.id);
		groupid = ctx.message.chat.id;
		if (ctx.chat && ctx.chat.id)
			if ((memberData && memberData[0] && memberData[0].status == ("creator" || "administrator")) || ctx.message.chat.all_members_are_administrators == true) {
				userrole = 3;
				//console.log(userrole)
				//console.log(telegrafGetChatMembers.check(ctx.chat.id))
			}
	}


	if (ctx.message.from.id) userid = ctx.message.from.id;
	//285083923223
	//userrole = 3
	let inputStr = ctx.message.text;
	let rplyVal = {};
	let msgSplitor = (/\S+/ig);
	let trigger = "";
	if (inputStr && ctx.message.from.is_bot == false) {
		if (ctx.botInfo && ctx.botInfo.username && inputStr.match(/^[/]/))
			inputStr = inputStr
			.replace(new RegExp('@' + ctx.botInfo.username + '$', 'i'), '')
			.replace(new RegExp('^/', 'i'), '');
		var mainMsg = inputStr.match(msgSplitor); // 定義輸入字串

	}
	if (mainMsg && mainMsg[0])
		trigger = mainMsg[0].toString().toLowerCase(); // 指定啟動詞在第一個詞&把大階強制轉成細階
	if (trigger == ".me") {
		displaynamecheck = false;
	}
	// 訊息來到後, 會自動跳到analytics.js進行骰組分析
	// 如希望增加修改骰組,只要修改analytics.js的條件式 和ROLL內的骰組檔案即可,然後在HELP.JS 增加說明.

	let privatemsg = 0
	//設定私訊的模式 0-普通 1-自己 2-自己+GM 3-GM
	if (trigger.match(/^dr$/i) && mainMsg && mainMsg[1]) {
		privatemsg = 1;
		inputStr = inputStr.replace(/^[d][r][ ]/i, '');
	}
	if (trigger.match(/^ddr$/i) && mainMsg && mainMsg[1]) {
		privatemsg = 2;
		inputStr = inputStr.replace(/^[d][d][r][ ]/i, '');
	}
	if (trigger.match(/^dddr$/i) && mainMsg && mainMsg[1]) {
		privatemsg = 3;
		inputStr = inputStr.replace(/^[d][d][d][r][ ]/i, '');
	}
	if (channelKeyword != '' && trigger == channelKeyword.toString().toLowerCase()) {
		mainMsg.shift();
		rplyVal = await exports.analytics.parseInput({
			inputStr: inputStr,
			groupid: groupid,
			userid: userid,
			userrole: userrole,
			botname: "Telegram",
			displayname: displayname,
			channelid: channelid,
			membercount: membercount,
			titleName: titleName
		})
	} else {
		if (channelKeyword == '') {
			rplyVal = await exports.analytics.parseInput({
				inputStr: inputStr,
				groupid: groupid,
				userid: userid,
				userrole: userrole,
				botname: "Telegram",
				displayname: displayname,
				channelid: channelid,
				membercount: membercount,
				titleName: titleName
			})
		}
	}
	if (!rplyVal.text && !rplyVal.LevelUp)
		return;
	//LevelUp功能
	if (groupid && rplyVal && rplyVal.LevelUp) {
		//	console.log('result.LevelUp 2:', rplyVal.LevelUp)
		ctx.reply("@" + displayname + '\n' + rplyVal.LevelUp);
	}
	if (!rplyVal.text) {
		return;
	}
	//TGcountroll++;
	if (privatemsg > 1 && TargetGM) {
		let groupInfo = await privateMsgFinder(groupid) || [];
		groupInfo.forEach((item) => {
			TargetGMTempID.push(item.userid);
			TargetGMTempdiyName.push(item.diyName);
			TargetGMTempdisplayname.push(item.displayname);
		})

	}
	switch (true) {
		case privatemsg == 1:
			// 輸入dr  (指令) 私訊自己
			//
			//console.log('ctx.message.chat.type: ', ctx.message.chat.type)
			if (ctx.message.chat.type != 'private') {
				ctx.reply("@" + displayname + ' 暗骰給自己');
			}
			rplyVal.text = "@" + displayname + " 的暗骰\n" + rplyVal.text
			await SendToId(ctx.message.from.id);
			break;
		case privatemsg == 2:
			//輸入ddr(指令) 私訊GM及自己
			if (ctx.message.chat.type != 'private') {
				let targetGMNameTemp = "";
				for (let i = 0; i < TargetGMTempID.length; i++) {
					targetGMNameTemp = targetGMNameTemp + ", " + (TargetGMTempdiyName[i] || "@" + TargetGMTempdisplayname[i]);
				}
				ctx.reply("@" + displayname + ' 暗骰進行中 \n目標: 自己 ' + targetGMNameTemp);
			}
			rplyVal.text = "@" + displayname + " 的暗骰\n" + rplyVal.text;
			SendToId(ctx.message.from.id);
			for (let i = 0; i < TargetGMTempID.length; i++) {
				if (ctx.message.from.id != TargetGMTempID[i])
					SendToId(TargetGMTempID[i]);
			}
			break;
		case privatemsg == 3:
			//輸入dddr(指令) 私訊GM
			if (ctx.message.chat.type != 'private') {
				let targetGMNameTemp = "";
				for (let i = 0; i < TargetGMTempID.length; i++) {
					targetGMNameTemp = targetGMNameTemp + " " + (TargetGMTempdiyName[i] || "@" + TargetGMTempdisplayname[i]);
				}
				ctx.reply("@" + displayname + ' 暗骰進行中 \n目標: ' + targetGMNameTemp);
			}
			rplyVal.text = "@" + displayname + " 的暗骰\n" + rplyVal.text;
			for (let i = 0; i < TargetGMTempID.length; i++) {
				SendToId(TargetGMTempID[i]);
			}
			break;
		default:
			if (displaynamecheck && displayname) {
				//285083923223
				displayname = "@" + ctx.message.from.username + "\n";
				rplyVal.text = displayname + rplyVal.text;
			}
			SendToReply();
			break;
	}

	async function SendToId(targetid) {
		for (var i = 0; i < rplyVal.text.toString().match(/[\s\S]{1,2000}/g).length; i++) {
			if (i == 0 || i == 1 || i == rplyVal.text.toString().match(/[\s\S]{1,2000}/g).length - 2 || i == rplyVal.text.toString().match(/[\s\S]{1,2000}/g).length - 1) {
				ctx.telegram.sendMessage(targetid, rplyVal.text.toString().match(/[\s\S]{1,2000}/g)[i]);
			}
		}
	}
	async function SendToReply() {
		for (var i = 0; i < rplyVal.text.toString().match(/[\s\S]{1,2000}/g).length; i++) {
			if (i == 0 || i == 1 || i == rplyVal.text.toString().match(/[\s\S]{1,2000}/g).length - 2 || i == rplyVal.text.toString().match(/[\s\S]{1,2000}/g).length - 1) {
				ctx.reply(rplyVal.text.toString().match(/[\s\S]{1,2000}/g)[i]);
			}
		}
	}

	// console.log("rplyVal: " + rplyVal)

	//  }

})
const io = require('socket.io-client');
const socket = io('ws://localhost:53589', {
	reconnection: true,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	reconnectionAttempts: Infinity
});
socket.on('connect', () => {
	// either with send()
	console.log('connect To core-www from Telegram!')
	socket.on('Telegram', message => {
		if (!message.text) return;
		TGclient.telegram.sendMessage(message.target.id, message.text);
		return;
	});
	socket.on('Line', message => {
		if (!message.text) return;
		process.emit('Line', message);
	});
	socket.on('disconnect', function () {
		console.log('disconnected from server telegram');
	});

});

TGclient.on('message', async (ctx) => {
	if (ctx.message.from.is_bot) return;
	if (ctx.message.new_chat_member && ctx.message.new_chat_member.username == ctx.me) {
		console.log("Telegram joined");
		ctx.reply(joinMessage);
	} else if (ctx.message.group_chat_created) {
		console.log("Telegram joined");
		ctx.reply(joinMessage);
	} else return null;
});

TGclient.on('audio', async (ctx) => {
	if (ctx.message.from.is_bot) return;
	if ((ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') && ctx.message.from.id && ctx.message.chat.id) {
		let groupid = '',
			userid = '',
			displayname = '',
			membercount = null;
		groupid = ctx.message.chat.id;
		if (ctx.message.from.username) {
			displayname = ctx.message.from.username;
		}
		if (ctx.message.from.id) {
			userid = ctx.message.from.id;
		}
		if (ctx.chat && ctx.chat.id) {
			membercount = await ctx.getChatMembersCount(ctx.chat.id);
		}
		await EXPUP(groupid, userid, displayname, "", membercount);
		await courtMessage("", "Line", "")
	}
	return null;
});
TGclient.on('document', async (ctx) => {
	if (ctx.message.from.is_bot) return;
	if ((ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') && ctx.message.from.id && ctx.message.chat.id) {
		let groupid = '',
			userid = '',
			displayname = '',
			membercount = '';
		groupid = ctx.message.chat.id;
		if (ctx.message.from.username) {
			displayname = ctx.message.from.username;
		}
		if (ctx.message.from.id) {
			userid = ctx.message.from.id;
		}
		if (ctx.chat && ctx.chat.id) {
			membercount = await ctx.getChatMembersCount(ctx.chat.id);
		}
		await EXPUP(groupid, userid, displayname, "", membercount);
		await courtMessage("", "Line", "")
	}
	return null
})
TGclient.on('photo', async (ctx) => {
	if (ctx.message.from.is_bot) return;
	if ((ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') && ctx.message.from.id && ctx.message.chat.id) {
		let groupid = '',
			userid = '',
			displayname = '',
			membercount = ''
		groupid = ctx.message.chat.id
		if (ctx.message.from.username) displayname = ctx.message.from.username
		if (ctx.message.from.id) userid = ctx.message.from.id
		if (ctx.chat && ctx.chat.id)
			membercount = await ctx.getChatMembersCount(ctx.chat.id)
		await EXPUP(groupid, userid, displayname, "", membercount);
		await courtMessage("", "Line", "")
	}
	return null
})
TGclient.on('sticker', async (ctx) => {
	if (ctx.message.from.is_bot) return;
	if ((ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') && ctx.message.from.id && ctx.message.chat.id) {
		let groupid = '',
			userid = '',
			displayname = '',
			membercount = ''
		groupid = ctx.message.chat.id
		if (ctx.message.from.username) displayname = ctx.message.from.username
		if (ctx.message.from.id) userid = ctx.message.from.id
		if (ctx.chat && ctx.chat.id)
			membercount = await ctx.getChatMembersCount(ctx.chat.id)
		await EXPUP(groupid, userid, displayname, "", membercount);
		await courtMessage("", "Line", "")
	}
	return null
})
TGclient.on('video', async (ctx) => {
	if (ctx.message.from.is_bot) return;
	if ((ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') && ctx.message.from.id && ctx.message.chat.id) {
		let groupid = '',
			userid = '',
			displayname = '',
			membercount = ''
		groupid = ctx.message.chat.id
		if (ctx.message.from.username) displayname = ctx.message.from.username
		if (ctx.message.from.id) userid = ctx.message.from.id
		if (ctx.chat && ctx.chat.id)
			membercount = await ctx.getChatMembersCount(ctx.chat.id)
		await EXPUP(groupid, userid, displayname, "", membercount);
		await courtMessage("", "Line", "")
	}
	return null
})
TGclient.on('voice', async (ctx) => {
	if (ctx.message.from.is_bot) return;
	if ((ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') && ctx.message.from.id && ctx.message.chat.id) {
		let groupid = '',
			userid = '',
			displayname = '',
			membercount = ''
		groupid = ctx.message.chat.id
		if (ctx.message.from.username) displayname = ctx.message.from.username
		if (ctx.message.from.id) userid = ctx.message.from.id
		if (ctx.chat && ctx.chat.id)
			membercount = await ctx.getChatMembersCount(ctx.chat.id)
		await EXPUP(groupid, userid, displayname, "", membercount);
		await courtMessage("", "Line", "")
	}
	return null
})
TGclient.on('forward', async (ctx) => {
	if (ctx.message.from.is_bot) return;
	if ((ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') && ctx.message.from.id && ctx.message.chat.id) {
		let groupid = '',
			userid = '',
			displayname = '',
			membercount = ''
		groupid = ctx.message.chat.id
		if (ctx.message.from.username) displayname = ctx.message.from.username
		if (ctx.message.from.id) userid = ctx.message.from.id
		if (ctx.chat && ctx.chat.id)
			membercount = await ctx.getChatMembersCount(ctx.chat.id)
		await EXPUP(groupid, userid, displayname, "", membercount);
		await courtMessage("", "Line", "")
	}
	return null
})
async function privateMsgFinder(channelid) {
	if (!TargetGM || !TargetGM.trpgDarkRollingfunction) return;
	let groupInfo = TargetGM.trpgDarkRollingfunction.find(data =>
		data.groupid == channelid
	)
	if (groupInfo && groupInfo.trpgDarkRollingfunction)
		return groupInfo.trpgDarkRollingfunction
	else return [];
}

TGclient.launch();


/*
bot.command('pipe', (ctx) => ctx.replyWithPhoto({
	url: 'https://picsum.photos/200/300/?random'
}))
*/