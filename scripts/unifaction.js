
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
	if(window.innerWidth > 1120)
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

/******************************
****** Mobile Navigation ******
******************************/

function toggleMenu()
{
	var menu = document.getElementById("panel-nav");
	
	if(menu.style.display == "block")
	{
		menu.style.display = "none";
		
		var m1 = document.getElementById("uni-modal-mobile");
		m1.parentNode.removeChild(m1);
	}
	else
	{
		menu.style.position = "absolute";
		menu.style.display = "block";
		menu.style.zIndex = "500";
		menu.style.width = "100%";
		
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		document.body.insertAdjacentHTML('afterbegin', '<div id="uni-modal-mobile" class="modal-bg" onclick="toggleMenu()"></div>');
	}
}

/*************************************
****** Mobile Effects on Resize ******
*************************************/

window.addEventListener('resize', function(event)
{
	if(window.innerWidth > 920)
	{
		var menu = document.getElementById("panel-nav");
		menu.style.display = "block";
		menu.style.position = "static";
		menu.style.zIndex = "0";
		
		if(window.innerWidth > 1120)
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


/*********************************
****** On Page-Load Handler ******
*********************************/
document.onreadystatechange = function()
{
	if(document.readyState == "complete")
	{
		// If the widget panel is visible, load it through AJAX
		if(document.getElementById("panel-right").offsetParent !== null)
		{
			var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
			
			// Widgets aren't essential. Only show if the load time was less than one second.
			if(loadTime < 1000)
			{
				loadAjax("", "widget-panel", "panel-right");
			}
		}
		
		// If the widget panel isn't visible but the navigation panel is, load widgets there instead
		else if(document.getElementById("panel-nav").offsetParent !== null)
		{
			var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
			
			// Widgets aren't essential. Only show if the load time was less than one second.
			if(loadTime < 1000)
			{
				ajaxInsertType = "after";
				loadAjax("", "widget-panel", "panel-nav");
			}
		}
	}
}

/********************************
****** Uni-Modal Functions ******
********************************/

// Standard "Button" Modal
function buttonModal(title, description, button_url, button_text, cancel_text)
{
	document.body.insertAdjacentHTML('afterbegin', '<div id="uni-modal-back" class="modal-bg" onclick="closeModal();"></div><div id="uni-modal" class="modal-box"><div class="modal-title">' + title + '</div><div class="modal-desc">' + description + '</div><div class="modal-button-bar"><div class="modal-button-wrap"><a class="modal-button" href="' + button_url + '">' + button_text + '</a></div> <div class="modal-button-wrap"><a class="modal-button" href="javascript:closeModal()">' + cancel_text + '</a></div></div></div>');
}

// Custom Modal
function customModal(custom_html)
{
	document.body.insertAdjacentHTML('afterbegin', '<div id="uni-modal-back" class="modal-bg" onclick="closeModal();"></div><div id="uni-modal" class="modal-box">' + custom_html + '</div>');
}

// Close Modal
function closeModal()
{
	var m1 = document.getElementById("uni-modal-back");
	var m2 = document.getElementById("uni-modal");
	
	m1.parentNode.removeChild(m1);
	m2.parentNode.removeChild(m2);
}

/******************************
****** UniMarkup Options ******
******************************/

/*
	Example of using this on a textarea:
	
	<a onclick="UniMarkup("myTextareaID", "color", "red")">Add Red Text</a>
*/

// Run the UniMarkup options for an element
function UniMarkup(elementID, tagToAdd, parameterToAdd, inject)
{
	// Default Values
	if(typeof(parameterToAdd) == "undefined")
	{
		parameterToAdd = "";
	}
	
	if(typeof(inject) == "undefined")
	{
		inject = false;
	}
	
	// Retrieve the Target Element
	var element = document.getElementById(elementID);
	
	// Prepare Values
	element.value.replace(/\r\n/g, "\n");
	
	// Set the cursor to the end of the element
	var startPos = element.value.length;
	var stopPos = element.value.length;
	
	// If the cursor is selecting content in the element, set its position appropriately
	if(typeof(element.selectionStart) == "number" && typeof(element.selectionEnd == "number"))
	{
		startPos = element.selectionStart;
		stopPos = element.selectionEnd;
	}
	
	// Grab each text section relative to the cursor and selection
	var section1 = element.value.substr(0, startPos);
	var section2 = element.value.substr(startPos, stopPos - startPos);
	var section3 = element.value.substr(stopPos);
	
	// If we're "injecting" a value into the textarea (as opposed to surrounding it with tags)
	if(inject == true)
	{
		// Update the Element's Text by rebuilding each segment
		element.value = section1 + tagToAdd + section3;		
		
		// Update the Element's Selection (Cursor)
		element.selectionStart = startPos + tagToAdd.length;
		element.selectionEnd = element.selectionStart;
	}
	
	// If we're surrounding a value with tags
	else
	{
		// Prepare the tag (and end tag) to be added to the textarea
		var tagStart = "[" + tagToAdd;
		var tagEnd = "[/" + tagToAdd + "]";
		var paramLen = 0;
		
		if(parameterToAdd != "")
		{
			tagStart += "=" + parameterToAdd;
			paramLen = parameterToAdd.length + 1;
		}
		
		tagStart += "]";
		
		// Update the Element's Text by rebuilding each segment
		element.value = section1 + tagStart + section2 + tagEnd + section3;		
		
		// Update the Element's Selection (Cursor)
		element.selectionStart = startPos + tagToAdd.length + 2 + paramLen;
		element.selectionEnd = stopPos + tagToAdd.length + 2 + paramLen;
	}
	
	// Refocus on the Element
	element.focus();
}

// Add UniMarkup options that require prompts
function UniMarkupAdvanced(elementID, tagToAdd)
{
	// Prepare Values
	var insert = "";
	
	// Prepare the necessary prompt
	if(tagToAdd == "link")
	{
		insert = prompt("Enter the URL (web address) to link to:");
		
		if(insert.indexOf("://") == -1)
		{
			insert = "http://" + insert;
		}
	}
	else if(tagToAdd == "quote") { insert = prompt("Enter the person being quoted:"); }
	
	// Run the insert after being prompted
	if(insert != null && insert != "")
	{
		UniMarkup(elementID, tagToAdd, insert);
	}
	
	// Injection prompts
	if(tagToAdd == "tag")
	{
		insert = prompt("Enter the hashtag to include:");
		
		UniMarkup(elementID, "#" + insert, "", true);
	}
	
	else if(tagToAdd == "user")
	{
		insert = prompt("Enter the user's handle:");
		
		UniMarkup(elementID, "@" + insert, "", true);
	}
}

// Check Characters Remaining
function CheckCharsRemaining(textboxID, divID, allowedChars)
{
	var chkTxt = document.getElementById(textboxID);
	var chkDiv = document.getElementById(divID);
	var numRemaining = allowedChars - chkTxt.value.length;
	
	chkDiv.innerHTML = numRemaining + " Characters Remaining";
	
	if(numRemaining < (allowedChars * 0.05) || numRemaining < 22)
	{
		chkDiv.style.color = "red";
	}
	else
	{
		chkDiv.style.color = "";
	}
}

/**********************************
****** Bookmarks & Favorites ******
**********************************/

var shareButtons = document.getElementsByClassName("uni-share-buttons");
var activeButton = "";

for(var a = 0;a < shareButtons.length;a++)
{
	var sb = shareButtons[a];
	
	// Get Button Data
	var shareType = sb.getAttribute("data-shareType");
	var name = sb.getAttribute("data-name");
	var url = sb.getAttribute("data-url");
	
	var title = sb.getAttribute("data-title");
	var customStyle = sb.getAttribute("data-style");
	
	// Make sure all required fields are provided
	if(!shareType) { continue; }
	if(!name) { continue; }
	if(!url) { continue; }
	
	if(!title) { title = ""; }
	if(!customStyle) { customStyle == ""; }
	
	// Style the Button
	if(customStyle != "custom")
	{
		sb.style.cursor = "pointer";
		sb.style.display = "inline-block";
		sb.style.fontFamily = "Arial";
		sb.style.fontSize = "12px";
		sb.style.color = "white";
		sb.style.backgroundColor = "#56ccc8";
		sb.style.padding = "4px 8px 4px 8px";
		sb.style.borderRadius = "5px"
	}
	
	// Create the button & it's functionality (based on what type it is)
	switch(shareType)
	{
		case "bookmark":
			sb.innerHTML = (title == "" ? "Bookmark" : title);
			
			sb.addEventListener("click", function()
			{
				// Get the necessary values
				activeButton = this;
				
				group = this.getAttribute("data-group");
				name = this.getAttribute("data-name");
				url = this.getAttribute("data-url");
				siteName = this.getAttribute("data-site");
				
				// Make sure all required fields are provided
				if(!group) { return false; }
				if(!name) { return false; }
				if(!url) { return false; }
				
				// Set the bookmark as in queue
				activeButton.style.backgroundColor = "black";
				
				// Call API
				callURL("http://auth.test/api/share?shareType=bookmark&group=" + group + "&name=" + name + "&url=" + url + (siteName ? "&site=" + siteName : ""));
			});
		break;
		
		case "share":
			sb.innerHTML = (title == "" ? "Share" : title);
			
			sb.addEventListener("click", function()
			{
				// Get the necessary values
				activeButton = this;
				
				group = this.getAttribute("data-group");
				name = this.getAttribute("data-name");
				url = this.getAttribute("data-url");
				siteName = this.getAttribute("data-site");
				
				// Make sure all required fields are provided
				if(!group) { return false; }
				if(!name) { return false; }
				if(!url) { return false; }
				
				// Set the bookmark as in queue
				activeButton.style.backgroundColor = "black";
				
				// Call API
				callURL("http://auth.test/api/share?shareType=share&group=" + group + "&name=" + name + "&url=" + url + (siteName ? "&site=" + siteName : ""));
			});
		break;
		
		case "chat":
			sb.innerHTML = (title == "" ? "Chat" : title);
			
			sb.addEventListener("click", function()
			{
				// Get the necessary values
				activeButton = this;
				
				name = this.getAttribute("data-name");
				url = this.getAttribute("data-url");
				siteName = this.getAttribute("data-site");
				
				// Make sure all required fields are provided
				if(!name) { return false; }
				if(!url) { return false; }
				
				// Set the bookmark as in queue
				activeButton.style.backgroundColor = "black";
				
				// Call API
				callURL("http://fastchat.test/api/share?shareType=chat&name=" + name + "&url=" + url + (siteName ? "&site=" + siteName : ""));
			});
		break;
	}
}

/*
	
	------------------------------------------
	----- AJAX, XSS, and JSON Processing -----
	------------------------------------------
	
	The script is used to call data from across different sites from within javascript.
	
*/

// Cross-Site URL Call (JSON)
function callURL(url)
{
	var script_id = null;
	
	var script = document.createElement("script");
	
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", url);
	script.setAttribute("id", "script_id");
	
	script_id = document.getElementById("script_id");
	
	if(script_id)
	{
		document.getElementsByTagName("head")[0].removeChild(script_id);
	}
	
	// Insert <script> into DOM
	document.getElementsByTagName("head")[0].appendChild(script);
}

// The JSON callback from a callURL() request
function callURL_Response(response)
{
	// If the response was successful
	if(response === true)
	{
		activeButton.style.backgroundColor = "blue";
	}
	else
	{
		activeButton.style.backgroundColor = "red";
	}
	
	alert(response);
	
	/*
	var txt = "";
	
	switch(typeof(data))
	{
		case "boolean": txt = (data == true ? "true" : "false"); break;
		case "string": txt = data; break;
		
		default:
			for(var key in data)
			{
				txt += key + " = " + data[key];
				txt += "\n";
			}
		break;
	}
	*/
}