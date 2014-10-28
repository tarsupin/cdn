
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


/**********************************
****** Footer Display Panels ******
**********************************/

var displayList = [];

function toggleDisplay(elementID, forceOn)
{
	// Get the index of the element in the displayList array
	var elIndex = displayList.indexOf(elementID);
	
	// If the element is already in the display panel, remove it (unless we're forcing it to display)
	if(elIndex >= 0)
	{
		if(forceOn != true)
		{
			document.getElementById(elementID).style.display = "";
			displayList.splice(elIndex, 1);
		}
	}
	
	// If the element is not in the display panel, add it
	else
	{
		displayList[displayList.length] = elementID;
	}
	
	var len = displayList.length;
	
	// Loop through every display
	for(var i = 0; i < len; i++)
	{
		// Get the next element in the list
		var el = document.getElementById(displayList[i]);
		
		el.style.right = (i * 230) + "px";
		
		// Make the element visible
		el.style.display = "block";
	}
	
}


/*********************************
****** On Page-Load Handler ******
*********************************/

document.onreadystatechange = function()
{
	if(document.readyState == "complete")
	{
		var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
		
		// If the widget panel is visible, load it through AJAX
		if(document.getElementById("panel-right").offsetParent !== null)
		{
			// Widgets aren't essential. Only show if the load time was less than one second.
			if(loadTime < 300)
			{
				loadAjax("", "widget-panel", "panel-right");
			}
		}
		
		// If the widget panel isn't visible but the navigation panel is, load widgets there instead
		else if(document.getElementById("panel-nav").offsetParent !== null)
		{
			// Widgets aren't essential. Only show if the load time was less than one second.
			if(loadTime < 300)
			{
				ajaxInsertType = "after";
				loadAjax("", "widget-panel", "panel-nav");
			}
		}
		
		// Load the notifications
		if(loadTime < 400 && typeof(JSUser) == "string")
		{
			runNotifications();
			runFriendList()
			
			// Run the core JS timer
			// This timer runs every second, but only if the page is active
			setInterval(function(){coreTimer()}, 1000);
		}
	}
}

// The Core Page Timer
// This timer runs every second, but only if the page is active
var coreTimeCount = 0;

function coreTimer()
{
	// Update the timer every 1 second, but only if you're on the page
	// If the document.hidden property doesn't work, this timer doesn't function
	if(typeof(document.hidden) != "undefined")
	{
		if(document.hidden != true)
		{
			coreTimeCount++;
		}
	}
	
	// Notifications Updater
	if(coreTimeCount % 30 == 0)
	{
		runNotifications();
	}
	
	// Online Friend Updater
	if(coreTimeCount % 25 == 0)
	{
		runFriendList()
	}
	
	// Chat Updater - Run every 3 seconds
	if(coreTimeCount % 3 == 0)
	{
		runUserChat()
	}
}

/**************************
****** Notifications ******
**************************/

function toggleNotifications()
{
	toggleDisplay('notif-box');
	
	getAjax("http://notifications.sync.test", "viewNotifications", "resetNotifyCount", "username=" + JSUser, "enc=" + JSEncrypt);
}

function resetNotifyCount()
{
	setNotifyButton(0);
}

function runNotifications()
{
	getAjax("http://notifications.sync.test", "getMyNotifications", "sync_notifications", "username=" + JSUser, "enc=" + JSEncrypt);
}

