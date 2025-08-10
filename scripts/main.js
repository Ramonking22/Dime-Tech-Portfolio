document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Slider functionality
    const slidesRow = document.querySelector('.slides-row');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let current = 0;
    const visibleSlides = 2.5;

    function updateSlider() {
        if (slides.length > 0) {
            const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
            slidesRow.style.transform = `translateX(-${current * slideWidth}px)`;
        }
    }

    prevBtn?.addEventListener('click', () => {
        if (current > 0) current--;
        updateSlider();
    });

    nextBtn?.addEventListener('click', () => {
        if (current < slides.length - visibleSlides) current++;
        updateSlider();
    });

    window.addEventListener('resize', updateSlider);
    updateSlider();

    // Gallery modal logic
    const galleryImages = document.querySelectorAll('.gallery-img');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('gallery-modal-img');
    const modalCaption = document.getElementById('gallery-modal-caption');
    const closeBtn = document.getElementById('gallery-close');

    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            modalCaption.textContent = this.alt;
        });
    });

    closeBtn?.addEventListener('click', () => {
        modal.style.display = "none";
        modalImg.src = "";
        modalCaption.textContent = "";
    });

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            modalImg.src = "";
            modalCaption.textContent = "";
        }
    });

    // Contact form submission (prevent duplicate sends)
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (contactForm.dataset.submitting === "true") return; // prevent double send
            contactForm.dataset.submitting = "true";

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
                alert("An error occurred. Please try again.");
            } finally {
                contactForm.dataset.submitting = "false";
            }
        });
    }
});
