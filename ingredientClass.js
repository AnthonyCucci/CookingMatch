class Ingredient {
    constructor(videoloc) {
      this.video = createVideo(videoloc);
      this.video.hide();
    }

    getVideo(){
      return this.video;
    }
    getTime(){
      return this.video.time()
    }
}
/*
class Button {
  constructor(btnName, Description,positionX, positionY, sizeX, sizeY, BtnVis, selectScreen) {
    this.btnName = btnName;
    this.Description = Description;
    this.positionX =  positionX;
    this.postitionY = positionY;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.BtnVis = BtnVis;
    this.selectScreen = selectScreen;
  }

  makeButton(){
    this.btnName = createButton(this.Description);
    this.btnName.position(this.positionX, this.postitionY);
    this.btnName.size(this.sizeX,this.sizeY);
    this.btnName.style("font-family", this.buttonFont);
    this.btnName.style("font-size", "48px");
    this.btnName.style("background-color","#D82329");
  }
  getButtonVisibility(){
    return this.BtnVis;
  }
  setButtonVisibility(booleanVal){
    this.BtnVis = booleanVal;
  }
  hide(){
    this.btnName.hide();
  }
}
*/