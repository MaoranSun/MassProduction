//BackGround
let bg;
// Building heights, initial as 1-3 storey
let height = '1-3';
// Count lines drawn
let count = 0;
// Record each shape
let rec = [];
// Record all shapes
let shapes = [[]];
// Record all voids
let voids = [[]];
// Initial stroke color
let s_color = '#eb565c';
// Check if a button is clicked
let btned = false;
// layer info
let layer_count = 0;

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

let voids_curve = [];

// buttons
let btn_y = 570;
let layer_btn_y = 410;
let active_layer = 0
// let layer_count = 0;

let retail_btn;
let residential_btn;
let office_btn;
let save_btn;
let clear_btn;
let flr13_btn;
let flr46_btn;
let flr912_btn;
let mode_btn;
let ortho_btn;
let temp_p;
let ortho = false;

let buttons;
const socket = new WebSocket('ws://massserver.herokuapp.com');
// const socket = new WebSocket('ws://massserver.herokuapp.com:3000/massings?name=web');
// const socket = new WebSocket('ws://localhost:3000');





// Setup UI
function setup() {
  // put setup code here
  // createCanvas(windowWidth, windowHeight);
  // bg = loadImage('http://127.0.0.1:8887/site-01.png');
  bg = loadImage("https://drive.google.com/file/d/1CPLAnpVXS81CbaWh7YC66-Ewsh0sDn8z/preview")
  createCanvas(1048, 636);
  background(51);

  noStroke();
  textAlign(CENTER);

  // Websocket Part
  // socket = new WebSocket('ws://localhost:9898')
  socket.addEventListener('open', function (event) {
      socket.send('hello, server!')
  })

  // Retail Program Button
  retail_btn = new ButtonColor(50, btn_y, '#eb565c', 'Retail');

  // Residential Program Button
  residential_btn = new ButtonColor(130, btn_y, '#e7cd77', 'Residential');

  // Office Program Button
  office_btn = new ButtonColor(210, btn_y, '#98eaa6', 'Office');

  // Void mode Button
  void_btn = new ButtonColor(290, btn_y, 'black', 'Void')

  // Save txt file Button
  save_btn = new ButtonSave(850, btn_y, '#ffffff', 'Save');

  // Ortho mode button
  ortho_btn = new ButtonOrtho(850, btn_y, '#ffffff', 'Ortho')

  // Clear Canvas Button
  clear_btn = new ButtonClear(770, btn_y, '#ffffff', 'Clear Canvas');

  // Delete Button
  delete_btn = new ButtonDelete(690, btn_y, 'red', 'Delete');

  // 1-3 storey Button
  flr13_btn = new ButtonHeight(370, btn_y, '#ffffff', '1-3 floors', '1-3');

  // 4-6 storey Button
  flr46_btn = new ButtonHeight(450, btn_y, '#ffffff', '4-6 floors', '4-6');

  // 9-12 storey Button
  flr912_btn = new ButtonHeight(530, btn_y, '#ffffff', '9-12 floors', '9-12');

  // Mode Button
  mode_btn = new ButtonMode(690, btn_y, '#ffffff', 'Switch Mode');

  // Create New Layer
  layer_btn = new ButtonLayer(930, btn_y, '#ffffff', 'New Layer');

  //First Layer
  layer_btn_0 = new ButtonDrawingLayer(930, btn_y-80, '#ffffff', '0')

  // Add buttons to array
  buttons = [retail_btn, residential_btn, office_btn, void_btn, clear_btn, ortho_btn, flr13_btn, flr46_btn, flr912_btn, delete_btn, layer_btn];
  // Layers button array
  buttons_layer = [layer_btn_0];

  // buttons = [retail_btn, residential_btn, office_btn, void_btn, save_btn, clear_btn, flr13_btn, flr46_btn, flr912_btn, mode_btn, delete_btn, layer_btn];
}

