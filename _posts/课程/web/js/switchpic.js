/*switchpic.js */
//定于全集变量
var curScreen = 1; // 当前显示的图像
var maxScreen = 5; // 最多课前换的图象数
var timer = null;
function $(id) {
	return document.getElementById(id);
}
function switchpic() {
	if (curScreen == maxScreen) {
		curScreen = 1;
	} else {
		curScreen++;
	}
	$("pic").src = "/images/tp" + curScreen + ".jpg"; // 更换图像的文件
}
function reStart() {
	switchpic();
	init();
}
function pause() {
	clearInterval(timer);
}
function init() {
	timer = setInterval('switchpic();', 1000);
}