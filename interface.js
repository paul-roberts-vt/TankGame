
var moveSpeed = 10;
var rowx;
var rowcolumn;
var zoomcount = 0;

function movescreen()
{

	if (mouse.x < view.x + 120)
	{
		view.x -= Math.abs(mouse.x - (view.x + 150)) * tick * moveSpeed;
	}
	
		
	if (mouse.x > view.x + screen.width - 150)
	{
		view.x += Math.abs(mouse.x - (view.x + screen.width - 150)) * tick * moveSpeed;
	}	

	if (mouse.y < view.y + 150)
	{
		view.y -= Math.abs(mouse.y - (view.y + 150)) * tick * moveSpeed;
	}

	if (mouse.y > view.y + view.height - 120)
	{
		view.y += Math.abs(mouse.y - (view.y + view.height - 150)) * tick * moveSpeed;
	}

	if (view.x <0)
		view.x = 0;
	if (view.x + screen.width > board.columns * board.tilewidth)
		view.x = board.columns * board.tilewidth - screen.width;
	
	if (view.y <0)
		view.y = 0;
	if (view.y + screen.height > board.rows * board.tileheight)
		view.y = board.rows * board.tileheight - screen.height;
}


function HUD()
{
	if (zoom.distanceto(mouse.x, mouse.y) < zheight/13 && (ispressing(CLICK)))
	{
		
		zoomcount++;
		
	}
	if (zoomcount > 2)
		zoomcount = 0;
	
	zheight = zoomcount == 0 ? 400 : zoomcount == 1 ? 700 : 1000;
	
	
	/*
	if (plus.distanceto(mouse.x, mouse.y) < zheight/10 && (ispressing(CLICK) || isholding(CLICK)))
	{
			markh -= 20;
			zheight -= 20;
		if (zheight < 400)
		{
			zheight = 400;
			markh+=20;
		}
	}
	
	*/
	
	
	
	
	drawtext('Enemies Left: ' + badcount, view.x + (zheight/13), view.y + (zheight/20), 'red', (zheight/10), 'fantasy', 'left');
	drawtext('Your Tanks: ' + goodcount, view.x + (zheight/13), view.y + (zheight/6.7), 'blue', (zheight/10), 'fantasy', 'left');
	
	drawtext('Money: ' + Math.floor(score*10), view.x + (zheight/13), view.y + (zheight/4), 'blue', (zheight/10), 'fantasy', 'left');
	
	
	buytank.y = view.y + view.height - (zheight/2.7);
	buytank.x = view.x + (zheight/2.7);
	buytank.height = (zheight/5)
	buytank.width = (zheight/5)
	buytank.setimage('buytank1');
	buytank.draw();
	
	view.width = (zheight*5)/2;
	view.height =  (zheight* 4)/2;
	
	//drawline(view.x + (view.width/40), view.y + (view.height/4), view.x + (view.width/40), view.y + (view.height/1.8), 'black', (zheight/60));
	zoom.height = zheight/6;
	zoom.width = zheight/6;
	zoom.y = view.y + zheight/2;
	zoom.x = view.x + (zheight/5);
	zoom.setimage('papersquare');
	zoom.draw();
	
	drawtext(zoomcount + 1, view.x + (zheight/5), view.y + zheight/1.95, 'black', (zheight/10), 'fantasy');
	
	/*
	plus.y = view.y + (view.height/4);
	plus.x =view.x + (view.width/20);
	plus.setimage('plus');
	plus.draw();
	minus.y = view.y + (view.height/1.8);
	minus.x = view.x + (view.width/20);
	minus.setimage('minus');
	minus.draw();
	minus.height= minus.width = plus.width = plus.height = zheight/18;
	*/



}

/*function newarrow(x, y)
{
	var e = new Object('greenarrow1');
	e.height = 20;
	e.width = 20;
	e.x = tank.x
	e.y = view.y + view.height - 5;
	arrows.push(e);
}
*/

function BuyTroops()
{
	for (i in tanks)
	{
		var base = tanks[i];
		if (score >= 10)
		{
			if (base.type == 2 && base.team == 1)
			{
			
				if (ispressing(CLICK) && buytank.distanceto(mouse.x, mouse.y) <= 50)
				{
					var x = base.x + randint(-200, 200);
					var y = base.y + randint(-200, 200) 
					score -= 10;
					createRawUnit('A', x, y);
				}
			}
		}
		if (badtimer <= 0 && base.type == 2 && base.team == 2 )
		{
			var xb = base.x + randint(-200, 200);
			var yb = base.y + randint(-200, 200) 
			newbad -= 10;
			createRawUnit('B', xb, yb);
			badtimer = timerlength;
			
		}
			
	}
	
	badtimer -= (randint(0, Math.floor(newbadspeed))/10)*tick;
	
}


