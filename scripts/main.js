// This file contains JavaScript code for interactivity on the site, such as handling form submissions, smooth scrolling for navigation, and any dynamic content updates.

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
            // Here you can handle the form data, e.g., send it to a server
            alert('Thank you for your submission! We will get back to you soon.');
            form.reset(); // Reset the form after submission
        });
    }

    // Dynamic content updates can be added here

    const slidesRow = document.querySelector('.slides-row');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let current = 0;
    const visibleSlides = 2.5; // Show 2 and a half slides

    function updateSlider() {
        const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
        slidesRow.style.transform = `translateX(-${current * slideWidth}px)`;
    }

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

    closeBtn.addEventListener('click', function() {
        modal.style.display = "none";
        modalImg.src = "";
        modalCaption.textContent = "";
    });

    // Optional: close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
            modalImg.src = "";
            modalCaption.textContent = "";
        }
    });
});


// Contact form submission handling
document.getElementById("contactForm").addEventListener("submit", async (e) => {
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
});

document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".navbar-links");
    const navLinks = document.querySelectorAll(".navbar-links a");

    // Toggle menu open/close
    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuBtn.classList.toggle("open");
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            menuBtn.classList.remove("open");
        });
    });

    // Close menu when scrolling
    window.addEventListener("scroll", () => {
        if (navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
            menuBtn.classList.remove("open");
        }
    });
});

// FAQ toggle
document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
        button.classList.toggle("active");
        const answer = button.nextElementSibling;
        if (answer.style.display === "block") {
            answer.style.display = "none";
        } else {
            answer.style.display = "block";
        }
    });
});
