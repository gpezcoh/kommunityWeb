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