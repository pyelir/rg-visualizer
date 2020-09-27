import Graph from "./graph.js";
let G = Graph.getGnp(20);
let H = Graph.getMST(G, 0);


// Get random positions

function randomLayout(G) {
  let positions = new Map();
  for (let v = 0; v < H.nodes; v++) {
    positions.set(v, new Vec(Math.random(), Math.random()));
  }
  return positions;
}



function getForce(G, v, layout) {
  const c1 = 2;
  const c2 = 1;
  const c3 = 1;
  const c4 = 0.1;
  const M  = 100;
  let force = new Vec(0,0);
  for (let u = 0; u < G.nodes; u++) {
    if (u != v) {
      let vu = layout.get(u).minus(layout.get(v));
      if (G.areAdjacent(u,v)) {
        let strength = (-1) * c1 * Math.log(vu.magnitude / c2);
        force = force.add(vu.unitvec.times(strength));
      } else {
        let strength = c3 / (vu.magnitude * vu.magnitude);
        force = force.add(vu.unitvec.times(strength));
      }
    }
  }
  return force;
}
// Generate a force-directed graph layout
// Algorithm taken from (say where algo is from)
function springLayout(G) {
  // parameters we don't need the user to touch
  const c1 = 2;
  const c2 = 1;
  const c3 = 1;
  const c4 = 0.1;
  const M  = 100;
  let layout = randomLayout(G);
  let increments = new Map();
  for (let i = 0; i < M; i++) {
    for (let v = 0; v < G.nodes; v++) {
      increments.set(v, getForce(G,v, layout));
    }
    for (let v = 0; v < G.nodes; v++) {
      let newPos = layout.get(v);
      newPos = newPos.add(increments.get(v).times(c4));
      layout.set(v, newPos);
    }
  }
  return layout;
}

function getExtrema(positions){
  // Ugly hack, but initializes extrema to xMin=xMax= first x coordinate and
  // yMin=yMax=first y coordinate
  let extrema;
  for (let k of positions.keys()) {
    let firstPos = positions.get(k);
    extrema = new Extrema(firstPos.x, firstPos.y);
    break;
  }
  for (let node of positions.keys()) {
    let newPos = positions.get(node);
    let newY = newPos.y;
    let newX = newPos.x;
    if (newY < extrema.getMinY()) {
      extrema.setMinY(newY);
    }
    if (newY > extrema.getMaxY()) {
      extrema.setMaxY(newY);
    }
    if (newX < extrema.getMinX()) {
      extrema.setMinX(newX);
    }
    if (newX > extrema.getMaxX()) {
      extrema.setMaxX(newX);
    }
  }
  return extrema;
}

function draw(G, positions, cvs) {
  let extrema = getExtrema(positions);
  let scale = new Coords(extrema, cvs)
  for (let v = 0; v < G.nodes; v++) {
    for (let u of G.getNeighbors(v).keys()) {
      if (v < u) {
        drawLine(u,v,cvs,positions,scale);
      }
    }
  }
}

function drawLine(u, v, cvs, positions, coords) {
  let cx = cvs.getContext("2d");
  cx.beginPath();
  cx.strokeStyle = "grey";
  cx.lineWidth = 1;
  let x1 = coords.scale(positions.get(v).x, 0);
//  let x1 = Math.round(width * positions.get(v).x);
  let y1 = coords.scale(positions.get(v).y, 1);
//  let y1 =  Math.round(height * positions.get(v).y);
  let x2 = coords.scale(positions.get(u).x, 0);
//  let x2 = Math.round(width * positions.get(u).x);
  let y2 = coords.scale(positions.get(u).y, 1);
//  let y2 = Math.round(height * positions.get(u).y);
  cx.moveTo(x1, y1);
  cx.lineTo(x2, y2);
  cx.stroke();
}

class Extrema {
  constructor(x, y) {
    this.minX = x;
    this.maxX = x;
    this.minY = y;
    this.maxY = y;
  }

  setMinY(newY) {
    this.minY = newY;
  }

  setMaxY(newY) {
    this.maxY = newY;
  }

  setMinX(newX) {
    this.minX = newX;
  }

  setMaxX(newX) {
    this.maxX = newX;
  }
  getMaxX() {
    return this.maxX;
  }

  getMinX() {
    return this.minX;
  }

  getMaxY() {
    return this.maxY;
  }

  getMinY() {
    return this.minY;
  }

  getMinCoord(idx) {
    if (idx == 0) {
      return this.minX;
    }
    return this.minY;
  }

  getMaxCoord(idx) {
    if (idx == 0) {
      return this.maxX;
    }
    return this.maxY;
  }
}

class Coords {
  // Takes an array representing the extrema of the points in each dimension
  // extrema = [[x1min, x1max], [x2min, x2max], ..., [xNmin, xNmax]]
  // and a canvas object.  (Implicitly assumes dimension 2 here)
  constructor(extrema, cvs) {
    this.extrema = extrema;
    this.dims = [cvs.width, cvs.height];
  }

  scale(val, dim){
    let M = this.extrema.getMaxCoord(dim);
    let m = this.extrema.getMinCoord(dim);
    let dxi = M - m;
    let result = Math.round(this.dims[dim] * ((val - m)/dxi));
    if (result < 0) {
      return 0;
    }
    if (result > this.dims[dim]) {
      return this.dims[dim];
    }
    return result;
  }
}

// vector in 2D Euclidean space
class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }

  minus(other) {
    return new Vec(this.x - other.x, this.y - other.y);
  }

  times(c) {
    return new Vec(c * this.x, c * this.y );
  }

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get unitvec() {
    let magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    return new Vec(this.x/magnitude, this.y/magnitude);
  }
}

draw(H, springLayout(H), document.querySelector("canvas"));