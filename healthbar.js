// ob must have .health and .maxhealth
function healthbar(ob)
{
	var x, y, length;
	
	x = ob.x - ob.width / 2;
	y = ob.y + ob.width / 2;
	length = ob.width;
	
	drawline(x, y, x+ length, y, 'red', 8);
	
	length = length * ob.health/ ob.maxhealth;
	
	drawline(x, y, x+ length, y, 'green', 8);
	
}

function drawselecticon(ob)
{
	var selecticon = new Object();
	selecticon.width = selecticon.height = 20;
	selecticon.x  = ob.x - ob.width/2;
	selecticon.y  = ob.y - ob.height/2;
	
	if (ob.isselected)
		selecticon.setimage('greencircle');
	else
		selecticon.setimage('redcircle');
	
	selecticon.draw()
	


}