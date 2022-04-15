"use strict";

function stars() {
  let canvas = $(".js-stars-canvas").first()[0],
    ctx = canvas.getContext('2d'),
    w = canvas.width = window.innerWidth,
    h = canvas.height = 1200,
      
    hue = 227,
    stars = [],
    count = 0,
    maxStars = 1000;

  // Thanks @jackrugile for the performance tip! https://codepen.io/jackrugile/pen/BjBGoM
  // Cache gradient
  let canvas2 = document.createElement('canvas'),
      ctx2 = canvas2.getContext('2d');
  canvas2.width = 100;
  canvas2.height = 100;
  
  let half = canvas2.width/2,
      gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
  gradient2.addColorStop(0.005, '#fff');
  gradient2.addColorStop(0.1, 'hsla(' + '360' + ', 75%, 33%, 0.5)');
  gradient2.addColorStop(0.3, 'hsla(' + "280" + ', 80%, 10%, 0.2)');
  gradient2.addColorStop(1, 'transparent');

  ctx2.fillStyle = gradient2;
  ctx2.beginPath();
  ctx2.arc(half, half, half, 0, Math.PI * 2);
  ctx2.fill();

  // End cache

  function random(min, max) {
    if (arguments.length < 2) {
      max = min;
      min = 0;
    }
    
    if (min > max) {
      let hold = max;
      max = min;
      min = hold;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function maxOrbit(x,y) {
    let max = Math.max(x,y),
        diameter = Math.round(Math.sqrt(max*max + max*max));
    return diameter/2;
  }

  let Star = function() {

    this.orbitRadius = random(maxOrbit(w,h));
    this.radius = random(60, this.orbitRadius) / 12;
    this.orbitX = w / 2;
    this.orbitY = h / 2;
    this.timePassed = random(0, maxStars);
    this.speed = random(this.orbitRadius) / 5000000;
    this.alpha = random(2, 10) / 10;

    count++;
    stars[count] = this;
  }

  Star.prototype.draw = function() {
    let x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
        y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
        twinkle = random(10);

    if (twinkle < 2 && this.alpha > 0) {
      this.alpha -= 0.01;
      // console.log(this.alpha);
    } else if (twinkle > 7 && this.alpha < 1) {
      this.alpha = Math.min(this.alpha + 0.1, 1);
    }

    
    ctx.globalAlpha = this.alpha;
      ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
    this.timePassed += this.speed;
  }

  for (let i = 0; i < maxStars; i++) {
    new Star();
  }
  const CUT_POINT = 10000;

  function onScroll() {
    if ($(window).scrollTop() < CUT_POINT){
      animate();
    }
  } 
  function animate() {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.8;
      // ctx.createRadialGradient(half, half, 0, half, half, half);
      ctx.fillStyle = 'hsla(' + '217' + ', 80%, 4%, 1)';
      // ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, w, h)
    
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 1, l = stars.length; i < l; i++) {
      stars[i].draw();
    };  
    if ($(window).scrollTop() > CUT_POINT){
      document.addEventListener('scroll', onScroll, false);
    } else {
      document.removeEventListener('scroll', onScroll, false);
      window.requestAnimationFrame(animate);
    }
  }
  animate();
}
stars();