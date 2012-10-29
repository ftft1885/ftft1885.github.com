function setMoveBy(name,length,speed,onComplete)
{
	//移动函数，向正前方移动length距离，length可以为负
	var initx = playerHash[name].loc[0];
	clearInterval(playerHash[name].walkTimer);
	playerHash[name].action = "walk";
	var walkIndexArr = [[1,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1]];
	speed = config.moveSpeed * speed;
	var i = 1;
	playerHash[name].from = [5,10,1,1];
	if(!playerHash[name].face)
	{
		speed = 0 - speed;//此处将未定义当成right
		console.warn(speed);
	}
	playerHash[name].walkTimer = setInterval(function(){
		
		
		changePlayerLoc(name,speed);		
		//var length = Math.abs(playerHash[name].loc[0] - loc[0]);
		if(Math.abs(initx - playerHash[name].loc[0]) >= Math.abs(length)	|| playerHash[name].action != "walk") 
		{			
			if(onComplete)
				onComplete();//结束时调用回调函数。				
			
			clearInterval(playerHash[name].walkTimer);	
			return;
		}
		if(i >= walkIndexArr.length)	i = 0;	
		playerHash[name].from[2] = walkIndexArr[i][0];
		playerHash[name].from[3] = walkIndexArr[i][1];
		playerHash[name].from[4] = walkIndexArr[i][2];
		refreshName();// 由于位置变了，我们需要更新位置
		i++;
	},config.FPS);	
}

function setWalk(name,loc,onComplete)
{
	//先要去掉之前的攻击指令。不管有没有
	clearInterval(playerHash[name].walkTimer);//每个人每个状态一个计时器，防止去掉所有的
	playerHash[name].action = "walk";
	var walkIndexArr = [[1,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1]];
	var xspeed = config.moveSpeed;
	var i = 1;
	playerHash[name].from = [5,10,1,1];
	playerHash[name].walkTimer = setInterval(function(){		
		
		if(playerHash[name].face == "left" || playerHash[name].face == "turnLeft")	
		{
			xspeed = 0 - config.FPS / 3;			
		}
		//playerHash[name].loc[0] += xspeed;
		changePlayerLoc(name,xspeed);
		/*
		if(playerHash[name].loc[0] + 100 > window.innerWidth)
		{
			parrot("超出距离",20,name);
			if(!config.sceneTimer)
			{
				refreshScene("right",0.2,1)
				//refreshScene(where,x,speed)				
			}
		}
		*/
		var length = Math.abs(playerHash[name].loc[0] - loc[0]);
		if(length < 30	|| playerHash[name].action != "walk") 
		{
			//恢复状态用的
			//console.log("进入次函数的情况只有两种");
			//console.log(playerHash[name].loc[0] +"	"+ loc[0]);
			//console.log(playerHash[name].action);
			//setTimeout(function(){alert(playerHash[name].action)},1000)
			
			if(onComplete)
				onComplete();//结束时调用回调函数。
				
			
			clearInterval(playerHash[name].walkTimer);	
			return;
		}
		if(i >= walkIndexArr.length)	i = 0;	
		playerHash[name].from[2] = walkIndexArr[i][0];
		playerHash[name].from[3] = walkIndexArr[i][1];
		playerHash[name].from[4] = walkIndexArr[i][2];
		refreshName();// 由于位置变了，我们需要更新位置
		i++;
	},config.FPS);	
}



function setBlock(name,enemy)//格挡
{
	clearInterval(playerHash[name].blockTimer);
	playerHash[name].action = "block";
	var blockIndexArr = [[1,4],[2,4]];
	var i = 0;
	playerHash[name].from = [5,10,1,4];
	playerHash[name].blockTimer = setInterval(function()
	{
		if(i == blockIndexArr.length)
		{
			clearInterval(playerHash[name].blockTimer);
			playerHash[name].action = "none";
			return;
		}
		//if(i == 2 && playerHash[enemy].loc[0] - playerHash[name].loc[0] < 100 ) {getHert(enemy,10)};
		if(playerHash[name].face == "left"||playerHash[name].face == "turnLeft")
		{
			//console.log(name+"朝"+"left")
			playerHash[name].loc[0] += 10;
		}
		else
		{
			//console.log(name+"朝"+"right")//朝右就要向左退
			playerHash[name].loc[0] -= 10;
		}
		//console.info(playerHash[name].from);
		playerHash[name].from[2] = blockIndexArr[i][0];
		playerHash[name].from[3] = blockIndexArr[i][1];
		playerHash[name].from[4] = blockIndexArr[i][2];
		i++;
		refreshName();
	},config.FPS*5);
	playerHash[name].isBlock = Math.random() * 1.6;
	if(playerHash[name].isBlock > 1)//格挡成功
	{
		setTimeout(function()
		{
			setFuckback(name,enemy);
		},config.FPS * 10)
	}
}

