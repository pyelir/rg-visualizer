
class PriorityQueue {
  constructor() {
    /* every element is an Object {key, obj} */
    this.elems = [];
    /* using this as a map obj -> index of Ojbect holding obj in this.elems */
    this.indices = {};
    /* just length of this.elems but maintaining for convenience */
    this.heapsize = 0;
  }

  /* parent, left, and right are helper functions for index calculations */
  parent(idx) {
    return Math.floor(idx/2);
  }

  left(idx) {
    return 2*idx;
  }

  right(idx) {
    return 2*idx + 1;
  }

  /* min-heapify assumes that left and right children of index i are
     well-mannered binary min-heaps, but that i might be larger than one of its
     children.  it'll correct such a heap, if necessary.  */

  min_heapify(i) {
    let l = this.left(i);
    let r = this.right(i);
    if ((l <= this.heapsize) && (this.elems[l].key < this.elems[i].key)) {
      let smallest = l;
    } else {
      let smallest = i;
    }
    if ((r <= this.heapsize) && (this.elems[r].key < this.elems[i].key)) {
      smallest = r;
    }
    if (smallest != i) {
      let tmp = this.elems[smallest];
      this.elems[smallest] = this.elems[i];
      this.elems[i] = tmp;
      min_heapify(smallest);
    }
  }
  

}
