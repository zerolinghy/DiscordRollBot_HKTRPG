var rollbase = require('./rollbase.js');
let rply = {};
////////////////////////////////////////
//////////////// D66
////////////////////////////////////////
function d66(text) {
	let returnStr = '';
	if (text != null) {
		returnStr = 'D66：' + text + ' → ' + rollbase.Dice(6) + rollbase.Dice(6);
	} else {
		returnStr = 'D66 → ' + rollbase.Dice(6) + rollbase.Dice(6);
	}
	rply.text = returnStr;
	return rply;
}
////////////////////////////////////////
//////////////// D66s
////////////////////////////////////////
function d66s(text) {
	let temp0 = rollbase.Dice(6);
	let temp1 = rollbase.Dice(6);
	let returnStr = '';
	if (temp0 >= temp1) {
		let temp2 = temp0;
		temp0 = temp1;
		temp1 = temp2;
	}
	if (text != null) {
		returnStr = 'D66s：' + text + ' → ' + temp0 + temp1;
	} else {
		returnStr = 'D66s → ' + temp0 + temp1;
	}
	rply.text = returnStr;
	return rply;
}
////////////////////////////////////////
//////////////// D66n
////////////////////////////////////////
function d66n(text) {
	let temp0 = rollbase.Dice(6);
	let temp1 = rollbase.Dice(6);
	let returnStr = '';
	if (temp0 <= temp1) {
		let temp2 = temp0;
		temp0 = temp1;
		temp1 = temp2;
	}
	if (text != null) {
		returnStr = 'D66n：' + text + ' → ' + temp0 + temp1;
	} else {
		returnStr = 'D66n → ' + temp0 + temp1;
	}
	rply.text = returnStr;
	return rply;
}
////////////////////////////////////////
//////////////// xBy
////////////////  xBy<>=z  成功数1
////////////////  xBy Dz   成功数1
////////////////////////////////////////
function xBy(triggermsg, text01, text02) {
	//	console.log('dd')
	let match = /^((\d+)(b)(\d+))(|(([<]|[>]|)(|[=]))(\d+))$/i.exec(triggermsg);
	//判斷式 0:"5b10<=80" 1:"5b10" 2:"5" 3:"b" 4:"10" 5:"<=80" 6:"<=" 	7:"<" 8:"=" 	9:"80"
	//console.log('match', match)
	let match01 = /^((|d)(\d+))$/i.exec(text01);
	//console.log('match01', match01)
	//判斷式 0:"d5"  1:"d5" 2:"d" 3:"5"
	let text = "";
	if (text01) text = text01
	if (!match[5] && match01 && match01[2].toLowerCase() == 'd' && !isNaN(match01[3])) {
		match[6] = "<";
		match[7] = "=";
		match[8] = match01[3]
		triggermsg += "<=" + match01[3]
		match = /^((\d+)(b)(\d+))(|(([<]|[>]|)(|[=]))(\d+))$/i.exec(triggermsg);
		text = ""
		if (text02) text = text02
	}
	if (!match[5] && match01 && !match01[2] && !isNaN(match01[3])) {
		match[6] = ">";
		match[7] = "=";
		match[8] = match01[3]
		triggermsg += ">=" + match01[3]
		match = /^((\d+)(b)(\d+))(|(([<]|[>]|)(|[=]))(\d+))$/i.exec(triggermsg);
		text = ""
		if (text02) text = text02
	}
	let returnStr = '(' + triggermsg + ')';
	//console.log(match)
	//	console.log(match01)
	let varcou = new Array();
	let varsu = 0;
	for (var i = 0; i < Number(match[2]); i++) {
		varcou[i] = rollbase.Dice(match[4]);
	}
	//	console.log(varcou)
	//varcou.sort(rollbase.sortNumber);
	//(5B7>6) → 7,5,6,4,4 →

	for (var i = 0; i < varcou.length; i++) {
		switch (true) {
			case (match[7] == "<" && !match[8]):
				if (varcou[i] < match[9])
					varsu++;
				else {
					//console.log('01: ', varcou[i])
					varcou[i] = strikeThrough(varcou[i])
				}
				break;
			case (match[7] == ">" && !match[8]):
				if (varcou[i] > match[9])
					varsu++;
				else {
					//	console.log('02: ', varcou[i])

					varcou[i] = strikeThrough(varcou[i])
				}
				break;
			case (match[7] == "<" && match[8] == "="):
				if (varcou[i] < match[9] || varcou[i] == match[9])
					varsu++;
				else {
					//	console.log('03: ', varcou[i])

					varcou[i] = strikeThrough(varcou[i])
				}
				break;
			case (match[7] == ">" && match[8] == "="):
				if (varcou[i] > match[9] || varcou[i] == match[9])
					varsu++;
				else {
					//	console.log('04: ', varcou[i])

					varcou[i] = strikeThrough(varcou[i])
				}
				break;
			case (match[7] == "" && match[8] == "="):
				if (varcou[i] == match[9])
					varsu++;
				else {
					//	console.log('05: ', varcou[i])
					//	console.log('match[7]: ', match[7])
					varcou[i] = strikeThrough(varcou[i])
				}
				break;
			default:
				break;
		}
	}
	returnStr += ' → ' + varcou.join(', ');
	if (match[5]) returnStr += ' → 成功數' + varsu
	if (text) returnStr += ' ；　' + text
	rply.text = returnStr;
	return rply;
}
////////////////////////////////////////
//////////////// xUy
////////////////  (5U10[8]) → 17[10,7],4,5,7,4 → 17/37(最大/合計)
////////////////  (5U10[8]>8) → 1,30[9,8,8,5],1,3,4 → 成功数1
////////////////////////////////////////

