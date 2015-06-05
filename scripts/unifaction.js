
/******************************************
****** Wrappers and Helper Functions ******
******************************************/

/******************************
****** Mobile Navigation ******
******************************/

// Toggle the Mobile Menu on / off
function toggleMenu()
{
	// Get the left panel
	var menu = document.getElementById("mobile-menu");
	
	// If the panel is visible (displayed), remove it
	if(menu.style.display == "block")
	{
		menu.style.display = "none";
	}
	
	// If the panel is not displayed, display it
	else
	{
		menu.style.display = "block";
		menu.style.width = "100%";
		
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}
}

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
		// Prepare Values
		var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
		
		// Attempt to retrieve the active hashtag of the page
		// The active hashtag indicates what is relevant on the page, and may determine what gets loaded
		var activeHashtag = document.getElementById('activeHashtag');
		
		if(!activeHashtag)
		{
			activeHashtag = "";
		}
		else
		{
			activeHashtag = activeHashtag.content;
		}
		
		var wPanel = document.getElementById("panel-right");
		
		if(wPanel)
		{
			// If the widget panel is visible, load it through AJAX
			if(wPanel.offsetParent !== null)
			{
				// Widgets aren't essential. Only show if the load time was fast.
				if(loadTime < 3500)
				{
					ajaxReturnFunc = 'moveDynamicContent';
					ajaxInsertType = "after";
					loadAjax("", "widget-panel", "panel-right", "activeHashtag=" + activeHashtag);
				}
			}
			
			// If the widget panel isn't visible but the navigation panel is, load widgets there instead
			/*
			else if(wPanel.offsetParent !== null)
			{
				// Widgets aren't essential. Only show if the load time was fast.
				if(loadTime < 3500)
				{
					ajaxInsertType = "after";
					loadAjax("", "widget-panel", "panel-left", "activeHashtag=" + activeHashtag);
				}
			}
			*/
		}
		
		// Load the notifications (if you're logged in)
		if(loadTime < 5000)
		{
			if(typeof(JSUser) == "string")
			{
				runNotifications();
				runFriendList()
				runUserChat();
			}
			
			// Run the core JS timer
			// This timer runs every second, but only if the page is active
			setInterval(function(){coreTimer()}, 250);
		}
	}
}

// The Core Page Timers
// Every "tick" is .25 seconds. Example: an interval of 4 ticks is 1 second.
var coreTimeCount = 0;
var timers = {}

// Notifications Timer
timers.notifications = {};
timers.notifications.interval = 120;
timers.notifications.next = 120;

// Friends Timer
timers.friends = {}
timers.friends.interval = 60;
timers.friends.next = 60;

// User Chat Timer
timers.userchat = {}
timers.userchat.interval = 10;
timers.userchat.next = 10;

// Chat Timer
timers.chat = {}
timers.chat.interval = 12;
timers.chat.next = 0;

// The core timer runs 4 times every second, but only if you're on the page
// When the core timer hits an interval of one of the page timers, it runs the appropriate function
// It will also set the timer forward (based on its current interval)
function coreTimer()
{
	// If the document.hidden property doesn't work, this timer doesn't function
	if(typeof(document.hidden) != "undefined")
	{
		if(document.hidden != true)
		{
			coreTimeCount++;
		}
	}
	
	// If you're logged in, run the user's update handlers
	if(typeof(JSUser) == "string")
	{
		// Notifications Updater
		if(coreTimeCount >= timers.notifications.next)
		{
			timers.notifications.next = coreTimeCount + timers.notifications.interval;
			runNotifications();
		}
		
		// Friend Updater
		if(coreTimeCount >= timers.friends.next)
		{
			timers.friends.next = coreTimeCount + timers.friends.interval;
			runFriendList();
		}
		
		// User Chat Updater
		if(coreTimeCount >= timers.userchat.next)
		{
			timers.userchat.next = coreTimeCount + timers.userchat.interval;
			runUserChat();
		}
	}
	
	// Chat Updater
	if(coreTimeCount >= timers.chat.next)
	{
		timers.chat.next = coreTimeCount + timers.chat.interval;
		runChatUpdate();
	}
}

/*********************************
****** Move Dynamic Content ******
*********************************/

// This section allows dynamically created content (through JavaScript) to be inserted into the widget panel.
// This allow us to bypass the restrictions on loading dynamic content through an AJAX-loaded page.

