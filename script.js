const svg = document.querySelector("svg");
let activeColor = "#181425";
let isMouseDown = false;
let mode = "draw";
const count = 16 * 16;
const exportTextarea = document.querySelector("#export");
const importTextarea = document.querySelector("#import");

const svgHistory = [];
const usesMap = new Map();

function createSVGElement(name) {
  // The NS (namespace) is important for SVGs
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

function createFrame(frameData) {
  const g = createSVGElement("g");

  for (let i = 0; i < count; i++) {
    const use = createSVGElement("use");
    use.setAttribute("href", "#p");

    const x = i % 16;
    if (x > 0) use.setAttribute("x", x);

    const y = Math.floor(i / 16);
    if (y > 0) use.setAttribute("y", y);

    usesMap.set(`${x},${y}`, use);

    g.appendChild(use);
  }

  svg.appendChild(g);
}

const lastFromLocalStorage = localStorage.getItem("last");
if (lastFromLocalStorage) {
  svg.innerHTML = lastFromLocalStorage;
  exportTextarea.value = getExport();
  svg.querySelectorAll("use").forEach((use) => {
    const x = use.getAttribute("x") ?? "0";
    const y = use.getAttribute("y") ?? "0";
    const key = `${x},${y}`;
    usesMap.set(key, use);
  });
} else {
  createFrame();
}

svg.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  if (!svg.contains(e.target) || e.target.tagName !== "use") return;
  svgHistory.push(svg.innerHTML);
  switch (mode) {
    case "draw": {
      e.target.setAttribute("fill", activeColor);
      exportTextarea.value = getExport();
      localStorage.setItem("last", svg.innerHTML);
      break;
    }
    case "fill": {
      const oldColor = e.target.getAttribute("fill");
      fillPixel(
        `${e.target.getAttribute("x")},${e.target.getAttribute("y")}`,
        oldColor,
        activeColor
      );
      exportTextarea.value = getExport();
      localStorage.setItem("last", svg.innerHTML);
      break;
    }
  }
});

svg.addEventListener("mousemove", (e) => {
  if (!isMouseDown) return;
  const elementsFromPoint = document.elementsFromPoint(e.clientX, e.clientY);
  elementsFromPoint.forEach((element) => {
    if (element.tagName === "use") {
      element.setAttribute("fill", activeColor);
      // Consider debouncing this
      localStorage.setItem("last", svg.innerHTML);
    }
  });
});

svg.addEventListener("mouseup", () => {
  isMouseDown = false;
});

// const colorPicker = document.querySelector("#color-picker");
// colorPicker.addEventListener("change", (e) => {
//   activeColor = e.target.value;
// });

const toolbarForm = document.querySelector("form#toolbar");
toolbarForm.addEventListener("change", (e) => {
  switch (e.target.name) {
    case "color": {
      activeColor = e.target.value;
      break;
    }
    case "mode": {
      mode = e.target.value;
      break;
    }
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
  svg.querySelectorAll("use").forEach((use) => {
    use.setAttribute("fill", "transparent");
  });
  localStorage.removeItem("last");
});

function fillPixel(key, oldColor, newColor) {
  const [x, y] = key.split(",").map((s) => parseInt(s));

  if (!usesMap.has(key)) return;

  const use = usesMap.get(key);
  const fill = use.getAttribute("fill");
  if (fill !== oldColor) return;

  use.setAttribute("fill", newColor);
  [
    [x, y + 1],
    [x, y - 1],
    [x + 1, y],
    [x - 1, y],
  ].forEach(([x, y]) => {
    fillPixel(`${x},${y}`, oldColor, newColor);
  });
}

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
palette.push("#00000080"); // 50% opaque black
palette.push("#00000040"); // 25% opaque black
palette.push("#ffffff80"); // 50% opaque white
palette.push("#ffffff40"); // 25% opaque white

let formInnerHTML = "";
palette.forEach((color, i) => {
  formInnerHTML += `
    <input id="${color}" type="radio" name="color" value="${color}" ${
    i == 0 ? "checked" : ""
  }/>
    <label aria-label="${color}" for="${color}" style="background-color: ${color}"></label>
  `;
});

activeColor = palette[0];

toolbarForm.innerHTML += `<fieldset><legend>Color</legend>${formInnerHTML}</fieldset>`;

importTextarea.addEventListener("input", (e) => {
  const string = e.target.value;
  const lines = string.split(`<use href="#p"`).slice(1);

  const map = new Map();

  lines.forEach((line) => {
    const x = line.match(/x="(\d+)"/)?.[1] ?? "0";
    const y = line.match(/y="(\d+)"/)?.[1] ?? "0";
    const fill = line.match(/fill="(#\w+)"/)?.[1] ?? "UH OH!";
    map.set(`${x},${y}`, fill);
  });

  svg.querySelectorAll("use").forEach((use) => {
    const x = use.getAttribute("x") ?? "0";
    const y = use.getAttribute("y") ?? "0";
    const key = `${x},${y}`;
    use.setAttribute("fill", map.has(key) ? map.get(key) : "transparent");
  });

  localStorage.setItem("last", svg.innerHTML);

  alert("Imported!");

  e.target.value = "";
});

function getExport() {
  let output = svg.outerHTML;
  // Remove "pixels" without fill
  output = output.replace(
    /<use href="#p"(?:\ x="\d+")?(?:\ y="\d+")?><\/use>/g,
    ""
  );
  // TODO: Combine with above
  // Remove "pixels" with transparent fill
  output = output.replace(
    /<use href="#p"(?:\ x="\d+")?(?:\ y="\d+")? fill="transparent"><\/use>/g,
    ""
  );
  // Self-close rect/use tags
  output = output.replace(/><\/(rect|use)>/g, "/>");
  // Remove extra whitespace
  output = output.replace(/>\s+</g, "><");
  return output;
}
