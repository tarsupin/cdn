/*
	
	[[ How to use this auto-scroll system ]]
	
	Choose an element that you want to have automatically populate with new content as you continue scrolling down. This system will now call post requests from a URL that you designate, and populate the element with new content.
	
	To activate this functionality, you will need to set the following values:
	
		<script>
			urlToLoad = "/ajax/example-autoloader";
			elementIDToAutoScroll = "my-autoloader-div";
			startPos = 0;
			entriesToReturn = 10;
			maxEntriesAllowed = 100;
			waitDuration = 1200;
			appendURL = "&example=1&b=2";
		</script>
	
	Then you'll need to create the div that has the same ID as "elementIDToAutoScroll"
	
		<div id="my-autoloader-div">{{ Data will load here }}</div>
		
	To run functionality after content loads from the auto-scroll, create this function:
		
		function afterAutoScroll() {
			// This will run after the scroll has loaded content
		}
	
	On the URL that you're calling from, you'll need to use the following parameters:
	
		$_GET['startPos']		// The starting position to call from.
		$_GET['entries']		// The number of rows (or entries) to return.
		$_GET['custom']			// Any custom data that was sent to this page.
		
	The content will be formatted however the URL outputs the information.
	
*/

// Values you must set
var urlToLoad = "";				// The URL that you're going to pull from
var elementIDToAutoScroll = "";	// The ID of the element to auto-scroll (generally a "div" element)
var startPos = 0;				// The starting position for auto generation
var entriesToReturn = 10;		// The number of entries to pull each cycle
var maxEntriesAllowed = 100;	// The maximum number of entries to pull total
var waitDuration = 1200;		// The amount of time (in microseconds) to pause between auto-loads
var appendURL = "&example=1";	// Custom URL content to send to the auto-load page (e.g. "&custom=value&a=1")

// Values that the system uses
var loadagain = true;

// The scrolling event that triggers auto-scrolling
window.onscroll = function(event)
{
	// If we haven't designated an element to auto-scroll, don't run any effects
	if(!elementIDToAutoScroll)
	{
		return false;
	}
	
	// Make sure we haven't exhausted all of the entries that are allowed at maximum
	if(startPos >= maxEntriesAllowed)
	{
		return false;
	}
	
	// Get the element that is designated to be auto-scrolled
	var getElement = document.getElementById(elementIDToAutoScroll);
	
	var pixelsFromBottom = getPixelOffsetFromBottomOfElement(getElement);
	
	if(pixelsFromBottom <= 650 && loadagain == true)
	{
		// Make sure we don't load too much too quickly
		// Allow more content to load after the designated wait duration
		loadagain = false;
		setTimeout(function() { loadagain = true; }, waitDuration);
		
		// Run the auto-scroll functionality
		runAutoScroll();
	}
}

function runAutoScroll()
{
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function()
	{
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			// If there was nothing loaded, stop running this setup
			if(xmlhttp.responseText == "")
			{
				loadagain = false;
				maxEntriesAllowed = startPos;
			}
			
			// Run the auto-scroll insert
			document.getElementById(elementIDToAutoScroll).insertAdjacentHTML('beforeend', xmlhttp.responseText);
			
			// If there is a follow-up function assigned, run it
			if(typeof afterAutoScroll == 'function')
			{ 
				afterAutoScroll(); 
			}
		}
	}
	
	xmlhttp.open("POST", urlToLoad + "?startPos=" + startPos + "&entries=" + entriesToReturn + appendURL, true);
	xmlhttp.send();
	
	// Update the starting position for the next loop
	startPos += entriesToReturn;
}

/**********************************
****** Auto-Scroll Detection ******
***********************************

This set of functions are used when detecting page positions for auto-scrolling. They provide mathematical checks to confirm whether or not the page has scrolled enough to warrant loading more data.

*/

function getPercentOfPageScrolled()
{
	return Math.floor(100 * (window.pageYOffset / (document.body.offsetHeight - window.innerHeight)));
}

function getPercentOfElementScrolled(element)
{
	var elTop = element.offsetTop;			// Distance element is from the top of the page
	var elHeight = element.offsetHeight;	// Height of the element
	
	var winTop = window.pageYOffset;		// Distance of window scroll to top of the page
	var winHeight = window.innerHeight;		// Height of the window's viewport
	
	var elementPercent = (winTop - elTop + winHeight) / elHeight;
	elementPercent = ((10000 * elementPercent) / 100).toFixed(2);
	
	elementPercent = Math.min(Math.max(elementPercent, 0), 100);
	
	return elementPercent;
}

function getPixelsOfElementScrolled(element)
{
	var elTop = element.offsetTop;			// Distance element is from the top of the page
	var elHeight = element.offsetHeight;	// Height of the element
	
	var winTop = window.pageYOffset;		// Distance of window scroll to top of the page
	var winHeight = window.innerHeight;		// Height of the window's viewport
	
	var pixelsShown = winTop - elTop + winHeight;
	
	pixelsShown = Math.min(Math.max(pixelsShown, 0), elHeight);
	
	return pixelsShown;
}

function getPixelOffsetFromBottomOfElement(element)
{
	var pixelsFromBottom = element.offsetHeight - getPixelsOfElementScrolled(element);
	
	return pixelsFromBottom;
}