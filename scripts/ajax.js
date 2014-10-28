/*
	
	-----------------------------------
	----- HOW TO USE searchAjax() -----
	-----------------------------------
	
	searchAjax() is used to activate searching functionality.
	
	searchAjax("scriptName", "searchBoxID", "searchInputID", 350)
		
		- "scriptName" is the script you're calling.
		
		- "searchBoxID" is the div ID on the page that will be update via AJAX.
		
		- "searchInputID" is the ID of the text input that you're using for the search.
		
		- 350 represents the millisecond delay for how long to wait before processing user input.
				- This prevents unnecessary updating for each click.
				- The default value will automatically adjust based on character length.
	
	
	<< A Simple Example >>
		
		<input id="searchInputID"
				type="text" name="blah" value="" placeholder="Search . . ."
				onkeyup='searchAjax("basicSearch", "searchBoxID", "searchInputID")' />
	
*/

// Important Variables
var nextUpdate = 0;			// Keeps track of the last time that user input was sent
var lastInput = "";			// Tracks the state of the last input that was entered
var searchActive = false;	// If the search is active.
var ajaxInsertType = "";	// Set to "after" to cause AJAX loads to add to a div rather than replace it.
var ajaxReturnFunc = "";	// If set, AJAX responses will run the designated function you assign.

var g_siteURL = "";
var g_scriptName = "";
var g_ajaxDivID = "";

// Track dropdown selection (up/down keys)
var curDropIndex = -1;

// This function will load the retrieved data into the "AJAX DIV".
function searchAjax(siteURL, scriptName, searchBoxID, searchInputID, query, delay)
{
	// Prepare Default Values
	delay = typeof delay !== "undefined" ? delay : -1;
	
	// Store Variables for the Search
	g_siteURL = siteURL;
	g_scriptName = scriptName;
	g_ajaxDivID = searchBoxID;
	
	// Start the update tester (if it is currently inactive)
	if(searchActive == false)
	{
		searchActive = true;
		searchUpdateChecker();
	}
	
	// Get Important Data
	var d = new Date();
	var ls = query ? query : document.getElementById(searchInputID).value;
	
	// Update the last input (to test if it's different)
	if(ls != lastInput)
	{
		if(delay == -1)
		{
			delay = 200 + (15 * ls.length);
		}
		
		nextUpdate = d.getTime() + delay;
		lastInput = ls;
	}
}

// This function works exclusively with the main search engine bar
function searchEngineAjax()
{
	// Prepare Values
	var siteURL = "http://search.unifaction.com";
	var query = document.getElementById("searchInputID").value;
	
	// Change the behavior if the first character is different
	if(query.charAt(0) == "#")
	{
		// siteURL = "http://hashtag.unifaction.com";
	}
	else if(query.charAt(0) == "@")
	{
		siteURL = "http://auth.unifaction.com";
	}
	
	// Run the Search
	searchAjax(siteURL, "search", "searchHoverID", "searchInputID", query);
}

// This function checks every few milliseconds to see if an update should be processed
function searchUpdateChecker()
{
	var d = new Date();
	
	// Update the search (if the update time has passed)
	if(nextUpdate != 0 && d.getTime() > nextUpdate)
	{
		curDropIndex = -1;
		nextUpdate = 0;
		loadAjax(g_siteURL, g_scriptName, g_ajaxDivID, "search=" + lastInput);
		searchActive = false;
	}
	else
	{
		// Continue to run the updater
		setTimeout(searchUpdateChecker, 50);
	}
}

/********************************
****** Search Box Handling ******
********************************/

// When a search box is selected
function focusSearch(event, dropdownID)
{
	// event.target.id;	// The ID of the input being used
	
	var searchDropdown = document.getElementById(dropdownID);
	
	// Show the Dropdown
	searchDropdown.style.display = "block";
	
	curDropIndex = -1;
}

// When a search box is deselected
function blurSearch(event, dropdownID)
{
	var searchDropdown = document.getElementById(dropdownID);
	
	// Hide the Dropdown
	setTimeout(function() {
		searchDropdown.style.display = "none";
	}, 130);
	
	// Restore all dropdowns to their standard appearance
	var option = searchDropdown.getElementsByTagName("a");
	
	for(var i = 0;i < option.length;i++)
	{
		option[i].className = "searchSel";
	}
	
	curDropIndex = -1;
}

