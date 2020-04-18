/*
File Name: Sketch.js
Author: Anthony Cucci
Game: Cooking Master
Creation Date: 3/25/2020
Date: 4/10/2020
*/

// Global Variables
var IngreidentList = ["Butter", "Egg", "Chicken", "Cheese", "Noodles", "Flour", "Sauce", "Bread", "Blueberries",
"Sugar", "Broth", "Milk"];

let aboutCredits = ["Thank you for playing Cooking Match!\n\n"+ "Team and Roles\n\n" + "Julia Conville\n\n" + "Project Lead\n" + 
                    "Artwork\nAnimations\n\n" + "Anthony Cucci\n\n" + "Coder\nQuality Assurance\n"];

// Declaring menu buttons
let contButton;
let exitButton;
let contbuttonVisiblity;
let cleanupBtn;
let tempCookBtn;
let cookBtnVis;
// Ingredeint Counter
let ingCount = 0;

// Screen Counter
let currentScreen = 0;

// Credits Variable
let creditY = 0;

// Ingredients
let Broth;
let Bread;
let Blueberries;
let Cheese;

// Game Variables
let currentString = "";
let videoPlaying;
let currentIngredient = "Null";


// Ardiuno Global Variables
let serial;
let latestSerialData = "waiting for data";


let buttonFont;


//This allows for all items to be loaded and prepared for the game
// Also reduces clutter in setup
function preload()
{
buttonFont = loadFont("Assets/Fonts/ComicNeue-Bold.ttf");
menuScreen = loadImage('Assets/Main menu.jpg');
backgroundScreen = loadImage("Assets/Background.jpg");
cleanupScreen = loadImage("Assets/Clean up.jpg")
continueDoneScreen = loadImage("Assets/Continue or Done.jpg");
cookingScreen = loadImage("Assets/cooking.jpg")
getCookingScreen = loadImage("Assets/lets get cooking.jpg");
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
  
  Broth = new Ingredient("Assets/Animations/broth_animation.mp4");
  Bread = new Ingredient("Assets/Animations/bread_animation.mp4");
  Blueberries = new Ingredient("Assets/Animations/Blueberry_drop.mp4");
  Cheese = new Ingredient("Assets/Animations/cheese_animation.mp4");

  videoPlaying = false;

  creditY = height/2;
}


//Repeadelty Draws the images onto the screen
function draw() {
  //Permanant Background
  background(backgroundScreen);
  // Main Menu Screen
  switch (currentScreen){
    case 0: // Main Menu
      mainMenu();
      break;

    case 1: // Playing game
      if (ingCount >= 4){
        currentScreen = 2;
      }
      else{
        playingGame();
      }
      break;

    case 2: // Cooking Screen
      cookItems();
      break;

    case 3: // Clean up screen
      cleanupMessScreen();
      break;

    case 4:
      continueScreen();
      break;

    case 5: // About screen
      aboutScreen();
      break;

    default:
      break;
  }
}


// Helper for playingGame function to proccess Ingredient Animations
function playingGameHelper(item, ingredientName){
    image(item,0,0);
  // Video is paused and there is no video playing
  if (videoPlaying == false && item.time() == 0){
    videoPlaying = true;
    item.play();
    console.log("Playing Video of:" + ingredientName);
  }
  else if (item.time() >= item.duration()){
    videoPlaying = false;
    setInputString("Null");
    item.stop();
    console.log("stopped video of: " + ingredientName);
    ingCount++;
  }
}


//This is where the game will run
function playingGame(){
  switch(currentIngredient){
    case "Blueberries":
      playingGameHelper(Blueberries.getVideo(), "Blueberry");
      break;
    case "Bread":
      playingGameHelper(Bread.getVideo(), "Bread");
      break;
    case "Broth":
      playingGameHelper(Broth.getVideo(), "Broth");
      break;
    case "Cheese":
      playingGameHelper(Cheese.getVideo(), "Cheese");
      break;
    default:
      break;
  }
  if (videoPlaying == false){
    currentIngredient = getInputString();
  }
  textSize(48);
  text('Ingredients:' + ingCount, 1550, 50);
}


// This is the main menu screen
function mainMenu(){
  image(menuScreen, 0, 0);
  menuScreen.resize(1920,1080); 

  
}


// This is where the items will be cooked!
function cookItems(){
  image(cookingScreen,0,0);
  cookingScreen.resize(1920,1080);

  if (!tempCookBtn){
    tempCookBtn = createButton("Continue").position(460, 850);
    tempCookBtn.size(400,150).style("font-family", buttonFont);
    tempCookBtn.style("font-size", "48px").style("background-color","#D82329");
    cookBtnVis = true;
    tempCookBtn.mousePressed(function() {buttonHelper(tempCookBtn, 3, cookBtnVis=false);});
  }
  else if (cookBtnVis == false){
    tempCookBtn.show();
  }
  textSize(48);
  text('WIP cooking screen', 1050, 750);
}


// Helper to set buttons false
function buttonHelper(currentButton, newScreen, valueNotused){
  currentButton.hide();
  currentScreen = newScreen;
}


// Clean up mess screen
function cleanupMessScreen(){
  image(cleanupScreen,0,0);
  cleanupScreen.resize(1920,1080);
  if (!cleanupBtn){
    cleanupBtn = createButton("Done").position(760, 850);
    cleanupBtn.size(400,150).style("background-color","#D82329");
    cleanupBtn.style("font-size", "48px").style("font-family", buttonFont);
    cleanupBtnVisibility = true;
    cleanupBtn.mousePressed(function() {buttonHelper(cleanupBtn, 4, cleanupBtnVisibility=false);});
  }
  else if (cleanupBtnVisibility == false){
    cleanupBtn.show();
    cleanupBtnVisibility = true;
  }
}


// This is the Continue or done screen displaying
function continueScreen(){
  image(continueDoneScreen,0,0);
  continueDoneScreen.resize(1920,1080);
  // If Button does not exist (1st time), Then create both buttons
  if (!contButton){
    contButton = createButton('Continue').position(590, 250);
    contButton.size(770,200).style("background-color","#D82329");
    contButton.style("font-family", buttonFont).style("font-size", "48px");
    contButton.mousePressed(continueGame);
    //Exit Button
    exitButton = createButton('Quit').position(590, 650)
    exitButton.size(770,200).style("background-color","#D82329");
    exitButton.style("font-family", buttonFont).style("font-size", "48px");
    exitButton.mousePressed(gameQuit);
    contbuttonVisiblity = true;
 }
 // Check if button is hidden (2nd time continuing)
 else if (contbuttonVisiblity == false){
   contButton.show();
   exitButton.show();
   contbuttonVisiblity = true;
 }
}


// Reset game
// Resets all elements and starts at the beginning
function continueGame(){
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
  contbuttonVisiblity = false;
  currentScreen = 5;
}


// About screen for the end of the game
// Rolls Credits
function aboutScreen(){
  //background(0);
  let w = width *.05;
  fill(0,0,0);
  textSize(50);
  textAlign(LEFT);
  text(aboutCredits, 550, creditY+550, 1200, height*10);
  creditY-=2;
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
  let tempString = serial.readLine();
  if (!tempString) return;

  // String Manipulation
  tempString = tempString.replace("\x00","");

  if (IngreidentList.indexOf(tempString) != -1){

    console.log("Success sending to PlayGame: " + tempString);
    setInputString(tempString);
    if(ingCount == 0)
    {
      currentScreen = 1;
    }
    tempString = "";
  }
}


function setInputString(inputS){
  currentString = inputS;
}


function getInputString(){
  return currentString;
}