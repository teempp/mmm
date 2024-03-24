const numStars = 600 + Math.random() * 300;
let stars = [];
let wink = true
let winkSpeed = 0.1
let velocity = 0
let maxSpeed = 1
let maxVelocity = 10
let maxSize = 4
let img;
let sound;
let audioContext;

function preload() {
    img = loadImage('1.png');
    sound = loadSound('fire.mp3');
    if (!audioContext){
        audioContext = new AudioContext();
        audioContext.resume()
    }
}
function setup() {

    createCanvas(window.innerWidth, window.innerHeight);
    stroke(255);
    img.resize(width,height);
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
    sound.loop();
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star(random(width), random(height)));
    }
}

function draw() {
    background(0,255);
    if (velocity > 0) {
        wink = false;
    }else if (velocity<=0){
        wink = true;
        velocity = 0;
    }

    let acc = map(velocity, 0, maxVelocity, 0, maxSpeed);

    stars = stars.filter(star => {
        star.draw();
        if (velocity > 0){
            star.update(acc);
        }
        return star.isActive();
    });

    while (stars.length < numStars) {
        stars.push(new Star(random(width), random(height)));
    }
    image(img,0,0,width,height);
    textSize(16);
    textAlign(RIGHT, TOP);
    fill(255,0,0);
    text(  "Velocity: "+ velocity, width/2, height-50);
    let playbackRate = map(velocity, 0, maxVelocity, 0, 5);
    playbackRate = constrain(playbackRate, 0.01, 4);
    sound.rate(playbackRate);
    if (!sound.isPlaying()){
        sound.loop();
        console.log(sound.isPlaying())
    }
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}

class Star {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.prevPos = createVector(x, y);
        this.size = random(0.25, maxSize);
        this.t = random(TAU);
        this.color = randomColor();
        this.velocity = createVector(0, 0);
        this.ang = atan2(y - (height / 2), x - (width / 2));
    }

    isActive() {
        return onScreen(this.prevPos.x, this.prevPos.y);
    }


    draw() {
        if (velocity === 0) {
            if (wink) {
                this.t += winkSpeed;
                var scale = this.size + sin(this.t) * this.size;
                if (scale < 0.25) {
                    this.color = randomColor()
                }
            } else {
                scale = this.size + sin(this.t) * this.size;
            }
            fill(this.color);
            noStroke();
            ellipse(this.pos.x, this.pos.y, scale, scale);
        } else  {
            wink = false;
            const alpha = map(velocity, 0, maxVelocity, 0, 255);
            stroke(this.color, alpha);
            strokeWeight(this.size);
            line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        }
    }

    update(acc) {
        this.velocity.x += cos(this.ang) * acc;
        this.velocity.y += sin(this.ang) * acc;

        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;

        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
    }
}

function onScreen(x, y) {
    return x >= 0 && x <= width && y >= 0 && y <= height;
}

function randomColor() {
    if (random(2) < 1) {
        return color(random(150, 200), random(150, 200), random(150, 200)); // silver
    } else {
        return color(random(200, 255), random(150, 200), random(100, 150)); // gold
    }
}

function keyPressed() {
    console.log(velocity)
    if (keyCode === UP_ARROW) {
        velocity++;
    } else if (keyCode === DOWN_ARROW) {
        if (velocity > 0) {
            velocity--;
        }
        if (velocity === 0) {
            wink = true;
        }
    } else if (key === "u") {
        if (wink === true) {
            winkSpeed += 0.05;
        }
    } else if (key === "d") {
        if (wink === true) {
            if (winkSpeed > 0){
                winkSpeed -= 0.05;
            }
        }
    }
}