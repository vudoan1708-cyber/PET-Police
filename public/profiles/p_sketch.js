let storedData = null; // variable to store all the data in JSON format
let images = []; // variable to create actual images from the image data
let numImg = []; // variable to store total number of images
let aggr = []; // variable to store aggressiveness score
let susp = []; // variable to store suspiciousness score 
let pass = []; // variable to store passiveness score 
let age = []; // variable to store the age
let gender = [""]; // variable to store gender in string formata
let riskLevel = []; // variable to store total risk factors

let loading = true;
let loadingCounter = 0;

// booleans
let moveBackwards = false,
    moveForwards =  false;

// image size
let x = 0,
    w = 320,
    h = 240;

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
    createCanvas(window.innerWidth, window.innerHeight);
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
                gender[j] = storedData[j].gender; 
                riskLevel[j] = storedData[j].riskLevel; 
                // console.log(j);
            }
            left_arrow = loadImage('../assets/img/left_arrow.png', MediaLoader(storedData.length));
        })
        .then(MediaLoader()) // trigger MediaLoader() function 
        .catch(err => {
            console.log(err);
        });

    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER);
}

function draw() {
    background(41, 40, 40);
    if (!loading) displayProfiles();
    else background(0, 0, 255); // loading animation purpose (HAVEN'T DONE IT)
}

// responsive window resizing
function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

// arrow button sizes
const arrow_w = 50,
      arrow_h = 38;
// display the profiles on webpage
function displayProfiles() {
    // images related parameters
    let y = height / 2;

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
        if (mouseX > (width / 15 - arrow_w / 2) && mouseX < (width / 15 + arrow_w / 2)) {
            if (mouseY > (height / 4 - arrow_h / 2) && mouseY < (height / 4 + arrow_h / 2)) {
                // console.log("HOVERED");
                fill(0, 20, 255, 10);
                noStroke();
                rect(0, 0, arrow_w + 20, arrow_h + 20);
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
    pop();


    // image gallery
    if ( gallery_move > 1 && gallery_move < (storedData.length) * 2 - ((width / (2 * w) * 2)) ) { 
    // steps needed < number of steps to get through all the images stored in the database - number of steps to display images to half of the screen
    // because that is how it is by default (half a screen is full with images)
    // each incremental step = half an image size
        for (let i = 0; i < images.length; i++) {
            x = ((w * i) + width / 2) - (w * gallery_move / 2);
            // if (mouseX > (-x / 2) && mouseX < (x / 2)) {
            //     if (mouseY > (-y / 2) && mouseY < (y / 2)) {
            //         console.log("HOVERED");
            //         scale(1.5, 1.5);
            //     }
            // }
            image(images[i], x, y, w, h);
        }
    } else {
        gallery_move = 1;
        for (let i = 0; i < images.length; i++) {
            x = (w * i) + width / 2;
            // if (mouseX > (-x / 2) && mouseX < (x / 2)) {
            //     if (mouseY > (-y / 2) && mouseY < (y / 2)) {
            //         console.log("HOVERED");
            //         scale(1.5, 1.5);
            //     }
            // }
            image(images[i], x, y, w, h);
        }
    }
    
    // image gallery control
    if (moveBackwards) {
        moveBackwards = false;
        gallery_move--;
        console.log(gallery_move)
    } else if (moveForwards) {
        moveForwards = false;
        gallery_move++;
        console.log(gallery_move)
    }

    // draw some horizontal lines for decorations
    push();
        stroke(255);
        strokeWeight(5);
        line(0, height / 2 - h / 2, width, height / 2 - h / 2);
        line(0, height / 2 + h / 2, width, height / 2 + h / 2);

        stroke(255, 100);
        strokeWeight(15);
        line(0, height / 2 - h / 2, width, height / 2 - h / 2);
        line(0, height / 2 + h / 2, width, height / 2 + h / 2);
    pop();

    // draw forward and backward arrows for image gallery
    push();
        push();
            // backward button
            // hide it if it gets less than 1, so users stop pressing it
            if (gallery_move > 1) {
                translate(width / 2 - 100, height / 2 + h);
                // hover backward button
                if (mouseX > width / 2 - 150 && mouseX < width / 2 - 45) {
                    if (mouseY > height / 2 + h - 35 && mouseY < height / 2 + h + 45) {
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
            translate(width / 2 + 100, height / 2 + h);
            if (mouseX < width / 2 + 150 && mouseX > width / 2 + 45) {
                if (mouseY > height / 2 + h - 35 && mouseY < height / 2 + h + 45) {
                    scale(1.25, 1.25);
                }
            }
            fill(0, 100);
            triangle(50, 5, -55, 45, -55, -35);
            fill(200);
            triangle(50, 0, -50, 40, -50, -40);
        pop();
    pop();

    
}

// back to the landing page
function goBack() {
    location.href = "../index.html";
}


function mousePressed() {
    // go back to the landing page
    if (mouseX > (width / 15 - arrow_w / 2) && mouseX < (width / 15 + arrow_w / 2)) {
        if (mouseY > (height / 4 - arrow_h / 2) && mouseY < (height / 4 + arrow_h / 2)) {
            goBack();
        }
    }

    // backward button for image gallery
    if (mouseX > width / 2 - 150 && mouseX < width / 2 - 45) {
        if (mouseY > height / 2 + h - 35 && mouseY < height / 2 + h + 45) {
            moveBackwards = true;
        }
    }

    // forward button for image gallery
    if (mouseX < width / 2 + 150 && mouseX > width / 2 + 45) {
        if (mouseY > height / 2 + h - 35 && mouseY < height / 2 + h + 45) {
            moveForwards = true;
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
}

async function retrieveData() {
    const old_data = await fetch('/face-api/');
    storedData = await old_data.json();
    console.log(storedData);
    return storedData;
}