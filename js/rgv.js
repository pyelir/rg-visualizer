/* Random graph visualizer JS scripts
 * By: Riley Price
 * Date: Sept. 18, 2020
 */

let slider = document.getElementById("pval");
let output = document.getElementById("view");
output.appendChild(document.createTextNode(slider.value));
slider.addEventListener("input", () => {
  output.removeChild(output.childNodes[0]);
  output.appendChild(document.createTextNode(slider.value));
});

