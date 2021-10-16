import '@babel/polyfill'
import Swiper from 'swiper/swiper-bundle.js'
import 'flatpickr/dist/flatpickr'


if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}


const mySwiper = new Swiper('.comments__slider', {
	navigation: {
		nextEl: '.slider__button-next',
		prevEl: '.slider__button-prev',
	},
	effect: 'fade',
	fadeEffect: {
    crossFade: true
  },
	spaceBetween: 30,
	slidesPerView: 1
})

const swiperPrev = document.querySelector('.comments-slider__button-prev')
const swiperNext = document.querySelector('.comments-slider__button-next')

swiperPrev.addEventListener('click', () => {
  mySwiper.slidePrev()
})
swiperNext.addEventListener('click', () => {
  mySwiper.slideNext()
})

// 

// Anchors
const anchors = document.querySelectorAll('.anchor')
const htmlBody = document.querySelector('html, body')

for(let anchor of anchors) {
  anchor.addEventListener("click", function(e) {
    e.preventDefault() // Предотвратить стандартное поведение ссылок
    // Атрибут href у ссылки, если его нет то перейти к body (наверх не плавно)
    const goto = anchor.hasAttribute('href') ? anchor.getAttribute('href') : 'body'
    // Плавная прокрутка до элемента с id = href у ссылки
    document.querySelector(goto).scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  })
}

// 

// 
// Pop-ups
// 

const body   		= document.body
const btn    		= document.querySelectorAll('.pop-up__btn')
const inputs 		= document.querySelectorAll('.pop-up__form input')
const date   		= document.querySelector('.pop-up__form-inputdate')
const popup  		= document.querySelector('.pop-up')
const close     = document.querySelector('.pop-up__close-btn')
const popupMask = document.querySelector('.pop-up__mask')
const timeout   = 300

// Body Lock func
function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px'

	body.style.paddingRight = lockPaddingValue
	body.classList.add('body--lock')
}

// Body Unlock func
function bodyUnLock() {
	setTimeout(function() {
		body.style.paddingRight = '0px'
		body.classList.remove('body--lock')
	}, timeout)
}

// Add class active
btn.forEach(element => {
	element.onclick = function() {
		popup.classList.add('pop-up--active')
		bodyLock()
	}
})

// Close on Escape
btn.forEach(element => {
	element.addEventListener('keydown', function(event) {
		if(event.keyCode == '27'){
			popup.classList.remove('pop-up--active')
			bodyUnLock()
		}
	})
})

// Close btn 
close.onclick = function() {
	popup.classList.remove('pop-up--active')
	bodyUnLock()
	setTimeout(function() {
		// Inputs Clear
		inputs.forEach((e) => {
			e.value = ""
		})

		date.classList.remove('pop-up__form-inputdate--active')
	}, 300)
}

// Close on background
popupMask.onclick = function() {
	popup.classList.remove('pop-up--active')
	bodyUnLock()
}

// Burger

const burger 		 = document.querySelector('.header__burger')
const mobileMenu = document.querySelector('.mobile-menu')

burger.onclick = function() {
	mobileMenu.classList.toggle('mobile-menu--active')
	bodyLock()

	// Close on background
	document.addEventListener('click', e => {
		let target = e.target;
		let itsMenu = target == mobileMenu || mobileMenu.contains(target);
		let itsBurger = target == burger;
		let menuIsActive = mobileMenu.classList.contains('mobile-menu--active');
		
		if (!itsMenu && !itsBurger && menuIsActive) {
			mobileMenu.classList.remove('mobile-menu--active')
			bodyUnLock()
		}
	})
}
// 

// Burger Close Btn 
const closeBtn = document.querySelector('.mobile-menu__close-btn')

closeBtn.onclick = function() {
	mobileMenu.classList.remove('mobile-menu--active')
	bodyUnLock()
}

// Burger Close on Esc
burger.addEventListener('keydown', function(event) {
	if(event.keyCode == '27'){
		mobileMenu.classList.remove('mobile-menu--active')
		bodyUnLock()
	}
})
//

// Flatpickr Plugin for Datepicker
flatpickr(date, {
  disableMobile: "true"
})

// Date event listener 
date.addEventListener('change', function() {
	if(date.value !== ""){
		date.classList.add('pop-up__form-inputdate--active')
	} else {
		date.classList.remove('pop-up__form-inputdate--active')
	}
})