// This functions runs after the widget page gets loaded
function moveDynamicContent()
{
	// Identify the proper divs, if available
	var mvRight = document.getElementById("move-content-wrapper");
	var dynRight = document.getElementById("dynamic-content-loader");
	
	// Move any content in the "move-content-wrapper" div to the right panel
	if(mvRight !== null)
	{
		if(dynRight !== null)
		{
			dynRight.appendChild(mvRight);
			mvRight.style.display = "block";
		}
		else
		{
			var wPanel = document.getElementById("panel-right");
			
			wPanel.appendChild(mvRight);
			mvRight.style.display = "block";
		}
	}
}


/**************************
****** Notifications ******
**************************/

function toggleNotifications()
{
	toggleDisplay('notif-box');
	
	// Run special display for guests
	if(typeof(JSUser) == "undefined")
	{
		// Update the contents of the notifications box
		document.getElementById("notif-box").innerHTML = '<div class="notif-slot"><div class="notif-entry"><a href="http://unifaction.community">Check out UniFaction\'s Communities!</a></div></div><div class="notif-slot"><div class="notif-entry"><a href="http://unifaction.com/discover">Discover what UniFaction has to offer you!</a></div></div><div class="notif-more"><div class="notif-more-inner"><a href="http://unifaction.com/register">Join UniFaction <span class="icon-arrow-right"></span></a></div></div>';
		
		return;
	}
	
	getAjax("http://notifications.sync.unifaction.com", "viewNotifications", "resetNotifyCount", "username=" + JSUser, "enc=" + JSEncrypt);
}

function resetNotifyCount()
{
	setNotifyButton(0);
}

function runNotifications()
{
	getAjax("http://notifications.sync.unifaction.com", "getMyNotifications", "sync_notifications", "username=" + JSUser, "enc=" + JSEncrypt);
}

function sync_notifications(response)
{
	// If there is no response this interval:
	if(!response)
	{
		// If the chat interval is less than 60 seconds long, add 4 ticks to the interval
		if(timers.notifications.interval < 240) { timers.notifications.interval += 4; }
		return;
	}
	
	// If a response was received
	else
	{
		// Set the chat interval to be shorter
		timers.notifications.interval = 120;
	}
	
	// Retrieve the JSON from the AJAX call
	var noteData = JSON.parse(response);
	
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
	
	prepHTML += '<div class="notif-more"><div class="notif-more-inner"><a href="http://unifaction.com/my-notifications">All Notifications <span class="icon-arrow-right"></span></a></div></div>';
	
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
	
	// Run special display for guests
	if(typeof(JSUser) == "undefined")
	{
		// Update the contents of the friends box
		document.getElementById("friend-box").innerHTML = '<div class="friend-header">Friends Online</div><div class="friend-center">Log in to see which of your friends are online.</div><div class="friend-bottom"><a href="http://unifaction.social/friends">Join UniFaction <span class="icon-arrow-right"></span></a></div>';
		
		return;
	}
	
	// Make sure there is a default when you're logged in
	var friendbox = document.getElementById("friend-box");
	
	if(!friendbox.innerHTML)
	{
		// Update the contents of the friends box
		document.getElementById("friend-box").innerHTML = '<div class="friend-header">Friends Online</div><div class="friend-center">All off your friends are currently offline.</div><div class="friend-bottom"><a href="http://unifaction.social/friends">Add / Find Friends <span class="icon-arrow-right"></span></a></div>';
		
		return;
	}
}

function runFriendList()
{
	getAjax("http://friends.sync.unifaction.com", "getMyFriends", "sync_friends", "username=" + JSUser, "enc=" + JSEncrypt);
}

function sync_friends(response)
{
	// If there is no response this interval:
	if(!response)
	{
		// If the chat interval is less than 40 seconds long, add 4 ticks to the interval
		if(timers.friends.interval < 160) { timers.friends.interval += 4; }
		return;
	}
	
	// If a response was received
	else
	{
		// Set the chat interval to be shorter
		timers.friends.interval = 60;
	}
	
	// Retrieve the JSON from the AJAX call
	var friendData = JSON.parse(response);
	
	// Prepare Values
	var friendbox = document.getElementById("friend-box");
	var prepHTML = "";
	
	var len = friendData.length;
	
	prepHTML += '<div class="friend-header">Friends Online</div>';
	
	// If you have no friends online, announce it
	if(len == 0)
	{
		prepHTML += '<div class="friend-center">All of your friends are offline at the moment.</div><div class="friend-bottom"><a href="http://unifaction.social/friends">Add / Find Friends <span class="icon-arrow-right"></span></a></div>';
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
		chatBox.innerHTML = '<div class="chat-header"><a href="http://unifaction.social/' + toUser + '">@' + toUser + '</a><div class="close-display"><a href="javascript:toggleChat(\'' + toUser + '\');">X</a></div></div><div class="chat-inner"></div><div class="chat-footer"><input id="chat_write_' + toUser + '" type="text" name="post-chat" value="" placeholder="Say something . . ." maxlength="200" onkeydown="if(event.keyCode == 13) { postUserChat(\'' + toUser + '\'); }" /></div>';
	}
	
	// Toggle the chat display
	toggleDisplay('userChat-' + toUser);
}

