/* 3.交互行为设计 */
//3.1 系统变量初始化
var db = null; //定义保存数据对象结果集的变量
var request, objStore1;
var DBName = "books",DBVersion= 1; //定义数据库名称和版本号
var bookLists = [{
		title:"Web前端开发技术-Html、Css、JavaScript",author:"储久良",isbn:"9787302431695"
	},
	{title:"计算机组成原理（修订版）",author:"张工宣",isbn:"9787302433637"
	},
	{title:"Html/Css/JavaScript标准教程",author:"本书编委会",isbn:"9787121079344"
	},
	{title:"Html+CSS网页设计与布局从入门到精通",author:"温谦",isbn:"9787115183392"
	},
	{title:"Java 2 实用教程",author:"耿祥义",isbn:"9787302464259"
	}
	];
//3.2 浏览器支持的判断
var indexedDB = window.indexedDB || windows.mozIndexedDB || windows.msIndexedDB || window.webkitIndexedDB;
//3.3 定义 创建indexedDB数据库的方法，并监听3个事件
function createDB(dbName, dbVersion) {
	request = indexedDB.open(dbName,dbVersion); //返回一个IDBrequest对象
	request.onerror = function(event){
		alert("打开数据库失败："+ event.target.errorCode);
		console.log("打开数据库失败："+ event.target.errorCode);
	};
	request.onsuccess = function(event){
		alert("打开数据库成功！");
		db = event.target.result; //给DB赋值
		var trans1 =db.transaction(["books"],"readwrite");
		objectStore1 = trans1.objectStore("books");  //创建books对象仓库
	};

	request.onupgradeneeded = function(event){
		alert("版本变化！"+"版本号为"+event.newVersion);
		console.log("版本变化！"+"版本号为"+event.newVersion);
		db = event.target.result;  //为books对象数据库创建事件对象
		if(!db.objectStoreNames.contains("books")){//如果不存在，则创建
			 objStore1 = db.createObjectStore("books",{keyPath:"isbn"}); //创建对象仓库
			 objStore1.createIndex("by_title",'title',{unique:false});
			 objStore1.createIndex("by_author",'author',{unique:false});
			 objStore1.createIndex("by_isbn",'isbn',{unique:true});
			 alert("objStore1-need" +objStore1);
		}
	};
}
//3.4  启动创建数据事件处理程序
createDB(DBName,DBVersion);
function $(id){
	return document.getElementById(id);
}
function loadBooks(){  //初始化加载5中图书
	$("booklist").innerHTML = "";  //加载前线清空列表
	var trans1 = db.transaction(["books"],"readwrite");
	var objStore1 = trans1.objectStore("books");
	alert("开始装载图书...");
	for(var i = 0; i < bookLists.length;i++){ //采用for循环将3个对象添加到指定对象仓库
		var request = objStore1.put(bookLists[i]); //put存在则更新，不存在则添加对象到books中
		request.onerror = function(){
			console.error('数据库中已有该对象不能重复添加！！');
		};
		request.onsuccess = function(){ //控制台输出或莫格HTML标记内输出
			console.log('对象已成功存入对象仓库中！');
		};
	}	
}
function showBooks(){  //显示所有图书
	var query = document.forms.list.query.value;
	$("booklist").value = "";   //加载前先清空列表
	var transaction = db.transaction(["books"],"readonly"); //为book定义制度事件
	var objStore = transaction.objectStore("books"); //获取books对象仓库
	var index = objStore.index("by_title");  //按title进行索引
	var range = IDBKeyRange.bound(query,query+"z"); //生成范围range对象
	var result= (query.length > 0) ? index.openCursor(range):index.openCursor();
	var i = 1;
	result.onsuccess = function(e){  //打开索引游标，启动成功监听事件
		var cursor = e.target.result;  //获取结果集
		if(cursor){    //通过控制台输出相关信息
			text1= i + "-" + cursor.value.title + "," + cursor.value.author + "," + cursor.value.isbn;
			$("booklist").value += text1 + "\n";
			cursor.continue();
			i++;
		}else {
			console.log("没有检索内容");
		}
	};
}
function addBook(){ //添加一本图书进入客户端图书库
	var title = document.forms.add.title.value;
	var author = document.forms.add.author.value;
	var isbn = document.forms.add.isbn.value;
	var onebook = {
		title:title,
		author:author,
		isbn:isbn
	};
	if(title.length > 0 && author.length > 0 && isbn.length > 0) {
		var trans2 = db.transaction(["books"],"readwrite");
		var objStore2 = trans2.objectStore("books");
		var request1 = objStore2.add(onebook);
		trans2.oncomplete= function(event){
			alert("图书成功添加！界面即将被清空！");
			document.forms.add.title.value = "";
			document.forms.add.author.value = "";
			document.forms.add.isbn.value = "";
			window.location.reload();
		};
	}
}
function deleteDatabase(){
	if(indexedDB) {
		var deleteDB = indexedDB.deleteDatabase("books");
		deleteDB.onsuccess= function(e){
			alert("数据库删除成功，即将重新初始化...");
			windows.location.reload();
		};
	}
}
function deleteAllBooks(){
	var trans1 = db.transaction(["books"],"readwrite");
	var objStore1 = trans1.objectStore("books");
	objStore1.clear();
	trans1.oncomplete = function(e){
		alert("所有图书清楚成功！");
	};
	trans1.onerror = function(e){
		alert("所有图书清楚失败！");
	};
	window.location.reload();
}
/* 监听Hashchange事件，并绑定事件处理函数 更具hash值，动态地给body修改class属性的值，完成sectrion随导航自动切换*/
window.addEventListener('hashchange',function(){
	switch(location.hash){
	case "#add":
		document.body.className = "add";
		break;
	case "#setting":
		document.body.className = "setting";
		break;
	default:
		document.body.className = "list";
		break;
	}
},false);	

