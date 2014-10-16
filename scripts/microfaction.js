
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