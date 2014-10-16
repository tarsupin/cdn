
// Prepare Values
var activeContentID = 0;

// Boost Handler
function track_boost(contentID, runAgg)
{
	if(runAgg == 1)
	{
		return agg_track_boost(contentID);
	}
	
	// Update the user's visual for the boost
	var boostTrack = document.getElementById("boost-track-" + contentID);
	var boostCount = document.getElementById("boost-count-" + contentID);
	var bCount = parseInt(boostCount.innerHTML);
	
	if(boostTrack.className == "c-boost")
	{
		boostTrack.className = "c-boost-track";
		boostCount.innerHTML = bCount + 1;
	}
	else
	{
		boostTrack.className = "c-boost";
		boostCount.innerHTML = bCount - 1;
	}
	
	// Run the Boost Function
	loadAjax("", "content-track", "", "contentID=" + contentID, "type=boost");
}

// Boost Handler (aggregate)
function agg_track_boost(contentID)
{
	activeContentID = contentID;
	voteType = 1;
	
	// Update the user's visual for the boost
	var boostTrack = document.getElementById("boost-track-" + contentID);
	var boostCount = document.getElementById("boost-count-" + contentID);
	
	if(boostCount.innerHTML != "?")
	{
		var bCount = parseInt(boostCount.innerHTML);
		
		if(boostTrack.className == "c-boost")
		{
			boostTrack.className = "c-boost-track";
			boostCount.innerHTML = bCount + 1;
		}
		else
		{
			boostTrack.className = "c-boost";
			boostCount.innerHTML = bCount - 1;
			voteType = -1;
		}
	}
	else
	{
		boostTrack.className = "c-boost-track";
	}
	
	// Run the Boost Function
	ajaxReturnFunc = 'boost_getResponse';
	loadAjax("", "content-track", "", "contentID=" + contentID, "type=boost", "voteType=" + voteType);
}

function boost_getResponse(ajaxResponse)
{
	var json = JSON.parse(ajaxResponse);
	
	setBubbles(activeContentID, json['boosts'], json['nooches'], json['tipNum']);
}


// Nooch Handler
function track_nooch(contentID)
{
	activeContentID = contentID;
	
	buttonModal("Nooch This Content", "A small payment of 0.15 UniJoule is required to nooch this content.<br /><br />Note: Nooches are permanent and cannot be removed once assigned. <a href='http://unifaction.com/faqs/nooching'>Learn More</a>.", "javascript:nooch_activate(" + contentID + ")", "Nooch It!", "Cancel");
}

function nooch_activate(contentID)
{
	ajaxReturnFunc = 'nooch_getResponse';
	loadAjax("", "content-track", "", "contentID=" + contentID, "type=nooch");
}

function nooch_getResponse(ajaxResponse)
{
	closeModal();
	
	// Prepare Values
	var json = JSON.parse(ajaxResponse);
	
	contentID = json['content_id'];
	noochTrackCount = json['nooch_count'];
	noochSuccess = json['nooch_success'];
	
	// Update the user's visual for the nooch
	var noochTrack = document.getElementById("nooch-track-" + contentID);
	var noochCount = document.getElementById("nooch-count-" + contentID);
	var nCount = parseInt(noochCount.innerHTML);
	
	if(noochSuccess)
	{	
		noochCount.innerHTML = nCount + 1;
		
		if(noochTrackCount == 3)
		{
			confirm("You have officially triple nooched this content.");
		}
	}
	else
	{
		alert("Unable to purchase this nooch.");
	}
	
	if(noochTrackCount >= 3)
	{
		noochTrack.className = "c-nooch-track";
		
		var noochLink = a.getElementsByTagName("a");
		noochLink[0].href = "javascript:void(0)";
	}
}

// Tip Handler
function track_tip(contentID)
{
	activeContentID = contentID;
	
	var a = "";
	var c = [5.00, 3.75, 2.50, 1.25, 0.75, 0.50, 0.25, 0.10];
	
	for(var b = 0;b <= 7;b++)
	{
		a += '<option value="' + c[b] + '"' + (b == 4 ? ' selected' : '') + '>Tip ' + c[b].toFixed(2) + ' UniJoule</option>';
	}
	
	customModal('<div class="modal-title">Tip the Author</div><div class="modal-desc" style="margin-bottom:10px;">Provide a tip to this author for their work.</div><div style="text-align:center;"><select id="tipAmount" name="tipAmount" style="padding:5px; font-size:1.2em;">' + a + '</select></div><div style="text-align:center; margin-top:22px;"><div class="modal-button-wrap"><a class="modal-button" href="javascript:tip_activate(' + contentID + ', document.getElementById(\'tipAmount\').value)">Tip the Author</a></div></div></div>');
}

function tip_activate(contentID, amount)
{
	ajaxReturnFunc = 'tip_getResponse';
	loadAjax("", "content-track", "", "contentID=" + contentID, "type=tip", "amount=" + amount);
}

function tip_getResponse(ajaxResponse)
{
	closeModal();
	
	// Prepare Values
	var json = JSON.parse(ajaxResponse);
	
	if(json !== false)
	{
		contentID = json['content_id'];
		tipAmount = json['tip_boost'];
		
		// Update the user's visual for the tip
		var tipCount = document.getElementById("tip-count-" + contentID);
		var tCount = parseInt(tipCount.innerHTML);
		
		tipCount.innerHTML = tCount + tipAmount;
	}
}

// Set the tracking bubbles
function setBubbles(contentID, bNum, nNum, tNum)
{
	var boostCount = document.getElementById("boost-count-" + contentID);
	var noochCount = document.getElementById("nooch-count-" + contentID);
	var tipCount = document.getElementById("tip-count-" + contentID);
	
	boostCount.innerHTML = bNum;
	noochCount.innerHTML = nNum;
	tipCount.innerHTML = tNum;
}