function runUserChat()
{
	getAjax("http://messages.sync.unifaction.com", "getMessages", "sync_chats", "username=" + JSUser, "enc=" + JSEncrypt, "time=" + JSChatTime);
}

function postUserChat(toUser)
{
	// Prepare Values
	var chatInput = document.getElementById("chat_write_" + toUser);
	var message = chatInput.value;
	
	// Prevent the post if it's empty
	if(!message) { return; }
	
	// Post your chat to the chat system
	getAjax("http://messages.sync.unifaction.com", "getMessages", "sync_chats", "username=" + JSUser, "enc=" + JSEncrypt, "time=" + JSChatTime, "toUser=" + toUser, "message=" + message);
	
	// Clean the chat input
	chatInput.value = "";
	
	// Show your own chat message
	var chatBox = document.getElementById("userChat-" + toUser);
	
	chatBox.children[1].insertAdjacentHTML('beforeend', '<div class="chat-line"><div class="chat-lside"><img src="' + JSProfilePic + '" /></div><div class="chat-rside">' + message + '</div></div>');
	
	// Scroll to the bottom of the chat box
	chatBox.children[1].scrollTop = chatBox.children[1].scrollHeight;
}

function sync_chats(response)
{
	// If there is no response this interval:
	if(!response)
	{
		// If the chat interval is less than 20 seconds long, add 1 tick to the interval
		if(timers.userchat.interval < 80) { timers.userchat.interval += 1; }
		return;
	}
	
	// If a response was received
	else
	{
		// Set the chat interval to be shorter, especially if the interval is less than 15 seconds
		if(timers.userchat.interval < 40) { timers.userchat.interval = 6; } else { timers.userchat.interval = 12; }
	}
	
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
			
			prepHTML += '<div class="chat-header"><a href="http://unifaction.social/' + key + '">@' + key + '</a><div class="close-display"><a href="javascript:toggleChat(\'' + key + '\');">X</a></div></div><div class="chat-inner">';
			
			// Loop through each of the chats and prepare the entry
			for(var i = 0; i < len; i++)
			{
				prepHTML += '<div class="chat-line"><div class="chat-lside"><img src="' + messages[key][i]['img'] + '" /></div><div class="chat-rside">' + messages[key][i]['message'] + '</div></div>';
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
				prepHTML += '<div class="chat-line"><div class="chat-lside"><img src="' + messages[key][i]['img'] + '" /></div><div class="chat-rside">' + messages[key][i]['message'] + '</div></div>';
			}
			
			chatBox.children[1].insertAdjacentHTML('beforeend', prepHTML);
		}
		
		// Toggle the chat display
		toggleDisplay('userChat-' + key, true);
		
		// Scroll to the bottom of the chat box
		chatBox.children[1].scrollTop = chatBox.children[1].scrollHeight;
	}
}


/*****************************
****** Personal Display ******
*****************************/

function toggleMyDisplay()
{
	toggleDisplay('myDisplay-box');
	
	// Run special display for guests
	if(typeof(JSUser) == "undefined")
	{
		// Update the contents of the notifications box
		document.getElementById("myDisplay-box").innerHTML = '<div class="notif-slot"><div class="notif-entry"><a href="http://unifaction.community">Check out UniFaction\'s Communities!</a></div></div><div class="notif-slot"><div class="notif-entry"><a href="http://unifaction.com/discover">Discover what UniFaction has to offer you!</a></div></div><div class="notif-more"><div class="notif-more-inner"><a href="http://unifaction.com/register">Join UniFaction <span class="icon-arrow-right"></span></a></div></div>';
		
		return;
	}
	
	getAjax("http://karma.unifaction.com", "getMyDisplay", "runMyDisplay", "username=" + JSUser, "enc=" + JSEncrypt);
}

