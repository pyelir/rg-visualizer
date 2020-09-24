
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
    let smallest;
    /* Contorted logic to handle cases where left or right subchildren
       don't exist */
    if (l < this.heapsize) {
      if (this.elems[l].key < this.elems[i].key) {
        smallest = l;
      }
      else {
        smallest = i;
      }
    } else {
      smallest = i;
    }
    if (r < this.heapsize) {
       if (this.elems[r].key < this.elems[i].key) {
         smallest = r;
       }
    }
    if (smallest != i) {
      let tmp = this.elems[smallest];
      this.elems[smallest] = this.elems[i];
      this.elems[i] = tmp;

      /* If we switched anything, keep track of the indices */
      this.indices[this.elems[i].obj] = i;
      this.indices[this.elems[smallest].obj] = smallest;
      min_heapify(smallest);
    }
  }

  extract_min() {
    if (this.heapsize < 1) {
      throw "heap underflow";
    }

    let min = this.elems[0];
    this.elems[0] = this.elems[this.heapsize - 1];
    this.heapsize--;
    this.elems = this.elems.slice(0,-1);
    this.min_heapify(0);
    return min;
  }

  decrease_key(obj, newkey) {
    let i = this.indices[obj];
    if (newkey > this.elems[i].key) {
      throw "new key bigger than old key";
    }
    this.elems[i].key = newkey;
    while ((i > 0) && (this.elems[this.parent(i)].key < this.elems[i].key)) {
      let tmp = this.elems[this.parent(i)];
      this.elems[this.parent(i)] = this.elems[i];
      this.elems[i] = tmp;

      /* If we switched anything, keep track of the indices */
      this.indices[this.elems[i].obj] = i;
      this.indices[this.elems[this.parent(i)].obj] = this.parent(i);
      i = this.parent(i);
    }
  }

  heap_insert(elem,key) {
      this.heapsize++;
      this.elems[this.heapsize - 1] = {'obj': elem, 'key': Infinity};
      this.indices[elem] = this.heapsize - 1;
      this.decrease_key(elem, key);
  }

}

let test = new PriorityQueue();
test.heap_insert("apple", 6);
test.heap_insert("banana", 4);
test.heap_insert("orange", 7);
test.heap_insert("persimmon", 2.0001);
test.decrease_key("orange", 2);
console.log(test.extract_min());
console.log(test.extract_min());
console.log(test.extract_min());
