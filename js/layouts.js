// Get random positions
function randomLayout(G) {
  let positions = new Map();
  for (let v = 0; v < H.nodes; v++) {
    positions.set(v, new Vec(Math.random(), Math.random()));
  }
  return positions;
}

// Used for basic, Eades-style force-directed spring graph layout
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

function firstPartial(G, pos, Kij, Lij, node, coord) {
  let total = 0;
  for (let u = 0; u < G.nodes; u++) {
    if (u != node) {
      let numerator = Lij.get(u).get(node) * (pos.get(node)[coord] - pos.get(u)[coord]);
      let denominator = (pos.get(v)[0]-pos.get(u)[0]) ** 2 + (pos.get(v)[1]-pos.get(u)[1]) ** 2;
      denominator = Math.sqrt(denominator);
      let multiplicand = (pos.get(node)[coord] - pos.get(u)[coord]) - (numerator / denominator);
      total = total + (Kij.get(u).get(v) * multiplicand);
    }
  }
  return total;
}

function getDi(G, pos, Kij, Lij) {
  let Di = new Map();
  for (let v = 0; v < G.nodes; v++) {
    let dEdXm = firstPartial(G, pos, Kij, Lij, v, 0);
    let dEdYm = firstPartial(G, pos, Kij, Lij, v, 1);
    Di.set(v, Math.sqrt(dEdXm ** 2 + dEdYm ** 2));
  }
  return Di;
}

function getLij(G, Dij) {
  let L = 0.5/Dij.get("max");
  let Lij = new Map();
  for (let u = 0; u < G.nodes; u++) {
    Lij.set(u, new Map());
    for (let v = 0; v<G.nodes; v++) {
      if (u != v) {
        Lij.get(u).set(v, L * Dij.get(u).get(v));
      }
    }
  }
  return Lij;
}

function KamadaKawaLayout(G) {
  const tol = 10^(-5);
  let Dij = Graph.getAPSP(G);
  let Lij = getLij(G, Dij);
  let Kij = getKij(G, Dij);
  // Initialize with a random layout
  let layout = randomLayout(G);
  let Delta_i = getDi(G, pos, Kij, Lij);
  // get the node with the highest value Di
  let maxm = [...Delta_i.entries()].reduce((a, e) => e[1] > a[1] ? e : a)[0];
}
