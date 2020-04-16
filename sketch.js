const MODEL_URL = 'face-api.js-master/weights';
// const input = document.getElementById('my-face');

const HTMLcanvas = document.getElementById('canvas');
const video = document.getElementById('video');
const photo = document.getElementById('photo');
let predictedAges = [];
let gender = "";
let age = 0;
let riskLevel = 0; // total risk score
let ageScore = 0; // age score
let exScore = 0; // expression score

let aggressiveness = 0;
let suspiciousness = 0; // contains fearful + sad
let passiveness = 0; // contains neutral

let btnShow = false;

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
                    riskLevel = (ageScore + exScore) / 10;
                    // console.log(riskLevel);
                    riskDisplay();
                }
                setTimeout(() => {
                    let width, height;
                    
                    HTMLcanvas.width = width; // store canvas width into a variable
                    HTMLcanvas.height = height; // store canvas height into a variable
                    context.drawImage(video, 0, 0, width, height); // draw a captured image 

                    let data = canvas.toDataURL('image/png');
                    photo.setAttribute('src', data);
                    // console.log("CAPTURED");
                    // return;
                    // clearPicture();
                }, 10000) // wait for 10 secs to invoke the above function
                
                
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
    let context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let data = canvas.toDataURL('image/png');
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
