// 1 is Players Tanks. 2 is Computers


function drawtanks()
{

	var i;
	/*for (i in miners)
	{
		miners[i].draw();
		healthbar(miners[i]);
	}
	*/
	for (i in tanks)
	{
		var tank = tanks[i];
		tank.draw();
		if (tank.health > 0)
			healthbar(tank);
	}
}

function movetanks()
{
	if (ispressing(KEY_Y))
		initcredits();	
	var i;
	//for (i in base)
		//base[i].move();
	badcount = 0;
	goodcount = 0;
	badbasecount = 0;
	goodbasecount = 0;

	for (i in tanks)
	
	{
		var tank = tanks[i];
		
		tank.speed = 100;

		if (tank.health > 0)
		{
			if (tank.type != 3)
			{
				if (tank.team==2 && tank.type == 1)
					badcount++;
				else if (tank.type == 2 && tank.team == 2)
					badbasecount++;
				if (tank.type == 2 && tank.team == 1)
					goodbasecount++;
				
		
				
				if (tank.ontile() == 'w')
				{
					tank.speed = 20;
				}
				
				if (tank.ontile() == 'h')
				{
					tank.speed = 50;
				}
				
		
				
				if (tank.team == 1 && tank.type == 1)
				{
					/*if (tank.isonscreen() == false)
					{
						newarrow(tank.x, tank.y);
					}
					
					for (i in arrows)
					{
						arrows[i].draw();
					}
					*/	
					goodcount++;
					if ((ispressing(CLICK)) && (tank.distanceto(mouse.x, mouse.y) < tank.width/1.5) && (isholding(KEY_S)))
						tank.isselected = true;
					
					if (ispressing(CLICK) && (tank.distanceto(mouse.x, mouse.y) < tank.width/1.5) && isholding(KEY_D))
					{
						tank.isselected = false;
						
					}
					
					if (ispressing(CLICK) && (tank.distanceto(mouse.x, mouse.y) < tank.width/1.5) && isholding(KEY_Q))
					{
						
						createRawUnit('N', tank.x, tank.y);
						tank.isdeleted = true;
					}
					
					if (ispressing(CLICK) && tank.isselected == true && (isholding(KEY_S) == false) && (isholding(KEY_D) == false) && (buytank.distanceto(mouse.x, mouse.y) > 100))
					{
						tank.tdestx = mouse.x;
						tank.tdesty = mouse.y;
					}
					if (tank.tdestx != null && (tank.distanceto(tank.tdestx, tank.tdesty) > tank.width))
					{
						tank.velocityat(tank.tdestx, tank.tdesty, tank.speed);
						tank.pointat(tank.tdestx, tank.tdesty);
					}
						
					else
						tank.xvel = tank.yvel = 0;
					
					if (isholding(KEY_A))
					{
						tank.isselected = true;
					}
					
					if (isholding(KEY_F))
					{
						tank.isselected = false;
						
					}
					
					
					drawselecticon(tank);
				}
				
				var closest = 999999;
				tank.target = null;
			}
			else
			{
				if (tank.team == 1)
					score += 0.15*tick;
				else
					
					newbadspeed += 1*tick;
			}
			for (j in tanks)
			{
				if (j != i)
				{
					var other = tanks[j];
					if (other.health > 0)
					{
						if (tank.distanceto(other.x, other.y) < tank.width && tank.type == 1)
						{
							tank.velocityat(other.x, other.y, 3);
							tank.x -= tank.xvel;
							tank.y -= tank.yvel;
						}
						// NEW 5/15/12
						
						
						if (other.team != tank.team && tank.strat != 0)
						{
							if (tank.distanceto(other.x, other.y) < closest)
							{
								closest = tank.distanceto(other.x, other.y);
								tank.target = other;
								
							}
						
						}
						if (tank.strat == 0 && tank.distanceto(other.x, other.y) < closest && other.type == 2 && other.team ==2 && tank.team == 2)
						{
								closest = tank.distanceto(other.x, other.y);
								tank.target = other;
								
						}
						
					}
				
				}
			
			}
			if (tank.team == 2 && tank.type == 1)
			{
				if (tank.target != null && tank.distanceto(tank.target.x, tank.target.y) > 400)
				{
					if (tank.strat != -1)
					{
						tank.velocityat(tank.target.x, tank.target.y, tank.speed);
						tank.pointat(tank.target.x, tank.target.y);
					}
					if (tank.distanceto(tank.target.x, tank.target.y) < 800 && tank.strat == -1)
					{
						tank.velocityat(tank.target.x, tank.target.y, tank.speed);
						tank.pointat(tank.target.x, tank.target.y);
					}
					if (tank.distanceto(tank.target.x, tank.target.y) >= 801 && tank.strat == -1)
						tank.strat = 0;
						
					
				}
				else
					tank.xvel = tank.yvel = 0;
			}
					
			if (tank.target != null && tank.distanceto(tank.target.x, tank.target.y) < 450 && tank.type == 1 )
			{
				if (tank.target.team != tank.team)
				{	
					tank.pointat(tank.target.x, tank.target.y);
					if (tank.bullettimer <= 0)
					{
						newbullet(tank.target.x, tank.target.y, tank.x, tank.y, tank.team);
						tank.bullettimer = 1;
					}
				}
				else
				{
					tank.strat = -1;
					tank.xvel = tank.yvel = 0;
					
				}
					
			}
			
			tank.bullettimer -= tick* BULLETS_PS;
	
			tank.move();	
		}
		
		else
		{
			tank.health = 0;
			tank.angle = 0;
			if (tank.deathtimer <= 0)	
			{		
				tank.setimage('boom' + tank.k);
				tank.width = tank.height = 200;
				tank.draw();
					
				if (tank.k >= 24)
				{
					
					if (tank.team == 1)
					{
						newbad++;
						if (tank.type == 2)
							initcredits();
					}
					if (tank.team == 2)
					{
						timerlength += 10;
						newbadspeed -= 1;
						score += 10;
					}
					tank.isdeleted = true;
					newbad++;
					tank.k = 1;
					
				}
				
				tank.k += 1;
				tank.deathtimer = 1;
				
						
			}
			
			tank.deathtimer -= tick*DeathSpeed;
				
		}
	}	
	
	
	for (var i in bulletlist)
		runbullet(bulletlist[i]);

	purgelist(tanks);
	purgelist(bulletlist);

}

