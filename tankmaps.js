
var allmaps =
[

[
'aaaaaaaaaaaaaaaaaaaaaaaaaaaa',
'a    A       A             a',
'a      X                N  a',
'a    A      A   A          a',
'a                         wa',
'a                       wwwa',
'a                     wwwwwa',
'a                   wwwwwwwa',
'a                    wwwwwwa',
'a   iddg                wwwa',
'a idhhhhdg                 a',
'adhhhhhhhhc                a',
'ahhhhhhhhh                 a',
'ahhhhhhh                   a',
'ahhhhh                     a',
'ahh       wwwwww           a',
'a       wwwwwwww           a',
'a        wwwwww            a',
'a                          a',
'a         M       B      B a',
'a                     Y    a',
'a   M            B       B a',
'a                     B    a',
'aaaaaaaaaaaaaaaaaaaaaaaaaaaa'
],

[
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
'a                                                               a',
'a      Y                             B       hhhhh        M     a',
'a                                          hhhhh                a',
'aw  B                                    hhhhh        B         a',
'awwwwww                                                         a',
'awwwwwwwwwwwwww                                             Y   a',
'a     wwwwwwwwwwwwwwwwwwwwww                                    a',
'a           wwwwwwwwwwwwwwwwwwww                                a',
'a                wwwwwwwwwwwwwwwwww                             a',
'a                      wwwwwwwwwwwwww                           a',
'a                          wwwwwwwwww                           a',
'a                            wwwwwww                            a',
'a                                           hhhhhhhhh           a',
'a                                        hhhhhhhhhhhhhhhhhhhhhhha',
'a                                             hhhhhhhhhhhhhhh   a',
'a                                                               a',
'a                hhhhhh                                 N       a',
'a   M              hhhhhh                                    N  a',
'a       B         hhh                                 X         a',
'a                                                  A            a',
'a                                                               a',
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
],


[
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
'a                                                                                                a',
'a                                                                 M                              a',
'a                                     N                                                          a',
'a                                                                                                a',
'a   N                                                                                            a',
'a                                                                                      Y         a',
'a                                                                                                a',
'a                          X                                                                     a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'awwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww                                                              a',
'awwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww            a',
'awwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww   a',
'a  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwa',
'a           wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwa',
'a                    wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwa',
'a                                        wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwa',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a   M                                                                                            a',
'a                                                                                                a',
'a                                                                                                a',
'a                                                                                                a',
'a                 Y                                                                    Y         a',
'a                                                        M                                       a',
'a                                                                                                a',
'a                                                                                                a',
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
]

];

function initmap(mapnumber)
{
	
	mode = MODE_GAME;
	view.width = 2000;
	view.height = 1600;
	//screen.width = screen.height = 2000;
	view.x = view.y = 0
	setboard(allmaps[mapnumber]);
	settileimage('b', 'dirtedgeL');
	settileimage('c', 'dirtedgeR');
	settileimage('d', 'dirtedgeU');
	settileimage('e', 'dirtedgeD');
	settileimage('f', 'dirtedgeLD');
	settileimage('g', 'dirtedgeUR');
	settileimage('j', 'dirtedgeDR');
	settileimage('i', 'dirtedgeUL');
	
	
	settileimage('a', 'blocks');
	settileimage('h', 'dirt');
	settileimage('w', 'water1');
	settileimage(' ', 'grass');
	//settileimage('m', 'mine1');
	
	var column;
	var row, value;
	score = 15;
	miners = [];
	tanks = [];
	arrows = [];
	//zheight = board.rows*board.tilewidth;

	for (row = 0; row < board.rows; row++)
	{
		for (column = 0; column < board.columns; column++)
		{
			value = tile(column, row);
			if ((value >= 'A') && (value <= 'Z'))
			{
				createNewUnit(value, column, row);
				settile(column, row, ' ');
				
			}
		}
	
	}
	
	
}



