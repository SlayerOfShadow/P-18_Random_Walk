let maxPositions; //trail length
let fr; //framerate
let bgColor = 255;
let head;

class Head
  {
    constructor()
    {
      this.x = random(200, width - 200);
      this.y = random(200, height - 200);
      this.color = 0;
      this.lastPositions = [];
      this.canMove = true;
      this.shape = 0;
    }
   
    moveHead()
    {
      let newXPos = 0;
      let newYPos = 0;
      
      this.shape = random(0, 100);
      
      if (this.shape < 1) //vertical stairs
        {
          let randomWeight = random([3, 5]);
          newXPos = random([-1, 1]) * random([10, 20, 30, 40]);
          newYPos = random([-1, 1]);
          let repeat = int(random(3, 8));
          
          for (let i = 0; i < repeat; i++)
            {
              if (i%2 == 0)
                {
                  this.x += newXPos;
                  this.pushAndShift(this.x, this.y, randomWeight, SQUARE);
                }
              else
                {
                  this.x -= newXPos;
                  this.pushAndShift(this.x, this.y, randomWeight, SQUARE);
                }
              let randomY = newYPos * random([10, 20, 30, 40]);
              if (this.y + randomY < 100 || this.y + randomY > height - 100)
                {
                  this.lastPositions[this.lastPositions.length-1].weight = 0.5;
                  return;
                }
              if (i < repeat-1)
                {
                  this.y += randomY;
                }
              this.pushAndShift(this.x, this.y, 0.5, SQUARE);
            }
        }
      else if (this.shape > 99) //horizontal stairs
        {
          let randomWeight = random([3, 5]);
          newXPos = random([-1, 1]);
          newYPos = random([-1, 1]) * random([10, 20, 30, 40]);
          let repeat = int(random(3, 8));
          
          for (let i = 0; i < repeat; i++)
            {
              if (i%2 == 0)
                {
                  this.y += newYPos;
                  this.pushAndShift(this.x, this.y, randomWeight, SQUARE);
                }
              else
                {
                  this.y -= newYPos;
                  this.pushAndShift(this.x, this.y, randomWeight, SQUARE);
                }
              let randomX = newXPos * random([10, 20, 30, 40]);
              if (this.x + randomX < 100 || this.x + randomX > width - 100)
                {
                  this.lastPositions[this.lastPositions.length-1].weight = 0.5;
                  return;
                }
              if (i < repeat-1)
                {
                  this.x += randomX;
                }
              this.pushAndShift(this.x, this.y, 0.5, SQUARE);
            }
        }
      else if (this.shape >= 1 && this.shape < 2 && this.lastPositions.length > 0) //vertical zigzag
        {
          let randomWeight = random([0.5, 2]);
          let randomLength = random([5, 10, 20]);
          newXPos = random([-1, 1]) * randomLength;
          newYPos = random([-1, 1]) * randomLength;
          let repeat = random([2, 4, 6, 8]);
          
          this.lastPositions[this.lastPositions.length-1].weight = randomWeight;
          
          for (let i = 0; i < repeat; i++)
            {
              if (this.y + newYPos < 100 || this.y + newYPos > height - 100)
                {
                  this.lastPositions[this.lastPositions.length-1].weight = 0.5;
                  return;
                }
              else
                {
                  this.y += newYPos;
                  if (i%2 == 0)
                    {
                      this.x += newXPos;
                    }
                  else
                    {
                      this.x -= newXPos;
                    }
                  if (i < repeat-1)
                    {
                      this.pushAndShift(this.x, this.y, randomWeight, PROJECT);
                    }
                  else
                    {
                      this.pushAndShift(this.x, this.y, 0.5, SQUARE);
                    }
                }
            }
        }
      else if (this.shape > 98 && this.shape <= 99 && this.lastPositions.length > 0) //horizontal zigzag
        {
          let randomWeight = random([0.5, 2]);
          let randomLength = random([5, 10, 20]);
          newXPos = random([-1, 1]) * randomLength;
          newYPos = random([-1, 1]) * randomLength;
          let repeat = random([2, 4, 6, 8]);
          
          this.lastPositions[this.lastPositions.length-1].weight = randomWeight;
          
          for (let i = 0; i < repeat; i++)
            {
              if (this.x + newXPos < 100 || this.x + newXPos > width - 100)
                {
                  this.lastPositions[this.lastPositions.length-1].weight = 0.5;
                  return;
                }
              else
                {
                  this.x += newXPos;
                  if (i%2 == 0)
                    {
                      this.y += newYPos;
                    }
                  else
                    {
                      this.y -= newYPos;
                    }
                  if (i < repeat-1)
                    {
                      this.pushAndShift(this.x, this.y, randomWeight, PROJECT);
                    }
                  else
                    {
                      this.pushAndShift(this.x, this.y, 0.5, SQUARE);
                    }
                }
            }
        }
      else
        {
          let randomLength = random([10, 30, 50]);
          
          while (newXPos == 0 && newYPos == 0)
              {
                newXPos = random([-1, 0, 1]) * randomLength;
                newYPos = random([-1, 0, 1]) * randomLength;
              }

            if (this.x + newXPos < 100 || this.x + newXPos > width - 100)
              {
                this.x -= newXPos;
              }
            else
              {
                this.x += newXPos;
              }

            if (this.y + newYPos < 100 || this.y + newYPos > height - 100)
              {
                this.y -= newYPos;
              }
            else
              {
                this.y += newYPos;
              }
            
          this.pushAndShift(this.x, this.y, 0.5, SQUARE);
        }
    }
    
    createTrail()
    {
      for (let i = 0; i < this.lastPositions.length - 1; i++) 
      {
        strokeWeight(this.lastPositions[i].weight);
        strokeCap(this.lastPositions[i].cap);
        stroke(this.color);
        line(this.lastPositions[i].x, this.lastPositions[i].y, this.lastPositions[i+1].x, this.lastPositions[i+1].y);
      }
    }
    
    pushAndShift(x, y, weight, cap)
    {
      this.lastPositions.push({x : x, y : y, weight : weight, cap : cap});
      if (this.lastPositions.length > maxPositions) 
        {
          this.lastPositions.shift();
        }
    }
  }

function setup() 
{
  var cnv = createCanvas(700, 700);
  cnv.parent("sketch-container");
  
  frSlider = createSlider(1, 120, 60);
  frSlider.parent("slider-container");

  mpSlider = createSlider(10, 500, 150);
  mpSlider.parent("slider-container");

  head = new Head();
}

function draw() 
{
  background(bgColor);
  fr = frSlider.value();
  maxPositions = mpSlider.value();
  frameRate(fr);
  head.createTrail();
  if (head.canMove)
    {
      head.moveHead();
      if (head.lastPositions.length > maxPositions) 
        {
          head.lastPositions.shift();
        }
    }
}

function changeColors()
{
  if (bgColor == 255)
    {
      head.color = 255;
      bgColor = 0;
    }
  else
    {
      head.color = 0;
      bgColor = 255;
    }
}

function pauseResume()
{
  head.canMove = !head.canMove;
}

function saveImage()
{
  saveCanvas('P-18', 'jpg');
}