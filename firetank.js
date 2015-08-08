// shoottank(x, y)
var bulletlist = [];

var BULLETS_PS = 1;
var DeathSpeed = 20;

function newbullet(otherx, othery, x, y, team)
{
	var bullet = new Object('bullet');
	bullet.width = 20;
	bullet.height = 10;
	
	bullet.team = team;
	bullet.x = x;
	bullet.y = y;
	
	bullet.pointat(otherx, othery);
	bullet.velocityat(otherx, othery, 400);	

	bulletlist.push(bullet);
	
}

function runbullet(bullet)
{

	bullet.move();
	bullet.draw();
	
	for (var i in tanks)
	{
		var tank = tanks[i];
		if (bullet.iscolliding(tank) && (bullet.team != tank.team))
		{
			bullet.isdeleted = true;
			if (tank.health > 0)
				tank.health -= 5;
		}
				

		
		

	}
	
	if (!bullet.isonscreen() || (bullet.ontile() == 'a'))
		bullet.isdeleted = true;
}



