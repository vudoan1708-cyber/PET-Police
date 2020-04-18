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

// image size
let x = 0,
    w = 320;

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
}

function draw() {
    background(41, 40, 40);
    if (!loading) displayProfiles();
    else background(0, 0, 255); // loading animation purpose (HAVEN'T DONE IT)
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

// arrow button sizes
const arrow_w = 50,
      arrow_h = 38;
// display the profiles on webpage
function displayProfiles() {
    // images related parameters
    let h = 240,
        y = height / 2;

    // titles and its background
    push();
        fill(0);
        rect(width / 2, height / 4, width, height / 5);
        fill(0, 20, 255, 150);
        textAlign(CENTER);
        textSize(width / 40); // responsive text
        stroke(100, 100);
        strokeWeight(2);
        text("PROFILE VISUALISATIONS", width / 2, height / 4);
    pop();

    // back arrow
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
            }
        }
        image(left_arrow, 0, 0, arrow_w, arrow_h);
    pop();


    // image gallery
    if (gallery_move > 1) {
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
}

// back to the landing page
function goBack() {
    location.href = "../index.html";
}

function mousePressed() {
    if (mouseX > (width / 15 - arrow_w / 2) && mouseX < (width / 15 + arrow_w / 2)) {
        if (mouseY > (height / 4 - arrow_h / 2) && mouseY < (height / 4 + arrow_h / 2)) {
            goBack();
        }
    }
}

// gallery control
function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        gallery_move++;
        console.log(gallery_move);
    } else if (keyCode === LEFT_ARROW) {
        gallery_move--;
        console.log(gallery_move);
    }
}

async function retrieveData() {
    const old_data = await fetch('/face-api/');
    storedData = await old_data.json();
    console.log(storedData);
    return storedData;
}