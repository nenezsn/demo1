var selected =document.getElementById("sel");
	var img = document.getElementById("tulip");
	selected.onchange=function(){
		var value= this.value;
		img.src="img/"+value+".jpg"
	}