//BackGround
let bg;
// Building heights, initial as 1-3 storey
let height = '1-3';
// Count lines drawn
let count = 0;
// Record each shape
let rec = [];
// Record all shapes
let shapes = [];
// Initial stroke color
let s_color = '#eb565c';
// Check if a button is clicked
let btned = false;
// layer info
let layer_count = 1;

// not sure if useful, for test now
let hover = false;
let hover_p;
let selected = false;
let lastline;
let curvemode = false;
let mode_text;
let curves = [];
let delete_mode = false;
let new_layer = false;

// temp drawing lines
let sketchingLines = [];
let currentlySketchingALine = false;

let curveLines = [];
let recordCurve = [];
let polygons = [];
let voids = [];
let voids_curve = [];

// buttons
let btn_y = 570;

let retail_btn;
let residential_btn;
let office_btn;
let save_btn;
let clear_btn;
let flr13_btn;
let flr46_btn;
let flr912_btn;
let mode_btn;
let temp_p;

let buttons;


// Setup UI
function setup() {
  // put setup code here
  // createCanvas(windowWidth, windowHeight);
  bg = loadImage('http://127.0.0.1:8887/site-01.png');
  createCanvas(1048, 636);
  background(51);

  noStroke();
  textAlign(CENTER);

  // Retail Program Button
  retail_btn = new ButtonColor(50, btn_y, '#eb565c', 'Retail');

  // Residential Program Button
  residential_btn = new ButtonColor(130, btn_y, '#e7cd77', 'Residential');

  // Office Program Button
  office_btn = new ButtonColor(210, btn_y, '#98eaa6', 'Office');

  // Void mode Button
  void_btn = new ButtonColor(290, btn_y, 'black', 'Void')

  // Save txt file Button
  save_btn = new ButtonSave(930, btn_y, '#ffffff', 'Save');

  // Clear Canvas Button
  clear_btn = new ButtonClear(850, btn_y, '#ffffff', 'Clear Canvas');

  // Delete Button
  delete_btn = new ButtonDelete(770, btn_y, 'red', 'Delete');

  // 1-3 storey Button
  flr13_btn = new ButtonHeight(370, btn_y, '#ffffff', '1-3 floors', '1-3');

  // 4-6 storey Button
  flr46_btn = new ButtonHeight(450, btn_y, '#ffffff', '4-6 floors', '4-6');

  // 9-12 storey Button
  flr912_btn = new ButtonHeight(530, btn_y, '#ffffff', '9-12 floors', '9-12');

  // Mode Button
  mode_btn = new ButtonMode(690, btn_y, '#ffffff', 'Switch Mode');

  // Layer
  layer_btn = new ButtonLayer(960, btn_y-100, '#ffffff', 'Layer');

  // Add buttons to array
  buttons = [retail_btn, residential_btn, office_btn, void_btn, save_btn, clear_btn, flr13_btn, flr46_btn, flr912_btn, delete_btn, layer_btn];
  // buttons = [retail_btn, residential_btn, office_btn, void_btn, save_btn, clear_btn, flr13_btn, flr46_btn, flr912_btn, mode_btn, delete_btn, layer_btn];
}

// Draw lines
function draw() {
    // background
    background(51);
    background(bg);

    push();
    textAlign(LEFT);
    textSize(24);
    // textFont('');
    fill('white');
    text("1min Before Studio But You've got nothing", 20, 40);
    if (delete_mode) mode_text = 'Current Mode: Delete';
    else if (curvemode) mode_text = 'Current Mode: Free Curves';
    else mode_text = 'Current Mode: Rectangle';
    pop();

    push();
    textAlign(LEFT);
    textSize(12);
    textFont('Georgia');
    fill('white');
    text(mode_text, 20, 80);
    text('Current Program: '+ mapcolor(s_color), 20, 100);
    text('Current Height: '+height, 20, 120);
    pop();

    // render buttons
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].render()
    }

    //render hovered geometry
    hover_p = new Point(mouseX, mouseY);
    for (let i = 0; i < shapes.length; i++) {
        if (inside(hover_p, shapes[i].cornerscoord) && !selected) shapes[i].hover = true;
        else shapes[i].hover = false;
        shapes[i].render();
    }

    for (let i = 0; i < polygons.length; i++) {
        if (inside(hover_p, polygons[i].cornerscoord) && !selected) polygons[i].hover = true;
        else polygons[i].hover = false;
        polygons[i].render();
    }

    for (let i = 0; i < voids.length; i++) {
        if (inside(hover_p, voids[i].cornerscoord) && !selected) voids[i].hover = true;
        else voids[i].hover = false;
        voids[i].render();
    }
    for (let i = 0; i < voids_curve.length; i++) {
        if (inside(hover_p, voids_curve[i].cornerscoord) && !selected) voids_curve[i].hover = true;
        else voids_curve[i].hover = false;
        voids_curve[i].render();
    }

    // move geometry
    if (selected) {
        // for ipad use, check move distance
        if (abs(mouseX - temp_p.X) < abs(mouseX - pmouseX)) x_dist = mouseX - temp_p.X;
        else x_dist = mouseX - pmouseX;
        if (abs(mouseY - temp_p.Y) < abs(mouseY - pmouseY)) y_dist = mouseY - temp_p.Y;
        else y_dist = mouseY - pmouseY;

        // move selected rectangle
        for (let i = 0; i < shapes.length; i++) {
            if (shapes[i].select) {
                // print('yes');
                shapes[i].move(x_dist, y_dist)
            }
        }

        // move selected polygons
        for (let i = 0;i < polygons.length; i++) {
            if (polygons[i].select) {
                polygons[i].move(x_dist, y_dist);
            }
        }

        // move selected voids
        for (let i = 0;i < voids.length; i++) {
            if (voids[i].select) {
                voids[i].move(x_dist, y_dist);
            }
        }

        // move selected voids_curve
        for (let i = 0;i < voids_curve.length; i++) {
            if (voids_curve[i].select) {
                voids_curve[i].move(x_dist, y_dist);
            }
        }
    }

    // draw temp sketching LINES
    for (let i = 0; i < sketchingLines.length; i++) {
        sketchingLines[i].render(1);
    }

    // draw sketches lines for curve line
    for (let i = 0; i < curveLines.length; i++) {
        // line(curveLines[i].X,curveLines[i].Y,curveLines[i+1].X,curveLines[i+1].Y);
        curveLines[i].render(1);
    }

}

