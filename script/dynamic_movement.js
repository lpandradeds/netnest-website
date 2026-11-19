let mouseDown = false;
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