function setFuckback(name,enemy)
{
	var blood = Math.random()*30;
	getHurt(enemy,blood);
	console.log(name+"反击了"+enemy + "_"+blood+"血");
	parrot(name+"反击!",20,enemy)
}

function setAttack(name,enemy)
{	
	clearInterval(playerHash[name].attackTimer);
	playerHash[name].action = "attack";
	var attackIndexArr = [[1,2],[2,2],[3,2,2],[5,2]];
	var i = 1;
	playerHash[name].from = [5,10,1,2];
	playerHash[name].attackTimer = setInterval(function()
	{
		
		if(i >= attackIndexArr.length) i = 0;
		if(i == 2 && playerHash[enemy].loc[0] - playerHash[name].loc[0] < 100 ) 
		{
			var blood = Math.random()*10+5;
			if(playerHash[enemy].blood - blood <= 0)
			{
				blood = playerHash[enemy].blood;				
			}
			console.log(name+"打了"+enemy+"_"+blood+"血")
			if(playerHash[enemy].isBlock > 1)//被格挡
			{
				getHurt(enemy,blood * 0.2);
			}
			else
			{
				getHurt(enemy,blood)
			}
		};
		playerHash[name].from[2] = attackIndexArr[i][0];
		playerHash[name].from[3] = attackIndexArr[i][1];
		playerHash[name].from[4] = attackIndexArr[i][2];
		
		if(playerHash[name].action != "attack")	clearInterval(playerHash[name].attackTimer);//极其重要，计时器一定要加停止条件，不然出大问题
		
		i++;
	},config.FPS*5);
	
}

function getHurt(name,blood)
{//方法是div变短。
	//console.log(name+":"+blood);
	if(!playerHash[name].bloodPos)
	{
		return;
	}
	where = playerHash[name].bloodPos;	
	if(playerHash[name].blood - blood <= 0)
	{
		playerHash[name].blood = 0;
		//alert(name +"被打败了");
		switch (where)
		{
			case "left":
				var bloodDiv = oDivLeft.getElementsByTagName("div")[0];			
				bloodDiv.style.width = 0  + "px";
			//	console.warn(name+"血条长度"+bloodDiv.style.width);
				break;
			case "right": 
				var bloodDiv = oDivRight.getElementsByTagName("div")[0];
				
				bloodDiv.style.width = 0 + "px";
				//console.warn(name+"血条长度"+bloodDiv.style.width);
			//	console.log(bloodDiv.offsetWidth);
				
				break;
			default:return;
		}		
		end();
		
	}
	playerHash[name].blood -= blood;
	var dec = playerHash[name].blood / 100;
	//console.log(name+":"+ playerHash[name].blood);
	switch (where)
	{
		case "left":
			var bloodDiv = oDivLeft.getElementsByTagName("div")[0];			
			bloodDiv.style.width = 230 * dec  + "px";
			//console.warn(name+"血条长度"+bloodDiv.style.width);
			break;
		case "right": 
			var bloodDiv = oDivRight.getElementsByTagName("div")[0];
			
			bloodDiv.style.width = 230 * dec + "px";
			//console.warn(name+"血条长度"+bloodDiv.style.width);
		//	console.log(bloodDiv.offsetWidth);
			
			break;
		default:return;
	}		
	if(blood >= 20)	Shake(1,blood);
	
}

function changePlayerLoc(name,x)
{
	/*
		参数：name,x  x其实是speed
		专门写个改变坐标的函数
		因为每次改变坐标都有可能改变背景图
			且肯定改变名字位置
	*/
	if(x == 0) return;
	if(x > 0)//两种情况，超出屏幕或者正常走
	{
		if(playerHash[name].loc[0] + 100 + x > window.innerWidth)
		{			
			//会导致不停调用，急需做出一个最短函数调用时间，且过期作废
			//注意超出屏幕的画自己不动，其他人就要动。
			for(var key in playerHash)
			{
				if(key != name)
				{
					playerHash[key].loc[0] -= x;
					refreshName(name);
				}
			}
			refreshScene("right",100,x);			
			return;
		}
	}
	if(x < 0)
	{
		if(playerHash[name].loc[0] - 100 + x < 0)
		{
			for(var key in playerHash)
			{
				if(key != name)
				{
					playerHash[key].loc[0] -= x;
				}
			}
			refreshScene("left",100,x);
			refreshName(name);
			return;
		}
	}	
	playerHash[name].loc[0] += x;	
	refreshName(name);
}