const svg = document.querySelector("svg");
let activeColor = "#181425";
let isMouseDown = false;
const count = 16 * 16;
const outputTextarea = document.querySelector("textarea");

const svgHistory = [];

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

const lastFromLocalStorage = localStorage.getItem("last");
if (lastFromLocalStorage) {
  svg.innerHTML = lastFromLocalStorage;
} else {
  createFrame();
}

svg.addEventListener("mousedown", (e) => {
  if (!svg.contains(e.target) || e.target.tagName !== "rect") return;
  svgHistory.push(svg.innerHTML);
  e.target.setAttribute("fill", activeColor);
  outputTextarea.value = svg.outerHTML;
  localStorage.setItem("last", svg.innerHTML);
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
form.addEventListener("change", (e) => {
  if (e.target.type === "radio") {
    activeColor = e.target.value;
  }
});

document.addEventListener("mousedown", (e) => {
  isMouseDown = true;
});

document.addEventListener("mouseup", () => {
  isMouseDown = false;
});

const clearTool = document.querySelector("[data-tool=clear]");
clearTool.addEventListener("click", () => {
  svg.querySelectorAll("rect").forEach((rect) => {
    rect.setAttribute("fill", "transparent");
  });
});

document.addEventListener("keyup", (e) => {
  if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
    const last = svgHistory.pop();
    if (last) svg.innerHTML = last;
  }
});

// https://lospec.com/palette-list/endesga-32
const palette = [
  "#be4a2f",
  "#d77643",
  "#ead4aa",
  "#e4a672",
  "#b86f50",
  "#733e39",
  "#3e2731",
  "#a22633",
  "#e43b44",
  "#f77622",
  "#feae34",
  "#fee761",
  "#63c74d",
  "#3e8948",
  "#265c42",
  "#193c3e",
  "#124e89",
  "#0099db",
  "#2ce8f5",
  "#ffffff",
  "#c0cbdc",
  "#8b9bb4",
  "#5a6988",
  "#3a4466",
  "#262b44",
  "#181425",
  "#ff0044",
  "#68386c",
  "#b55088",
  "#f6757a",
  "#e8b796",
  "#c28569",
];

palette.push("transparent");

let formInnerHTML = "";
palette.forEach((color, i) => {
  formInnerHTML += `
    <input id="${color}" type="radio" name="color" value="${color}" ${
    i == 0 ? "checked" : ""
  }/>
    <label aria-label="${color}" for="${color}" style="background-color: ${color}"></label>
  `;
});

form.innerHTML = formInnerHTML;
