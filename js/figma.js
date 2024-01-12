window.addEventListener('load', function(){
let open_icon = document.querySelector('.open_menu')
let close_icon = document.querySelector('.close_menu')
let nav_ul = document.querySelector('.header ul')
let nav_tag = document.querySelector('nav.header')

open_icon.onclick = function(){
    nav_ul.classList.add('show1')
    close_icon.classList.add('show')
}
close_icon.onclick = function(){
    nav_ul.classList.remove('show1')
    this.classList.remove('show')
}
window.addEventListener('resize', function(){
if(close_icon.classList.contains('show')){
    close_icon.classList.remove('show')
    nav_ul.classList.remove('show1')
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
