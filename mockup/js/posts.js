function openPost(post){

	var children = post.parentNode.children;
	for(var i = 0; i < children.length; ++i){
		if(children[i].className === "description col-md-12"){
			description = children[i];
			break;
		}
	}
	var height = Math.round(description.textContent.length / 3) + "px";
	$(description).animate({ opacity : 1 , height : height, paddingTop : "10px", paddingBottom : "10px"},700);
	return false;
}

function closePost(post){
	var description = post.parentNode;
	$(description).animate({ opacity : 0 , height : "0px", paddingTop : "0px", paddingBottom : "0px"},700);
	return false;
}

$(document).ready(function () {
	$( "#submit" ).click(function() {
		var values = []
		$.each($('#newPostForm').find(".form-control"), function() {
			values.push(this.value);
		});
		var location;
		var margin1;
		var margin2;
		if(place === "news"){
			location = document.getElementById("newInfo");
			margin1 = "col-md-4";
			margin2 = "col-md-8";
		}
		else if(place === "event"){
			location = document.getElementById("eventInfo");
			margin1 = "col-md-6";
			margin2 = "col-md-6";
		}
		else if(place === "job"){
			location = document.getElementById("jobInfo");
			margin1 = "col-md-6";
			margin2 = "col-md-6";
		}
		$("#" + location.id).prepend('<ul><div class="new">&#10004;</div><a href="javascript:void(0)" onClick="openPost(this)" class="'+ margin1 + '">'+ values[1] + '</a><p class="summary '+ margin2 +'">'+  values[2] +'</p><p class="description col-md-12">'+ values[3] + '<a href="javascript:void(0)" onClick="closePost(this)"> &#8679;</a></p></ul>');
	});
});
