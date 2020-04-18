/*
File Name: Sketch.js
Author: Anthony Cucci
Game: Cooking Master
Creation Date: 3/25/2020
Date: 4/6/2020
*/


// Global Variables
var IngreidentList = ["Butter", "Egg", "Chicken", "Cheese", "Noodles", "Flour", "Sauce", "Bread", "Blueberries",
"Sugar", "Broth", "Milk"];

// Declaring Buttons
let contButton;
let exitButton;
let contbuttonVisiblity;


let ingCount = 0;
// Main Menu = 0, GameScreen = 1, Ending = 2
let currentScreen = 0;





// Ardiuno Global Variables
let serial;
let latestSerialData = "waiting for data";



//This allows for all items to be loaded and prepared for the game
// Also reduces clutter in setup
function preload()
{
menuScreen = loadImage('Assets/Main menu.jpg');
backgroundScreen = loadImage("Assets/Background.jpg");
cleanupScreen = loadImage("Assets/Clean up.jpg")
continueDoneScreen = loadImage("Assets/Continue or Done.jpg");
cookingScreen = loadImage("Assets/cooking.jpg")
getCookingScreen = loadImage("Assets/lets get cooking.jpg");

Blueberries = createVideo('Assets/Animations/Blueberry_drop.mp4');
Bread = createVideo('Assets/Animations/bread_animation.mp4');
Broth = createVideo('Assets/Animations/broth_animation.mp4');
Cheese = createVideo('Assets/Animations/cheese_animation.mp4');

Blueberries.hide();
Bread.hide();
Broth.hide();
Cheese.hide();
}


// This will setup the canvas for first time use
// We need to load assets here and set up the ardiuno device
function setup() {
  createCanvas(1920, 1080);

  //SERIAL SETUP
  // Serial Port Loading
  // Make sure Serial Websocket is running
  serial = new p5.SerialPort();
  serial.list();
  //Opens correct Port and sets Baud rate to 9600
  serial.open('COM3', 9600);
  // Sets up server connection, data reading, and error handling
  serial.on('connected', serverConnected);
  serial.on('data', gotData);
  serial.on('error', gotError);
  


}

//Repeadelty Draws the images onto the screen
function draw() {
  //Permanant Background
  background(backgroundScreen);

  if (currentScreen == 0){ // draw title screen
    mainMenu();
  }
  else if (currentScreen == 1)
  {
    if (ingCount >= 2){
      image(cookingScreen,0,0);
      cookingScreen.resize(1920,1080);
      //cooking animations??
      currentScreen = 2;

    }
    else{
      playingGame();
    }
  }
  else if (currentScreen == 2)
  {
    cleanupMessScreen();
    setTimeout(continueScreen(), 7000);
  }

}


//This is where the game will run
function playingGame(){


  image(Bread,0,0);
  if (Bread.time() == 0){
    Bread.play();
    
  }
  else if (Bread.time() >= Bread.duration()){
    Bread.stop();
    console.log("stopped video of: ");
    //currentScreen = 2;
    ingCount++;
  }

  textSize(48);
  text('Ingredients:' + ingCount, 1550, 50);
}

// This is the main menu screen
function mainMenu(){
  image(menuScreen, 0, 0);
  menuScreen.resize(1920,1080);
}


// Clean up mess screen
function cleanupMessScreen(){
  image(cleanupScreen,0,0);
  cleanupScreen.resize(1920,1080);
}


// This is the Continue or done screen displaying
function continueScreen(){
  image(continueDoneScreen,0,0);
  continueDoneScreen.resize(1920,1080);
  
  // If Button does not exist (1st time), Then create both buttons
  if (!contButton){
    contButton = createButton('Continue');
    contButton.position(590, 250);
    contButton.size(770,200);
    contButton.style("font-family", "Bodoni");
    contButton.style("font-size", "48px");
    contButton.mousePressed(resetGame);
    //Exit Button
    exitButton = createButton('Quit');
    exitButton.position(590, 650);
    exitButton.size(770,200);
    exitButton.style("font-family", "Bodoni");
    exitButton.style("font-size", "48px");
    exitButton.mousePressed(gameQuit);
    contbuttonVisiblity = true;
 }
 // Check if button is hidden (2nd time continuing)
 else if (contbuttonVisiblity == false){
   contButton.show();
   exitButton.hide();
 }
}

//Reset game
// Resets all elements and starts at the beginning
function resetGame(){
  contButton.hide();
  exitButton.hide();
  contbuttonVisiblity = false;
  ingCount= 0;
  currentScreen = 0;
}

// Quits the game and leaves with the About page
function gameQuit(){
  contButton.hide();
  exitButton.hide();
}


/*
 * ADRIUNO SECTION
 * This is where all ardiuno functions are stored
 *
 */
  
//Print if the server is online
function serverConnected() {
  print("Connected to Server");
 }
 

//Incase of error reading chip discard to console
function gotError(theerror) {
  print(theerror);
 }
 

 // Gets data from the ardiuno device and sends it to the game function
function gotData() {
  let currentString = serial.readLine();
  if (!currentString) return;

  // String Manipulation
  currentString = currentString.replace("\x00","");
  latestSerialData = currentString;
  console.log(latestSerialData);

  if (IngreidentList.indexOf(latestSerialData) != -1){

    console.log("Success sending to PlayGame: " + latestSerialData);
    currentScreen = 1;
  }
 }
