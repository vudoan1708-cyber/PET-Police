let storedData = null; // variable to store all the data in JSON format
let userData = null; // variable to store all user data in JSON format

let images = []; // variable to create actual images from the image data
let numImg = []; // variable to store total number of images
let aggr = []; // variable to store aggressiveness score
let susp = []; // variable to store suspiciousness score 
let pass = []; // variable to store passiveness score 
let age = []; // variable to store the age
let gender = [""]; // variable to store gender in string formata
let riskLevel = []; // variable to store total risk factors
let timeStamp = []; // variable to store the timestamp

let date = []; // variable to store the date
let time = []; // variable to store the time

// arrow button sizes
const arrow_w = 50,
      arrow_h = 38;

// loading animation
let loading = true;
let loadingCounter = 0;

// booleans
let moveBackwards = false,
    moveForwards =  false,
    visualiseData = false;

// class(es)
let imgDisplay;

// animate image gallery
let gallery_move = 1;

// assets : images
let left_arrow;

function MediaLoader(media) {
    loadingCounter++;
    if (loadingCounter == (media + 1))
    loading = false; // trigger displayProfiles() function
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight).parent('container');
    retrieveData()
        .then(data => {
            storedData = data;
        })
        .then(() => {
            // load all the images from the database
            for (let j = 0; j < storedData.length; j++) {
                // pass all the stored database into variables
                images[j] = loadImage(storedData[j].image64, MediaLoader(storedData.length));
                numImg[j] = storedData[j].totalImg;
                aggr[j] = storedData[j].aggressiveness; 
                susp[j] = storedData[j].suspiciousness; 
                pass[j] = storedData[j].passiveness; 
                age[j] = storedData[j].age; 
                gender[j] = storedData[j].gender.charAt(0).toUpperCase(); 
                riskLevel[j] = storedData[j].riskLevel; 
                // get the timestamp
                timeStamp[j] = storedData[j].timestamp.split('T');
                // separate the string into an array of two elements from the separator, then get the date
                date[j] = timeStamp[j][0];
                time[j] = timeStamp[j][1].split('.')[0]; // get the time
                // console.log(timeStamp[j], date[j]);
            }
            left_arrow = loadImage('../assets/img/left_arrow.png', MediaLoader(storedData.length));
        })
        // .then(MediaLoader()) // trigger MediaLoader() function 
        .catch(err => {
            console.log(err);
        });

    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER);

    // class
    imgDisplay = new ImgDisplay();
}

function draw() {
    background(41, 40, 40);
    if (!loading) displayProfiles();
    else {
        background(0, 0, 200, 150); // loading animation purpose (HAVEN'T DONE IT)
    }
}

// responsive window resizing
function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}


// display the profiles on webpage
function displayProfiles() {
    // images related parameters
    // let y = height / 2;

    // titles and its background
    push();
        fill(0);
        rect(width / 2, height / 4, width, height / 5);
        fill(0, 20, 255, 150);
        textSize(width / 40); // responsive text
        stroke(100, 100);
        strokeWeight(2);
        text("PROFILE VISUALISATIONS", width / 2, height / 4);
    pop();

    // back arrow to the landing page
    push();
        translate(width / 15, height / 4);
        // hover the back button
        // go through the code if visualisaData is false
        if (!visualiseData) {
            if (mouseX > (width / 15 - arrow_w / 2) && mouseX < (width / 15 + arrow_w / 2)) {
                if (mouseY > (height / 4 - arrow_h / 2) && mouseY < (height / 4 + arrow_h / 2)) {
                    scale(1.5, 1.5);
                    push(); // to avoid the scale function for this rectangle
                        strokeWeight(2.5);
                        stroke(255, 0, 0, 100);
                        noFill();
                        rect(width / 15, -50, width / 8, 50);
                        noStroke();
                        fill(200);
                        rect(width / 15, -50, width / 8, 50);
                    pop();
                    fill(10);
                    textSize(width / 100);
                    text("Back to the landing page", width / 15, -50);
                }
            }
            image(left_arrow, 0, 0, arrow_w, arrow_h);
        }
    pop();

    // push();
    // // can't translate to x because x is a constantly changed variable
    // // so horizontally translate to the centre of the page as the first x is supposed to do
    // pop();
    
    // image gallery control
    if (moveBackwards) {
        moveBackwards = false;
        gallery_move--;
    } else if (moveForwards) {
        moveForwards = false;
        gallery_move++;

    }

    // draw some horizontal lines for decorations
    push();
        stroke(255);
        strokeWeight(5);
        line(0, height / 2 - imgDisplay.h / 2, width, height / 2 - imgDisplay.h / 2);
        line(0, height / 2 + imgDisplay.h / 2, width, height / 2 + imgDisplay.h / 2);

        stroke(255, 100);
        strokeWeight(15);
        line(0, height / 2 - imgDisplay.h / 2, width, height / 2 - imgDisplay.h / 2);
        line(0, height / 2 + imgDisplay.h / 2, width, height / 2 + imgDisplay.h / 2);
    pop();

    // display image gallery
    drawImg();

    // display backwards button and forwards button for image gallery
    drawGalleryNavigation();
}

