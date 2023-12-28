'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};


const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn=>btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1=document.querySelector('#section--1')

btnScrollTo.onclick = function(){
  //  const s1coord = section1.getBoundingClientRect()
  //  console.log(e.target.getBoundingClientRect())
  //  console.log(s1coord)
  //  window.scrollTo({
  //   left: s1coord.left + window.pageXOffset,
  //   top: s1coord.top + window.pageYOffset,
  //   behavior: 'smooth'
  //  })
  section1.scrollIntoView({behavior: 'smooth'})
}
// Tabbed component
const tabs = document.querySelectorAll('.operations__tab')
const tabs_Container = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')

tabs_Container.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');
  //Gurad clause
  if(!clicked) return '';
  tabs.forEach(t=>t.classList.remove('operations__tab--active'))
  clicked.classList.add('operations__tab--active');
  tabsContent.forEach(t=>t.classList.remove('operations__content--active'))
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})

// menu fade animation

const handle_over = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')
    siblings.forEach(el=>{
      if(el!==link) el.style.opacity= this
    })
    logo.style.opacity = this
}
}
const nav = document.querySelector('.nav')

nav.addEventListener('mouseover', handle_over.bind(0.5))
nav.addEventListener('mouseout', handle_over.bind(1))


// Sticky navigation
const header = document.querySelector('.header')
const navHeight = nav.getBoundingClientRect().height

const obsCallback = function(entries){
const [entry] = entries
if(!entry.isIntersecting){
  nav.classList.add('sticky')
}
else{
  nav.classList.remove('sticky')
}
}
const obsOptions = {
root: null,
threshold: 0,
rootMargin: `-${navHeight}px`
}
const Navobserver = new IntersectionObserver(obsCallback, obsOptions)
Navobserver.observe(header)

// Reveal sections
const allSections = document.querySelectorAll('.section')

const revealSection = function(entries, sectionObserver){
    const [entry] = entries
    if(!entry.isIntersecting){
      return 
    }
    entry.target.classList.remove('section--hidden')
    sectionObserver.unobserve(entry.target)
}
const sectionObserver = new IntersectionObserver(revealSection, {
root:null,
threshold: 0.25
})

allSections.forEach(function(section){
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})

//Lazy loading images
const imgTarget = document.querySelectorAll('img[data-src]')

const loadImg = function(entries, imgObserver){
const [entry] = entries;
console.log(entry)
if(!entry.isIntersecting) return;
entry.target.src = entry.target.dataset.src;
entry.target.addEventListener('load', function(){
  entry.target.classList.remove('lazy-img')
})
imgObserver.unobserve(entry.target)
}
const imgObserver = new IntersectionObserver(loadImg, {
root: null,
threshold: 0,
rootMargin: '200px'
})

imgTarget.forEach(img=>imgObserver.observe(img))

//slider component
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();


