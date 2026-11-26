const content = document.querySelector('.content'); // camera / scroll container
const world   = document.querySelector('.world');   // 6000x6000 map

/* ---------- Start centered on the map ---------- */
function centerView() {
  content.scrollLeft = (world.offsetWidth  - content.clientWidth)  / 2;
  content.scrollTop  = (world.offsetHeight - content.clientHeight) / 2;
}

if (document.readyState === 'complete') {
  centerView();
} else {
  window.addEventListener('load', centerView);
}

/* ---------- Drag to pan ---------- */
let isDragging = false;
let moved = false;
let startX = 0;
let startY = 0;
let startScrollLeft = 0;
let startScrollTop = 0;

content.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;

  isDragging = true;
  moved = false;
  startX = e.clientX;
  startY = e.clientY;
  startScrollLeft = content.scrollLeft;
  startScrollTop  = content.scrollTop;
  content.classList.add('dragging');
});

window.addEventListener('pointermove', (e) => {
  if (!isDragging) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  if (!moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
    moved = true;
    content.setPointerCapture?.(e.pointerId);
  }

  content.scrollLeft = startScrollLeft - dx;
  content.scrollTop  = startScrollTop  - dy;
});

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  content.classList.remove('dragging');
  if (content.hasPointerCapture?.(/* id */)) {}
}
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);

/* Suppress the click that ends a drag */
content.addEventListener('click', (e) => {
  if (moved) {
    e.stopPropagation();
    e.preventDefault();
    moved = false;
  }
}, true);