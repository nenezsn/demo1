function main(x,y){
  //获取canvas对象
  var c=document.getElementById("myCanvas");
  //获取canvas的上下文
  var ctx=c.getContext("2d");

  //获取图片对象
  var img=document.getElementById("tulip");
  //获取图片的裁剪位置
  //var XY=getXY(img)	
  //获取裁剪后图片的像素信息
  var imgData = getImageData(img,x,y)
  //获取处理后的图片展示
  var newData = clearOther();

  //获取RGB 
  var RGB = getRGBAverage();
  var RGBinfo=document.getElementById("RGB")
  RGBinfo.innerHTML="R:"+RGB.R+"  ,  "+"G:"+RGB.G+"  ,  "+"B:"+RGB.B


	
  //是否处于发病区域;
  var flag =getAtRound();
  var flagInfo = document.getElementById("zhanbi");
  var fabing="";
  if(flag){
  	fabing="处于发病区域";
  }else{
  	fabing="未处于发病区域";
  }
  flagInfo.innerHTML=fabing;

  
  //最终结论：
  var yellowPersent=document.getElementById("zhanbi2");
  var motai = document.getElementById("motai");
  var motai1 =document.getElementById("motai1");
  if(flag){
  	 yellowPersent.innerHTML="存在病毒病，请及时处理";
  	 yellowPersent.style.color="red";
  	 motai.style.display='none';
  	 motai1.style.display='inline-block';
  }else{
  	yellowPersent.innerHTML="不存在病毒病，请做好防治";
  	yellowPersent.style.color="green";
  	motai.style.display='inline-block';
  	motai1.style.display='none';
  }
  
  
  
  /**********************************下面是函数部分***********************************/
  //获得图像中心区域的RGB集合 ************************************************************
	function getImageData(img,x,y){
	  //第一个参数是图像元素  ，第2,3个是从图像的那里开始截图，第4,5个是截图图像元素的大小,
	  //第6,7个是放在canvas上的位置,8,9个是将截取下来的图像，以多少宽高显显示在画布上
	  //截取样张上的部分图片绘制到画布上去
	  ctx.drawImage(img,x,y,200,200,0,0,200,200);
	  
	  
	  //第1,2个参数是从画布那里开始截取,第3,4参数是截取的大小
	  //选中画布上的矩形区域，求出改区域上的rgba
	 
	  var data =  ctx.getImageData(0,0,200,200)
	  var imgData = data.data;
 
	  var arr = []
	  for(var i =0; i < imgData.length;i+=4){
	  		var obj = {};
	  		obj.R=imgData[i];
	  		obj.G=imgData[i+1];
	  		obj.B=imgData[i+2];
	  		obj.A=imgData[i+3];
	  		arr.push(obj);
	  }
	  	return arr
	  }
	//消除其他非叶部元素的影响***************************************************************
	function clearOther(){
	  var data =  ctx.getImageData(0,0,200,200);
	  var color = data.data;
	  for(var i =0;i<color.length;i+=4){
	  	if(color[i+1]<color[i]+10||color[i+1]<50){
	  		color[i]=0;
	  		color[i+1]=0;				
	  		color[i+2]=0;
	  	}
	  }
	ctx.putImageData(data,250,0);
	return data;

	}
  //求出所选区域的RGB平均值**************************************************************
  function getRGBAverage(){
  	var data = clearOther();
  	var color = data.data;
  	var count = 0;
  	var R=0;
  	var G=0;
  	var B=0;
  	for(var i =0 ; i<color.length;i+=4){
  		if(color[i+1]!=0){
	  		count++;
	  		R+=color[i]
	  		G+=color[i+1]
	  		B+=color[i+2]
  		}
	}
  	
  	R=format(R/count);
  	G=format(G/count);
  	B=format(B/count);
  	
  	var obj = {};
  	obj.R=R;
  	obj.G=G;
  	obj.B=B;
  	return obj;
   }  
  //用来保留小数点用的函数*******************************************************
    function format(val){
  		return Number(val).toFixed(2)*1;
  	}


//获取是否处于病发区域*********************************************************
	function getAtRound(){
		var imgData = getRGBAverage()
		var R = imgData.R;
		var G = imgData.G;
		var B = imgData.B;
  		console.log(R)
  		console.log(G)
  		console.log(B)
	  	if(R>113&&R<162&&G>144&&G<190){
	  		console.log("true")
			return true;
		}else{
			console.log("false")
	  		return false;
	  	}
	
	}

}