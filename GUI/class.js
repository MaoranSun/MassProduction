class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    get X() {
        return this.x;
    }

    get Y() {
        return this.y;
    }

    set set_x(a) {
        this.x = a;
    }

    set set_y(a) {
        this.y = a;
    }
}

class L {
    constructor(p1, p2) {
        this.Start = p1;
        this.End = p2;

        this.color = 'red';
    }

    get start() {
        return this.Start;
    }

    get end() {
        return this.End;
    }

    chageEnd(point) {
        this.End = point;
    }

    get points() {
        return [start, end];
    }

    get slope() {
        if (this.Start.X == this.End.X) return 'None';
        else return (this.Start.Y - this.End.Y) / (this.Start.X - this.End.X);
    }

    get yintersect() {
        if (this.slope == 'None') {
            return 'None';
        }
        else return this.Start.Y - this.slope * this.Start.X;
        // else return None;
    }

    intersection (l1) {
        let inter_x;
        let inter_y;
        let interpoint;
        // check if parallel
        if (this.slope != l1.slope) {
            if (this.slope == 'None') {
                inter_x = this.start.X;
                inter_y = l1.slope * inter_x + l1.yintersect;
                interpoint = new Point(inter_x, inter_y);
            }
            else if (l1.slope == 'None') {
                inter_x = l1.start.X;
                inter_y = this.slope * inter_x + this.yintersect;
                interpoint = new Point(inter_x, inter_y);
            }
            else {
                inter_x = (l1.yintersect - this.yintersect) / (this.slope - l1.slope);
                inter_y = this.slope * inter_x + this.yintersect;
                interpoint = new Point(inter_x, inter_y);
            }

            return interpoint;
        }
        else return 'None';
    }

    checkAngle(l1) {
        if (this.slope == l1.slope) return 5;
        else if (this.slope == 'None') return PI / 2 - atan(l1.slope);
        else if (l1.slope == 'None') return PI / 2 - atan(this.slope);
        else return atan(this.slope) - atan(l1.slope);
    }

    render(weight){
        push();
        stroke(this.color);
        strokeWeight(weight);
        line(this.Start.X, this.Start.Y, this.End.X, this.End.Y);
        pop();
    }
}

class Rectangle {
  constructor(p1, p2, p3, p4, program, height, fill_color, layer_count) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
    this.program = program;
    this.height = height;
    this.fill_color = fill_color;

    this.delete = false;
    this.hover = false;
    this.select = false;
    this.layer = layer_count
  }

  get corners() {
      return [this.p1, this.p2, this.p3, this.p4];
  }

  get cornerscoord() {
      return [[this.p1.X, this.p1.Y], [this.p2.X, this.p2.Y], [this.p3.X, this.p3.Y], [this.p4.X, this.p4.Y]];
  }

  get totext() {
      return [this.p1.X, this.p1.Y, this.p2.X, this.p2.Y, this.p3.X, this.p3.Y, this.p4.X, this.p4.Y];
  }

  move(x_dist, y_dist) {
      this.p1.set_x = this.p1.X + x_dist;
      this.p1.set_y = this.p1.Y + y_dist;
      this.p2.set_x = this.p2.X + x_dist;
      this.p2.set_y = this.p2.Y + y_dist;
      this.p3.set_x = this.p3.X + x_dist;
      this.p3.set_y = this.p3.Y + y_dist;
      this.p4.set_x = this.p4.X + x_dist;
      this.p4.set_y = this.p4.Y + y_dist;
  }

  render() {
      let colormap = {
          '#eb565c': [235, 86, 92],
          '#e7cd77': [231, 205, 119],
          '#98eaa6': [152, 234, 166],
          'black': [0,0,0]
      }
      let transparent = [0, 1, .6, .3];

      if (!this.delete) {
          push();
          if (this.hover && this.layer == 1) {
              strokeWeight(3);
              stroke('white');
              // fill(this.fill_color);
              // fill('rgba(colormap[this.fill_color][0], colormap[this.fill_color][1], colormap[this.fill_color][2], transparent[this.layer])')
          }
          else {
              noStroke();
              // fill(this.fill_color);
          }
          // fill('rgba(colormap[this.fill_color][0], colormap[this.fill_color][1], colormap[this.fill_color][2], transparent[this.layer])');
          fill(`rgba(${colormap[this.fill_color][0]}, ${colormap[this.fill_color][1]}, ${colormap[this.fill_color][2]}, ${transparent[this.layer]})`);
          // print(`rgba(${colormap[this.fill_color][0]}, ${colormap[this.fill_color][1]}, ${colormap[this.fill_color][2]}, ${transparent[this.layer]})`);
          quad(this.corners[0].x, this.corners[0].y, this.corners[1].x, this.corners[1].y, this.corners[2].x, this.corners[2].y, this.corners[3].x, this.corners[3].y);
          pop();
      }

  }



}

