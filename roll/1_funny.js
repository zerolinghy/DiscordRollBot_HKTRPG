"use strict";
var rollbase = require('./rollbase.js');
var variables = {};

var gameName = function () {
	return '【趣味擲骰】 排序(至少3個選項) choice/隨機(至少2個選項) 每日塔羅 運勢 立flag .me'
}

var gameType = function () {
	return 'funny:funny:hktrpg'
}
var prefixs = function () {
	return [{
		first: /^[.]me$|排序|隨機|choice|^每日塔羅|^時間塔羅|^大十字塔羅|命運之人|立flag|運勢|鴨霸獸/i,
		second: null
	}]
}
var getHelpMessage = function () {
	return "【趣味擲骰】" + "\n\
隨機選擇： 啓動語 choice 隨機\n\
(問題)(啓動語)(問題)  (選項1) (選項2) \n\
例子 收到聖誕禮物隨機數 1 2 >3  \n\
\n\
隨機排序：啓動語 排序\n\
(問題)(啓動語)(問題) (選項1) (選項2)(選項3)\n\
例子 交換禮物排序 A君 C君 F君 G君\n\
\n\
複述功能：啓動語 .me (模擬系統說話)\n\
(啓動語) (句子)(句子)(句子)\n\
例子 .me C君殺死了NPC 村民, 受到尼什村通緝!\n\
\n\
占卜運氣功能： 字句開頭或結尾包括「運勢」兩字及四十字以內\n\
塔羅牌占卜： 「大十字塔羅 每日塔羅 時間塔羅」 等關键字可啓動\n\
\n\
隨機死亡FLAG 字句開頭或結尾包括「立FLAG」可啓動\n"
}
var initialize = function () {
	return variables;
}

var rollDiceCommand = async function ({
	inputStr,
	mainMsg
}) {
	let rply = {
		default: 'on',
		type: 'text',
		text: ''
	}
	//let result = {};
	//		if (trigger.match(/排序/) != null && mainMsg.length >= 3) return exports.funny.SortIt(inputStr, mainMsg);
	//choice 指令開始於此
	//	if (trigger.match(/choice|隨機|選項|選1/) != null && mainMsg.length >= 3) return exports.funny.choice(inputStr, mainMsg);
	//tarot 指令
	/*
	if (trigger.match(/tarot|塔羅牌|塔羅/) != null) {
		if (trigger.match(/^單張|^每日|^daily/) != null) return exports.funny.NomalDrawTarot(mainMsg[1], mainMsg[2]); //預設抽 79 張
		if (trigger.match(/^時間|^time/) != null) return exports.funny.MultiDrawTarot(mainMsg[1], mainMsg[2], 1);
		if (trigger.match(/^大十字|^cross/) != null) return exports.funny.MultiDrawTarot(mainMsg[1], mainMsg[2], 2);
	}
	*/

	//FLAG指令開始於此
	//		if (trigger.match(/立flag|死亡flag/) != null) return exports.funny.BStyleFlagSCRIPTS();

	//鴨霸獸指令開始於此
	//		if (trigger.match(/鴨霸獸/) != null) return exports.funny.randomReply();
	//		if (trigger.match(/運勢/) != null) return exports.funny.randomLuck(mainMsg); //占卜運氣
	/*猜拳指令
	if (trigger.match(/猜拳/) != null) {
	return RockPaperScissors(inputStr, mainMsg[1]);
	}
*/

	switch (true) {
		case /^排序|排序$/i.test(mainMsg[0]) && (mainMsg.length >= 4):
			rply.text = await SortIt(inputStr, mainMsg);
			return rply;
		case /^隨機|^choice|隨機$|choice$/i.test(mainMsg[0]) && (mainMsg.length >= 3):
			rply.text = await choice(inputStr, mainMsg);
			return rply;
		case /塔羅/i.test(mainMsg[0]):
			if (mainMsg[0].match(/^每日塔羅/) != null)
				rply.text = await NomalDrawTarot(mainMsg[1], mainMsg[2]); //預設抽 79 張
			if (mainMsg[0].match(/^時間塔羅/) != null)
				rply.text = await MultiDrawTarot(mainMsg[1], mainMsg[2], 1);
			if (mainMsg[0].match(/^大十字塔羅/) != null)
				rply.text = await MultiDrawTarot(mainMsg[1], mainMsg[2], 2);
			return rply;
		case /^命運之人$/i.test(mainMsg[0]):
			rply.text = await DargonCityDraw(mainMsg[1], mainMsg[2]);
			return rply;
		case (/立flag$|^立flag/i.test(mainMsg[0]) && mainMsg[0].toString().match(/[\s\S]{1,25}/g).length <= 1):
			rply.text = await BStyleFlagSCRIPTS();
			return rply;
		// case /^鴨霸獸$/i.test(mainMsg[0]):
		// 	rply.text = await randomReply();
		// 	return rply;
		case (/運勢$|^運勢/i.test(mainMsg[0]) && mainMsg[0].toString().match(/[\s\S]{1,40}/g).length <= 1):
			rply.text = await randomLuck(mainMsg);
			return rply;
		case /^[.]me$/i.test(mainMsg[0]):
			rply.text = me(inputStr);
			return rply;
		default:
			break;
	}
}

