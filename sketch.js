var runner, running, collided;

var cloud, cloudImage;

var obstacle, obstacleImage, obstacleGroup;

var backgroundp, backgroundImage, invis;

var gameOver, gameOverImage;
var restart, restartImage;

var jumpSound;
var dieSound;
var levelSound;
var musicSound;

var PLAY = 0;
var END = 1;
var gameState = PLAY;

var score = 0;
var hscore = 0;

function preload(){
  backgroundImage = loadImage("background.png");
  
  running = loadAnimation("runner1.png","runner2.png","runner3.png");
  
  collided = loadAnimation("runner2.png");
  
  backgroundImage = loadImage("background.png");
  
    jumpSound = loadSound("jumpSound.wav");
  dieSound = loadSound("deathSound.wav");
  checkpointSound = loadSound("levelupSound.wav");
  musicSound = loadSound("gameSound.wav");
  obstacleImage = loadImage("car.png");
  
  gameOverImage = loadImage("gameover.png");
  restartImage = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  backgroundp = createSprite(600,100,10,10);
  backgroundp.addImage(backgroundImage);
  
  runner = createSprite(30,155,10,10);
  runner.addAnimation("run",running);
  runner.addAnimation("dead",collided);
  runner.scale = 0.3;

  restart = createSprite(width/2, height/2, 10, 10);
  restart.addImage(restartImage);
  restart.scale = 0.3;
  
  gameOver = createSprite(width/2, 40, 10, 10);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.1;
  invis = createSprite(300,175,600,5);
  invis.visible = false;
   
  obstacleGroup = new Group();

}

function draw() {
  background(220);
  runner.collide(invis);
  if(gameState === PLAY){
    //musicSound.loop();
    
  if(keyDown("space") && runner.y > 100){
    runner.velocityY = runner.velocityY - 5;
  }
  if(keyWentDown("space")){
    jumpSound.play();
  }
  if(score % 100 === 0){
    checkpointSound.play();
  }
  backgroundp.velocityX = -5;
  if(backgroundp.x < -1000){
    backgroundp.x = 650
  }
    gameOver.visible = false;
    restart.visible = false;
  runner.changeAnimation("run",running);
  runner.velocityY = runner.velocityY + 2;
  if(frameCount % 200 === 0){
    spawnObstacles();
  }
  score = Math.round(frameCount/2);

  if(runner.isTouching(obstacleGroup)){
    gameState = END;
    runner.changeAnimation("dead",collided);
  }
  } else if(gameState === END){
    backgroundp.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    restart.visible = true;
    gameOver.visible = true;
    if(mousePressedOver(restart)){
      reset();
    }
  }
  

  drawSprites();
    stroke("green");
    text("HIGH: "+hscore,10,20);
    stroke("red");
    text("SCORE: "+score, 100, 20);
}

function spawnObstacles(){
  obstacle = createSprite(Math.round(random(610,650)),160,10,10);
  obstacle.addImage(obstacleImage);
  obstacle.velocityX = -5;
  obstacle.scale = 0.3;
  obstacle.debug = true;
  obstacle.setCollider("rectangle",0,0,100,10);
  obstacleGroup.add(obstacle);
}

function reset(){
  if(score > hscore){
    hscore = score;
  }
  frameCount = 0;
  score = 0;
  obstacleGroup.destroyEach();
  gameState = PLAY;
}