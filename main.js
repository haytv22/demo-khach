

const buttonHide = document.querySelector('.sticky-button');
buttonHide.addEventListener('click', () => {
    const sticky = document.querySelector('.sticky-container');
    const bntMuiTen = document.querySelector('.sticky-button');
    sticky.classList.toggle('hidden');
    bntMuiTen.classList.toggle('hidden');
});


// Xử lý menu-active cho table-right-menu_item
document.querySelectorAll('.table-right-menu_item').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelectorAll('.table-right-menu_item').forEach(i => i.classList.remove('menu-active'));
        this.classList.add('menu-active');
    });
});






// Slider functionality
const slides = document.querySelectorAll('.slide-item');
const dots = document.querySelectorAll('.control-dots-item');
let current = 0;

function updateSlides() {
  slides.forEach((slide, i) => {
    slide.addEventListener('dragstart', e => e.preventDefault());
    slide.classList.remove('left', 'right', 'active');
    if (i === current) {
      slide.classList.add('active');
    } else if (i === (current - 1 + slides.length) % slides.length) {
      slide.classList.add('left');
    } else if (i === (current + 1) % slides.length) {
      slide.classList.add('right');
    } 
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  updateSlides(); // <-- GỌI SAU KHI DOM LOAD XONG
});
document.querySelector('.control-arrow-item.next').addEventListener('click', () => {
  current = (current + 1) % slides.length;
  updateSlides();
});

document.querySelector('.control-arrow-item.back').addEventListener('click', () => {
  current = (current - 1 + slides.length) % slides.length;
  updateSlides();
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    current = i;
    updateSlides();
  });
});

let startX = 0;
document.querySelector('.container-slides').addEventListener('mousedown', e => {
  console.log(e.clientX);
  startX = e.clientX;
});

document.querySelector('.container-slides').addEventListener('mouseup', e => {
  console.log(e.clientX);
  if (e.clientX - startX > 50) {
    current = (current - 1 + slides.length) % slides.length;
  } else if (startX - e.clientX > 50) {
    current = (current + 1) % slides.length;
  }
  updateSlides();
});


// xử lý slide kéo thả
const slideDrag = ()=>{
  const sliderTrack = document.getElementById("sliderTrack");
  const dotsContainer = document.getElementById("dots");

  let slides = Array.from(document.querySelectorAll(".item2-track-slide"));
  slides.forEach(slide => {
    slide.addEventListener('dragstart', e => e.preventDefault());
  });
  // Clone đầu & cuối
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.classList.add("clone");
  lastClone.classList.add("clone");

  // Gắn clone vào DOM
  sliderTrack.appendChild(firstClone);
  sliderTrack.insertBefore(lastClone, slides[0]);

  // Cập nhật lại slides (gồm cả clone)
  slides = Array.from(document.querySelectorAll(".item2-track-slide"));

  let currentIndex = 1; // Bắt đầu ở slide thật đầu tiên
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;
  let slideWidth = slides[0].offsetWidth;

  // Tạo dot cho slide thật (bỏ clone)
  for (let i = 1; i < slides.length - 1; i++) {
    const dot = document.createElement("div");
    dot.classList.add("table-left-item2-dot");
    if (i === 1) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  // Gán sự kiện
  sliderTrack.addEventListener("mousedown", startDrag);
  sliderTrack.addEventListener("mouseup", endDrag);
  sliderTrack.addEventListener("mouseleave", endDrag);
  sliderTrack.addEventListener("mousemove", drag);
  sliderTrack.addEventListener("touchstart", startDrag);
  sliderTrack.addEventListener("touchend", endDrag);
  sliderTrack.addEventListener("touchmove", drag);

  function startDrag(e) {
    isDragging = true;
    startPos = getPositionX(e);
    animationID = requestAnimationFrame(animation);
  }

  function drag(e) {
    if (!isDragging) return;
    const currentPosition = getPositionX(e);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100) currentIndex++;
    if (movedBy > 100) currentIndex--;

    moveToCurrentIndex();
  }

  function moveToCurrentIndex() {
    sliderTrack.style.transition = "transform 0.3s ease";
    currentTranslate = -slideWidth * currentIndex;
    prevTranslate = currentTranslate;
    setSliderPosition();
    updateDots();

    sliderTrack.addEventListener("transitionend", handleLoop, { once: true });
  }

  function handleLoop() {
    sliderTrack.style.transition = "none";

    if (slides[currentIndex].classList.contains("clone")) {
      if (currentIndex === 0) {
        currentIndex = slides.length - 2;
      } else if (currentIndex === slides.length - 1) {
        currentIndex = 1;
      }
      currentTranslate = -slideWidth * currentIndex;
      prevTranslate = currentTranslate;
      setSliderPosition();
      updateDots();
    }
  }

  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  function setSliderPosition() {
    sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
  }

  function getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }

  function goToSlide(index) {
    currentIndex = index;
    moveToCurrentIndex();
  }

  function updateDots() {
    const dots = document.querySelectorAll(".table-left-item2-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex - 1);
    });
  }

  window.addEventListener("resize", () => {
    slideWidth = slides[0].offsetWidth;
    currentTranslate = -slideWidth * currentIndex;
    prevTranslate = currentTranslate;
    setSliderPosition();
  });

  // Khởi tạo vị trí slide đầu tiên
  window.addEventListener("load", () => {
    slideWidth = slides[0].offsetWidth;
    currentTranslate = -slideWidth * currentIndex;
    prevTranslate = currentTranslate;
    setSliderPosition();
  });
}
slideDrag(); // Gọi hàm slideDrag để khởi tạo slider kéo thả

const menuIcon = document.querySelector('.mobile-container-menu-icon')
const menuMobile = document.querySelector('.mobile-container-menu');

menuIcon.addEventListener('click', () => {
  menuMobile.style.display = menuMobile.style.display === 'flex' ? 'none' : 'flex';
});