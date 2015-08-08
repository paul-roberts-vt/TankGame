
var menubox;
var mapbox;

function centerview()
{
	view.x = -(screen.width - view.width)/2;
	view.y = -(screen.height - view.height)/2;
	
}

function initmenu()
{
	view.width = view.height = 1000;
	setbackground('paper');
	menubox = new Object('menubox');
	menubox.width = menubox.height = 800;
	mode = MODE_MENU;
	menubox.items = [
		{text: 'Play Game', y:300, onclick:initgame},
		{text: 'Map Select', y:500, onclick:initmapselect},
		{text: 'Controls', y:700, onclick:initcredits}
	];
	setboard([]);
	bomb.timer = 10;
	bomb.k = 1;
	bomb.y = view.y + view.height/2;
	bomb.x = view.x + 200;
}

function runmenu()
{
	centerview();
	
	menubox.draw();
	
	if (bomb.timer <= 0)	
	{		
		bomb.setimage('boom' + bomb.k);
		bomb.k += 1;
		bomb.timer = 1;
		if (bomb.k >= 24)
		{
			bomb.k = 1;	
			bomb.timer = 2;
		}
	}
	bomb.width = bomb.height = 150;
	bomb.timer -= tick* 50;
	
	
	for (var i in menubox.items)
	{
		var item = menubox.items[i];
		
		var isover = Math.abs(mouse.y - item.y) < 50;

		
		drawtext(item.text, menubox.x - 250, item.y - 50, isover ? 'black' : 'black', isover ? '100' : '100', 'fantasy', 'left');
		if (isover)
		{
			bomb.y = item.y;
			bomb.x = menubox.x -300;
			bomb.draw();
		}
		if (isover && ispressing(CLICK))
			item.onclick();
	}
	



}


function initcredits()
{

	mode = MODE_CREDITS;
	setboard([]);
}

function runcredits()
{

	drawtext('Adjust Zoom With the 1, 2, 3 options on the Left', view.x + 100, view.y + view.height/2, 'red', 40, 'fantasy', 'left');
	drawtext('Press S and click tank to Select', view.x + 100, view.y + view.height/2 + 50, 'red', 40, 'fantasy', 'left');
	drawtext('Press D and click tank to Deselect', view.x + 100, view.y + view.height/2 + 100, 'red', 40, 'fantasy', 'left');
	drawtext('Press A to Select All Tanks', view.x + 100, view.y + view.height/2 + 150, 'red', 40, 'fantasy', 'left');
	drawtext('Press F to Deselect All Tanks', view.x + 100, view.y + view.height/2 + 200, 'red', 40, 'fantasy', 'left');
	drawtext('Press Q and click tank to transform into mine (increases resources)', view.x + 100, view.y + view.height/2 + 250, 'red', 40, 'fantasy', 'left');
	if (ispressing(CLICK))
		initmenu();
	

}

function newmapitem(c, r)
{
	var item = {};
	
	var x = mapbox.x - mapbox.width/2 + 180;
	var y = mapbox.y - mapbox.height/2 + 180;
	
	item.background = new Object('whitecircle');
	item.background.width = item.background.height = 100;
	item.background.x = x + 150 * c;
	item.background.y = y + 150 * r;
	item.mapnumber = r * 5 + c;
	
	return item;
}

function initmapselect()
{

	view.width = view.height = 1000;
	setbackground('paper');
	mapbox = new Object('papersquare');
	mapbox.width = mapbox.height = 1000;
	mode = MODE_LEVELSELECT;
	mapbox.items = [];
	var column, row;
	for (column = 0;  column < 5; column ++)
	{
		for (row = 0; row < 5; row++)
		{
			mapbox.items.push(newmapitem(column, row));
		}
	}
}
function runlevelselect()
{
	mapbox.draw()
	var isselecting = false;
	for (var i in mapbox.items)
	{
		var item = mapbox.items[i];
		item.background.draw();
		drawtext(item.mapnumber + 1, item.background.x, item.background.y, 
			'black', 50);
			
		if (ispressing(CLICK))
		{	
			if(item.background.ismouseover())
			{
				initmap(item.mapnumber);
				isselecting = true;
			}
			
		}
	}
	
	if (ispressing(CLICK) && isselecting == false)
		initmenu();
	
}




function initgame()
{
	initmap(0);

}