function drawGalleryNavigation() {
    push();
        if (!visualiseData) {
            // draw forward and backward arrows for image gallery
            push();
            // backward button
            // hide it if it gets less than 1, so users stop pressing it
            if (gallery_move > 1) {
                translate(width / 2 - 100, height / 2 + imgDisplay.h);
                // hover backward button
                if (mouseX > width / 2 - 150 && mouseX < width / 2 - 45) {
                    if (mouseY > height / 2 + imgDisplay.h - 35 && mouseY < height / 2 + imgDisplay.h + 45) {
                        scale(1.25, 1.25);
                    }
                } 
                fill(0, 100);
                triangle(-50, 5, 55, 45, 55, -35);
                fill(200);
                triangle(-50, 0, 50, 40, 50, -40);
            }
            pop();   

            push();
                // forward button
                translate(width / 2 + 100, height / 2 + imgDisplay.h);
                // hover the forward button
                if (mouseX < width / 2 + 150 && mouseX > width / 2 + 45) {
                    if (mouseY > height / 2 + imgDisplay.h - 35 && mouseY < height / 2 + imgDisplay.h + 45) {
                        scale(1.25, 1.25);
                    }
                }
                fill(0, 100);
                triangle(50, 5, -55, 45, -55, -35);
                fill(200);
                triangle(50, 0, -50, 40, -50, -40);
            pop();

            // "show details" button
            push();
                translate(width - 150, height / 2 + imgDisplay.h + 90);
                if (mouseX < (width - 150) + 100 && mouseX > (width - 150) - 100) {
                    if (mouseY < (height / 2 + imgDisplay.h + 90) + 25 && mouseY > (height / 2 + imgDisplay.h + 90) - 25) {
                        scale(1.25, 1.25);
                        textSize(width / 20);
                    }
                }
                fill(0, 100);
                rect(0, 0, 220, 70);
                fill(200);
                rect(0, 0, 200, 50);
                fill(10);
                textSize(width / 50);
                text("Show Details", 0, 12.5);
            pop();
        }
    pop();
}

// image gallery class
function drawImg() {
    imgDisplay.showImg();
}

// back to the landing page
function goBack() {
    location.href = "../index.html";
}


function mousePressed() {
    if (!visualiseData) {
        // go back to the landing page
        if (mouseX > (width / 15 - arrow_w / 2) && mouseX < (width / 15 + arrow_w / 2)) {
            if (mouseY > (height / 4 - arrow_h / 2) && mouseY < (height / 4 + arrow_h / 2)) {
                goBack();
            }
        }
    
        // backward button for image gallery
        if (mouseX > width / 2 - 150 && mouseX < width / 2 - 45) {
            if (mouseY > height / 2 + imgDisplay.h - 35 && mouseY < height / 2 + imgDisplay.h + 45) {
                moveBackwards = true;
            }
        }
    
        // forward button for image gallery
        if (mouseX < width / 2 + 150 && mouseX > width / 2 + 45) {
            if (mouseY > height / 2 + imgDisplay.h - 35 && mouseY < height / 2 + imgDisplay.h + 45) {
                moveForwards = true;
            }
        }
    
        // show detail button
        if (mouseX < (width - 150) + 100 && mouseX > (width - 150) - 100) {
            if (mouseY < (height / 2 + imgDisplay.h + 90) + 25 && mouseY > (height / 2 + imgDisplay.h + 90) - 25) {
                visualiseData = true;
            }
        }
    } else {
        // close button 
        const r = 50;
        let d = dist(mouseX, mouseY, width - 25, 25);
        if (d < 25) {
            console.log("CLOSED");
            visualiseData = false;
        }
    }
}

// for testing
function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        gallery_move++;
    } else if (keyCode === LEFT_ARROW) {
        gallery_move--;
    }

    if (keyCode === ESCAPE) {
        visualiseData = false;
    } else if (key == ' ') {
        visualiseData = true;
    }
}

// retrieve profile-related data
async function retrieveData() {
    const old_data = await fetch('/face-api/');
    storedData = await old_data.json();
    console.log(storedData);
    return storedData;
}