function sync_notifications(ajaxResponse)
{
	// If there was no response, end here
	if(!ajaxResponse) { return; }
	
	// Retrieve the JSON from the AJAX call
	var noteData = JSON.parse(ajaxResponse);
	
	// Prepare Values
	var notebox = document.getElementById("notif-box");
	var prepHTML = "";
	
	var noteCount = noteData.notification_count;
	var noteList = noteData.notifications;
	var len = noteList.length;
	
	// Loop through each of the notifications and prepare the entry
	for(var i = 0; i < len; i++)
	{
		prepHTML += '<div class="notif-slot"><div class="notif-entry"><a href="' + noteList[i]['url'] + '">' + noteList[i]['message'] + '</a></div></div>';
	}
	
	prepHTML += '<div class="notif-more"><div class="notif-more-inner"><a href="#">All Notifications <span class="icon-arrow-right"></span></a></div></div>';
	
	// Update the contents of the notification box
	notebox.innerHTML = prepHTML;
	
	// Update the notification button
	setNotifyButton(noteCount);
}

function setNotifyButton(noteCount)
{
	// Prepare Values
	var noteButton = document.getElementById("notif-button");
	var ncDisplay = document.getElementById("notif-count");
	
	// Update the notification count and button
	ncDisplay.innerHTML = noteCount;
	
	if(noteCount == 0)
	{
		noteButton.style.color = "#c0c0c0";
	}
	else
	{
		noteButton.style.color = "#ee6666";
	}
}


/************************
****** Friend List ******
************************/

function toggleFriends()
{
	toggleDisplay('friend-box');
}

function runFriendList()
{
	getAjax("http://friends.sync.test", "getMyFriends", "sync_friends", "username=" + JSUser, "enc=" + JSEncrypt);
}

function sync_friends(ajaxResponse)
{
	// If there was no response, end here
	if(!ajaxResponse) { return; }
	
	// Retrieve the JSON from the AJAX call
	var friendData = JSON.parse(ajaxResponse);
	
	// Prepare Values
	var friendbox = document.getElementById("friend-box");
	var prepHTML = "";
	
	var len = friendData.length;
	
	prepHTML += '<div style="border-bottom: solid 1px #1F6F6D; padding:4px; font-weight:bold; color:#1f6f6d !important;">Friends Online</div>';
	
	// If you have no friends online, announce it
	if(len == 0)
	{
		prepHTML += '<div style="padding:4px; color:#1f6f6d !important;">All of your friends are offline at the moment.</div>';
	}
	
	// Loop through each of the notifications and prepare the entry
	for(var i = 0; i < len; i++)
	{
		prepHTML += '<div class="friend-slot"><div class="friend-entry"><a href="javascript:toggleChat(\'' + friendData[i]['handle'] + '\')"><div class="friend-lside"><img src="' + friendData[i]['img'] + '" /></div><div class="friend-rside">' + friendData[i]['display_name'] + '<br />@' + friendData[i]['handle'] + '</div></a></div></div>';
	}
	
	// Update the contents of the notification box
	friendbox.innerHTML = prepHTML;
	
	// Update the notification button
	setFriendButton(len);
}

function setFriendButton(friendCount)
{
	// Prepare Values
	var friendButton = document.getElementById("friend-button");
	var fcDisplay = document.getElementById("friend-count");
	
	// Update the notification count and button
	fcDisplay.innerHTML = friendCount;
	
	if(friendCount == 0)
	{
		friendButton.style.color = "#c0c0c0";
	}
	else
	{
		friendButton.style.color = "#44ee99";
	}
}


/******************************
****** User Chat Display ******
******************************/

function toggleChat(toUser)
{
	// Check if the display has been created yet. If not, create it now.
	var chatBox = document.getElementById("userChat-" + toUser);
	
	if(!chatBox)
	{
		// Create the chatBox element (since it doesn't exist yet)
		document.body.insertAdjacentHTML('beforeend', '<div id="userChat-' + toUser + '" class="footer-display"></div>');
		chatBox = document.getElementById("userChat-" + toUser);
		
		// Set the contents
		chatBox.innerHTML = '<div class="chat-header">@' + toUser + '</div><div class="chat-inner"></div><div class="chat-footer"><input id="chat_write_' + toUser + '" type="text" name="post-chat" value="" placeholder="Say something . . ." maxlength="200" onkeydown="if(event.keyCode == 13) { postUserChat(\'' + toUser + '\'); }" /></div>';
	}
	
	// Toggle the chat display
	toggleDisplay('userChat-' + toUser);
}