/**
 * .ME
 */
function me(inputStr) {
	return inputStr.replace(/^[.]me/i, '');
}

/**
 * 占卜&其他
 */

async function BStyleFlagSCRIPTS() {
	const rplyArr = ['\
「打完這仗我就回老家結婚（この戦いが終わったら、故郷に帰って結婚するんだ）」', '\
「打完這一仗後我請你喝酒」', '\
「你、你要錢嗎！要什麼我都能給你！/我可以給你更多的錢！」', '\
「做完這次任務，我就要結婚了。」', '\
「幹完這一票我就金盆洗手了。」', '\
「好想再XXX啊……」', '\
「已經沒什麼好害怕的了（もう何も恐くない）」', '\
「我一定會回來的（必ず帰る！）」', '\
「差不多該走了」', '\
「我只是希望你永遠不要忘記我。」', '\
「我只是希望能永遠和你在一起。」', '\
「啊啊…為什麼會在這種時候、想起了那些無聊的事呢？」', '\
「能遇見你真是太好了。」', '\
「我終於…為你們報仇了！」', '\
「等到一切結束後，我有些話想跟妳說！」', '\
「這段時間我過的很開心啊。」', '\
「把自己的寶物借給其他人，然後說「待一切結束後記得還給我。」', '\
「真是，別人借的那麼貴的東西，用壞了可就不好了啊...！」', '\
「真希望這份幸福可以永遠持續下去。」', '\
「我們三個人要永永遠遠在一起！」', '\
「這是我女兒的照片，很可愛吧？」', '\
「請告訴他/她，我永遠愛他/她」', '\
「聽好，在我回來之前絕不要亂走動哦（いいか、俺が帰ってくるまでここを動くんじゃないぞ）」', '\
「要像一個乖孩子一樣等著我回來」', '\
「還沒到你上戰場的時候...！」', '\
「就算我不在了，靈魂也一直陪在你身邊」', '\
「我去去就來（先に行って、すぐ戻るから）」', '\
「快逃！(逃げろう！/早く逃げろう！)」', '\
「對方只有一個人，大家一起上啊」', '\
「我就不信，這麼多人還殺不了他一個！」', '\
「幹，幹掉了嗎？（やったのか？）」', '\
「身體好輕」', '\
「可惡！你給我看著！（逃跑）」', '\
「躲在這裡就應該不會被發現了吧。」', '\
「我不會讓任何人死的。」', '\
「英雄，是不會倒下的！」', '\
「可惡！原來是這麼回事！」', '\
「跑這麼遠應該就行了。」', '\
「我已經甚麼都不怕了（もう何も恐くない）」', '\
「這XXX是什麼，怎麼之前沒見過（なんだこのXXX、見たことないな）」', '\
「什麽聲音……？就去看一下吧（:「何の音だ？ちょっと見てくる」', '\
「是我的錯覺嗎？/果然是錯覺/錯覺吧/可能是我（看/聽）錯了」', '\
「二十年後又是一條好漢！」', '\
「大人/將軍武運昌隆」', '\
「他這麼厲害，一定不會有事的」', '\
「這次工作的報酬是以前無法比較的（:「今度の仕事でまとまったカネが入るんだ」', '\）」', '\
「為了宗教，奉獻一切！」', '\
「如果還有下輩子，我希望，當個長不大的蘿莉……」', '\
「為了蘿莉而死，就是我人生存在的價值！」', '\
「我已經天下無敵了~~」', '\
「大人！這邊就交給小的吧，請快離開這邊吧」', '\
「XX，這就是我們流派的最終奧義。這一招我只會演示一次，你看好了！」', '\
「誰敢殺我？」', '\
「從來沒有人能越過我的劍圍。」', '\
「就算殺死也沒問題吧？」', '\
「看我塔下強殺！」', '\
「這種空曠無一物的地方總不會有陷阱....」', '\
「乖乖在這邊待著，我馬上就會回來！」', '\
「這是準備送給XX的禮物」', '\
「今天還不是我們的死期...！」', '\
「我們至今所做的一切不是徒勞的，只要我們不止步，前方就會有路！」', '\
「無論發生什麼事，我都會相信你」', '\
「這裡交給我，你們快走！」', '\
「我馬上就會跟上。」', '\
「必須得有人留下！」', '\
「我即使剩下靈魂也會陪伴著你」'];

	//	rply.text = rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	return rplyArr[await rollbase.Dice(rplyArr.length) - 1]
}

