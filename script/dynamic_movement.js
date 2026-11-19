let mouseDown = false;
<<<<<<< HEAD
let startX = 0;
let startY = 0;
let scrollLeft = 0;
let scrollTop = 0;
const slider = document.querySelector('.world');

if (slider) {
  const startDragging = (e) => {
    mouseDown = true;

    const rect = slider.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    scrollLeft = slider.scrollLeft;
    scrollTop = slider.scrollTop;
  };

  const stopDragging = () => {
    mouseDown = false;
  };

  const move = (e) => {
    if (!mouseDown) return;

    e.preventDefault();

    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    slider.scrollLeft = scrollLeft - (x - startX);
    slider.scrollTop = scrollTop - (y - startY);
  };

  slider.addEventListener('mousemove', move);
  slider.addEventListener('mousedown', startDragging);
  slider.addEventListener('mouseup', stopDragging);
  slider.addEventListener('mouseleave', stopDragging);
}
=======
let startX, scrollLeft;
const slider = document.querySelector('.world');

const startDragging = (e) => {
  mouseDown = true;
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
}

const stopDragging = (e) => {
  mouseDown = false;
}

const move = (e) => {
  e.preventDefault();
  if(!mouseDown) { return; }
  const x = e.pageX - slider.offsetLeft;
  const scroll = x - startX;
  slider.scrollLeft = scrollLeft - scroll;
}

// Add the event listeners
slider.addEventListener('mousemove', move, false);
slider.addEventListener('mousedown', startDragging, false);
slider.addEventListener('mouseup', stopDragging, false);
slider.addEventListener('mouseleave', stopDragging, false);
>>>>>>> 0ad41df934fe04a1e5f016e9c59aae514c023ddf
