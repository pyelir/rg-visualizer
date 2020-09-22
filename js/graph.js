class Graph {
	constructor(n) {
		this.nodes = n /* store only |V| */
		this.edges = {};
		for (let i = 0; i < n; i++) {
			this.edges[i] = {};
		}
	}
	
	/* addEdge
	 * - u,v: two nodes (represented by numbers, 0<=u,v<n
	 * - w: a weight.  For our purposes, 0 <= w < 1 
	 */
	addEdge(u,v,w) {
		this.edges[u][v] = w;
		this.edges[v][u] = w;
	}

	getNeighbors(v) {
		return this.edges[v];
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

}

console.log(Graph.getGnp(5).getNeighbors(3));