async function randomReply() {
	const rplyArr = ['\
你們死定了呃呃呃不要糾結這些……所以是在糾結哪些？', '\
在澳洲，每過一分鐘就有一隻鴨嘴獸被拔嘴。 \n我到底在共三小。', '\
嗚噁噁噁噁噁噁，不要隨便叫我。', '\
幹，你這學不會的豬！', '\
嘎嘎嘎。', '\
wwwwwwwwwwwwwwwww', '\
為什麼你們每天都可以一直玩；玩就算了還玩我。', '\
好棒，整點了！咦？不是嗎？', '\
不要打擾我挖坑！', '好棒，誤點了！', '\
在南半球，一隻鴨嘴獸拍打他的鰭，他的嘴就會掉下來。 \n我到底在共三小。', '\
什麼東西你共三小。', '\
哈哈哈哈哈哈哈哈！', '\
一直叫，你4不4想拔嘴人家？', '\
一直叫，你想被淨灘嗎？', '\
幫主你也敢嘴？', '\
拔嘴的話，我的嘴巴會長出觸手，然後開花成四個花瓣哦 (´×`)', '\
看看我！！我體內的怪物已經這麼大了！！', '\
傳說中，凡是拔嘴過鴨嘴獸的人，有高機率在100年內死去。 \n我到底在共三小。', '\
人類每花60秒拔嘴，就減少一分鐘的壽命。 \n我到底在共三小。', '\
嘴被拔，就會掉。', '\
你在大聲什麼啦！！！！', '\
公道價，八萬一（伸手）。', '\
你的嘴裡有異音（指）', '\
幫主說，有人打你的左臉，你就要用肉食性猛擊咬斷他的小腿。'];
	//	rply.text = rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	return rplyArr[await rollbase.Dice(rplyArr.length) - 1];
}

async function randomLuck(TEXT) {
	const rplyArr = ['超吉', '超級上吉', '大吉', '吉', '中吉', '小吉', '吉', '小吉', '吉', '吉', '中吉', '吉', '中吉', '吉', '中吉', '小吉', '末吉', '吉', '中吉', '小吉', '末吉', '中吉', '小吉', '小吉', '吉', '小吉', '末吉', '中吉', '小吉', '凶', '小凶', '沒凶', '大凶', '很凶', '你不要知道比較好呢', '命運在手中,何必問我'];
	//	rply.text = TEXT[0] + ' ： ' + rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	return TEXT[0] + ' ： ' + rplyArr[await rollbase.Dice(rplyArr.length) - 1];
}

/**
 * Tarot塔羅牌
 */
