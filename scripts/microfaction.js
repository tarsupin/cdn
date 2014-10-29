
/******************************
****** Core Page Scripts ******
******************************/

function runVote(threadID, vote)
{
	var voteLink = document.getElementById((vote == 1 ? "up" : "down") + "Vote-" + threadID);
	var voteLinkOther = document.getElementById((vote == 1 ? "down" : "up") + "Vote-" + threadID);
	
	// Handle Upvotes
	if(vote == 1)
	{
		loadAjax("", "vote", "", "threadID=" + threadID, "vote=1");
		
		voteLinkOther.className = "voteDown";
		
		if(voteLink.className.match(/\bvStayUp\b/))
		{
			voteLink.className = "voteUp";
		}
		else
		{
			voteLink.className = "voteUp vStayUp";
		}
	}
	
	// Handle Downvotes
	else if(vote == -1)
	{
		loadAjax("", "vote", "", "threadID=" + threadID, "vote=-1");
		
		voteLinkOther.className = "voteUp";
		
		if(voteLink.className.match(/\bvStayDown\b/))
		{
			voteLink.className = "voteDown";
		}
		else
		{
			voteLink.className = "voteDown vStayDown";
		}
	}
}

/***************************
****** Thread Scripts ******
***************************/

function showMore(id, step)
{
	loadAjax("", "load-more-comments", "reply-box-" + id, "id=" + id, "step=" + step);
}

function hitReply(id)
{
	var replyForm = document.getElementById("comment-post");
	replyForm.style.display = "block";
	document.getElementById("comment-" + id + "-form").appendChild(replyForm);
	
	var replyNum = document.getElementById("comment-post-num");
	replyNum.value = id;
}

function minimize(id)
{
	var commentBox = document.getElementById("reply-box-" + id);
	var minBox = document.getElementById("min-" + id);
	
	if(commentBox.style.display == "none")
	{
		commentBox.style.display = "block";
		minBox.innerHTML = "Minimize";
	}
	else
	{
		commentBox.style.display = "none";
		minBox.innerHTML = "Maximize";
	}
}

/***************************
****** Posting Scripts ******
***************************/

function showRules(url, hashtag)
{
	// Create the parser that will work on our current URL
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
    // Let the browser do the work
    parser.href = url;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for( i = 0; i < queries.length; i++ ) {
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }
    // parser.hostname will return _____.microfaction.test
    // This next line will typecast our entire parser.hostname as a String and
    // return the portion of it beginning at position 0 and ending at the first period(.)
    // (In other words, the "_____" portion of parser.hostname)
    var microfaction = String(parser.hostname).substr(0, String(parser.hostname).indexOf('.'));
    // Now that we have the name of the microfaction that we are in, we can pass that 
    // to our AJAX function to tell it where the rules can be found
	loadAjax("", "load-rules", "rules", "microfaction=" + microfaction, "hashtag=" + hashtag);
}