class Polygon {
    constructor(points, program, height, color) {
        this.points = points;
        this.program = program;
        this.height = height;
        this.color = color;

        this.delete = false;
        this.hover = false;
        this.select = false;
    }

    get cornerscoord() {
        let corcoord = [];
        for (let i = 0; i < this.points.length; i++) {
            corcoord.push([this.points[i].X, this.points[i].Y]);
        }
        return corcoord;
    }

    get totext() {
        let corcoord = [];
        for (let i = 0; i < this.points.length; i++) {
            corcoord.push(this.points[i].X, this.points[i].Y);
        }
        return corcoord;
    }

    move(x_dist, y_dist) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].set_x = this.points[i].X + x_dist;
            this.points[i].set_y = this.points[i].Y + y_dist;
        }
    }

    render() {
        if (!this.delete) {
            push();
            if (this.hover) {
                strokeWeight(3);
                stroke('white');
            }
            else {
                noStroke();
            }
            fill(this.color);
            beginShape();
            for (let i = 0; i < this.points.length; i++) {
                vertex(this.points[i].X, this.points[i].Y)
            }
            endShape(CLOSE);
            // quad(this.corners[0].x, this.corners[0].y, this.corners[1].x, this.corners[1].y, this.corners[2].x, this.corners[2].y, this.corners[3].x, this.corners[3].y);
            pop();
        }

    }
}

class Button {
    constructor(locationx, locationy, color, word) {
        this.centerx = locationx;
        this.centery = locationy;
        this.color = color;
        this.word = word;

        this.radius = 45;
        this.select = false;
    }

    render() {
        push();
        textAlign(CENTER);
        fill(this.color);
        noStroke();
        circle(this.centerx, this.centery, this.radius);
        text(this.word, this.centerx, this.centery + this.radius);
        pop();
    }

    isinside(p) {
        let distance = dist(p.X, p.Y, this.centerx, this.centery);
        if (distance < this.radius) return true;
        else return false;
    }
}

class ButtonColor extends Button {
    constructor(locationx, locationy, color, word) {
        super(locationx, locationy, color, word);
    }

    execute() {
        s_color = this.color;
    }
}

class ButtonClear extends Button {
    constructor(locationx, locationy, color, word) {
        super(locationx, locationy, color, word);
    }

    execute() {
        location.reload();
    }
}

class ButtonSave extends Button {
    constructor(locationx, locationy, color, word) {
        super(locationx, locationy, color, word);
    }

    execute() {
        saveStrings(finalExport(shapes),'shapes.txt')
        // location.reload();
        // saveStrings(shapes, 'shapes.txt');
        count = 0;
    }
}

class ButtonHeight extends Button {
    constructor(locationx, locationy, color, word, height) {
        super(locationx, locationy, color, word);
        this.height = height;
    }

    execute() {
        height = this.height;
    }
}

class ButtonMode extends Button {
    constructor(locationx, locationy, color, word) {
        super(locationx, locationy, color, word);
        this.mode = 'rect';
    }

    execute() {
        if (curvemode) curvemode = false;
        else curvemode = true;
    }
}

class ButtonDelete extends Button {
    constructor(locationx, locationy, color, word) {
        super(locationx, locationy, color, word);
    }

    execute() {
        if (delete_mode) delete_mode = false;
        else delete_mode = true;
    }
}

class ButtonLayer extends Button {
    constructor(locationx, locationy, color, word) {
        super(locationx, locationy, color, word);
    }

    execute() {
        if (new_layer) new_layer = false;
        else new_layer = true;
    }
}