async function MultiDrawTarot(text, text2, type) {
	let returnStr = '';
	let cards = []
	switch (type) {
		case 1:
			returnStr = '時間塔羅';
			(text) ? returnStr += "；" + text + " " + text2: '';
			cards = await rollbase.shuffleTarget(TarotList2);
			returnStr += '過去: ' + cards[0] + '\n'
			returnStr += '現在: ' + cards[1] + '\n'
			returnStr += '未來: ' + cards[2] + '\n'
			break;
		case 2:
			returnStr = '大十字塔羅';
			(text) ? returnStr += "；" + text + " " + text2: '';
			cards = await rollbase.shuffleTarget(TarotList2);
			returnStr += '現況: ' + cards[0] + '\n'
			returnStr += '助力: ' + cards[1] + '\n'
			returnStr += '目標: ' + cards[2] + '\n'
			returnStr += '基礎: ' + cards[3] + '\n'
			returnStr += '過去: ' + cards[4] + '\n'
			returnStr += '未來: ' + cards[5] + '\n'
			returnStr += '自我: ' + cards[6] + '\n'
			returnStr += '環境: ' + cards[7] + '\n'
			returnStr += '恐懼: ' + cards[8] + '\n'
			returnStr += '結論: ' + cards[9] + '\n'
			break;
		default:
			break;

	}
	return returnStr;
}

async function NomalDrawTarot(text, text2) {
	let returnStr = '';
	returnStr = '每日塔羅'
	if (text)
		returnStr += "；" + text + " " + text2
	let ans = await rollbase.shuffleTarget(TarotList)
	returnStr += '\n' + ans[0]
	return returnStr;
}

async function DargonCityDraw(text, text2) {
	let returnStr = '';
	returnStr = '命運之人'
	(text) ? returnStr += "；" + text + " " + text2: '';
	cards = await rollbase.shuffleTarget(DargonCityList);
	returnStr += '第一張: ' + cards[0] + '\n'
	returnStr += '第一張: ' + cards[1] + '\n'
	returnStr += '第一張: ' + cards[2] + '\n'
	return returnStr;
}

