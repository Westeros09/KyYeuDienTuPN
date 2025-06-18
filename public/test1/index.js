
Fancybox.bind('[data-fancybox="gallery1"]', {
    dragToClose: false,

    Toolbar: {
        display: {
            left: ['close'],
            middle: [],
            right: [],
        },
    },

    Images: {
        zoom: false,
    },

    Thumbs: {
        // type: 'classic',
        type: 'modern',
    },

    Carousel: {
        transition: false,
        friction: 0,
    },

    on: {
        'Carousel.ready Carousel.change': (fancybox) => {
            fancybox.container.style.setProperty(
                '--bg-image',
                `url("${fancybox.getSlide().thumbSrc}")`
            );
        },
    },
});

const toggleBtn = document.getElementById('toggleBtn');
const hiddenBoxes = document.querySelectorAll('#macy .box:nth-child(n+11)');

toggleBtn.addEventListener('click', () => {
    const isHidden = hiddenBoxes[0].classList.contains('hidden');

    hiddenBoxes.forEach(box => {
        box.classList.toggle('hidden');
    });

    toggleBtn.textContent = isHidden ? 'Rút gọn' : 'Xem thêm';
    macy.runOnImageLoad(function () {
        macy.recalculate(true, true);
    }, true);
});
