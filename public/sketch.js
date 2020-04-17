const MODEL_URL = 'face-api.js-master/weights';
// const input = document.getElementById('my-face');

const video = document.getElementById('video');
const webcam_loading = document.getElementById('webcam_loading');
let predictedAges = [];
let gender = "";
let age = 0;

let riskLevel = 0; // total risk score (age + expressions + gender)
let ageScore = 0; // age score
let exScore = 0; // expression score
let genderScore = 0; // gender score

let aggressiveness = 0; // contains angry
let suspiciousness = 0; // contains fearful + sad
let passiveness = 0; // contains neutral

// storing images to database
let captured = true;
let image64 = null; // a variable to store images 
let totalImg = 0;

// load all the included models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
]).then(startVideo) // then start the video playing

// function setup() {
//     canvas = createCanvas(window.innerWidth, window.innerHeight).parent('video');;
// }

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    // console.log('Playing');
    webcam_loading.style.visibility = 'hidden'; // get rid of the text when webcam is loaded

    const hidden_canvas = document.getElementById('canvas');
    const canvas = faceapi.createCanvasFromMedia(video); // create a canvas 
    const context = canvas.getContext('2d');
    document.body.append(canvas); // append the canvas to the body of the page
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize); // to match the canvas to the display size
    setInterval(async () => {
        let fullFaceDescriptions = await faceapi.detectAllFaces(video,
            new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions()
            .withAgeAndGender();
            //  console.log(fullFaceDescriptions);
            const resizedDetections = faceapi.resizeResults(fullFaceDescriptions, displaySize);
            context.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections); // detects faces
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // detect expressions
            // console.log(resizedDetections[0]);
            if (resizedDetections) {
                age = resizedDetections[0].age;
                gender = resizedDetections[0].gender;
                // aggressiveness
                const angry = resizedDetections[0].expressions.angry;
                // suspiciousness
                const fearful = resizedDetections[0].expressions.fearful;
                const sad = resizedDetections[0].expressions.sad;
                // passiveness
                const neutral = resizedDetections[0].expressions.neutral;

                // const expressions = resizedDetections[0].expressions;
                // console.log(resizedDetections[0].expressions);
                // const interpolatedAge = interpolatedAgePredictions(age);
                // console.log(interpolatedAge);

    
                // new faceapi.draw.DrawTextField(
                //     [`${faceapi.utils.round(interpolatedAge, 0)} years`],
                //     bottomRight
                // ).draw(canvas)

                // new faceapi.draw.DrawTextField(
                //     ['Gender: ' + gender],
                //     left
                // ).draw(canvas)
                drawGender();
                drawAge();
                drawAggr();
                drawSusp();
                drawPass();
                if (riskLevel < 1000) { // if risk level is less than 1000 score
                    if (ageScore <= 400) { // if age score is less 400
                        if (age > 17 && age < 50) ageScore = (40 - (age - 16) * 10); // add score to the total age score
                    }
                    if (exScore <= 300) { // if expression score is less 300
                        aggressiveness = angry * 100;
                        suspiciousness = (fearful + sad) / 2 * 100;
                        passiveness = neutral * 100;
                        exScore = (aggressiveness * 2 + suspiciousness * 2 + (100 - passiveness));
                        // console.log(exScore);
                    }
                    if (genderScore <= 300) {
                        // console.log(gender);
                        if (gender === 'male') genderScore = 300;
                        else genderScore = 150;
                    }
                    riskLevel = (ageScore + exScore + genderScore) / 10;
                    // console.log(riskLevel);
                    riskDisplay();
                }
                setTimeout(() => { // run the code once
                    // get the exact size of the video element
                    if (captured) {
                        captured = false;
                        let width = video.videoWidth,
                        height = video.videoHeight;

                        const ctx = hidden_canvas.getContext('2d');

                        // set the canvas size to be exactly the same as the video
                        hidden_canvas.width = width;
                        hidden_canvas.height = height;
                        ctx.drawImage(video, 0, 0, width, height); // draw a captured image on the canvas 
                        // ctx.clearRect(video, 0, 0, width, height);
                        // clearPicture();

                        // send images to database
                        image64 = hidden_canvas.toDataURL('image/png');
                        
                        // triggers the async functions after 10 secs since opening the webpage
                        get_store_displayImg();
                    }
                    
                    
                    // console.log("CAPTURED");
                    // return;

                    // trigger the storeImg function
                }, 10000) // wait for 10 secs to invoke the above functions
                
                
                // document.body.removeChild(newDiv);
                // gender = "";
                // newDiv.clear();
                // canvas.getContext('2d').clearRect(canvas.width / 2, canvas.height / 2, );
                // newDiv.innerHTML = "";
            }
            //     const box_Y = resizedDetections[0].detection.box.y;

            // if (box_Y < 50) {
            //     console.log(box_Y);

            // }
            
    }, 100) // every 100ms, await the face API
})

