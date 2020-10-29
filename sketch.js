//Create variables here
var dog, happyDog;
var foodStock;
var foodS = 0;
var database;
var feedPet, addFood, fedTime, lastFed;
var currentTime;

function preload(){
  dogImage = loadImage("images/dogImg.png");
  happyDogImage = loadImage("images/dogImg1.png");
  sadDogimage = loadImage("images/Lazy.png");

  bedroomImage = loadImage("images/Bed Room.png");
  gardenImage = loadImage("images/Garden.png");
  bathroomImage = loadImage("images/Wash Room.png");
}

function setup() {
  createCanvas(1000, 500);
  
  database = firebase.database();

  foodStock = database.ref("Food/foodLeft");
  foodStock.on("value", readStock);

  fedTime = database.ref("Food/feedTime");
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  readGameState = database.ref("GameStates");
  readGameState.on("value", function(data){
    gameState = data.val();
  })

  dog = createSprite(800, 320, 25, 25);
  dog.addImage(dogImage);
  dog.scale = 0.3;

  foodObj = new Food();

  feedPet = createButton("Feed the dog");
  feedPet.position(875,95);
  feedPet.mouseClicked(feedDog);

  addFood = createButton("Add more food");
  addFood.position(1000,95);
  addFood.mouseClicked(addFoods);
}

function draw() {  
  background(46, 139, 87);

  foodObj.display();

  if(lastFed >= 12){
    fill("white");
    textSize(20);
    text("Last Feed: " + lastFed % 12 + " PM", 250, 60);
  }
  else if(lastFed === 0){
    fill("white");
    textSize(20);
    text("Last Feed: 12 AM", 250, 60);
  }
  else{
    fill("white");
    textSize(20);
    text("Last Feed: " + lastFed + " AM", 250, 60);
  }

  currentTime = hour();
  if(currentTime === lastFed - 1){
    updateGameState("playing");
    garden();
  }
  else if(currentTime === lastFed - 2){
    updateGameState("sleeping");
    bedroom();
  }
  else if(currentTime > lastFed - 2 && currentTime <= lastFed + 4){
    updateGameState("bathing");
    bathroom();
  }
  else{
    updateGameState("hungry");
    foodObj.display();
  }

  if(readGameState !== "hungry"){
    feedPet.hide();
    addFood.hide();
    dog.visible = false;
  }
  else if(readGameState === "hungry"){
    feedPet.show();
    addFood.show();
    dog.addImage(sadDogImage);
  }

  drawSprites();
}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){

  if(x <= 0){
    x = 0;
  }
  else{
    x = x - 1;
  }

  var databaseRef = database.ref("Food");
  databaseRef.update({foodLeft : x});
}

function feedDog(){
  dog.addImage(happyDogImage);

  database.ref("Food").update({
    foodLeft: foodS - 1,
    feedTime: hour()
  })
}

function addFoods(){
  foodS++;
  database.ref("Food").update({
    foodLeft: foodS 
  })
}

function updateGameState(state){
  var updateStateRef = database.ref("GameStates");
  updateStateRef.update({
    gameState: state
  })
}

function bedroom(){
  background(bedroomImage);
}

function garden(){
  background(gardenImage);
}

function bathroom(){
  background(bathroomImage);
}


