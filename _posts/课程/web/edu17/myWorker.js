var tenInteger =new Array();
function createTenInteger(){
	for(var j = 0; j <10;j++){
		tenInteger[j] = Math.floor(Math.random()*90+10);
	}
	postMessage(tenInteger.sort());
	setTimeout("createTenInteger()",1000);
}
createTenInteger();