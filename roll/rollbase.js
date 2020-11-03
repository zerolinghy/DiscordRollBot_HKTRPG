let rply = [];
////////////////////////////////////////
//////////////// 擲骰子運算
////////////////////////////////////////


function Dice(diceSided) {
	return Math.floor((Math.random() * diceSided) + 1)
}

function sortNumber(a, b) {
	return a - b
}

function RollDice(inputStr) {
	//先把inputStr變成字串（不知道為什麼非這樣不可）
	let comStr = inputStr.toString();
	let finalStr = '[';
	let temp = 0;
	var totally = 0;
	for (let i = 1; i <= comStr.split('d')[0]; i++) {
		temp = Dice(comStr.split('d')[1]);
		totally += temp;
		finalStr = finalStr + temp + '+';
	}

	finalStr = finalStr.substring(0, finalStr.length - 1) + ']';
	finalStr = finalStr.replace('[', totally + '[');
	return finalStr;
}

function FunnyDice(diceSided) {
	return Math.floor((Math.random() * diceSided)) //猜拳，從0開始
}

function BuildDiceCal(inputStr) {

	//首先判斷是否是誤啟動（檢查是否有符合骰子格式）
	if (inputStr.toLowerCase().match(/\d+d\d+/) == null) return undefined;

	//排除小數點
	if (inputStr.toString().match(/\./) != null) return undefined;

	//先定義要輸出的Str
	let finalStr = '';

	//一般單次擲骰
	let DiceToRoll = inputStr.toString().toLowerCase();
	if (DiceToRoll.match('d') == null) return undefined;

	//寫出算式
	let equation = DiceToRoll;
	while (equation.match(/\d+d\d+/) != null) {
		let tempMatch = equation.match(/\d+d\d+/);
		if (tempMatch.toString().split('d')[0] > 200) return '欸欸，不支援200D以上擲骰';
		if (tempMatch.toString().split('d')[1] == 1 || tempMatch.toString().split('d')[1] > 500) return '不支援D1和超過D500的擲骰';
		equation = equation.replace(/\d+d\d+/, BuildRollDice(tempMatch));
	}

	//計算算式
	let answer = eval(equation.toString());
	finalStr = equation + ' = ' + answer;

	return finalStr;

}

function BuildRollDice(inputStr) {
	//先把inputStr變成字串（不知道為什麼非這樣不可）
	let comStr = inputStr.toString().toLowerCase();
	let finalStr = '(';

	for (let i = 1; i <= comStr.split('d')[0]; i++) {
		finalStr = finalStr + Dice(comStr.split('d')[1]) + '+';
	}

	finalStr = finalStr.substring(0, finalStr.length - 1) + ')';
	return finalStr;
}


////////////////////////////////////////
//////////////// 普通ROLL
////////////////////////////////////////
function nomalDiceRoller(inputStr, text0, text1, text2) {

	//首先判斷是否是誤啟動（檢查是否有符合骰子格式）
	// if (inputStr.toLowerCase().match(/\d+d\d+/) == null) return undefined;

	//再來先把第一個分段拆出來，待會判斷是否是複數擲骰
	let mutiOrNot = text0.toLowerCase();

	//排除小數點
	if (mutiOrNot.toString().match(/\./) != null) return undefined;

	//先定義要輸出的Str
	let finalStr = '';
	let test1 = text0.match(/[(]/g) || '';
  let test2 = text0.match(/[)]/g) || '';
  if (test2.length != test1.length) return;


	//是複數擲骰喔
	if (mutiOrNot.toString().match(/\D/i) == null && text1) {
    if (text1.replace(/\d|[+]|[-]|[*]|[/]|[(]|[)]|[d]|[>]|[<]|[=]|[k]|[h]|[l]/ig, '')) return;
    finalStr = text0 + '次擲骰：\n' + text1 + ' ' + (text2 || '') + '\n'
    for (let i = 0; i < mutiOrNot; i++) {
      finalStr += i + 1 + '# ' + await onetimeroll(text1) + '\n'
    }
  } else {
    if (text0.replace(/\d|[+]|[-]|[*]|[/]|[(]|[)]|[d]|[>]|[<]|[=]|[k]|[h]|[l]/ig, '')) return;
    finalStr = text0 + '：' + (text1 || '') + '\n'
    finalStr += await onetimeroll(text0)
  }

  return finalStr;
}

function onetimeroll(text0) {
	let Str = ''

  // 寫出算式
  let equation = text0
  while (equation.match(regex) != null) {
    // let totally = 0
    let tempMatch = equation.match(regex)
    if (tempMatch[1] > 1000 || tempMatch[1] <= 0) return '不支援零顆以下及一千顆骰以上'
    if (tempMatch[2] < 1 || tempMatch[2] > 9000000000000000) return '不支援一以下及九千兆以上'
    equation = equation.replace(regex, await RollDice(tempMatch))
  }
  // 計算算式
  let aaa = equation
  aaa = aaa.replace(/\[.+?\]/ig, '')
  let answer = math.eval(aaa.toString()).toString().replace(/true/i, "成功").replace(/false/i, "失敗");
  if (equation.match(/[\s\S]{1,250}/g).length > 1) {
    Str = answer + '（計算過程太長，僅顯示結果）';
  } else {
    Str = equation + ' = ' + answer
  }
  return Str

}

module.exports = {
	Dice: Dice,
	sortNumber: sortNumber,
	FunnyDice: FunnyDice,
	BuildDiceCal: BuildDiceCal,
	BuildRollDice: BuildRollDice,
	nomalDiceRoller: nomalDiceRoller
};
