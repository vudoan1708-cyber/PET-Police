const MODEL_URL = 'face-api.js-master/weights';

// video related elements
const video = document.getElementById('video'),
      webcam_loading = document.getElementById('webcam_loading'),
      countdown = document.getElementById('countdown'),
      nav = document.getElementById('nav'),
      content_wrapper = document.querySelector('.wrapper'),
      stats = document.getElementById('stats'),
      risk = document.getElementById('risk'),
      consent_form = document.getElementById('consent_form'),
      timer = document.getElementById('timer'),

      hidden_canvas = document.getElementById('canvas'),
      warningBox = document.createElement("div"),
      visualisation_btn = document.querySelector(".preview"),
      submit_btn = document.querySelector('input[type="submit"]#submit'),
      arrowBtn = document.querySelector('.arrow');

// pre-modify some HTML elements for the intro section
countdown.style.display = 'none';
// nav.style.opacity = 0,
content_wrapper.style.display = 'none';
stats.style.display = 'none';
risk.style.display = 'none';
timer.style.display = 'none';
visualisation_btn.style.visibility = 'hidden';
webcam_loading.style.visibility = 'hidden';
hidden_canvas.style.visibility = 'hidden';

// countdown timer
let timeCountdown = 10; // show the time countdown on screen so users can see it

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
let totalImg = 0; // a variable to keep track of total number of images in the database
let imgData = []; // a variable to store JSON image data

let isSubmitted = false;

// FOR EDGE
TextEncoder = function TextEncoder() {

		}

		TextEncoder.prototype.encode = function(s) {
			const e = new Uint8Array(s.length);

			for (let i = 0; i < s.length; i += 1) {
				e[i] = s.charCodeAt(i);
			}

			return e;
		}

		TextDecoder = function TextDecoder() {
			
		}

		TextDecoder.prototype.decode = function(arr) {
			let d = "";

			for (let i = 0; i < arr.length; i += 1) {
				d += String.fromCharCode(arr[i]);
			}

			return d;
		} 
// FOR EDGE

Promise.all([
    // load all the included models
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    getImg(), // and trigger the getImg() function
    
]).then(check) 

// check if the submit button is clicked, 
// if not, loop this function forever (keep the page at the consent form section)
// if clicked, start the video and do the rest of the code
function check() {
    if (!isSubmitted) {
        const id = setTimeout(() => {
            check();
            clearTimeout(id);
        }, 100);
    } else {
        consent_form.style.display = 'none';
        countdown.style.display = 'block';
        // nav.style.opacity = 1;
        content_wrapper.style.display = 'flex';
        stats.style.display = 'flex';
        risk.style.display = 'block';
        webcam_loading.style.visibility = 'visible';
        hidden_canvas.style.visibility = 'visible';

        startVideo(); // start the video playing
    }
}

// check for form validations
// not working very well atm
// form.addEventListener('submit', e => {
//     let messages = [];
//     if (fname.value === '' || fname.value == null) {
//         messages.push('Name needed');
//         console.log(fname.value);
//     }
//     if (messages.length > 0) {
//         e.preventDefault();
//         return false;
//     } else {
//         postForm(fname.value);
//         isSubmitted = true;
//     }
// })

// posting users' data to another database
// async function postForm(name, age) {
//     const data = { name, age };
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     };
//     const form_response = await fetch('/forms/', options);
//     const json = await form_response.json();
//     console.log(json);
// }
// end of checking form validation


const showMessage = document.createElement("div");

function validationForm() {
    let messages = [];
    showMessage.style.display = 'none';
    // error handling straight from the client without using express-validator from the server side
    // if the box is uncheck
    if (!agreementCheck.checked) {
        messages.push('Please check this box to proceed!');
        // style the warning message
        showMessage.style.display = 'block';
        showMessage.style.color = 'red';
        showMessage.style.fontSize = '1.25rem';
        showMessage.innerHTML = messages;
        agreementCheckLabel.parentNode.insertBefore(showMessage, agreementCheckLabel.nextSibling); // add a warning message above the check box
    }
    

    if (messages.length > 0) {
        // e.preventDefault();
        // clear the warning message after 2 secs
        // setTimeout(() => {
        //     showMessage.parentNode.removeChild(showMessage);
        // }, 2000);
        return false;
    } else {
        // console.log(fname.value);
        // postForm(fname.value, u_age.value).then(() => { isSubmitted = true; })
        isSubmitted = true;
    }
}


