const svg = document.querySelector("svg");
let activeColor = "#181425";
let isMouseDown = false;
const count = 16 * 16;

function createSVGElement(name) {
  // The NS (namespace) is important for SVGs
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

function createFrame(frameData) {
  const g = createSVGElement("g");

  for (let i = 0; i < count; i++) {
    const rect = createSVGElement("rect");
    rect.setAttribute("height", "1");
    rect.setAttribute("width", "1");
    rect.setAttribute("x", i % 16);
    rect.setAttribute("y", Math.floor(i / 16));
    g.appendChild(rect);
  }

  svg.appendChild(g);
}

createFrame();

svg.addEventListener("mousedown", (e) => {
  if (!svg.contains(e.target) || e.target.tagName !== "rect") return;
  e.target.setAttribute("fill", activeColor);
});

svg.addEventListener("mousemove", (e) => {
  // console.log(":hover", document.querySelector(":hover"));
  console.log(document.elementsFromPoint(e.clientX, e.clientY));
});

// const colorPicker = document.querySelector("#color-picker");
// colorPicker.addEventListener("change", (e) => {
//   activeColor = e.target.value;
// });

const form = document.querySelector("form");
form.addEventListener("change", e => {
  if (e.target.type === "radio") {
    activeColor = e.target.value;
  }
})

document.addEventListener("mousedown", (e) => {
  isMouseDown = true;
});

document.addEventListener("mouseup", () => {
  isMouseDown = false;
});