const TarotList = ["愚者 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/00.jpg",
	"魔術師 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/01.jpg",
	"女祭司 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/02.jpg",
	"女皇 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/03.jpg",
	"皇帝 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/04.jpg",
	"教皇 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/05.jpg",
	"戀人 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/06.jpg",
	"戰車 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/07.jpg",
	"力量 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/08.jpg",
	"隱者 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/09.jpg",
	"命運之輪 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/10.jpg",
	"正義 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/11.jpg",
	"吊人 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/12.jpg",
	"死神 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/13.jpg",
	"節制 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/14.jpg",
	"惡魔 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/15.jpg",
	"高塔 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/16.jpg",
	"星星 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/17.jpg",
	"月亮 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/18.jpg",
	"太陽 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/19.jpg",
	"審判 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/20.jpg",
	"世界 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/21.jpg",
	"愚者 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/00-Re.jpg",
	"魔術師 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/01-Re.jpg",
	"女祭司 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/02-Re.jpg",
	"女皇 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/03-Re.jpg",
	"皇帝 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/04-Re.jpg",
	"教皇 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/05-Re.jpg",
	"戀人 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/06-Re.jpg",
	"戰車 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/07-Re.jpg",
	"力量 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/08-Re.jpg",
	"隱者 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/09-Re.jpg",
	"命運之輪 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/10-Re.jpg",
	"正義 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/11-Re.jpg",
	"吊人 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/12-Re.jpg",
	"死神 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/13-Re.jpg",
	"節制 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/14-Re.jpg",
	"惡魔 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/15-Re.jpg",
	"高塔 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/16-Re.jpg",
	"星星 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/17-Re.jpg",
	"月亮 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/18-Re.jpg",
	"太陽 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/19-Re.jpg",
	"審判 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/20-Re.jpg",
	"世界 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/21-Re.jpg",
	"聖杯一 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_01.jpg",
	"聖杯二 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_02.jpg",
	"聖杯三 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_03.jpg",
	"聖杯四 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_04.jpg",
	"聖杯五 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_05.jpg",
	"聖杯六 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_06.jpg",
	"聖杯七 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_07.jpg",
	"聖杯八 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_08.jpg",
	"聖杯九 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_09.jpg",
	"聖杯十 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_10.jpg",
	"聖杯國王 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_KING.jpg",
	"聖杯騎士 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_KNIGHT.jpg",
	"聖杯侍者 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_PAGE.jpg",
	"聖杯皇后 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_QUEEN.jpg",
	"錢幣一 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_01.jpg",
	"錢幣二 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_02.jpg",
	"錢幣三 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_03.jpg",
	"錢幣四 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_04.jpg",
	"錢幣五 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_05.jpg",
	"錢幣六 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_06.jpg",
	"錢幣七 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_07.jpg",
	"錢幣八 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_08.jpg",
	"錢幣九 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_09.jpg",
	"錢幣十 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_10.jpg",
	"錢幣國王 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_KING.jpg",
	"錢幣騎士 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_KNIGHT.jpg",
	"錢幣侍者 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_PAGE.jpg",
	"錢幣皇后 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_QUEEN.jpg",
	"寶劍一 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_01.jpg",
	"寶劍二 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_02.jpg",
	"寶劍三 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_03.jpg",
	"寶劍四 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_04.jpg",
	"寶劍五 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_05.jpg",
	"寶劍六 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_06.jpg",
	"寶劍七 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_07.jpg",
	"寶劍八 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_08.jpg",
	"寶劍九 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_09.jpg",
	"寶劍十 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_10.jpg",
	"寶劍國王 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_KING.jpg",
	"寶劍騎士 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_KNIGHT.jpg",
	"寶劍侍者 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_PAGE.jpg",
	"寶劍皇后 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_QUEEN.jpg",
	"權杖一 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_01.jpg",
	"權杖二 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_02.jpg",
	"權杖三 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_03.jpg",
	"權杖四 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_04.jpg",
	"權杖五 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_05.jpg",
	"權杖六 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_06.jpg",
	"權杖七 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_07.jpg",
	"權杖八 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_08.jpg",
	"權杖九 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_09.jpg",
	"權杖十 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_10.jpg",
	"權杖國王 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_KING.jpg",
	"權杖騎士 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_KNIGHT.jpg",
	"權杖侍者 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_PAGE.jpg",
	"權杖皇后 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_QUEEN.jpg",
	"聖杯一 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_01-Re.jpg",
	"聖杯二 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_02-Re.jpg",
	"聖杯三 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_03-Re.jpg",
	"聖杯四 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_04-Re.jpg",
	"聖杯五 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_05-Re.jpg",
	"聖杯六 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_06-Re.jpg",
	"聖杯七 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_07-Re.jpg",
	"聖杯八 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_08-Re.jpg",
	"聖杯九 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_09-Re.jpg",
	"聖杯十 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_10-Re.jpg",
	"聖杯國王 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_KING-Re.jpg",
	"聖杯騎士 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_KNIGHT-Re.jpg",
	"聖杯侍者 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_PAGE-Re.jpg",
	"聖杯皇后 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/CUPS_QUEEN-Re.jpg",
	"錢幣一 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_01-Re.jpg",
	"錢幣二 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_02-Re.jpg",
	"錢幣三 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_03-Re.jpg",
	"錢幣四 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_04-Re.jpg",
	"錢幣五 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_05-Re.jpg",
	"錢幣六 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_06-Re.jpg",
	"錢幣七 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_07-Re.jpg",
	"錢幣八 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_08-Re.jpg",
	"錢幣九 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_09-Re.jpg",
	"錢幣十 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_10-Re.jpg",
	"錢幣國王 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_KING-Re.jpg",
	"錢幣騎士 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_KNIGHT-Re.jpg",
	"錢幣侍者 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_PAGE-Re.jpg",
	"錢幣皇后 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/PANTA_QUEEN-Re.jpg",
	"寶劍一 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_01-Re.jpg",
	"寶劍二 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_02-Re.jpg",
	"寶劍三 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_03-Re.jpg",
	"寶劍四 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_04-Re.jpg",
	"寶劍五 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_05-Re.jpg",
	"寶劍六 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_06-Re.jpg",
	"寶劍七 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_07-Re.jpg",
	"寶劍八 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_08-Re.jpg",
	"寶劍九 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_09-Re.jpg",
	"寶劍十 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_10-Re.jpg",
	"寶劍國王 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_KING-Re.jpg",
	"寶劍騎士 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_KNIGHT-Re.jpg",
	"寶劍侍者 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_PAGE-Re.jpg",
	"寶劍皇后 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/SWORDS_QUEEN-Re.jpg",
	"權杖一 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_01-Re.jpg",
	"權杖二 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_02-Re.jpg",
	"權杖三 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_03-Re.jpg",
	"權杖四 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_04-Re.jpg",
	"權杖五 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_05-Re.jpg",
	"權杖六 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_06-Re.jpg",
	"權杖七 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_07-Re.jpg",
	"權杖八 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_08-Re.jpg",
	"權杖九 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_09-Re.jpg",
	"權杖十 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_10-Re.jpg",
	"權杖國王 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_KING-Re.jpg",
	"權杖騎士 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_KNIGHT-Re.jpg",
	"權杖侍者 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_PAGE-Re.jpg",
	"權杖皇后 －\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/tarot/WANDS_QUEEN-Re.jpg",
	"空白"
]