// Draw lines
function draw() {
    // background
    background(51);
    background(bg);

    // Text on the top-left
    push();
    textAlign(LEFT);
    textSize(24);
    // textFont('');
    fill('white');
    text("MASS Production", 20, 40);
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
    text('Ortho Mode: ' + ortho, 20, 140);
    pop();

    // render buttons
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].render()
    }
    for (let i = 0; i < buttons_layer.length; i++) {
        buttons_layer[i].render();
    }

    //render hovered geometry
    hover_p = new Point(mouseX, mouseY);
    // read from top layers to bottom

    for (let i = 0; i < shapes.length; i++) {
        // only active layer geometry could be hovered
        if (i == active_layer) {
            // iterate through active layer geometries
            for (let j = 0; j < shapes[i].length; j++) {
                if (inside(hover_p, shapes[i][j].cornerscoord) && !selected) {
                    shapes[i][j].hover = true;
                }
                else shapes[i][j].hover = false;
                shapes[i][j].render();
            }
        }
        else {
            for (let j = 0; j < shapes[i].length; j++) {
                shapes[i][j].hover = false;
                shapes[i][j].render();
            }
        }
    }

    // for (let i = 0; i < polygons.length; i++) {
    //     if (inside(hover_p, polygons[i].cornerscoord) && !selected) polygons[i].hover = true;
    //     else polygons[i].hover = false;
    //     polygons[i].render();
    // }

    for (let i = 0; i < voids.length; i++) {
        // only voids in active layer could be hovered
        if(i === active_layer) {
            //iterate through active layer geometries
            for (let j = 0; j < voids[i].length; j++) {
                if (inside(hover_p, voids[i][j].cornerscoord) && !selected) voids[i][j].hover = true;
                else voids[i][j].hover = false;
                voids[i][j].render();
            }
        }

        else {
            for (let j = 0; j < voids[i].length; j++) {
                voids[i][j].hover = false;
                voids[i][j].render();
            }
        }
    }
    // for (let i = 0; i < voids_curve.length; i++) {
    //     if (inside(hover_p, voids_curve[i].cornerscoord) && !selected) voids_curve[i].hover = true;
    //     else voids_curve[i].hover = false;
    //     voids_curve[i].render();
    // }

    // move geometry
    if (selected) {
        // for ipad use, check move distance
        if (abs(mouseX - temp_p.X) < abs(mouseX - pmouseX)) x_dist = mouseX - temp_p.X;
        else x_dist = mouseX - pmouseX;
        if (abs(mouseY - temp_p.Y) < abs(mouseY - pmouseY)) y_dist = mouseY - temp_p.Y;
        else y_dist = mouseY - pmouseY;

        // move selected rectangle
        for (let i = 0; i < shapes[active_layer].length; i++) {
            if (shapes[active_layer][i].select) {
                // print('yes');
                shapes[active_layer][i].move(x_dist, y_dist)
            }
        }

        // move selected polygons
        // for (let i = 0;i < polygons.length; i++) {
        //     if (polygons[i].select) {
        //         polygons[i].move(x_dist, y_dist);
        //     }
        // }

        // move selected voids
        for (let i = 0;i < voids[active_layer].length; i++) {
            if (voids[active_layer][i].select) {
                voids[active_layer][i].move(x_dist, y_dist);
            }
        }

        // move selected voids_curve
        // for (let i = 0;i < voids_curve.length; i++) {
        //     if (voids_curve[i].select) {
        //         voids_curve[i].move(x_dist, y_dist);
        //     }
        // }
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
        print(rec);
        print(count);

        // If a rectangle is formed, append it to shapes
        if (count % 4 == 0 && count != 0){
            let program = mapcolor(s_color);
            if (s_color == 'black') {
                voids[active_layer].push(pointsToRec(rec.slice(0,4), program, height, s_color, active_layer));
            }
            else shapes[active_layer].push(pointsToRec(rec.slice(0,4), program, height, s_color, active_layer, ortho));
            rec = [];
            sketchingLines = [];
            // print(finalExport(shapes));
            print(shapes);
            socket.send(finalExport(shapes));
        }
    }
    else if (selected) {
        sketchingLines = []
        rec = [];
        count = 0;
        socket.send(finalExport(shapes));
    }
    else if (btned) {
        socket.send(finalExport(shapes));
    }
    else if (!btned && curvemode) {
        let program = mapcolor(s_color);
        if (s_color == 'black') {
            voids_curve.push(new Polygon(mapCurveToPoint(recordCurve), program, height, s_color));
        }
        else polygons.push(new Polygon(mapCurveToPoint(recordCurve), program, height, s_color));
        sketchingLines = [];
    }
    else if (delete_mode) {
        sketchingLines = [];
        socket.send(finalExport(shapes));
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
    for (let i = 0; i < shapes.length; i++) {
        for (let j = 0; j < shapes[i].length; j++) {
            shapes[i][j].select = false;
        }
    }


    // for (let i = 0; i < polygons.length; i++) {
    //     polygons[i].select = false;
    // }

    for (let i = 0; i < voids.length; i++) {
        for (let j = 0; j < voids[i].length; j++) {
            voids[i][j].select = false;
        }

    }

    // for (let i = 0; i < voids_curve.length; i++) {
    //     voids_curve[i].select = false;
    // }

    // reset all buttons' select status to false
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].select = false;
    }
    for (let i = 0; i < buttons_layer.length; i++) {
        buttons_layer[i].select = false;
    }


    print(active_layer);
    print(selected);
}

