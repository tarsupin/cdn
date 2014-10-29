
/****************************
****** Menu Navigation ******
****************************/

var coreNav = document.getElementById("panel-core");

coreNav.onmouseover = function()
{
	coreMenu_showFull();
}

coreNav.onmouseout = function()
{
	if(window.innerWidth > 1520)
	{
		coreMenu_showFull();
	}
	else
	{
		coreMenu_showMini();
	}
}

function coreMenu_showFull()
{
	// Expand the Core Nav
	var val = document.getElementById("core-list");
	val.style.width = "155px";
	
	// Set core navigation links to no display
	var elements = document.getElementsByClassName("core-txt");
	
	for(var i = 0; i < elements.length; i++)
	{
		elements[i].style.display = "inline-block";
	}
}

function coreMenu_showMini()
{
	// Restrict the Core Nav
	var val = document.getElementById("core-list");
	val.style.width = "55px";
	
	// Set core navigation links to no display
	var elements = document.getElementsByClassName("core-txt");
	
	for(var i = 0; i < elements.length; i++)
	{
		elements[i].style.display = "none";
	}
}


/*************************************
****** Mobile Effects on Resize ******
*************************************/

window.addEventListener('resize', function(event)
{
	if(window.innerWidth > 1120)
	{
		var menu = document.getElementById("panel-nav");
		menu.style.display = "block";
		menu.style.position = "static";
		menu.style.zIndex = "0";
		
		if(window.innerWidth > 1520)
		{
			coreMenu_showFull();
		}
		else
		{
			coreMenu_showMini();
		}
	}
	else
	{
		var menu = document.getElementById("panel-nav");
		menu.style.display = "none";
		
		coreMenu_showMini();
	}
});
