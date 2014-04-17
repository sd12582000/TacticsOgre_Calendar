function TacticsOrge_Date(){
	var date;
	var day;
	var month;
	var month_str;
}
function initializeTacticsOrge_Date(date,day,month){
	//初始化TacticsOrge_Date並回傳物件
	var item=new TacticsOrge_Date();
	item.date=date;
	item.day=day;
	item.month=month;
	var to_month_str=new Array("神龍の月","地龍の月","水龍の月","影龍の月","白龍の月","炎龍の月"
			,"風龍の月","金龍の月","雷龍の月","闇龍の月","海龍の月","黑龍の月","雙龍の月","火龍の月","光龍の月");
	item.month_str=to_month_str[month];
	return item;
}

//獲取圖檔目錄預設為js檔目錄下IMG資料夾
var initpath=new function(){
	var js=document.scripts;
	js=js[js.length-1].src.substring(0,js[js.length-1].src.lastIndexOf("/")+1);
	var path=js+"IMG/";
	this.getpath=function(){
		return path;
	}
}
function TacticsOrge_calandar(){
	var nowdate;
    var to_Date;
    var width;
    var height;
    //TacticsOrge each month day
    var to_month_num=new Array(24,25,23,24,25,24,24,25,24,24,25,24,24,25,25);
    var path=initpath.getpath();

	this.creat_calandar=function() {
		var obj=document.getElementById('to_calendar');
		if(obj.style.width==""){
			obj.style.width="158px"
		}
		if(obj.style.height==""){
			obj.style.height="168px"
		}
		var width=parseInt(obj.style.width);
		var height=parseInt(obj.style.height);
		nowdate=new Date();
		to_Date=transform(nowdate);

		drawPaint(obj,width,height);

		//每3秒檢查日期是否更換
		setInterval(function(){
			update(obj,width,height);
		},3000);
	}
	function update(obj,width,height){
		var ontime_now=new Date();
		if(ontime_now.getDate()!=nowdate.getDate()){
			nowdate=ontime_now;
			to_Date=transform(nowdate);
			obj.removeChild(obj.childNodes[0]);
			drawPaint(obj,width,height);
		}
	}
	function drawPaint(obj,width,height){
		//html5 canvas
		var can=document.createElement("canvas");
		can.width=158
		can.height=168

		var ctx = can.getContext("2d");

		img=new Image();
		img.src=path+"background.png";
		//load background_pic
		img.onload=function(){
			var mon_img=new Image();
			mon_img.src=path+to_Date.month+".gif";
			//load month_pic
			mon_img.onload=function(){
				ctx.drawImage(img,0,0);
				ctx.drawImage(mon_img,40,30);
				drawText(obj,can);
			}
		}
		//resize
		can.width=width
		can.height=height
		ctx.scale(width/158,height/168);
	}
	function drawText(obj,can){
		var ctx = can.getContext("2d");
		ctx.font = "8pt Calibri";
		ctx.strokeStyle="#FFA500"
		ctx.strokeText(nowdate.getFullYear()+"年",75,14);

		ctx.font = "10pt Calibri";
		ctx.strokeStyle="#F9F900"
		ctx.strokeText(to_Date.month_str+to_Date.date+"日",78,55);

		//========定位該月份一號星期==========
		var startdata=to_Date.date;
		var startday=to_Date.day;
		while(startdata>7){
			startdata-=7;
		}
		while(startdata>1){
			startdata--;
			startday=(startday+6)%7;
		}
		//==================
		var tx=18;
		var ty=87;
		var dx=22;
		var dy=16;
		var layer=0;

		ctx.font = "12pt Calibri";
		ctx.textAlign = "right";

		var today=new Image();
		today.src=path+"today.gif";
		today.onload=function(){
			while(startdata<=to_month_num[to_Date.month]){
				if(startday==6){
					//土曜日藍色
					ctx.strokeStyle="#37FDFF";
				}
				else if(startday==0){
					//日曜日綠色
					ctx.strokeStyle="#00FA03";
				}
				else {
					//平日白色
					ctx.strokeStyle="#ffffff";
				}

				if(startdata==to_Date.date){
					//當天特別處理
					ctx.drawImage(today,tx-16+dx*startday,ty-16+dy*layer);
					//紅色
					ctx.strokeStyle="#FA0300";
				}
				ctx.strokeText(startdata,tx+dx*startday,ty+dy*layer);
				if(startday==6)layer++;
				startdata++;
				startday=(startday+1)%7
			}
			obj.appendChild(can);
		}
	}
	function transform(date){
		var month_num=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
		//閏年判斷
		var y=date.getFullYear();
		if(y%4==0&&y%4!=0||y%4==0){
			month_num[2-1]++;
			//TacticsOrge 是潤水龍の月
			to_month_num[2]++;
		}
		var totalday=date.getDate()
		for(var i=0;i<date.getMonth();i++){
			totalday+=month_num[i]
		}
		var month_iterator=0;
		while(totalday>to_month_num[month_iterator]){
			totalday-=to_month_num[month_iterator];
			month_iterator++;
		}
		return new initializeTacticsOrge_Date(totalday,date.getDay(),month_iterator);
	}
	return this;
}