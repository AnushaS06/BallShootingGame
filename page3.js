var score=localStorage.score;

var tot=localStorage.numberBall;
window.onload = function b(){
    var ele = this.document.querySelector("#sc");
    ele.innerHTML += score + "/" + tot;
    var vidWin=document.querySelector("#za1");
    var vidLoose=document.querySelector("#za2");
    //console.log(vidWin,vidLoose);
    if (score>(tot/2)){
        //vidWin.unload();
        vidWin.load();
        //vidWin.src();       
        vidWin.play();
   }
    else{
        vidLoose.load();
        vidLoose.play();
    }
    
}