function neartile(ob, xofs, yofs)
{
	var savex = ob.x;
	var savey = ob.y;
	ob.x += xofs;
	ob.y += yofs;
	var on = ob.ontile();
	ob.x = savex;
	ob.y = savey;
	return on;

}

//function 

function createNewUnit(type, column, row)
{
	var x = (column + 0.5) * board.tilewidth;
	var y = (row + 0.5 )* board.tileheight;
	
	createRawUnit(type, x, y);


}

function createRawUnit(type, x, y)
{
	
	var e = new Object();

	if (type == 'X')
	{
	// Base
		e.setimage('base3');
		tanks.push(e);
		e.maxhealth = e.health = 400;
		e.type = 2;
		e.team = 1;
		e.deathtimer = 2;
		e.k = 1;
		e.x = x;
		e.y = y;
		e.strat = 1;
		e.height = e.width = 200;
		view.x = e.x + view.width/2;
		view.y = e.y + view.height/2;
	}
	
	if (type == 'Y')
	{
	// Base
		e.setimage('base5');
		tanks.push(e);
		e.maxhealth = e.health = 400;
		e.type = 2;
		e.team = 2;
		e.deathtimer = 1;
		e.k = 1;
		e.x = x
		e.y = y
		e.strat = 1;
		e.height = e.width = 200;
	}
		
	else if (type == 'A')
	{
		e.height = 50;
		e.setimage('tank');
		e.isselected = false;
		e.bullettimer = 1;
		e.team = 1;
		tanks.push(e);
		e.maxhealth = e.health = 200;
		e.type = 1;
		e.deathtimer = 1;
		e.k = 1;
		e.x = x;
		e.y = y;
		e.strat = 1;
		
	}
	else if (type == 'B')
	{
		e.setimage('tank2');
		e.height = 50;
		e.team = 2;
		e.bullettimer = 1;
		tanks.push(e);
		e.maxhealth = e.health = 200;
		e.type = 1;
		e.strat = randint(0, 5);
		e.deathtimer = 1;
		e.k = 1;
		e.x = x;
		e.y = y;
	}
	else if (type == 'M' || type =='N')
	{
		
		e.height = 100;
		if (type == 'M')
		{
			e.team = 2;
			e.setimage('mine2');
		}
		else
		{
			e.team = 1;
			e.setimage('mine1');
		}
		tanks.push(e);
		e.maxhealth = e.health = 200;
		e.type = 3;
		e.deathtimer = 1;
		e.k = 1;
		e.x = x;
		e.y = y;
	}
	
}