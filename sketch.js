let nSides = 8; // number of sides on the polygons
let nPoints = 900; // number of points per shape border (higher => smoother but also slower)
let nBumps = 14; // number of bumps in the blob

function setup() {
  createCanvas(800, 800);
  noStroke();
}

function draw() {
  translate(width/2, height/2);
  
  let colors = ["#ff9100", "#4464a1", "#5e3500", "#b3dce0", "#e2f0f3", "#ff9100", "#62b6de", "#4464a1", "#301051"];
  let backCol = "#fffbe6";
  background(backCol);
  
  let nLayers = colors.length;
  let t = frameCount/200;
  
  let r1 = 200, r2 = 50;
  let outerPoints = makePolygon(r1, nSides, t); // outer border polygon
  let blobPoints = makeBlob((r1+r2)/2, t); // central blob
  let innerPoints = makePolygon(r2, nSides, -t); // inner border polygon
  
  // draw the interpolated shapes between the outer border and the blob
  for (let i = 0; i < nLayers; i++) {
    fill(colors[i]);
    beginShape();
    for (j = 0; j < nPoints; j++) {
      let p1 = outerPoints[j];
      let p2 = blobPoints[j];
      let x = map(i, 0, nLayers-1, p1.x, p2.x);
      let y = map(i, 0, nLayers-1, p1.y, p2.y);
      vertex(x, y);
    }
    endShape();
  }
  
  nLayers++;
  colors.push(backCol)
  
  // draw the interpolated shapes between the outer border and the blob
  for (let i = 0; i < nLayers; i++) {
    fill(colors[i]);
    beginShape();
    for (j = 0; j < nPoints; j++) {
      let p1 = blobPoints[j];
      let p2 = innerPoints[j];
      let x = map(i, 0, nLayers-1, p1.x, p2.x);
      let y = map(i, 0, nLayers-1, p1.y, p2.y);
      vertex(x, y);
    }
    endShape();
  }
}

function makePolygon(r, n, theta0) {
  let points = [];
  for (let i = 0; i < n; i++) {
    let theta = theta0 + i*TAU/n;
    let x1 = r*cos(theta);
    let y1 = r*sin(theta);
    let x2 = r*cos(theta+TAU/n);
    let y2 = r*sin(theta+TAU/n);
    for (let j = 0; j < nPoints/n; j++) {
      let t = j/nPoints*n;
      let x = x1*(1-t) + x2*t;
      let y = y1*(1-t) + y2*t;
      points.push(createVector(x, y));
    }
  }
  
  // reorder the points so that every polygon will be aligned
  let nShifts = nPoints - points.findIndex( 
    p => (abs(atan2(p.y, p.x)) < TAU/nPoints) 
  );
  for (let i = 0; i < nShifts; i++) {
    points.unshift(points.pop());
  }
  
  return points;
}

function makeBlob(r, t) {
  let points = [];
  let maxOffset = r/10;
  for (let i = 0; i < nPoints; i++) {
    let theta = TAU*i/nPoints;
    let rOffset = sin(theta*nBumps)*cos(t*10)*maxOffset;
    points.push(createVector(
      (r+rOffset)*cos(theta), 
      (r+rOffset)*sin(theta)
    ));
  }
  
  return points;
}
