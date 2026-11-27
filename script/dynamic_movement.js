const content = document.querySelector('.content');
const world = document.querySelector('.world');

/* ---------- Place containers and connect them ---------- */
function positionContainers() {
  const primary = document.querySelector('.container[data-primary]')
    || document.getElementById('login-container');
  const containers = [...document.querySelectorAll('.container')];
  const padding = 150;
  const placed = [];

  if (!primary) return;

  // The primary card is always the center point of the map.
  primary.style.left = '50%';
  primary.style.top = '50%';
  primary.style.transform = 'translate(-50%, -50%)';
  placed.push({
    element: primary,
    x: world.offsetWidth / 2,
    y: world.offsetHeight / 2,
    width: primary.offsetWidth,
    height: primary.offsetHeight
  });

  containers.filter((container) => container !== primary).forEach((container) => {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    let position;

    // Try several random positions and keep cards apart from one another.
    for (let attempt = 0; attempt < 150; attempt++) {
      const x = padding + Math.random() * (world.offsetWidth - padding * 2 - width);
      const y = padding + Math.random() * (world.offsetHeight - padding * 2 - height);

      const hasCollision = placed.some((item) => {
        const gap = 80;
        return Math.abs(x + width / 2 - item.x) < (width + item.width) / 2 + gap
          && Math.abs(y + height / 2 - item.y) < (height + item.height) / 2 + gap;
      });

      if (!hasCollision) {
        position = { x, y };
        break;
      }
    }

    if (!position) {
      position = {
        x: padding + Math.random() * (world.offsetWidth - padding * 2 - width),
        y: padding + Math.random() * (world.offsetHeight - padding * 2 - height)
      };
    }

    container.style.left = `${position.x}px`;
    container.style.top = `${position.y}px`;
    container.style.transform = 'none';
    placed.push({
      element: container,
      x: position.x + width / 2,
      y: position.y + height / 2,
      width,
      height
    });
  });

  drawConnections(placed);
}

/* ---------- Draw a minimum-spanning straight-line network ---------- */
function drawConnections(containers) {
  let network = document.getElementById('container-network');

  if (!network) {
    network = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    network.id = 'container-network';
    network.setAttribute('width', world.offsetWidth);
    network.setAttribute('height', world.offsetHeight);
    network.setAttribute('viewBox', `0 0 ${world.offsetWidth} ${world.offsetHeight}`);
    world.appendChild(network);
  }

  network.replaceChildren();
  if (containers.length < 2) return;

  // Prim's algorithm finds the shortest connected set of straight edges.
  const connected = [0];
  const remaining = containers.map((_, index) => index).slice(1);

  while (remaining.length) {
    let shortest = null;

    connected.forEach((fromIndex) => {
      remaining.forEach((toIndex) => {
        const from = containers[fromIndex];
        const to = containers[toIndex];
        const distance = Math.hypot(to.x - from.x, to.y - from.y);

        if (!shortest || distance < shortest.distance) {
          shortest = { fromIndex, toIndex, distance };
        }
      });
    });

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', containers[shortest.fromIndex].x);
    line.setAttribute('y1', containers[shortest.fromIndex].y);
    line.setAttribute('x2', containers[shortest.toIndex].x);
    line.setAttribute('y2', containers[shortest.toIndex].y);
    network.appendChild(line);

    connected.push(shortest.toIndex);
    remaining.splice(remaining.indexOf(shortest.toIndex), 1);
  }
}

/* ---------- Center the viewport on the primary container ---------- */
function centerView() {
  const primary = document.querySelector('.container[data-primary]')
    || document.getElementById('login-container');
  if (!primary) return;

  const primaryRect = primary.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();

  content.scrollLeft = primaryRect.left - contentRect.left + content.scrollLeft - content.clientWidth / 2 + primaryRect.width / 2;
  content.scrollTop = primaryRect.top - contentRect.top + content.scrollTop - content.clientHeight / 2 + primaryRect.height / 2;
}

window.addEventListener('load', () => {
  positionContainers();
  requestAnimationFrame(centerView);
});

window.addEventListener('resize', centerView);

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
  startScrollTop = content.scrollTop;
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
  content.scrollTop = startScrollTop - dy;
});

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  content.classList.remove('dragging');
}

window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);

content.addEventListener('click', (e) => {
  if (moved) {
    e.stopPropagation();
    e.preventDefault();
    moved = false;
  }
}, true);