const TarotList2 = ["愚者 ＋",
	"魔術師 ＋",
	"女祭司 ＋",
	"女皇 ＋",
	"皇帝 ＋",
	"教皇 ＋",
	"戀人 ＋",
	"戰車 ＋",
	"力量 ＋",
	"隱者 ＋",
	"命運之輪 ＋",
	"正義 ＋",
	"吊人 ＋",
	"死神 ＋",
	"節制 ＋",
	"惡魔 ＋",
	"高塔 ＋",
	"星星 ＋",
	"月亮 ＋",
	"太陽 ＋",
	"審判 ＋",
	"世界 ＋",
	"聖杯一 ＋",
	"聖杯二 ＋",
	"聖杯三 ＋",
	"聖杯四 ＋",
	"聖杯五 ＋",
	"聖杯六 ＋",
	"聖杯七 ＋",
	"聖杯八 ＋",
	"聖杯九 ＋",
	"聖杯十 ＋",
	"聖杯國王 ＋",
	"聖杯騎士 ＋",
	"聖杯侍者 ＋",
	"聖杯皇后 ＋",
	"錢幣一 ＋",
	"錢幣二 ＋",
	"錢幣三 ＋",
	"錢幣四 ＋",
	"錢幣五 ＋",
	"錢幣六 ＋",
	"錢幣七 ＋",
	"錢幣八 ＋",
	"錢幣九 ＋",
	"錢幣十 ＋",
	"錢幣國王 ＋",
	"錢幣騎士 ＋",
	"錢幣侍者 ＋",
	"錢幣皇后 ＋",
	"寶劍一 ＋",
	"寶劍二 ＋",
	"寶劍三 ＋",
	"寶劍四 ＋",
	"寶劍五 ＋",
	"寶劍六 ＋",
	"寶劍七 ＋",
	"寶劍八 ＋",
	"寶劍九 ＋",
	"寶劍十 ＋",
	"寶劍國王 ＋",
	"寶劍騎士 ＋",
	"寶劍侍者 ＋",
	"寶劍皇后 ＋",
	"權杖一 ＋",
	"權杖二 ＋",
	"權杖三 ＋",
	"權杖四 ＋",
	"權杖五 ＋",
	"權杖六 ＋",
	"權杖七 ＋",
	"權杖八 ＋",
	"權杖九 ＋",
	"權杖十 ＋",
	"權杖國王 ＋",
	"權杖騎士 ＋",
	"權杖侍者 ＋",
	"權杖皇后 ＋",
	"愚者 －",
	"魔術師 －",
	"女祭司 －",
	"女皇 －",
	"皇帝 －",
	"教皇 －",
	"戀人 －",
	"戰車 －",
	"力量 －",
	"隱者 －",
	"命運之輪 －",
	"正義 －",
	"吊人 －",
	"死神 －",
	"節制 －",
	"惡魔 －",
	"高塔 －",
	"星星 －",
	"月亮 －",
	"太陽 －",
	"審判 －",
	"世界 －",
	"聖杯一 －",
	"聖杯二 －",
	"聖杯三 －",
	"聖杯四 －",
	"聖杯五 －",
	"聖杯六 －",
	"聖杯七 －",
	"聖杯八 －",
	"聖杯九 －",
	"聖杯十 －",
	"聖杯國王 －",
	"聖杯騎士 －",
	"聖杯侍者 －",
	"聖杯皇后 －",
	"錢幣一 －",
	"錢幣二 －",
	"錢幣三 －",
	"錢幣四 －",
	"錢幣五 －",
	"錢幣六 －",
	"錢幣七 －",
	"錢幣八 －",
	"錢幣九 －",
	"錢幣十 －",
	"錢幣國王 －",
	"錢幣騎士 －",
	"錢幣侍者 －",
	"錢幣皇后 －",
	"寶劍一 －",
	"寶劍二 －",
	"寶劍三 －",
	"寶劍四 －",
	"寶劍五 －",
	"寶劍六 －",
	"寶劍七 －",
	"寶劍八 －",
	"寶劍九 －",
	"寶劍十 －",
	"寶劍國王 －",
	"寶劍騎士 －",
	"寶劍侍者 －",
	"寶劍皇后 －",
	"權杖一 －",
	"權杖二 －",
	"權杖三 －",
	"權杖四 －",
	"權杖五 －",
	"權杖六 －",
	"權杖七 －",
	"權杖八 －",
	"權杖九 －",
	"權杖十 －",
	"權杖國王 －",
	"權杖騎士 －",
	"權杖侍者 －",
	"權杖皇后 －",
	"空白"
]