function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    // console.log('Playing');
    
    setInterval(() => {
        // countdown timer
        // show the users the timer before a photo capture
        timer.style.display = 'block';
        if (timeCountdown > 0) { // if the time is still larger than 0
            timer.innerHTML = timeCountdown + ' second(s)';
        }
        timeCountdown--;
    }, 1000);
    
    webcam_loading.style.visibility = 'hidden'; // get rid of the text when webcam is loaded

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
                age = Math.round(resizedDetections[0].age);
                gender = resizedDetections[0].gender;
                // aggressiveness
                const angry = resizedDetections[0].expressions.angry;
                // suspiciousness
                const fearful = resizedDetections[0].expressions.fearful;
                const sad = resizedDetections[0].expressions.sad;
                // passiveness
                const neutral = resizedDetections[0].expressions.neutral;

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
                        if (age > 17 && age < 50) ageScore = Math.round((40 - (age - 16) * 10)); // add score to the total age score
                    }
                    if (exScore <= 300) { // if expression score is less 300
                        aggressiveness = Math.round(angry * 100);
                        suspiciousness = Math.round((fearful + sad) / 2 * 100);
                        passiveness = Math.round(neutral * 100);
                        exScore = (aggressiveness * 2 + suspiciousness * 2 + (100 - passiveness));
                        // console.log(exScore);
                    }
                    if (genderScore <= 300) {
                        // console.log(gender);
                        if (gender === 'male') genderScore = 300;
                        else genderScore = 150;
                    }
                    riskLevel = Math.round((ageScore + exScore + genderScore) / 10);
                    // console.log(riskLevel);
                    riskDisplay();
                }

                // after all the fluctuation of the risk factors and risk level calculation, and detections
                // don't do anything else until it captures a photo
                return new Promise(() => {
                    const timeoutId = setTimeout(() => { 
                        // get the exact size of the video element
                        if (captured) {
                            captured = false;
                            let width = video.videoWidth,
                            height = video.videoHeight;
    
                            const ctx = hidden_canvas.getContext('2d');
    
                            // set the canvas size to be exactly the same as the video
                            hidden_canvas.width = width;
                            hidden_canvas.height = height;
                            // draw a captured image on the canvas 
                            ctx.drawImage(video, 0, 0, width, height); 
                            // then hide it because it's blocking the video webcam, which is useless
                            hidden_canvas.style.visibility = "hidden";
                            // ctx.clearRect(video, 0, 0, width, height);
                            // clearPicture();
    
                            // convert captured image into characters
                            image64 = hidden_canvas.toDataURL('image/png');
                            
                            // triggers the async function after 10 secs since opening the webpage
                            storeImg();
                            clearTimeout(timeoutId);
                        }
                    }, 10000)// wait for 10 secs to invoke the above function
                }); // end of promise
                
            }
    }, 100) // every 100ms, await the face API
})

// display warning message
// if there is no data in the database, show this message when users try to click on the visualisations button
warningBox.className = "warning";


function displayWarning(msg) {
    // display the warning message
    warningBox.innerHTML = msg;

    if (document.body.contains(warningBox)) {
        clearTimeout(warningTimeout);
    } else {
        // insert warningBox after visualisation_btn
        visualisation_btn.parentNode.insertBefore(warningBox, visualisation_btn.nextSibling);
    }

    // clear the warning message after 2 secs
    warningTimeout = setTimeout(() => {
        warningBox.parentNode.removeChild(warningBox);
        clearTimeout(warningTimeout);
    }, 2000);
}

// visualise images from the database
function displayImg() {
    if (imgData.length == 0) { // if there is no image in the database
        // display a warning box message
        displayWarning("No Image From The Database."
                        + "\n" + "Capture Your Face To Store An Image");
    } else {
        location.href = "profiles/profiles.html"; // link to the profiles file
    }
}

// preview image captured img
async function previewImg() {
    // get the images out and utilise them (display them in this scenario)
    const response = await fetch('/face-api/');
    imgData = await response.json();

    const photo = document.createElement('img');
    photo.className = "one_img";
    // preview the most recent photo capture
    // index is 0 because the sorting in the database is arranging images in the order of the latest to the oldest
    photo.setAttribute('src', imgData[0].image64);
    document.body.appendChild(photo);
}

// async function storeImg() { 
    
// }


// look for any existing image file in the database before the image capturing,
// in case users only want to see the visualisations
// and don't want to be taken a photo
async function getImg() {
    const old_data = await fetch('/face-api/');
    imgData = await old_data.json();
    return imgData;
}

// after a photo capture
async function storeImg() {
    timer.innerHTML = "CAPTURED";
    // get total number of images from the database
    const get_data = await fetch('/face-api/'); 
    const data_count = await get_data.json();
    // console.log(data_count);
    totalImg = data_count.length + 1; // pass the length of the database starting from 0 into a global variable
                            //(equivalent to and mainly for the number of images)

    // capture an image and put it into the database of images
    // start posting data to the database
    const data = { // including
        image64, // images
        totalImg, // the total number of them
        aggressiveness, // the expression scores
        suspiciousness,
        passiveness,
        age, // age
        gender, // gender
        riskLevel // and risk level
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const store_response = await fetch('/face-api/', options);
    await store_response.json();
    visualisation_btn.style.visibility = "visible";
}

function drawAggr() {
    const newDiv = document.getElementById("aggressiveness");
    newDiv.innerHTML = "Aggressiveness: " + (aggressiveness) + "%";
}

function drawSusp() {
    const newDiv = document.getElementById("suspiciousness");
    newDiv.innerHTML = "Suspiciousness: " + (suspiciousness) + "%";
}

function drawPass() {
    const newDiv = document.getElementById("passiveness");
    newDiv.innerHTML = "Passiveness: " + (passiveness) + "%";
}

function drawAge() {
    const newDiv = document.getElementById("age");
    newDiv.innerHTML = "Age: " + (age);
}

function drawGender() {
    const newDiv = document.getElementById("gender");
    const abbreviation = gender.charAt(0).toUpperCase(); // get the first letter and capitalise it
    newDiv.innerHTML = "Gender: " + abbreviation;
}

function riskDisplay() {
    const newDiv = document.getElementById("risk");
    if (riskLevel > 0 && riskLevel < 100) newDiv.innerHTML = (riskLevel) + "% Risk";
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
