let imgData;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    displayProfiles();
}

function draw() {
    background(100);
}

async function displayProfiles() {
    const old_data = await fetch('/face-api/');
    imgData = await old_data.json();
    console.log(imgData);
    return imgData;
}