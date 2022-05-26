// 37.7952 pixels per cm or 
// 377.952 pixels per metre`
// 1 m/s = 377.952px / s 
// = 1360.6272px / hr

// x pixels every frame, frame is a 60th of a second
// pixels * 60 / 377.952

const FPS = 60;
const PPCM = 38;

function motion() {
    class Ball {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.oldx = 0;
            this.oldy = 0;
            this.radius = 30;
            this.vx = 2;
            this.vy = 2;
            this.oldvx = 2;
            this. oldvy = 2;
            this.color = 'hsl(350, 70%, 50%)';
            this.bounce = -0.8;
            this.hasBounced = false;
        }

        updatePos(motionScene) {
            this.hasBounced = false;
            this.oldvx = this.vx;
            this.oldvy = this.vy;
            this.oldx = this.x;
            this.oldy = this.y;
            this.vy += gravity;
            this.x += this.vx;
            this.y += this.vy;
    
            //boundary detect and bounce
            if (this.x + this.radius > cright) {
                this.x = cright - this.radius;
                this.vx *= this.bounce;
                this.hasBounced = true;
            } else if (this.x - this.radius < cleft) {
                this.x = cleft + this.radius;
                this.vx *= this.bounce;
                this.hasBounced = true;
            }
            if (this.y + this.radius > motionScene.canvas.height) {
                this.y = motionScene.canvas.height - this.radius;
                this.vy *= bounce;
                this.hasBounced = true;
            } else if (this.y - this.radius < ctop) {
                this.y = ctop + this.radius;
                this.vy *= this.bounce;
                this.hasBounced = true;
            }
        }
    
        draw(ctx) {
            ctx.lineWidth = this.lineWidth;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    }

    class Tracker {
        constructor() {
            this.cmps = 0;
            this.avgCmps = 0;
            this.prevCmps = 0;
            this.angle = 0;
            this.deltaX = 0;
            this.deltaY = 0;
            this.deltaDiag = 0;
            this.currTimestamp = 0;
            this.prevTimestamp = 0;
            this.elapsedTime = 0;
        }

        track(ball) {
            this.dx = ball.x - ball.oldx;
            this.dy = ball.y - ball.oldy;
            this.diag = Math.sqrt((dx*dx) + (dy*dy));

            this.elapsedTime = this.currTimestamp - this.lastTimestamp;
            this.prevCmps = this.cmps;
            this.cmps = (diag / (this.elapsedTime * PPCM)).toFixed(2);
            this.avgCmps = (this.cmps + this.prevCmps) / 2;

            this.angle = Math.round(Math.atan2(dy, dx) * 180 / Math.PI);
            if (this.angle < 0) this.angle = 360 + this.angle;
        }
    }

    class MotionScene {
        constructor() {
            this.canvas = document.getElementsByClassName('js-motion-canvas--speed')[0];
            this.canvasCloneOne = document.getElementsByClassName('js-motion-canvas--velocity')[0];
            this.canvasCloneTwo = document.getElementsByClassName('js-motion-canvas--acceleration')[0];
            this.ctx = canvas.getContext('2d');
            this.ctxCloneOne = canvasCloneOne.getContext('2d');
            this.ctxCloneTwo = canvasCloneTwo.getContext('2d');

            this.ball = new Ball();
            this.gravity = 0;
            this.currTimestamp = 0;
            this.lastTimestamp = 0;

            this.boostValue = 0;
        }

        configureDimensions() {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.canvasCloneOne.width = this.canvasCloneOne.clientWidth;
            this.canvasCloneOne.height = this.canvasCloneOne.clientHeight;
            this.canvasCloneTwo.width = this.canvasCloneTwo.clientWidth;
            this.canvasCloneTwo.height = this.canvasCloneTwo.clientHeight;
            this.ball.x = this.canvas.width / 2;
            this.ball.y = this.canvas.height / 2;
        }

        clone() {
            this.ctxCloneOne.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctxCloneOne.drawImage(this.canvas, 0, 0 );
            this.ctxCloneTwo.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctxCloneTwo.drawImage(this.canvas, 0, 0 );
        }

        boost(type) {
            this.ball.oldvx = this.ball.vx;
            this.ball.oldvy = this.ball.vy;

            this.boostValue = parseInt($(`.js-gui__boost-value--${type}`)[0].value);
            if (isNaN(this.boostValue)) this.boostValue = 0;
            this.boostValue = this.boostValue * PPCM/FPS;

            let angleOfElevation = Math.atan(Math.abs(vy)/Math.abs(vx));
            let xBoostVal = boostVal*Math.cos(angleOfElevation), 
                yBoostVal = boostVal*Math.sin(angleOfElevation);

            if (this.ball.vx > 0) this.ball.vx += xBoostVal;
            else this.ball.vx -= xBoostVal;
            if (this.ball.vy > 0) this.ball.vy += yBoostVal;
            else this.ball.vy -= yBoostVal;
        }
    }

    $(".js-gui__boost-btn-inner--speed")[0].addEventListener("click", () => boost("speed"));
    $(".js-gui__boost-btn-inner--velocity")[0].addEventListener("click", () => boost("velocity"));
    $(".js-gui__boost-btn-inner--acceleration")[0].addEventListener("click", () => boost("acceleration"));

    function trackSpeed() {
        let dx = ball.x - ball.oldx, dy = ball.y - ball.oldy;
        let diag = Math.sqrt((dx*dx) + (dy*dy));
        let elapsedTime = currTimestamp - lastTimestamp;

        measurements.prevCmps = measurements.cmps;
        measurements.cmps = (diag/(elapsedTime*PPCM)).toFixed(2);
        measurements.avgCmps = (measurements.cmps + measurements.prevCmps) / 2;
    }

    function trackAngle() {
        let dx = ball.x - ball.oldx, dy = ball.y - ball.oldy;

        measurements.angle = Math.round(Math.atan2(dy, dx) * 180/Math.PI);
        if (measurements.angle < 0) measurements.angle = 360 + measurements.angle;
    }

    function trackMaster() {
        let vxms, vyms, axmss, aymss, amss, oldvxms, oldvyms, anglea;

        trackSpeed();
        trackAngle();

        vxms = vx*FPS/PPCM, vyms = -vy*FPS/PPCM;
        oldvxms = oldvx*FPS/PPCM, oldvyms = -oldvy*FPS/PPCM;
        let dvxms = vxms-oldvxms, dvyms = vyms-oldvyms;
        amss = Math.sqrt(((dvxms)*(dvxms)) + ((dvyms)*(dvyms)));
        amss = amss.toFixed(2);
        axmss = (dvxms).toFixed(2);
        aymss = (dvyms).toFixed(2);

        anglea = Math.round(Math.atan2(dvyms, dvxms) * 180/Math.PI);
        if (ball.hasBounced) {
            aymss = 0, axmss = 0, amss = 0;
        }
    }

    function displayTracking() {
        $(".js-measurement__text-value--speed").each(index => $(this).html(measurements.cmps))
        $(".js-measurement__bar-fill--speed").css("width", `${measurements.cmps / 5}%`);

        $(".js-measurement__text-value--degrees").html(measurements.angle);
        $(".js-gui__direction-dial-point--velocity").css("transform", `rotate(${(measurements.angle+145)}deg)`);
    }

    function animate (timestamp) {
        timestamp /= 1000;
        currTimestamp = timestamp;

        window.requestAnimationFrame(animate, canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        updatePos();
        trackMaster();
        displayTracking();

        ball.draw(ctx);
        clone();
        lastTimestamp = timestamp;
    };
    animate();
}
motion();