function mouseDragged() {
    if (currentlySketchingALine && sketchingLines.length > 0){
        lastLine = sketchingLines[sketchingLines.length - 1];
        if (ortho) {
            let start_x = temp_p.X;
            let start_y = temp_p.Y;
            let end_x = mouseX;
            let end_y = mouseY;

            if (Math.abs(start_x - end_x) > Math.abs(start_y - end_y)) {
                lastLine.chageEnd(new Point(mouseX, start_y));
            }
            else {
                lastLine.chageEnd(new Point(start_x, mouseY));
            }
        }
        else {
            lastLine.chageEnd(new Point(mouseX, mouseY));
        }
        // lastLine.chageEnd(new Point(mouseX, mouseY));
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
        for (let i = 0; i < shapes[active_layer].length; i++) {
            if (inside(temp_p, shapes[active_layer][i].cornerscoord)) {
                if (!delete_mode) {
                    shapes[active_layer][i].select = true;
                    selected = true;
                }
                else {
                    shapes[active_layer][i].handdelete = true;
                }
            }
        }

        // for (let i = 0; i < polygons.length; i++) {
        //     if (inside(temp_p, polygons[i].cornerscoord)) {
        //         if (!delete_mode) {
        //             polygons[i].select = true;
        //             selected = true;
        //         }
        //         else polygons[i].delete = true;
        //
        //     }
        // }
    }

    for (let i = 0; i < voids[active_layer].length; i++) {
        if (inside(temp_p, voids[active_layer][i].cornerscoord)) {
            if (!delete_mode) {
                voids[active_layer][i].select = true;
                selected = true;
            }
            else voids[active_layer][i].handdelete = true;
        }
    }

    // for (let i = 0; i < voids_curve.length; i++) {
    //     if (inside(temp_p, voids_curve[i].cornerscoord)) {
    //         if (!delete_mode) {
    //             voids_curve[i].select = true;
    //             selected = true;
    //         }
    //         else voids_curve[i].delete = true;
    //     }
    // }


    // check if a button is selected
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].isinside(temp_p)) {
            buttons[i].select = true;
            buttons[i].execute();
            btned = true;
        }
    }
    // check if a layer is selected
    for (let i = 0; i < buttons_layer.length; i++) {
        if (buttons_layer[i].isinside(temp_p)) {
            buttons_layer[i].select = true;
            buttons_layer[i].execute();
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