const TarotList = ["世界 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/01-World.jpg",
	"信仰 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/02-Faith.jpg",
	"城市 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/03-City.jpg",
	"塔樓 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/04-Tower.jpg",
	"家庭 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/05-Family.jpg",
	"寂靜 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/06-Quiet.jpg",
	"小徑 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/07-Path.jpg",
	"山雲 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/08-Cloud.jpg",
	"岩石 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/09-Rock.jpg",
	"巔峰 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/10-Peak.jpg",
	"日暮 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/11-Sun.jpg",
	"曙光 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/12-Dawn.jpg",
	"沉默 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/13-Silence.jpg",
	"河流 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/14-River.jpg",
	"海洋 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/15-Ocean.jpg",
	"湖泊 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/16-Lake.jpg",
	"瀑布 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/17-Waterfall.jpg",
	"狹縫 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/18-Slit.jpg",
	"田野 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/19-Field.jpg",
	"相反 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/20-Contrast.jpg",
	"街道 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/21-Street.jpg",
	"規則 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/22-Rules.jpg",
	"雪原 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/23-SnowField.jpg",
	"雪山 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/24-SnowMountain.jpg",
	"霧靄 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/25-Haze.jpg",
	"飛翔 ＋\nhttps://raw.githubusercontent.com/zerolinghy/DiscordRollBot/master/assets/dargon_city/26-Fly.jpg",
	"空白"
]

/**
 *  choice 及SORT
 */
async function choice(input, str) {
	let a = input.replace(str[0], '').match(/\S+/ig);
	return str[0] + ' [' + a + '] \n→ ' + a[await rollbase.Dice(a.length) - 1];

}

async function SortIt(input, mainMsg) {
	let a = input.replace(mainMsg[0], '').match(/\S+/ig);
	for (var i = a.length - 1; i >= 0; i--) {
		//var randomIndex = Math.floor(Math.random() * (i + 1));
		//3 -> 210 , 10, 0
		var randomIndex = await rollbase.Dice(i + 1) - 1
		//3 ->
		//console.log('randomIndex: ', randomIndex)
		var itemAtIndex = a[randomIndex];
		a[randomIndex] = a[i];
		a[i] = itemAtIndex;
	}
	return mainMsg[0] + ' \n→ [ ' + a + ' ]';
}

module.exports = {
	rollDiceCommand: rollDiceCommand,
	initialize: initialize,
	getHelpMessage: getHelpMessage,
	prefixs: prefixs,
	gameType: gameType,
	gameName: gameName
};
