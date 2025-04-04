document.addEventListener('DOMContentLoaded', () => {
    let currentImageIndex = 0;
    const carousel = document.querySelector('.carousel');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const totalImages = carouselItems.length;

    const updateCarousel = () => {
        carousel.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    };

    window.prevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        updateCarousel();
    };

    window.nextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateCarousel();
    };
});