// Record shapes and attributes
function mouseReleased() {
    // record line in to rectangle
    if (!btned && !selected && !curvemode && !delete_mode && !new_layer) {
        count += 1;
        rec.push([lastLine.start.X, lastLine.start.Y, lastLine.end.X, lastLine.end.Y]);

        // If a rectangle is formed, append it to shapes
        if (count % 4 == 0 && count != 0){
            let program = mapcolor(s_color);
            if (s_color == 'black') {
                voids.push(pointsToRec(rec.slice(0,4), program, height, s_color, layer_count));
            }
            else shapes.push(pointsToRec(rec.slice(0,4), program, height, s_color, layer_count));
            rec = [];
            sketchingLines = [];
            print(finalExport(shapes));
        }
    }
    else if (selected) {
        sketchingLines = []
        rec = [];
        count = 0;
    }
    else if (!btned && curvemode) {
        let program = mapcolor(s_color);
        if (s_color == 'black') {
            voids_curve.push(new Polygon(mapCurveToPoint(recordCurve), program, height, s_color));
        }
        else polygons.push(new Polygon(mapCurveToPoint(recordCurve), program, height, s_color));
        sketchingLines = [];
    }
    else if (delete_mode) sketchingLines = [];

    // Update shapes layer
    else if (new_layer) {
        for (let i = 0; i < shapes.length; i++) {
            updateLayer(shapes[i]);
        }
        for (let i = 0; i < voids.length; i++) {
            updateLayer(voids[i])
        }
    }

    // print(polygons);

    // reinitialize parameters
    btned = false;
    selected = false;
    currentlySketchingALine = false;
    new_layer = false;
    recordCurve = [];
    curveLines = [];


    // reset all shapes' select status to false
    if (shapes.length > 0) {
        for (let i = 0; i < shapes.length; i++) {
            shapes[i].select = false;
        }
    }

    for (let i = 0; i < polygons.length; i++) {
        polygons[i].select = false;
    }

    for (let i = 0; i < voids.length; i++) {
        voids[i].select = false;
    }

    for (let i = 0; i < voids_curve.length; i++) {
        voids_curve[i].select = false;
    }

    // reset all buttons' select status to false
    for (let i = 0; i < buttons.length; i++) {
        buttons.select = false;
    }
}

function mouseDragged() {
    if (currentlySketchingALine && sketchingLines.length > 0){
        lastLine = sketchingLines[sketchingLines.length - 1];
        lastLine.chageEnd(new Point(mouseX, mouseY));
    }
    if (curvemode && !selected && checkDist(mouseX, mouseY, pmouseX, pmouseY)) {

        let temp_curve = new L(new Point(pmouseX, pmouseY), new Point(mouseX, mouseY));
        temp_curve.color = s_color;
        curveLines.push(temp_curve);
        recordCurve.push(temp_curve);
    }
}

// Click Button Event
function mousePressed() {
    // record pressed point
    temp_p = new Point(mouseX, mouseY);

    if (s_color != 'black') {
        // check if a shape is selected
        if (shapes.length > 0) {
            for (let i = 0; i < shapes.length; i++) {
                if (inside(temp_p, shapes[i].cornerscoord) && shapes[i].layer == 1) {
                    if (!delete_mode) {
                        shapes[i].select = true;
                        selected = true;
                    }
                    else {
                        shapes[i].delete = true;
                    }
                }
            }
        }

        for (let i = 0; i < polygons.length; i++) {
            if (inside(temp_p, polygons[i].cornerscoord)) {
                if (!delete_mode) {
                    polygons[i].select = true;
                    selected = true;
                }
                else polygons[i].delete = true;

            }
        }
    }

    for (let i = 0; i < voids.length; i++) {
        if (inside(temp_p, voids[i].cornerscoord)) {
            if (!delete_mode) {
                voids[i].select = true;
                selected = true;
            }
            else voids[i].delete = true;
        }
    }

    for (let i = 0; i < voids_curve.length; i++) {
        if (inside(temp_p, voids_curve[i].cornerscoord)) {
            if (!delete_mode) {
                voids_curve[i].select = true;
                selected = true;
            }
            else voids_curve[i].delete = true;
        }
    }


    // check if a button is selected
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].isinside(temp_p)) {
            buttons[i].select = true;
            buttons[i].execute();
            btned = true;
        }
    }

    // if no shapes and button is selected, start to draw a line
    if (!btned && !selected) {
        currentlySketchingALine = true;
        var currentLine = new L(new Point(mouseX, mouseY), new Point(mouseX, mouseY));
        currentLine.color = s_color;
        sketchingLines.push(currentLine);
    }
}