function runMyDisplay(response)
{
	// If there is no response:
	if(!response)
	{
		return;
	}
	
	// Retrieve the JSON from the AJAX call
	var dispResponse = JSON.parse(response);
	
	// Prepare Values
	var myDisplayBox = document.getElementById("myDisplay-box");
	var currentURL = window.location.protocol + "//" + window.location.hostname;
	var siteIsBookmarked = false;
	
	var bookmarks = dispResponse.bookmarks;
	var Communities = bookmarks.Communities;
	var Sites = bookmarks.Sites;
	var Friends = bookmarks.Friends;
	var Links = bookmarks.Links;
	
	var bookmarks = {"Communities":Communities, "Sites":Sites, "Friends":Friends, "Links":Links};
	
	var prepHTML = '<div id="myDisp-wrap"><div class="myDisp-head" style="text-align:right;">' + dispResponse.auro + ' Auro</div>';
	
	// Loop through each of the bookmark types provided, if any
	for(var bm in bookmarks)
	{
		if(bookmarks[bm])
		{
			prepHTML += '<div class="myDisp-head">My ' + bm + '</div><div class="myDisp-content">';
			
			for(var chk in bookmarks[bm])
			{
				if(currentURL == bookmarks[bm][chk]) { siteIsBookmarked = true; }
				
				prepHTML += '<a href="' + bookmarks[bm][chk] + '">' + chk + '</a> ';
			}
			
			prepHTML += '</div>';
		}
	}
	
	// Loop through each of the sites provided, if any
	prepHTML += '<div id="myDisp-foot"><div id="myDisp-view"><a href="http://karma.unifaction.com/auro-transactions">My Auro</a></div><div id="myDisp-edit"><a href="http://karma.unifaction.com/bookmarks">My Bookmarks</a></div></div>' + (siteIsBookmarked ? '' : '<div id="myDisp-foot"><div id="myDisp-view"><a href="/action/Bookmarks/add?return=' + encodeURIComponent(document.URL) + '"><span class="icon-star"></span> Bookmark This Site</a></div></div>') + '</div>';
	
	prepHTML += '</div>';
	
	// Update the contents of the notification box
	myDisplayBox.innerHTML = prepHTML;
}


/**********************************
****** Chat System + Widgets ******
**********************************/

// When the Chat Form is submitted
function submitChatForm()
{
	// Prepare Values
	var message = document.getElementById("chat_message").value;
	var isPrivate = document.getElementById("chat_private");
	
	isPrivate = (isPrivate ? true : false);
	
	// Clean the chat box, but refocus there
	document.getElementById("chat_message").value = "";
	
	// Run the chat update with a designated message
	runChatUpdate(message, isPrivate);
	return false;
}

// Add messages to the chat
function load_chat(response)
{
	// Prepare Values
	var chatInner = document.getElementById("chat-inner");
	
	// If there is no response this interval:
	if(!response)
	{
		// If the chat interval is less than 30 seconds long, add 1 tick to the interval
		if(timers.chat.interval < 120) { timers.chat.interval += 1; }
		
		// If there is no content inside the chat box, we need to crate a single entry
		if(chatInner.innerHTML == "")
		{
			chatInner.insertAdjacentHTML("beforeend", '<div class="chat-line"><div class="chat-lside"><img src="http://cdn.unifaction.com/images/uniavi_sm.png" /></div><div class="chat-rside">Welcome! Be the first to post in this chat!</div></div>');
		}
		
		return;
	}
	
	// If a response was received
	else
	{
		// Set the chat interval to be shorter, especially if the interval is less than 15 seconds
		if(timers.chat.interval < 60) { timers.chat.interval = 8; } else { timers.chat.interval = 20; }
	}
	
	// Prepare Values
	var response = JSON.parse(response);
	var lastTime = response.last_time;
	var messages = response.messages;
	
	var len = messages.length;
	
	// Update the last chat time
	document.getElementById("chat_time").value = lastTime;
	
	// Load each of the new messages into the chat
	for(var i = 0; i < len; i++)
	{
		chatInner.insertAdjacentHTML("beforeend", '<div class="chat-line"><div class="chat-lside"><img src="' + messages[i]["img"] + '" /></div><div class="chat-rside"><a href="http://unifaction.social/' + messages[i]["user"] + '">@' + messages[i]["user"] + '</a> ' + messages[i]["message"] + '</div></div>');
	}
	
	chatInner.scrollTop = chatInner.scrollHeight;
}

