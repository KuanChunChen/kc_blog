function createSwiper(containerSelector) {
    var totalSlides = document.querySelectorAll(`${containerSelector} .swiper-slide`).length;
    var middleSlide = Math.floor(totalSlides / 2) -1 ;

    return new Swiper(containerSelector, {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 30,
        effect: 'coverflow',
        slidesPerView: "auto",
        initialSlide: middleSlide,
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
        on: {
            slideChange: function () {
                // var activeSlideTitle = this.slides[this.activeIndex].dataset.title;
                // var activeSlideContent = this.slides[this.activeIndex].dataset.content;
                var tableContainer = document.querySelector('.table_container');
                // tableContainer.innerHTML = `<p>${activeSlideTitle}</p>${activeSlideContent}`;
            },
        },
    });
}

window.onload = function() {
    var swiper1 = createSwiper('#swiper-container-sys-app');
    var swiper2 = createSwiper('#swiper-container-car');
    var swiper3 = createSwiper('#swiper-container-wm-app');
    var swiper4 = createSwiper('#swiper-container-exercise-app');
    var swiper5 = createSwiper('#swiper-container-remote-support-app');
    var swiper6 = createSwiper('#swiper-container-kp-app');
    var swiper7 = createSwiper('#swiper-container-biz-app');
    var swiper8 = createSwiper('#swiper-container-browser-app');
}
