function refreshScene(where,x,speed)//很显然这三个参数就是向哪里按什么speed移动x,在移动时都要判断是否移动场景
{	
	//where指向左还是右，x距离（实际坐标），speed，速度	
	//先判断上次调用时间
	var now = new Date().getTime();
	if(now - config.fnInt.scene < 100)//这个100是自己乱加的，以后需考察
		return;
	
	config.fnInt.scene = now;	
	
	clearInterval(config.sceneTimer);//清除之前的命令
	var change = speed/(config.scene.width - window.innerWidth);//换算成按比例的
	x = x / (config.scene.width - window.innerWidth);
	switch(where)
	{
		case "left":	if(config.sceneX == 0) return;
						change = 0 - change;
						endX = config.sceneX - x;
						if(endX < 0)
							endX = 0;
						config.sceneTimer = setInterval(function(){				
							config.sceneX += change;							
							if(config.sceneX <= 0 )
							{		
								config.sceneX = 0;
								clearInterval(config.sceneTimer);
							}
							if(config.sceneX <= endX )
								clearInterval(config.sceneTimer);
						},config.FPS);									
						break;
					
		case "right":	if(config.sceneX == 1) return;
						endX = config.sceneX + x;						
						if(endX > 1)
							endX = 1;
						config.sceneTimer = setInterval(function(){				
							config.sceneX += change;							
							if(config.sceneX >= 1)
							{	
								//console.log( config.sceneX +">="+ endX);
								//console.log(config.sceneX);
								config.sceneX = 1;								
								clearInterval(config.sceneTimer);
							}
							if(config.sceneX >= endX )
								clearInterval(config.sceneTimer);
						},config.FPS);					
						break;
		default:break;
	}
}

function refreshName()
{
	for(var key in playerHash)
	{		
		playerHash[key].oDiv.style.left = playerHash[key].loc[0]+"px";
		playerHash[key].oDiv.style.top = playerHash[key].loc[1]+"px";		
	}
}

function addPlayerInfo()
{
	//左边的人物
	oDivLeft = document.createElement("div");
	oDivLeft.style.cssText = "position:fixed;left:0px;top:0px;width:290px;height:60px;margin:2px;";
	oDivLeft.innerHTML = "<img src='img/ft.png' style='width:60px;height:60px;'></img>"
	+"<div style='position:absolute;left:62px;top:0px;background:#B80000;height:38px;width:230px'></div>"
	+"<div style='position:absolute;left:62px;top:40px;background:#003377;height:20px;width:230px'></div>";
	document.body.appendChild(oDivLeft);
	
	//右边的人物
	oDivRight = document.createElement("div");
	oDivRight.style.cssText = "position:fixed;right:0px;top:0px;width:290px;height:60px;margin:2px;";
	oDivRight.innerHTML = "<img src='img/gyl.png' style='width:60px;height:60px;'></img>"
	+"<div style='position:absolute;left:62px;top:0px;background:#B80000;height:38px;width:230px'></div>"
	+"<div style='position:absolute;left:62px;top:40px;background:#003377;height:20px;width:230px'></div>";
	document.body.appendChild(oDivRight);
}

function Shake(time,level)
{
	var i = 0;
	var fudu = 3;
	var initTime = new Date().getTime();

	var shakeTimer = setInterval(function()
	{	
		var now = new Date().getTime();
		var t = (now - initTime)*config.FPS/10000;		
		if(t > time)
		{
			clearInterval(shakeTimer);
			oCanvas.style.top = -fudu + "px";
			oCanvas.style.left = -fudu + "px";
			//console.log(oCanvas.style.top );
		}
		if(i == 0)
		{
			oCanvas.style.top = oCanvas.offsetTop + fudu + "px";
			oCanvas.style.left = oCanvas.offsetLeft + fudu + "px"
			i = 1;
			return;
		}
		if(i == 1)
		{
			oCanvas.style.top = oCanvas.offsetTop - fudu + "px";
			oCanvas.style.left = oCanvas.offsetLeft - fudu + "px"
			i = 0;
			return;
		}
	},level);
}

function addName()
{
	//这是一个给所有player加名字的函数，只要调用就可以加名字，用的div，为啥不用fillText，因为我不会居中
	for(var key in playerHash)
	{
		playerHash[key].oDiv = document.createElement("div");
		playerHash[key].oDiv.innerHTML = playerHash[key].name;
		playerHash[key].oDiv.style.cssText = "position:absolute;color:#EEE;text-align:center;margin-top:-10px;";
		playerHash[key].oDiv.style.width = config.hcr.width/10 + "px";	
		playerHash[key].oDiv.style.left = playerHash[key].loc[0]+"px";
		playerHash[key].oDiv.style.top = playerHash[key].loc[1]+"px";		
		document.body.appendChild(playerHash[key].oDiv);
	}
}

function parrot(text,size,name)
{
	//如何动态显示伤害呢？目标是把console.log用parrot显示，
	//希望参数 悬浮time秒，字的大小size,loc位置
	//如果用div显然简单太多。就用div吧。
	//效果应该是往上飘
	//一个div肯定不够的。只能动态新建div
	var now = new Date().getTime();	
	if(!config.fnInt.parrot[name])
	{
		config.fnInt.parrot[name] = 0.0001;		
	}
	if(now - config.fnInt.parrot[name] < 100)
	{		
		//setTimeout(function()	{parrot(text,size,name);});
		return;
	}
	config.fnInt.parrot[name] = now;
	var speed = 3;
	console.log(playerHash);
	var loc = playerHash[name].loc;
	
	var parrot = document.createElement("div");	
	parrot.style.cssText = "position:absolute;width:200px;height:200px;color:#EE7700;text-align:center;";
	parrot.innerHTML = text;
	parrot.style.fontSize = size + "px";
	parrot.style.left = loc[0] -50 + "px";//+50才是头顶
	parrot.style.top =  loc[1] - 100 + "px";
	document.body.appendChild(parrot);
	var par_time = 0;
	var parrotTimer = setInterval(function()
	{
		par_time++;
		if(par_time < 70)
		{
			parrot.style.top = parrot.offsetTop - speed/5 + "px";
		}
		else
		{
			parrot.style.top = parrot.offsetTop - speed*2 + "px";
		}
		
		if(parrot.offsetTop <= 0)
		{
			parrot.innerHTML = "";
			clearInterval(parrotTimer);
		}
	},10);
}

