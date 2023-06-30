var totalSlides = document.querySelectorAll('.swiper-container.two .swiper-slide').length;
var middleSlide = Math.floor(totalSlides / 2) -1 ;

var swiper = new Swiper('.swiper-container.two', {
    slidesPerView: 3,
    centeredSlides: true,
    spaceBetween: 30,
    effect: 'coverflow',
		slidesPerView: "auto",
		initialSlide: middleSlide,  // Set the middle slide as the initial slide

		coverflowEffect: {
			rotate: 15,
			stretch: 0,
			depth: 300,
			modifier: 1,
			slideShadows: true,
		},
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});
