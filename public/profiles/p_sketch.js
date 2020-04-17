let imgData = []; // variable to store image data in JSON
let images = []; // variable to create actual images from the image data

let loading = true;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    retrieveData()
        .then(data => {
            imgData = data;
        })
        .then(() => {
            // load all the images from the database
            for (let j = 0; j < imgData.length; j++) {
                images[j] = loadImage(imgData[j].image64);
                console.log(j);
            }
            loading = false; // trigger displayProfiles() function   
        })
        .catch(err => {
            console.log(err);
        });
}

function draw() {
    background(41, 40, 40);
    if (!loading) displayProfiles();
}

// display the profiles on webpage
function displayProfiles() {
    for (let j = 0 ; j < imgData.length; j++) {
        for (let i = 0; i < imgData.length - 3; i++) {
            // console.log(imgData.length);
            let w = 320,
                h = 240,
                x = w * i,
                y = h * j;
            image(images[i], x, y, w, h);
        }
    }
}

async function retrieveData() {
    const old_data = await fetch('/face-api/');
    imgData = await old_data.json();
    console.log(imgData);
    return imgData;
}