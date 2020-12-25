var dog,sadDog,happyDog, database;
var playingDog, sleepingDog, bathingDog;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var currentTime;
var foodObj, readState;
var gameState = "PLAY";
var gameState = "END";

function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
  playingDog=loadImage("Images/Garden.png");
  sleepingDog=loadImage("Images/Bed Room.png")
  bathingDog=loadImage("Images/Wash Room.png")
}

function setup() {

  database=firebase.database();
  createCanvas(1000,400);

  readState = database.ref("gameState");
  readState.on("value",function(data){

    gameState = data.val();

  })

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  if(gameState!=="END"){
    feed.hide();
    addFood.hide();
    //foodObj.display.remove();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

   currentTime = hour();

   if(currentTime==(lastFed+1)){
    gameState="PLAY"
    foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    gameState="PLAY"
    foodObj.bedroom();
   }else if(currentTime>=(lastFed+2)&&currentTime<=(lastFed+4)){
    gameState="PLAY"
    foodObj.washroom();
   }else{
    gameState="END"
    foodObj.display();
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){

  database.ref('/').update({

    gameState:state

  });

}