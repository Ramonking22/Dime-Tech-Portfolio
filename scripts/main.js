document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Handle form submission
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            alert('Thank you for your submission! We will get back to you soon.');
            form.reset();
        });
    }

    // Slider logic
    const slidesRow = document.querySelector('.slides-row');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let current = 0;

    function updateSlider() {
        if (!slidesRow) return;
        const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
        slidesRow.style.transform = `translateX(-${current * slideWidth}px)`;
    }

    prevBtn?.addEventListener('click', () => {
        if (current > 0) current--;
        updateSlider();
    });

    nextBtn?.addEventListener('click', () => {
        if (current < slides.length - 1) current++;
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
            modalImg.classList.add('zoom-in'); // add fade/zoom effect
        });
    });

    closeBtn?.addEventListener('click', () => {
        modal.style.display = "none";
        modalImg.src = "";
        modalCaption.textContent = "";
        modalImg.classList.remove('zoom-in');
    });

    modal?.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
            modalImg.src = "";
            modalCaption.textContent = "";
            modalImg.classList.remove('zoom-in');
        }
    });

    // Contact form submission
    const contactForm = document.getElementById("contactForm");
    contactForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        const res = await fetch("/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message })
        });

        const data = await res.json();
        alert(data.message);
        contactForm.reset();
    });

    // Mobile menu
    const menuBtn = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".navbar-links");
    const navLinks = document.querySelectorAll(".navbar-links a");

    menuBtn?.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuBtn.classList.toggle("open");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            menuBtn.classList.remove("open");
        });
    });

    window.addEventListener("scroll", () => {
        if (navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
            menuBtn.classList.remove("open");
        }
    });

    // FAQ toggle with smooth slide
document.querySelectorAll(".faq-question").forEach(button => {
    const answer = button.nextElementSibling;
    answer.style.maxHeight = "0";
    answer.style.overflow = "hidden";
    answer.style.transition = "max-height 0.35s ease";

    button.addEventListener("click", () => {
        button.classList.toggle("active");
        if (button.classList.contains("active")) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = "0";
        }
    });
});

});