function xUy(triggermsg, text01, text02, text03) {
	var match = /^(\d+)(u)(\d+)/i.exec(triggermsg); //判斷式  5u19,5,u,19,
	var returnStr = '(' + triggermsg + '[' + text01 + ']';
	if (Number(text02) <= Number(match[3]) && text02 != undefined) {
		returnStr += '>' + text02 + ') → ';
		if (text03 != undefined) returnStr += text03 + ' → ';
	} else {
		returnStr += ') → ';
		if (text02 != undefined) returnStr += text02 + ' → ';
	}
	let varcou = new Array();
	let varcouloop = new Array();
	let varcoufanl = new Array();
	let varcounew = new Array();
	var varsu = 0;
	if (text01 <= 2) {
		rply.text = '加骰最少比2高';
		return rply;
	}

	for (var i = 0; i < Number(match[1]); i++) {
		varcou[i] = rollbase.Dice(match[3]);
		varcounew[i] = varcou[i];
		varcouloop[i] = varcounew[i];
		for (; varcounew[i] >= text01;) {
			varcounew[i] = rollbase.Dice(match[3]);
			varcouloop[i] += ', ' + varcounew[i];
			varcou[i] += varcounew[i];
		}

	}
	for (var i = 0; i < varcouloop.length; i++) {
		if (varcouloop[i] == varcou[i]) {
			returnStr += varcou[i] + ', ';
		} else returnStr += varcou[i] + '[' + varcouloop[i] + '], ';

	}
	returnStr = returnStr.replace(/, $/ig, '');

	if (Number(text02) <= Number(match[3])) {
		let suc = 0;

		////////////////  (5U10[8]>8) → 1,30[9,8,8,5],1,3,4 → 成功数1
		for (var i = 0; i < varcou.length; i++) {
			if (Number(varcou[i]) >= Number(text02)) suc++;
		}
		returnStr += ' → 成功数' + suc;
	} else
	////////////////  (5U10[8]) → 17[10,7],4,5,7,4 → 17/37(最大/合計)

	{
		returnStr += ' → ' + Math.max.apply(null, varcou)
		returnStr += '/' + varcou.reduce(function (previousValue, currentValue) {
			return previousValue + currentValue;
		}) + '(最大/合計)';
	}
	rply.text = returnStr;
	return rply;
}
module.exports = {
	d66: d66,
	d66s: d66s,
	d66n: d66n,
	xBy: xBy,
	xUy: xUy
};
