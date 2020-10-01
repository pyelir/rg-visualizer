import PriorityQueue from "./pq.js";

export default class Graph {
	constructor(n) {
		this.nodes = n /* store only |V| */
		this.edges = new Map();
		for (let i = 0; i < n; i++) {
			this.edges.set(i, new Map());
		}
	}

  areAdjacent(u,v) {
		return this.edges.get(u).has(v);
	}

	/* addEdge
	 * - u,v: two nodes (represented by numbers, 0<=u,v<n
	 * - w: a weight.  For our purposes, 0 <= w < 1
	 */
	addEdge(u,v,w) {
		this.edges.get(u).set(v, w);
		this.edges.get(v).set(u, w);
	}

	getEdge(u,v) {
		return this.edges.get(u).get(v);
	}

	getNeighbors(v) {
		return this.edges.get(v);
	}

	static getGnp(n) {
		let gnp = new Graph(n);
		for (let i = 0; i < n-1; i++) {
			for (let j = i+1; j < n; j++) {
				gnp.addEdge(i, j, Math.random());
			}
		}
		return gnp;
	}

	/* Compute the minimum spanning tree of some graph G using Prim's algorithm */
	static getMST(G, startnode) {
		// Q is our min-heap that keep track of the lowest weight edge adjacent to
		// what we've built so far.
		// Pi tracks the parents of nodes we've explored
		let Q = new PriorityQueue();
		let Pi = new Map();
		for (let i = 0; i < G.nodes; i++) {
			Q.heap_insert(i, Infinity);
			Pi.set(i, null);
		}
		Q.decrease_key(startnode, 0);
		while (!Q.is_empty()) {
			let u = Q.extract_min();
			for (let nbr of G.getNeighbors(u)) {
				let w = nbr[1];
				let v = nbr[0];
				if (Q.contains(v)) {
					if (Q.getkey(v) > w) {
						Pi.set(v, u);
						Q.decrease_key(v, w);
					}
				}
			}
		}
		return Graph.build_MST(G, Pi);
	}

	static build_MST(G, Pi) {
		let H = new Graph(G.nodes);
		for (let e of Pi) {
			if (e[1] != null) {
				H.addEdge(e[0], e[1], G.getEdge(e[0],e[1]));
			}
		}
		return H;
	}

	static getAPSP(G) {
		let apsp = new Map();
		for (let v = 0; v < G.nodes; v++) {
			let BFSDs = Graph.getBFSDs(G, v);
			apsp.set(v, BFSDs);
		}
		return apsp;
	}

	static getBFSDs(G, s) {
		let colors = new Map();
		let pi = new Map();
		let D = new Map();
		for (let u = 0; u < G.nodes; u++) {
			if (u != s) {
				colors.set(u, "white");
				D.set(u, Infinity);
				pi.set(u, null);
			}
		}
		colors.set(s, "gray"); D.set(s, 0); pi.set(s, null);
		let Q = new Queue();
		Q.enqueue(s);
		while (!Q.isEmpty()) {
			let u = Q.dequeue();
			for (let v of G.getNeighbors(u).keys()) {
				if (colors.get(v) == "white") {
					colors.set(v, "gray");
					D.set(v, D.get(u) + 1);
					pi.set(v, u);
					Q.enqueue(v);
				}
			}
			colors.set(u, "black");
		}
		return D;
	}

}

class Queue {
	constructor() {
		this.elems = [];
	}

	dequeue() {
		let elem = this.elems[0];
		this.elems = this.elems.slice(1,);
		return elem;

	}

	enqueue(elem) {
		this.elems.push(elem);
	}

	isEmpty() {
		return this.elems.length == 0;
	}
}

// let test = Graph.getGnp(10);
// let m = Graph.getMST(test, 0);
// console.log(Graph.getAPSP(m));
