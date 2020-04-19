class ImgDisplay {
    constructor() {
        this.x = 0;
        this.y = height / 2;
        this.w = 320;
        this.h = 240;
    }

    showImg() {
        push();
        translate(width / 2, this.y);
        // image gallery
        if ( gallery_move > 1 && gallery_move < (storedData.length + 1)) { 
        // steps needed < number of steps to get through all the images stored in the database - number of steps to display images to half of the screen
        // because that is how it is by default (half a screen is full with images)
        // each incremental step = an image size
    
            for (let i = 0; i < images.length; i++) {
                if (gallery_move == 2) {
                    this.x = ((this.w * i)) - (this.w * gallery_move / 2); // a one-image step (320px) everytime gallery_move increases by 1
                } else {
                    this.x = ((this.w * i)) - (this.w * (gallery_move - 1)); // a one-image step (320px) everytime gallery_move increases by 1
                }
                
                // enlarge one image that is at the centre of the screen
                if (this.x == 0) {
                    push();
                        scale(1.25, 1.25);
                        image(images[i], this.x, 0, this.w, this.h);
                    pop();
                    if (visualiseData) {
                        push();
                            noStroke();
                            fill(50, 200);
                            rect(this.x, 0, width, height);
                            fill(0);
                            const displayMenu_w = this.w * 2.75,
                                  displayMenu_h = this.h * 2;
                            rectMode(CENTER);
                            rect(this.x, 0, displayMenu_w, displayMenu_h);
                            // move the image's right conrner to the right edge of the above rect
                            const image_to_rectEdge_X = this.x + (displayMenu_w - (this.w * 2)) / 2;
                            image(images[i], image_to_rectEdge_X, 0, this.w * 2, displayMenu_h);
                            fill('#8A8EFF');
                            textSize(width / 50);
                            text("Gender " + gender[i], (this.x - displayMenu_w / 2) / 1.4, -displayMenu_h / 3);
                            text("Age " + age[i], (this.x - displayMenu_w / 2) / 1.4, -displayMenu_h / 5);
                            textSize(width / 60);
                            text("Agressiveness" + "\n" + aggr[i], (this.x - displayMenu_w / 2) / 1.4, -displayMenu_h / 14);
                            text("Suspiciousness" + "\n" + susp[i], (this.x - displayMenu_w / 2) / 1.4, 50);
                            text("Passiveness" + "\n" + pass[i], (this.x - displayMenu_w / 2) / 1.4, 140);
                            textSize(width / 20);
                            noStroke();
                            fill(0, 50);
                            rectMode(CORNER);
                            rect((image_to_rectEdge_X) - this.w, (displayMenu_h / 2) - width / 20, 325, 100);
                            stroke(200);
                            strokeWeight(2);
                            if (riskLevel[i] > 75) {
                                fill(255, 0, 0);
                            } else if (riskLevel[i] > 50 && riskLevel[i] <= 75) {
                                fill(255, 200, 0);
                            } else fill('#8A8EFF');
                            text(riskLevel[i] + "% Risk", (image_to_rectEdge_X) - this.w / 2, displayMenu_h / 2);
                        pop();
                    }
                } else {
                    if (!visualiseData) {
                        push();
                            // filter(GRAY);
                            blendMode(SCREEN);
                            image(images[i], this.x, 0, this.w, this.h);
                        pop();
                    }
                }
            }
        } else {
            gallery_move = 1;
            for (let i = 0; i < images.length; i++) {
                this.x = (this.w * i);
                if (this.x == 0) {
                    push();
                        scale(1.1, 1.1);
                        image(images[i], this.x, 0, this.w, this.h);
                    pop();
                    if (visualiseData) {
                        push();
                            noStroke();
                            fill(50, 200);
                            rect(0, 0, width, height);
                            fill(0);
                            const displayMenu_w = this.w * 2.75,
                                  displayMenu_h = this.h * 2;
                            rectMode(CENTER);
                            rect(this.x, 0, displayMenu_w, displayMenu_h);
                            // move the image's right conrner to the right edge of the above rect
                            image(images[i], this.x + (displayMenu_w - (this.w * 2)) / 2, 0, this.w * 2, displayMenu_h);
                            fill('#8A8EFF');
                            textSize(width / 50);
                            text("Gender " + gender[i], (this.x - displayMenu_w / 2) / 1.4, -displayMenu_h / 3);
                            text("Age " + age[i], (this.x - displayMenu_w / 2) / 1.4, -displayMenu_h / 5);
                            textSize(width / 60);
                            text("Agressiveness" + "\n" + aggr[i], (this.x - displayMenu_w / 2) / 1.4, -displayMenu_h / 14);
                            text("Suspiciousness" + "\n" + susp[i], (this.x - displayMenu_w / 2) / 1.4, 50);
                            text("Passiveness" + "\n" + pass[i], (this.x - displayMenu_w / 2) / 1.4, 140);
                            textSize(width / 20);
                            text(riskLevel[i] + "% Risk", (this.x + (displayMenu_w - (this.w * 2)) / 2) - this.w / 2, displayMenu_h / 2);
                        pop();
                    }
                } else {
                    // don't show stuff when visualiseData is false
                    if (!visualiseData) {
                        push();
                            // filter(GRAY);
                            blendMode(SCREEN);
                            image(images[i], this.x, 0, this.w, this.h);
                        pop();
                    }
                }
            }
        }
        pop();
    }
}


