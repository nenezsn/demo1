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
  var RGB = getRGBAverage(imgData);
  var RGBinfo=document.getElementById("RGB")
  RGBinfo.innerHTML="R:"+RGB.R+"  ,  "+"G:"+RGB.G+"  ,  "+"B:"+RGB.B

  //获取rgb
  var rgb = getrgbToOneAverage(imgData);
  var rgbinfo=document.getElementById("rgb");
  rgbinfo.innerHTML="r:"+rgb.r+"  ,  "+"g:"+rgb.g+"  ,  "+"b:"+rgb.b;

  //获取HIS
  var HIS = getHISaverage(imgData);
  var HISinfo=document.getElementById("HIS"); 
  HISinfo.innerHTML="H:"+HIS.H+"  ,  "+"I:"+HIS.I+"  ,  "+"S:"+HIS.S
	
  //是否处于发病区域;
  var flag =getAtRound(imgData);
  var flagInfo = document.getElementById("zhanbi");
  var fabing="";
  if(flag){
  	fabing="处于发病区域";
  }else{
  	fabing="未处于发病区域";
  }
  flagInfo.innerHTML=fabing;
  //获取黄色所占比
  var yellow = getYellowGreenPersent(imgData);
  var yellowPersent=document.getElementById("zhanbi1");
  yellowPersent.innerHTML=Number(yellow).toFixed(4)+"%"
  
  //最终结论：
  var yellowPersent=document.getElementById("zhanbi2");
  var motai = document.getElementById("motai");
  var motai1 =document.getElementById("motai1");
  if(flag==true&&yellow>4.8){
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
	  ctx.drawImage(img,x,y,100,100,0,0,100,100);
	  
	  
	  //第1,2个参数是从画布那里开始截取,第3,4参数是截取的大小
	  //选中画布上的矩形区域，求出改区域上的rgba
	 
	  var data =  ctx.getImageData(0,0,100,100)
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
	  var data =  ctx.getImageData(0,0,100,100);
	  var color = data.data;
	  for(var i =0;i<data.data.length;i+=4){
	  	if(data.data[i+1]<140&&data.data[i+2]<130&&data.data[i+2]>10){
	  		color[i]=255;
	  		color[i+1]=255;				
	  		color[i+2]=255;
	  	}
	  }
	ctx.putImageData(data,150,0);
		
	}
  //求出所选区域的RGB平均值**************************************************************
  function getRGBAverage(imgData){
  	var R=0;
  	var G=0;
  	var B=0;
  	var count = 0;
  	
  	for(var i =0 ; i<imgData.length;i++){
  		
  		R+=imgData[i].R;
  		G+=imgData[i].G;
  		B+=imgData[i].B;
	}
  	
  	R=format(R/10000);
  	G=format(G/10000);
  	B=format(B/10000);

  	
  	
  	var obj = {};
  	obj.R=R;
  	obj.G=G;
  	obj.B=B;
  	return obj;
  	
  }

  //求出所选区域的归一化rgb的平均值***************************************************
  function getrgbToOneAverage(imgData){
  	var r=0;
  	var g=0;
  	var b=0;
  	var R=0;
  	var G=0;
  	var B=0;
  	for(var i =0 ; i<imgData.length;i++){
  		R=imgData[i].R
  		G=imgData[i].G;
  		B=imgData[i].B;
  		r+=R/(R+G+B);
  		g+=G/(R+G+B); 		
  		b+=B/(R+G+B);  		
	}
  	r=format(r/10000);
  	g=format(g/10000);
  	b=format(b/10000);
  	var obj ={};
  	obj.r=r;
  	obj.g=g;
  	obj.b=b;
  	return obj;
  }
  //求出所选区域的HIS
  function getHISaverage(imgData){
  	var R=0;
  	var G=0;
  	var B=0;
  	var H=0;
  	var I=0;
  	var S=0;
  	var W=0;
  	for(var i =0 ; i<imgData.length;i++){
  		R=imgData[i].R;
  		G=imgData[i].G;
  		B=imgData[i].B;
  		I+=(R+G+B)/3;
  		H+=Math.acos((2*R-G-B)/( 2*Math.sqrt((R-G)*(R-G) + (R-B)*(G-B))))
  		S+=1-(3*Math.min(R,G,B)) / (R+G+B);

	}

  	I=format(I/10000);
  	H=format(H/10000);
  	S=format(S/10000);
  	var obj={};
  	obj.S=S;
  	obj.H=H;
  	obj.I=I;
  	return obj
  }
  
  //用来保留小数点用的函数*******************************************************
    function format(val){
  		return Number(val).toFixed(2)*1;
  	}


//获取是否处于病发区域*********************************************************
	function getAtRound(imgData){
  	var count = 0;
  	var R=0;
  	var G=0;
  	var B=0;
  	for(var i =0 ; i<imgData.length;i++){
  		R+=imgData[i].R;
  		G+=imgData[i].G;
  		B+=imgData[i].B;
	}
  	R=R/10000;
  	G=G/10000;
  	B=B/10000;
  	
  	if(R>108&&R<192&&G>149&&G<224&&30<B&&B<110){
		return true;
	}else{
  		return false;
  	}
	
	}
	//求得黄绿相间所占比
	function getYellowGreenPersent(imgData){
  	var count = 0;
  	var R=0;
  	var G=0;
  	var B=0;
  	for(var i =0 ; i<imgData.length;i++){
  		if(imgData[i].R>154&&imgData[i].G>205&&imgData[i].B<112&&imgData[i].B>30)
			count++;
	}
	count=count/10000*100;
  	return count;
 
	
	}
	
  //获取截取的坐标位置 ***************************************************************
  function getXY(img){
  //获取待检测图像的宽高，
  var imgW = img.offsetWidth;
  var imgH = img.offsetHeight;
  //截图图像点的坐标
  var x = imgW/2-50;
  var y = imgH/2-50;
  var arr=[];
  arr[0]=x;
  arr[1]=y;
  	return arr
  }
}