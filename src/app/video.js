
var MYWIDTH=128;
var MYLENGTH=96;

function convertDwordToInt(nb){
	
	var red=nb&0x1f;
	red=Math.floor((red*255)/32);
	var green=(nb&0x7e0)>>5;
	green=Math.floor((green*255)/64);
	var blue=(nb&0xf800)>>11;
	blue=Math.floor((blue*255)/32);
	
	//alert("rgb:"+red+":"+green+":"+blue);
	return new Array(red,green,blue);

}
var memoireVideo=new Uint16Array(MYWIDTH*MYLENGTH);

for(var i=0;i<memoireVideo.length;i++){
	memoireVideo[i]=Math.floor(Math.random() * (65535));
}





var c = document.getElementById( "video_canvas" );
var longueur=document.getElementById( "video_canvas" ).width;
var largeur=document.getElementById( "video_canvas" ).height;
var scale = Math.min(MYWIDTH / longueur, MYLENGTH/ largeur);

//REISZER TOUT CA 
var ctx = c.getContext("2d");



// Yeux
var maChaine="";
for(var i=0;i<memoireVideo.length;i++){
	var pixel=convertDwordToInt(memoireVideo[i]);
	ctx.fillStyle = "rgb("+pixel[0]+","+pixel[1]+","+pixel[2]+")";
	var x=Math.floor(i/MYLENGTH);
	var y=Math.floor(i%MYLENGTH);
	maChaine+="=> "+x+":"+y+" \n";
	ctx.fillRect(x,y,1,1);
}

lines = maChaine.split("=>");
var lastLine = lines.pop();

