const grid = document.getElementById("grid");
const furnitureItems = document.querySelectorAll(".furniture");
const resetBtn = document.getElementById("reset");
const rotateBtn = document.getElementById("rotate");
const saveBtn = document.getElementById("save");
const loadBtn = document.getElementById("load");

let selectedFurniture = null;
let isVertical = false;

const gridSize = 6;
const totalCells = gridSize * gridSize;

// Furniture sizes
const furnitureSizes = {
  bed: 2,
  desk: 2,
  chair: 1,
  dresser: 1
};

// Create grid
for (let i = 0; i < totalCells; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  grid.appendChild(cell);
}

// Select furniture
furnitureItems.forEach(item => {
  item.addEventListener("click", () => {
    furnitureItems.forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");
    selectedFurniture = item.dataset.type;
  });
});

// Rotate toggle
rotateBtn.addEventListener("click", () => {
  isVertical = !isVertical;
  rotateBtn.textContent = isVertical ? "Rotate: Vertical" : "Rotate: Horizontal";
});

// Place furniture
grid.addEventListener("click", (e) => {
  const cell = e.target.closest(".cell");
  if (!cell || !selectedFurniture) return;

  const startIndex = parseInt(cell.dataset.index);
  const size = furnitureSizes[selectedFurniture];

  let indexes = [];

  for (let i = 0; i < size; i++) {
    let newIndex;

    if (isVertical) {
      newIndex = startIndex + (i * gridSize);
    } else {
      newIndex = startIndex + i;
    }

    indexes.push(newIndex);
  }

  // Boundary checks
  if (!isVertical && (startIndex % gridSize) + size > gridSize) return;
  if (isVertical && startIndex + (size - 1) * gridSize >= totalCells) return;

  // Check for occupied cells
  for (let idx of indexes) {
    const checkCell = document.querySelector(`.cell[data-index="${idx}"]`);
    if (!checkCell || checkCell.classList.contains("occupied")) return;
  }

  // Place furniture
  indexes.forEach((idx, i) => {
    const placeCell = document.querySelector(`.cell[data-index="${idx}"]`);

    const item = document.createElement("div");
    item.classList.add("item", selectedFurniture);
    item.dataset.group = startIndex;

    // Show text only in first block
    if (i === 0) {
      item.textContent = selectedFurniture.toUpperCase();
    }

    placeCell.appendChild(item);
    placeCell.classList.add("occupied");
  });
});

// Double-click remove
grid.addEventListener("dblclick", (e) => {
  const cell = e.target.closest(".cell");
  if (!cell) return;

  const item = cell.querySelector(".item");
  if (!item) return;

  const group = item.dataset.group;

  document.querySelectorAll(`.item[data-group="${group}"]`)
    .forEach(el => {
      const parentCell = el.closest(".cell");
      parentCell.classList.remove("occupied");
      el.remove();
    });
});

// Reset
resetBtn.addEventListener("click", () => {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.innerHTML = "";
    cell.classList.remove("occupied");
  });
});

// Save
saveBtn.addEventListener("click", () => {
  const layout = [];

  document.querySelectorAll(".cell").forEach(cell => {
    const item = cell.querySelector(".item");
    if (item) {
      layout.push({
        type: item.classList[1],
        group: item.dataset.group
      });
    } else {
      layout.push(null);
    }
  });

  localStorage.setItem("dormLayout", JSON.stringify(layout));
  alert("Layout Saved");
});

// Load
loadBtn.addEventListener("click", () => {
  const saved = JSON.parse(localStorage.getItem("dormLayout"));
  if (!saved) return;

  document.querySelectorAll(".cell").forEach((cell, index) => {
    cell.innerHTML = "";
    cell.classList.remove("occupied");

    if (saved[index]) {
      const item = document.createElement("div");
      item.classList.add("item", saved[index].type);
      item.dataset.group = saved[index].group;

      // Only show text in first group cell
      if (saved[index].group == index) {
        item.textContent = saved[index].type.toUpperCase();
      }

      cell.appendChild(item);
      cell.classList.add("occupied");
    }
  });
});