function runUserChat()
{
	getAjax("http://messages.sync.test", "getMessages", "sync_chats", "username=" + JSUser, "enc=" + JSEncrypt, "time=" + JSChatTime);
}

function postUserChat(toUser)
{
	// Prepare Values
	var chatInput = document.getElementById("chat_write_" + toUser);
	var message = chatInput.value;
	
	// Prevent the post if it's empty
	if(!message) { return; }
	
	// Post your chat to the chat system
	getAjax("http://messages.sync.test", "getMessages", "sync_chats", "username=" + JSUser, "enc=" + JSEncrypt, "time=" + JSChatTime, "toUser=" + toUser, "message=" + message);
	
	// Clean the chat input
	chatInput.value = "";
	
	// Show your own chat message
	var chatBox = document.getElementById("userChat-" + toUser);
	
	chatBox.children[1].insertAdjacentHTML('beforeend', '<div class="chat-slot"><div class="chat-entry"><div class="chat-lside"><img src="' + JSProfilePic + '" /></div><div class="chat-rside">' + message + '</div></div></div>');
	
	// Scroll to the bottom of the chat box
	chatBox.children[1].scrollTop = chatBox.scrollHeight;
}

function sync_chats(response)
{
	console.log(response);
	
	// If there was no response, end here
	if(!response) { return; }
	
	// Retrieve the JSON from the AJAX call
	var response = JSON.parse(response);
	JSChatTime = response.time;
	
	// If there were no messages, end here
	if(!response.messages) { return; }
	var messages = response.messages;
	
	// Loop through each of the keys provided, if any
	for(var key in messages)
	{
		// Check if the display has been created yet. If not, create it now.
		var chatBox = document.getElementById("userChat-" + key);
		
		// Prepare Values
		var prepHTML = "";
		var len = messages[key].length;
		
		if(!chatBox)
		{
			// Create the chatBox element (since it doesn't exist yet)
			document.body.insertAdjacentHTML('beforeend', '<div id="userChat-' + key + '" class="footer-display"></div>');
			chatBox = document.getElementById("userChat-" + key);
			
			prepHTML += '<div class="chat-header">@' + key + '</div><div class="chat-inner">';
			
			// Loop through each of the chats and prepare the entry
			for(var i = 0; i < len; i++)
			{
				prepHTML += '<div class="chat-slot"><div class="chat-entry"><div class="chat-lside"><img src="' + messages[key][i]['img'] + '" /></div><div class="chat-rside">' + messages[key][i]['message'] + '</div></div></div>';
			}
			
			prepHTML += '</div><div class="chat-footer"><input id="chat_write_' + key + '" type="text" name="post-chat" value="" placeholder="Say something . . ." maxlength="200" onkeydown="if(event.keyCode == 13) { postUserChat(\'' + key + '\'); }" /></div>';
			
			// Set the contents
			chatBox.innerHTML = prepHTML;
		}
		else
		{
			// Loop through each of the chats and prepare the entry
			for(var i = 0; i < len; i++)
			{
				prepHTML += '<div class="chat-slot"><div class="chat-entry"><div class="chat-lside"><img src="' + messages[key][i]['img'] + '" /></div><div class="chat-rside">' + messages[key][i]['message'] + '</div></div></div>';
			}
			
			chatBox.children[1].insertAdjacentHTML('beforeend', prepHTML);
		}
		
		// Toggle the chat display
		toggleDisplay('userChat-' + key, true);
		
		// Scroll to the bottom of the chat box
		chatBox.children[1].scrollTop = chatBox.scrollHeight;
	}
}

/***********************
****** Encryption ******
***********************/

// var salt = (Math.random() + 1).toString(36).substring(3, 10));


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
}