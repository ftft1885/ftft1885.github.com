function AI2(name)//唯一参数name？
{
	var enemy = playerHash[name].enemy;
	if(!enemy) 
	{
		playerHash[name].enemy = enemy = getBestEnemy(name);
		parrot(name+"发现敌人"+enemy,20,name);
		return;//这个很重要，每回合只能进行一个判断
	}
	//获取敌人，没想出什么参数，获取一个么？
	
	//要设置判断条件，否则会一直执行下去。
	//定义一个参数，任务正在执行。playerHash[name].isTask = true;
	//然后就可以根据权值选择ai该做的事情  
	var action = getAction(name,enemy); 
	if(!playerHash[name].isTask)
	{
		playerHash[name].isTask = true;//注意顺序，先要启动任务，在延迟执行，否则执行两次
		//setTimeout(function(){
			CMD[action](name,enemy,function(){clearInterval(CMDTimer);});//不加会有延迟。
			var CMDTimer = setInterval(function(){
					CMD[action](name,enemy,function(){clearInterval(CMDTimer);playerHash[name].isTask = false;});					
				},config.FPS * 20);			
			//},config.FPS * 20);//也是为了判断操作，空两回合，但是这样的话
		parrot(name+"接受任务向"+enemy+"发出攻击",20,name);	
	}
}

function getAction(name,enemy)//AI的选择不是best，不能叫getBestAction
{
	var action = "attack";//默认最好的操作是攻击，防止愣住
	var score = 0;//评估分为0；得分最高的执行
	if(Math.abs(playerHash[name].loc[0] - playerHash[enemy].loc[0]) < 200)
	{
		action = "attack";
		if(playerHash[name].blood < playerHash[enemy].blood )
		{
			action = "runaway";
		}
		
	}
	return action;
}

function getBestEnemy(name)
{
	for(var key in playerHash)
	{
		if(key != name)
		{
			return key;
			
		}
	}
}

var CMD = //命令函数数组
{
	attack:function(name,enemy,onComplete)
	{
		//显然出了一个问题。判断为走过去的话，就不会打了。
		var length = Math.abs(playerHash[name].loc[0] - playerHash[enemy].loc[0]);
		//var loc = playerHash[enemy].loc;//java中数组永远是引用。。。。
		var loc = [];
		loc[1] = playerHash[enemy].loc[1];
		if(playerHash[enemy].loc[0] >= playerHash[name].loc[0])
		{
			loc[0] = playerHash[enemy].loc[0] - 50;
		}
		else{loc[0] = playerHash[enemy].loc[0] + 50;}
		if(length < 100)
		{
			setAttack(name,enemy);//距离够直接攻击....必须要禁止同时运行。
			onComplete();//此处可以结束
		}
		else
		{	
			//if(!playerHash[name].isTask)
			{
				setWalk(name,loc,function()//走到跟前不好，距离100就可以打了
				{
					setAttack(name,enemy);//这样就可以打完就走了。
					parrot(name+"开始攻击"+enemy,20,name);
				});//距离太远走过去，貌似要回调函数！onComplete！
				
				parrot("距离"+length+"需要走过去",20,name);
			}
		}
		
	},
	runaway:function(name,enemy,onComplete)
	{
		parrot(name+"逃跑",20,name);
		setMoveBy(name,-200,5)
	}
}

function AI(name)//此AI太丑，
{
	//if(playerHash[name].AIStop %%)
	var enemy = null;
	for(var key in playerHash)//搜索目标
	{
		if(key != name)
		{
			enemy = key;
			var length = Math.abs(playerHash[enemy].loc[0] - playerHash[name].loc[0]);
			if(length <= 100 && playerHash[name].action != "attack" )
			{
				if(playerHash[name].blood >= playerHash[enemy].blood)
				{
					//console.log(name+"攻击");
					setAttack(name,enemy);
				}
				else
				{
					
				}
				//console.log(name+"距离"+key+"有"+length);
			}
			if(playerHash[name].blood < playerHash[enemy].blood && playerHash[name].action != "block")
			{
				//console.log(name+"格挡")
				setBlock(name,enemy);
			}
			if(length > 100 && playerHash[name].action != "walk")
			{
				//console.log(name+"xxxxx"+playerHash[name].action)
				//console.log(name+"距离"+key+"有"+length);
				//console.log(key+"+"+playerHash[key].loc[0]);
				//首先要确定有gyl没有进入这个函数				
				setWalk(name,playerHash[enemy].loc);
			}			
		}
	}	
}

/*
	AI格式
	寻找敌人——》有——》作出判断
				没有——》寻找敌人
*/

