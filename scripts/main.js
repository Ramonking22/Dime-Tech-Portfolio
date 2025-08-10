// JavaScript for interactivity: smooth scrolling, slider, gallery modal, and form handling.

document.addEventListener('DOMContentLoaded', function () {
    /* ---------------- Smooth Scrolling ---------------- */
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ---------------- Slider Logic ---------------- */
    const slidesRow = document.querySelector('.slides-row');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let current = 0;
    const visibleSlides = 2.5; // Show 2 and a half slides

    function updateSlider() {
        if (slides.length > 0) {
            const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
            slidesRow.style.transform = `translateX(-${current * slideWidth}px)`;
        }
    }

    if (prevBtn && nextBtn && slides.length > 0) {
        prevBtn.addEventListener('click', () => {
            if (current > 0) current--;
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            if (current < slides.length - visibleSlides) current++;
            updateSlider();
        });

        window.addEventListener('resize', updateSlider);
        updateSlider();
    }

    /* ---------------- Gallery Modal Logic ---------------- */
    const galleryImages = document.querySelectorAll('.gallery-img');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('gallery-modal-img');
    const modalCaption = document.getElementById('gallery-modal-caption');
    const closeBtn = document.getElementById('gallery-close');

    if (galleryImages.length > 0 && modal && modalImg && modalCaption && closeBtn) {
        galleryImages.forEach(img => {
            img.addEventListener('click', function () {
                modal.style.display = "flex";
                modalImg.src = this.src;
                modalCaption.textContent = this.alt;
            });
        });

        closeBtn.addEventListener('click', function () {
            modal.style.display = "none";
            modalImg.src = "";
            modalCaption.textContent = "";
        });

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = "none";
                modalImg.src = "";
                modalCaption.textContent = "";
            }
        });
    }
});

/* ---------------- Contact Form Handling ---------------- */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = new FormData(contactForm);

        try {
            const res = await fetch("https://formspree.io/f/mblkqyrn", {
                method: "POST",
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                alert("Message sent successfully!");
                contactForm.reset();
            } else {
                alert("Oops! Something went wrong.");
            }
        } catch (error) {
            alert("Network error. Please try again later.");
        }
    });
}
