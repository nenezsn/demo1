var box =document.getElementById("box");
			var div1 =document.getElementById("move"); 
			box.onmousemove=function(event){
				var event=event||window.event;
				var sT=document.body.scrollTop
				var l=event.clientX-box.offsetLeft-div1.offsetWidth/2;
				var t=event.clientY-box.offsetTop+sT-div1.offsetHeight/2;
				if(l<=0&&l<=box.offsetWidth-div1.offsetWidth)
				{
					l=0;
				}
				else if(l>=box.offsetWidth-div1.offsetWidth)
				{
					l=box.offsetWidth-div1.offsetWidth;
				}

				if(t<=0){
					t=0;
				}else if(t>=box.offsetHeight-div1.offsetHeight)
				{
					t=box.offsetHeight-div1.offsetHeight;
				}

				div1.style.left=l+"px";
				div1.style.top=t+"px"
				div1.onclick=function(){
					main(l,t);

				}
			}