// async function getImg() { 
    
//     return totalImg; // return the total number of images to the variable
// }
// this async func only triggered once everytime using the webpage
// async function storeImg() { 
    
// }

async function get_store_displayImg() {
    // get total number of images from the database
    const response = await fetch('/face-api/'); 
    const data_count = await response.json();
    // console.log(img);
    totalImg = data_count.length + 1; // pass the length of the database starting from 1 into a global variable
                            //(equivalent to and mainly for the number of images)


    // capture an image and put it into the database of images
    // start posting data to the database
    const data = { // including
        image64, // images
        totalImg // and the number of them
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const res = await fetch('/face-api/', options);
    const json = await res.json();
    console.log(json);

    // get the images out and utilise them (display them in this scenario)
    const resp = await fetch('/face-api/');
    const utilised_data = await resp.json();
    console.log(utilised_data);
    // console.log(totalImg); 
    for (let i = 0; i < utilised_data.length; i++) {
        const photo = document.createElement('img');
        // photo.style.visibility = 'visible';
        photo.setAttribute('src', utilised_data[i].image64);
        document.body.appendChild(photo);
        // photo.style.position = 'absolute';
        // photo.style.bottom = 0;
        // photo.style.right = 0;
        photo.style.transform = 'translateY(400%)';
    }
}

function showBtns(b) {
    const button = document.getElementById(b);
    if (button.style.display === "none") {
        button.style.display = "block";
        // button.style.transition = "display 0.5s";
    }
    else button.style.display = "none";
    console.log("PRESSED");
}

function clearPicture() {
    const hidden_canvas = document.getElementById('canvas');
    const ctx = hidden_canvas.getContext('2d');
    ctx.fillStyle = "#AAA";
    ctx.fillRect(0, 0, hidden_canvas.width, hidden_canvas.height);

    let data = hidden_canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

function drawAggr() {
    const newDiv = document.getElementById("aggressiveness");
    newDiv.style.color = "#8A8EFF";
    newDiv.style.position = "absolute";
    newDiv.style.top = "50%";
    newDiv.style.left = "0";
    newDiv.innerHTML = "Aggressiveness: " + Math.round(aggressiveness) + "%";
}

function drawSusp() {
    const newDiv = document.getElementById("suspiciousness");
    newDiv.style.color = "#8A8EFF";
    newDiv.style.position = "absolute";
    newDiv.style.top = "60%";
    newDiv.style.left = "0";
    newDiv.innerHTML = "Suspiciousness: " + Math.round(suspiciousness) + "%";
}

function drawPass() {
    const newDiv = document.getElementById("passiveness");
    newDiv.style.color = "#8A8EFF";
    newDiv.style.position = "absolute";
    newDiv.style.top = "70%";
    newDiv.style.left = "0";
    newDiv.innerHTML = "Passiveness: " + Math.round(passiveness) + "%";
}

function drawAge() {
    const newDiv = document.getElementById("age");
    newDiv.style.color = "#8A8EFF";
    newDiv.style.position = "absolute";
    // newDiv.style.transform = "translate(-50, -50)";
    newDiv.style.top = "40%";
    newDiv.style.left = "0";
    // newDiv.style.text-align = "center";
    newDiv.innerHTML = "Age: " + Math.round(age);
}

function drawGender() {
    const newDiv = document.getElementById("gender");
    newDiv.style.color = "#8A8EFF";
    newDiv.style.position = "absolute";
    // newDiv.style.transform = "translate(-50, -50)";
    newDiv.style.top = "35%";
    newDiv.style.left = "0";
    // newDiv.style.text-align = "CENTER";
    const abbreviation = gender.charAt(0).toUpperCase(); // get the first letter and capitalise it
    // console.log(abbreviation);
    newDiv.innerHTML = "Gender: " + abbreviation;
    // document.getElementById("video").appendChild(newDiv);
    // document.body.appendChild(newDiv);
    // btnShow = true;
}

function riskDisplay() {
    const newDiv = document.getElementById("risk");
    newDiv.style.color = "#8A8EFF";
    newDiv.style.position = "absolute";
    newDiv.style.bottom = "0";
    newDiv.style.left = "10%";
    if (riskLevel > 0 && riskLevel < 100) newDiv.innerHTML = Math.round(riskLevel) + "% Risk";

}

function interpolatedAgePredictions(age) {

    predictedAges = [age].concat(predictedAges).slice(0, 30);
    const avgPredictedAge =
        predictedAges.reduce((total, a) => total + a) / predictedAges.length;
        return avgPredictedAge;
}

// function setup() {
//     createCanvas(600, 600);
//     video = createCapture(VIDEO);
//     video.hide();

//     loadModel().then(gotResults => {
//         console.log('models ready');
//     });
// }
// loadModel();
