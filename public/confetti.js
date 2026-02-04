function launchConfetti(){
    const canvas=document.getElementById("gameCanvas");
    const ctx=canvas.getContext("2d");
    const confettis=[];
    for(let i=0;i<100;i++){
        confettis.push({
            x:Math.random()*canvas.width,
            y:Math.random()*canvas.height/2,
            r:Math.random()*6+4,
            color:`hsl(${Math.random()*360},100%,50%)`,
            vy:Math.random()*5+2
        });
    }
    let count=0;
    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        confettis.forEach(c=>{
            ctx.fillStyle=c.color;
            ctx.beginPath();
            ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
            ctx.fill();
            c.y+=c.vy; if(c.y>canvas.height) c.y=0;
        });
        count++; if(count<100) requestAnimationFrame(animate);
    }
    animate();
}
