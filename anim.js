var cb= localStorage.colorBall;
var sb= localStorage.speedBall;
var nb= localStorage.numberBall;
var wrongBalls=goodBalls=0,noOfGoodBalls,startNoOfBalls;
var colorBalls=cb,speedBalls=sb,numberBalls=nb;
var canvas, obj, w, h, mousePos,score=0;
var rect = { 
    xR : 20,
    yR : 20,
    wid:20,
    hei:20,
    colo:'lightblue',
    RSpeed : 1,
    v:20,
    move: function(x,y){
        this.xR=x;
        this.yR=y;
    }
};
var angle=0;
var cir=[];
var sec=Math.round(((nb*2.9)*sb/2));
function countdown(){
    var ele=document.querySelector("#clock");  
    ele.innerHTML="Time left = "+sec+" seconds";
    sec=sec-1;
    if(sec >= 0){
    var timer=setTimeout("countdown()",1000);}
    else
    {
        setScore(score,true);
    }
}        
function init() {
    countdown();
    playBackMusic();
    canvas = document.querySelector("#myCanvas");
    w = canvas.width; 
    h = canvas.height;  
    obj = canvas.getContext('2d');
    startGame();
    canvas.addEventListener('mousemove',mouseMoved);
    ballEaten=new Howl({
            src:["plop.mp3"],
            onload:function(){
                mainLoop();
            }
        });
    
}
function playBackMusic(){
    var a=document.getElementById("aud");
    a.play();
}
function startGame(){
    do{
        cir= createBallsSpec(3*numberBalls);
        startNoOfBalls=numberBalls;
        noOfGoodBalls=countNoOfGoodBalls();
    }
    while(noOfGoodBalls === 0);
    wrongBalls=0;
    goodBalls=0;
}
function countNoOfGoodBalls(){
    var x=0;
    cir.forEach(function (c){
        if(c.colo === colorBalls){
            x++;
        }
    });
    return x;
}
function mouseMoved(evt){
    mousePos = getMousePos(canvas,evt);
}
function getMousePos(canvas,evt){
    var rec = canvas.getBoundingClientRect();
    return {
        x : evt.clientX - rec.left,
        y : evt.clientY - rec.top
    }
}
function createBallsSpec(n) { 
    var ballArray=[];
    for(var i=0; i < n/3; i++) {
       var b = {
          xC:w/2,
          yC:h/2,
          r: 5 + 30 * Math.random(), 
          Cspeedx: -5 + 10 * Math.random(), 
          Cspeedy: -5 + 10 * Math.random(), 
          colo:cb,
        };
       ballArray.push(b);
      }
      for(var i=0; i < n-(n/3); i++) {
        var b = {
           xC:w/2,
           yC:h/2,
           r: 5 + 30 * Math.random(), 
           Cspeedx: -5 + 10 * Math.random(), 
           Cspeedy: -5 + 10 * Math.random(), 
           colo:getARandomColor(),
         };
        ballArray.push(b);
       }
     
    return ballArray;
}
function getARandomColor() {
    var colors = ['red', 'blue', 'yellow'];
    colors.splice(colors.indexOf(cb),1);
    var colorIndex = Math.round((colors.length-1)*Math.random()); 
    var co = colors[colorIndex];
    return co;
}

function mainLoop() {
  obj.clearRect(0, 0, w, h); 
  drawRectangle(rect);
  drawCircle(cir);
  drawAliveBalls(cir);
  
  moveBall(cir);
  moveRect();
  
  requestAnimationFrame(mainLoop);
}
function setScore(score,loadPage) {
    if (score<0)
        score=0;
    localStorage.setItem("score",score);
    if (loadPage==true && score>(nb/2))
        window.location.href="page3.html";
    else if(loadPage==true && score<=(nb/2))
        window.location.href="page4.html"
}

function drawAliveBalls(c){
    obj.font='30px Arial'

    if (cir.length === 0){
        score=goodBalls-wrongBalls;
        setScore(score,true);
    }
    else if(goodBalls==nb){
        score=goodBalls-wrongBalls;
        setScore(score,true);
    }
    else{
        score=goodBalls-wrongBalls;
        setScore(score,false);
    }
}
function moveBall(c)
{
    c.forEach(function(b,index){
    b.xC=b.xC+(b.Cspeedx*speedBalls);
    b.yC=b.yC+(b.Cspeedy*speedBalls);
    testCollisionWithWall(b);
    testCollisionWithBall(b,index);
});
} 
function testCollisionWithWall(c){
    if ((c.xC + c.r)>w){
        c.Cspeedx=-c.Cspeedx;
    }
    else if((c.xC-c.r) <0){
        c.Cspeedx=-c.Cspeedx;
    }
    if((c.yC+c.r)>h){
        c.Cspeedy=-c.Cspeedy;
    }
    else if((c.yC-c.r)<0){
        c.Cspeedy=-c.Cspeedy;
    }
}
 function testCollisionWithBall(b,index){
    if(cirRectOverlap(rect.xR,rect.yR,rect.wid,rect.hei,b.xC,b.yC,b.r)){
        if(b.colo === colorBalls){
            ballEaten.play();
            goodBalls ++;
        }
        else{
            wrongBalls ++;
        }
        cir.splice(index,1);
    }
}
function cirRectOverlap(xR,yR,wR,hR,xC,yC,rC){

    var tempX = xC;
    var tempY = yC;
    if(tempX<xR) tempX = xR;
    if(tempX>(xR+wR)) tempX=(xR+wR);
    if(tempY<yR) tempY = yR;
    if(tempY>(yR+hR)) tempY=(yR+hR);
    return(((xC-tempX)*(xC-tempX)+(yC-tempY)*(yC-tempY))<rC*rC);
}

function moveRect(){
    if (mousePos != undefined){
        rect.xR=mousePos.x;
        rect.yR=mousePos.y;
    }
}
function drawRectangle(r)
{
    //obj.rotate(a);
    obj.fillStyle=r.colo;
    obj.fillRect(r.xR,r.yR,r.wid,r.hei); 
}

function drawCircle(c)
{
    c.forEach(function(d){
    obj.fillStyle=d.colo;
    obj.beginPath();
    obj.arc(d.xC,d.yC,d.r,0,2*Math.PI);
    obj.fill();});
    
}