function runChatUpdate(message)
{
	// Check if the chat widget exists
	var channel = document.getElementById("chat_channel");
	
	// If the channel doesn't exist, there is no chat widget. End here.
	if(!channel) { return; }
	
	// Set default message to nothing if one is not provided
	if(typeof(message) == "undefined")
	{
		message = "";
	}
	
	// Prepare Values
	channel = channel.value;
	
	var lastpost = document.getElementById("chat_time").value;
	var username = document.getElementById("chat_username");
	var isPrivate = document.getElementById("chat_private");
	
	isPrivate = (isPrivate ? true : false);
	
	// If the user is not logged in, set appropriate values
	if(!username)
	{
		username = "";
		JSEncrypt = "";
	}
	else
	{
		username = username.value;
	}
	
	// Load balance the chat servers using the channel string as a numeric algorithm
	var chatServID = parseInt((channel.charCodeAt(0) + channel.charCodeAt(1)) % 10);
	
	if(!chatServID) { return; }
	
	// Call the AJAX file that is going to add your values
	getAjax("http://" + (isPrivate ? "p" : "") + "chat" + chatServID + ".sync.unifaction.com", (isPrivate ? "getPrivateChatData" : "getChatData"), "load_chat", "lastpost=" + lastpost, "username=" + username, "message=" + message, "enc=" + JSEncrypt, "channel=" + channel);
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
	
	// Exception for lists
	var extra = "";
	var extramove = 0;
	if(tagToAdd == "list")	{ extra = "[*]\n[*]\n[*]"; extramove = 3; }
	
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
		element.value = section1 + tagStart + extra + section2 + tagEnd + section3;		
		
		// Update the Element's Selection (Cursor)
		element.selectionStart = startPos + tagToAdd.length + 2 + extramove + paramLen;
		element.selectionEnd = stopPos + tagToAdd.length + 2 + extramove + paramLen;
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
	if(tagToAdd == "url")
	{
		insert = prompt("Enter the URL (web address) to link to:");
		
		if(insert.indexOf("://") == -1)
		{
			insert = "http://" + insert;
		}
	}
	else if(tagToAdd == "quote")
	{
		insert = prompt("Enter the person being quoted:");
	}
	
	else if(tagToAdd == "spoiler")
	{
		insert = prompt("Enter the title of the spoiler:");
	}
	else if(tagToAdd == "color")
	{
		insert = prompt("Enter the color:");
	}
	else if(tagToAdd == "size")
	{
		insert = prompt("Enter the font size:");
	}
	else if(tagToAdd == "font")
	{
		insert = prompt("Enter the font family:");
	}
	
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
		siteURL = "http://hashtag.unifaction.com";
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
	
	getAjax("http://example.com", "scriptName", "funcToActivate", "var1=a", "var2=b", ...)
		
		- Replace "http://example.com" with the site to connect to, or "" if loading the same site.
		
		- "scriptName" is the script you're calling.
		
		- "funcToActivate" is the function you're going to activate when the AJAX responds.
			It will be run with the return value of the ajax call, i.e. funcToActivate(responseText);
		
		- Each argument passed to getAjax() after the AJAX DIV will provide additional parameters that
		  get sent as $_POST values to that page.
		  
			^ For example, the script above would pass $_POST['var1'] = "a" and $_POST['var2'] = "b",
			which can be used to generate data on that page.
		
	
	<< A Simple Example >>
		
		getAjax('http://search.unifaction.com', 'doSomething', 'funcToActivate', 'setVal=1', 'anotherVal=2');
		
		function funcToActivate(response) { console.log(response); }
		
	
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
	for(var i = 3; i < arguments.length; i++)
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
			// Standard AJAX calls return content to a specific DIV
			if(ajaxDivID != "")
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
			
			// If we're requesting the AJAX call to return to a specific function
			if(ajaxReturnFunc != "")
			{
				if(typeof window[ajaxReturnFunc] == "function")
				{
					window[ajaxReturnFunc](xmlhttp.responseText);
				}
				
				ajaxReturnFunc = "";
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

// Shortcuts for BBCode
function shortcut(event, element)
{
	if (event.ctrlKey && !event.altKey)
	{
		var id = element.getAttribute("id");
		var code = event.keyCode ? event.keyCode : event.which;
		switch(code)
		{
			case 66:
				event.preventDefault();
				UniMarkup(id, "b");
				break;
			case 85:
				event.preventDefault();
				UniMarkup(id, "u");
				break;
			case 73:
				event.preventDefault();
				UniMarkup(id, "i");
				break;			
			case 83:
				event.preventDefault();
				UniMarkup(id, "s");
				break;
			case 80:
				event.preventDefault();
				UniMarkup(id, "img");
				break;
			case 76:
				event.preventDefault();
				UniMarkupAdvanced(id, "url");
				break;
			case 81:
				event.preventDefault();
				UniMarkupAdvanced(id, "quote");
				break;
			case 72:
				event.preventDefault();
				UniMarkupAdvanced(id, "spoiler");
				break;
		}
	}
}

// Enable shortcuts for the relevant textareas
var textareas = document.getElementsByTagName("textarea");
for(i=0; i<textareas.length; i++)
{
	if(textareas[i].hasAttribute("id"))
		textareas[i].setAttribute("onkeydown", "shortcut(event, this)");
}
	