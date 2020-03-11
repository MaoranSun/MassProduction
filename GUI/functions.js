// check if a point is inside a geometry
function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point.X, y = point.Y;

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

// convert points to rectangle
function pointsToRec(pts, program, height, fill_color, layer_count) {
    let p11 = new Point(pts[0][0], pts[0][1]);
    let p12 = new Point(pts[0][2], pts[0][3]);
    let p21 = new Point(pts[1][0], pts[1][1]);
    let p22 = new Point(pts[1][2], pts[1][3]);
    let p31 = new Point(pts[2][0], pts[2][1]);
    let p32 = new Point(pts[2][2], pts[2][3]);
    let p41 = new Point(pts[3][0], pts[3][1]);
    let p42 = new Point(pts[3][2], pts[3][3]);

    let l1 = new L(p11, p12);
    let l2 = new L(p21, p22);
    let l3 = new L(p31, p32);
    let l4 = new L(p41, p42);

    let lines = [l1, l2, l3, l4];

    let angle01 = lines[0].checkAngle(lines[1]);
    let angle02 = lines[0].checkAngle(lines[2]);
    let angle03 = lines[0].checkAngle(lines[3]);
    let p1;
    let p2;
    let p3;
    let p4;
    let rec;

    if (abs(angle01) < abs(angle02) & abs(angle01) < abs(angle03)) {
        p1 = lines[0].intersection(lines[2]);
        p2 = lines[0].intersection(lines[3]);
        p3 = lines[1].intersection(lines[2]);
        p4 = lines[1].intersection(lines[3]);
    }
    else if(abs(angle02) < abs(angle01) & abs(angle02) < abs(angle03)) {
        p1 = lines[0].intersection(lines[1]);
        p2 = lines[0].intersection(lines[3]);
        p3 = lines[2].intersection(lines[1]);
        p4 = lines[2].intersection(lines[3]);
    }
    else {
        p1 = lines[0].intersection(lines[1]);
        p2 = lines[0].intersection(lines[2]);
        p3 = lines[3].intersection(lines[1]);
        p4 = lines[3].intersection(lines[2]);
    }

    rec = new Rectangle(p1, p3, p4, p2, program, height, fill_color, layer_count);

    return rec;
}

// Map color to building program
function mapcolor(c) {
    if (c === '#eb565c') {
        return 'retail';
    }
    else if (c === '#e7cd77') {
        return 'residential';
    }
    else if (c === '#98eaa6') {
        return 'office';
    }
    else if (c === 'black') {
        return 'void';
    }
}

// Check distantce between points, to distinguish between lines, for iPad use
function checkDist(x, y, px, py){
    let d = int(dist(x, y, px, py));
    if(d > 20) {
        return false;
    }
    else {
        return true;
    }
}

// Clean shapes array, and return true shapes
function cleanarr(arr) {
    var temp = [];
    for (i = 0; i < arr.length; i++) {
        if (arr[i].length === 6) {
            temp.push(arr[i]);
        }
    }
    return temp;
}

// translate curveLines to points to construct the polygons
function mapCurveToPoint(curves) {
    let pts = []
    for (let i = 0; i < curves.length; i++) {
        pts.push(curves[i].Start);
    }

    return pts;
}

// Save rectangle to text
function recExport(rect) {
    return [rect.totext, rect.program, rect.height, 'Rectangle', rect.layer];
}

// Save polygon to text
function polyExport(polygon) {
    return [polygon.totext, polygon.program, polygon.height, 'Polygon'];
}

// Final Export
function finalExport(shapes) {
    let final = [];

    for (let i = 0; i < shapes.length; i++) {
        for (let j = 0; j < shapes[i].length; j++) {
            if (!shapes[i][j].delete && !shapes[i][j].handdelete) final.push(recExport(shapes[i][j]));
        }
    }

    for (let i = 0; i < voids.length; i++) {
        for (let j = 0; j < voids[i].length; j++) {
            if (!voids[i][j].delete) final.push(recExport(voids[i][j]))
        }
        // if (!voids[i].delete) final.push(recExport(voids[i]));
    }

    // if (polygons.length > 0) {
    //     for (let i = 0; i < polygons.length; i++) {
    //         if (!polygons[i].delete) final.push(polyExport(polygons[i]));
    //     }
    // }
    //
    // for (let i = 0; i < voids_curve.length; i++) {
    //     if (!voids_curve[i].delete) final.push(polyExport(voids_curve[i]));
    // }
    return final;
}

// Update layer_count
function updateLayer(rec) {
    // if(rec.layer == 3) rec.delete = true;
    // else rec.layer = rec.layer + 1;
    layer_count += 1;
}