// This function handles the up/down/enter handling for search boxes
// It allows you to navigate with keys to click on links
function showSelectedSearch(event, dropdownID)
{
	var searchDropdown = document.getElementById(dropdownID);
	var option = searchDropdown.getElementsByTagName("a");
	
	// If there are no children, end here
	if(option.length == 0)
	{
		curDropIndex = -1;
		return false;
	}
	
	// Down Key
	if(event.keyCode == 40)
	{
		curDropIndex = curDropIndex + 1;
		if(curDropIndex >= option.length) { curDropIndex = 0; }
	}
	
	// UP Key
	else if(event.keyCode == 38)
	{
		curDropIndex = curDropIndex - 1;
		if(curDropIndex <= -1) { curDropIndex = option.length - 1; }
	}
	
	// Enter Key
	else if(event.keyCode == 13)
	{
		var selectedIndex = curDropIndex;
		blurSearch(event, dropdownID);
		
		if(option[selectedIndex].href.indexOf("javascript:") > -1)
		{
			var rmj = option[selectedIndex].href.replace("javascript:", "");
			
			eval(rmj);
		}
		else
		{
			window.location = option[selectedIndex].href;
		}
	}
	
	// Set the current index as active
	if(typeof(option[curDropIndex]) != "undefined")
	{
		// Restore all dropdowns to their standard appearance
		for(var i = 0;i < option.length;i++)
		{
			option[i].className = "searchSel";
		}
		
		// Highlight the active selector
		option[curDropIndex].className = "searchSelActive";
	}
}

// Prevent Form Submission when in a Search Box
window.onload = function()
{
	var frm = document.forms;
	
	// Assign a function to every form that prevents submission when the active element's class == "searchInput"
	for (var i = 0; i < frm.length; i++)
	{
		frm[i].onkeypress = function(event)
		{
			var act = document.activeElement;
			
			if(act.className == "searchInput")
			{
				return event.keyCode != 13;
			}
		}
	}
}


/*
	
	--------------------------------
	----- HOW TO USE getAjax() -----
	--------------------------------
	
	To properly retrieve an AJAX string, use the following syntax:
	
	getAjax("http://example.com", "scriptName", "funcToActivate" "var1=a", "var2=b", ...)
		
		- Replace "http://example.com" with the site to connect to, or "" if loading the same site.
		
		- "scriptName" is the script you're calling.
		
		- "funcToActivate" is the function you're going to activate when the AJAX responds.
			It will be run with the return value of the ajax call, i.e. funcToActivate(responseText);
		
		- Each argument passed to getAjax() after the AJAX DIV will provide additional parameters that
		  get sent as $_POST values to that page.
		  
			^ For example, the script above would pass $_POST['var1'] = "a" and $_POST['var2'] = "b",
			which can be used to generate data on that page.
		
	
	<< A Simple Example >>
		
		var getData = getAjax('http://search.unifaction.com', 'mySearchScript', 'setVal=1', 'anotherVal=2');
	
	
	<< Note about Cross-Origin Policies >>
	
		If you want to make a cross-site connection with JavaScript, you'll need to accept CORS at the destination page.
		
		This can be done with the following header:
		
			header('Access-Control-Allow-Origin: *');
		
		This header needs to be applied to the page you're connecting to.
	
*/

// This function will retrieve data from an ajax script
function getAjax(siteURL, scriptName, funcToActivate)
{
	var queryString = "";
	
	// Add the extra data values to the query string
	// Each additional argument sent to this function is set up like: value=something
	// So a full function call would look like this:
	// getAjax('', 'myAjaxScript', 'mySpecialFunc', 'username=Joe', 'value=something');
	for(var i = 2; i < arguments.length; i++)
	{
		queryString = queryString + "&" + arguments[i];
	}
	
	var gethttp = new XMLHttpRequest();
	
	gethttp.onreadystatechange = function()
	{
		if(gethttp.readyState == 4 && gethttp.status == 200)
		{
			if(funcToActivate)
			{
				window[funcToActivate](gethttp.responseText);
			}
		}
	}
	
	// Run the Processor
	gethttp.open("POST", (siteURL ? siteURL : "") + "/ajax/" + scriptName, true);
	gethttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	gethttp.send(queryString);
}

