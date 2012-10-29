
	
function getCanvas(width,height)
{
	body = document.getElementsByTagName('body')[0];
	oCanvas = document.createElement('canvas');
	oDiv = document.createElement('div');
	
	oCanvas.style.cssText="top:0px;left:0px;position:absolute;z-index:-1";
	oCanvas.width=width;
	oCanvas.height=height;
	oCanvas.style.background="#000";
	oCanvas.style.zindex = "-1";
	oDiv.style.cssText = 'width:220px;height:400px;z-index:1;color:white';
	oDiv.innerHTML = "<input id='username' type='text'></input><button id='loginButton' onclick=login()>submit</button>";
	body.appendChild(oCanvas);
	body.appendChild(oDiv);
	return oCanvas.getContext("2d");
}

window.onresize = function()
{
	canvasResize(window.innerWidth,window.innerHeight);
	
} 


function canvasResize(width,height)
{
	oCanvas.width = width;
	oCanvas.height = height;
	//draw();
}