window.addEventListener('load', function(){
let icon = document.querySelector('.icon')
let nav_ul = document.querySelector('.header ul')
let image = document.querySelector('.icon img')
let nav_tag = document.querySelector('nav.header')

icon.onclick = function(){
    this.classList.toggle('show2')
    if(icon.classList.contains('show2')){
       image.setAttribute('src', './images/XOutline.png')
       nav_ul.classList.add('show1')
    }
    else{
        image.setAttribute('src', './images/MenuAlt4Outline.svg')
        nav_ul.classList.remove('show1')
    }
}
window.addEventListener('resize', function(){
if(icon.classList.contains('show2')){
    image.setAttribute('src', './../images/MenuAlt4Outline.svg')
    nav_ul.classList.remove('show1')
    icon.classList.remove('show2')
}
})

// fixed to top navigation
const header = document.querySelector('header')
const navHeight = nav_tag.getBoundingClientRect().height

const obsCallback = function(entries){
const [entry] = entries
if(!entry.isIntersecting){
  nav_tag.classList.add('scroll')
}
else{
  nav_tag.classList.remove('scroll')
}
}
const obsOptions = {
root: null,
threshold: 0,
rootMargin: `-${navHeight}px`
}
const Navobserver = new IntersectionObserver(obsCallback, obsOptions)
Navobserver.observe(header)

// animation scrolling
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

})