/*
	
	---------------------------------
	----- HOW TO USE loadAjax() -----
	---------------------------------
	
	To properly call AJAX in our system, use the following syntax:
	
	loadAjax("http://example.com", "scriptName", "ajaxDivID", "var1=a", "var2=b", ...)
		
		- Replace "http://example.com" with the site to connect to, or "" if loading the same site.
		
		- "scriptName" is the script you're calling.
		
		- "ajaxDivID" is the div ID on the page that will be update via AJAX.
		
		- Each argument passed to loadAjax() after the AJAX DIV will provide additional parameters that
		  get sent as $_POST values to that page.
		  
			^ For example, the script above would pass $_POST['var1'] = "a" and $_POST['var2'] = "b",
			which can be used to generate data on that page.
		
		- Set the variable "ajaxInsertType" to "after" to load the AJAX content after a div rather than replace it.
	
	
	<< A Simple Example >>
		
		<a href="javascript:void(0)" onclick="loadAjax('http://search.unifaction.com', 'checkData', 'ajaxDivID', 'menu=1')">Edit Me</a>
	
	
	<< Activating a function with the AJAX Response >>
	
		If you want to activate a function with the AJAX response, you can set the variable "ajaxReturnFunc" to the
		name of the function you want it to return to. The function has to be set up like this:
			
			function myAjaxFunc(ajaxResponse) {}
			
		The call will look like this:
			
			onclick="ajaxReturnFunc='myAjaxFunc'; loadAjax('', 'ajaxScript', '', 'menu=1')"
	
	
	<< Note about Cross-Origin Policies >>
	
		If you want to make a cross-site connection with JavaScript, you'll need to accept CORS at the destination page.
		
		This can be done with the following header:
		
			header('Access-Control-Allow-Origin: *');
		
		This header needs to be applied to the page you're connecting to.
	
*/

// This function will load the retrieved data into the "AJAX DIV".
function loadAjax(siteURL, scriptName, ajaxDivID)
{
	var queryString = "";
	
	// Add the extra data values to the query string
	// Each additional argument sent to this function is set up like: value=something
	// So a full function call would look like this:
	// loadAjax('', 'ajaxCall', 'myDivID', 'username=Joe', 'value=something');
	for(var i = 2; i < arguments.length; i++)
	{
		queryString = queryString + "&" + arguments[i];
	}
	
	processAjax(siteURL, scriptName, ajaxDivID, queryString);
}

// This is the AJAX Processor
// Don't call this directly. Use loadAjax() or processForm().
function processAjax(siteURL, scriptName, ajaxDivID, queryString)
{
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function()
	{
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			// If we're requesting the AJAX call to return to a specific function
			if(ajaxReturnFunc != "")
			{
				if(typeof window[ajaxReturnFunc] == "function")
				{
					window[ajaxReturnFunc](xmlhttp.responseText);
				}
				
				ajaxReturnFunc = "";
			}
			
			// Standard AJAX calls return content to a specific DIV
			else if(ajaxDivID != "")
			{
				if(ajaxInsertType == "after")
				{
					// Append the AJAX result into the page
					document.getElementById(ajaxDivID).insertAdjacentHTML('beforeend', xmlhttp.responseText);
					ajaxInsertType = "";
				}
				else
				{
					// Replace the AJAX result into the designated DIV
					document.getElementById(ajaxDivID).innerHTML = xmlhttp.responseText;
				}
			}
		}
	}
	
	// Run the Processor
	xmlhttp.open("POST", (siteURL ? siteURL : "") + "/ajax/" + scriptName, true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send(queryString);
}

/*
	
	----------------------------------
	----- HOW TO USE THIS SCRIPT -----
	----------------------------------
	The script is used to process forms through AJAX.
	
	To be called properly, the form must be set up like this:
	
	<form id="formID" name="someName"
			action="/page/to/load'
			onsubmit="return processForm('formID', 'fileToLoad', 'divToAlter')">
			
		<!-- Form Content Goes Here -->
	</form>
	
	This script represses the standard form behavior (since that normally forces a refresh).
	It does this because we don't want to reload the entire page - we only want to reload
	the AJAX DIV on THIS page.
	
*/

// Process Form
function processForm(formID, pageName, ajaxDivID)
{
	/* do what you want with the form */
	var form = document.getElementById(formID);
	var elements = form.elements;
	var queryString = "";
	
	for(var i = 0; i < elements.length; i++)
	{
		if(typeof elements[i] != 'undefined' && typeof elements[i].name != 'undefined' && typeof elements[i].value != 'undefined')
		{
			// Prepare Element Name
			var elemName = elements[i].name;
			
			// Special Checks for Checkboxes
			if(elements[i].type == "checkbox")
			{
				if(elements[i].checked == true)
				{
					queryString = queryString + "&" + elemName + "=on";
				}
			}
			else
			{
				var elemValue = encodeURIComponent(elements[i].value); // works
				
				queryString = queryString + "&" + elemName + "=" + elemValue;
			}
		}
	}
	
	// Send the Form Data through the ajax processing script:
	processAjax(pageName, ajaxDivID, queryString);
	
	// You must return false to prevent the default form behavior
	return false;
}
