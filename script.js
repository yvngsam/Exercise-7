'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.gallery__track');
    const items = Array.from(document.querySelectorAll('.gallery__item'));
    const previousButton = document.querySelector('.gallery__arrow--prev');
    const nextButton = document.querySelector('.gallery__arrow--next');
    const pagination = document.querySelector('.gallery__pagination');
    const status = document.querySelector('.gallery__status');

    let currentPage = 0;
    let visibleCount = getVisibleCount();

    function getVisibleCount() {
        return window.matchMedia('(max-width: 600px)').matches ? 1 : 3;
    }

    function getPageCount() {
        return Math.ceil((items.length - visibleCount) / visibleCount) + 1;
    }

    function getPageStart(page) {
        return Math.min(page * visibleCount, items.length - visibleCount);
    }

    function renderPagination() {
        pagination.innerHTML = '';
        const pageCount = getPageCount();

        for (let i = 0; i < pageCount; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'gallery__dot';
            dot.setAttribute('aria-label', 'Перейти на страницу ' + (i + 1));
            dot.addEventListener('click', function () {
                currentPage = i;
                updateGallery();
            });
            pagination.appendChild(dot);
        }
    }

    function updateGallery() {
        const pageCount = getPageCount();
        const startIndex = getPageStart(currentPage);
        const shiftPixels = items[startIndex].offsetLeft;

        track.style.transform = 'translateX(-' + shiftPixels + 'px)';

        previousButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === pageCount - 1;

        const dots = pagination.querySelectorAll('.gallery__dot');
        dots.forEach(function (dot, index) {
            dot.classList.toggle('gallery__dot--active', index === currentPage);
            if (index === currentPage) {
                dot.setAttribute('aria-current', 'page');
            } else {
                dot.removeAttribute('aria-current');
            }
        });

        status.textContent = 'Страница ' + (currentPage + 1) + ' из ' + pageCount;
    }

    previousButton.addEventListener('click', function () {
        if (currentPage > 0) {
            currentPage--;
            updateGallery();
        }
    });

    nextButton.addEventListener('click', function () {
        if (currentPage < getPageCount() - 1) {
            currentPage++;
            updateGallery();
        }
    });

    window.addEventListener('resize', function () {
        const newVisibleCount = getVisibleCount();

        if (newVisibleCount !== visibleCount) {
            visibleCount = newVisibleCount;
            currentPage = 0;
            renderPagination();
            updateGallery();
        }
    });

    renderPagination();
    updateGallery();
});
