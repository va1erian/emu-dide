
var MYWIDTH=128*2;
var MYLENGTH=96*2;

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

for(var i=0;i<MYWIDTH*MYLENGTH;i++){
	memoireVideo[i]=Math.floor(Math.random() * (65535));
}





var c = document.getElementById( "video_canvas" );
//var longueur=document.getElementById( "video_canvas" ).width;
//var largeur=document.getElementById( "video_canvas" ).height;
//var scale = Math.min(MYWIDTH / longueur, MYLENGTH/ largeur);

//REISZER TOUT CA 
var ctx = c.getContext("2d");



// Yeux

var maChaine="";
/*
c.width=MYWIDTH;
c.height=MYLENGTH;
for(var i=0;i<memoireVideo.length;i++){
	var pixel=convertDwordToInt(memoireVideo[i]);
	ctx.fillStyle = "rgb("+pixel[0]+","+pixel[1]+","+pixel[2]+")";
	var x=Math.floor(i/(MYLENGTH));
	var y=Math.floor(i%(MYLENGTH));
	
		x=x+1;
	
		y=y+1;
	maChaine+="=> "+x+":"+y+" \n";
	ctx.fillRect(x,y,2,2);
}
*/
c.width=MYWIDTH;
c.height=MYLENGTH;

var i=0;
for(var x=0;x<MYWIDTH;x=x+2){
	for(var y=0;y<MYLENGTH;y=y+2){
		var pixel=convertDwordToInt(memoireVideo[i]);
		ctx.fillStyle = "rgb("+pixel[0]+","+pixel[1]+","+pixel[2]+")";
		maChaine+="=> "+x+":"+y+" \n";
		ctx.fillRect(x,y,2,2);
		i++;
	}
	i++;
}

//lines = maChaine.split("=>");
//var lastLine = lines.pop();

