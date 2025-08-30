// main.js – All interactivity, slider, FAQ, menu, payments, etc.

document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       Smooth Scrolling
    ========================== */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* =========================
       Contact Form
    ========================== */
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", async e => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            try {
                const res = await fetch("/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message })
                });
                const data = await res.json();
                alert(data.message || "✅ Message sent successfully!");
                form.reset();
            } catch (err) {
                console.error("Form error:", err);
                alert("❌ Could not send message. Please try again.");
            }
        });
    }

    /* =========================
       Slider (Our Work)
    ========================== */
    const slidesRow = document.querySelector(".slides-row");
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".slider-btn.prev");
    const nextBtn = document.querySelector(".slider-btn.next");
    let current = 0;

    function getVisibleSlides() {
        return window.innerWidth < 768 ? 1 : 2.5;
    }

    function updateSlider() {
        if (slides.length > 0) {
            const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
            slidesRow.style.transform = `translateX(-${current * slideWidth}px)`;
        }
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
            if (current > 0) current--;
            updateSlider();
        });

        nextBtn.addEventListener("click", () => {
            if (current < slides.length - getVisibleSlides()) current++;
            updateSlider();
        });
    }

    window.addEventListener("resize", updateSlider);
    updateSlider();

    /* =========================
       Gallery Modal
    ========================== */
    const galleryImages = document.querySelectorAll(".gallery-img");
    const modal = document.getElementById("gallery-modal");
    const modalImg = document.getElementById("gallery-modal-img");
    const modalCaption = document.getElementById("gallery-modal-caption");
    const closeBtn = document.getElementById("gallery-close");

    if (galleryImages && modal) {
        galleryImages.forEach(img => {
            img.addEventListener("click", () => {
                modal.style.display = "flex";
                modalImg.src = img.src;
                modalCaption.textContent = img.alt;
            });
        });

        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        modal.addEventListener("click", e => {
            if (e.target === modal) modal.style.display = "none";
        });
    }

    /* =========================
       Mobile Navbar Toggle
    ========================== */
    const menuBtn = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".navbar-links");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            menuBtn.classList.toggle("open");
        });

        document.querySelectorAll(".navbar-links a").forEach(link => {
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
    }

    /* =========================
       FAQ Toggle
    ========================== */
    document.querySelectorAll(".faq-question").forEach(button => {
        button.addEventListener("click", () => {
            const faqItem = button.parentElement;
            const answer = faqItem.querySelector(".faq-answer");
            const icon = button.querySelector(".faq-icon");

            faqItem.classList.toggle("open");
            if (answer) answer.classList.toggle("active");
            if (icon) icon.textContent = faqItem.classList.contains("open") ? "−" : "+";
        });
    });

  /* =========================
   Flutterwave Payment with Auto Currency
========================== */

/* =========================
   Currency Selector + Auto Detect
========================== */
const currencySelector = document.getElementById("currency");
let selectedCurrency = "USD"; // default

// Detect user location if Auto selected
async function detectCurrency() {
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data && data.country_code === "NG") {
            return "NGN";
        }
        return "USD";
    } catch (err) {
        console.error("Location detection failed:", err);
        return "USD"; // fallback
    }
}

// Convert prices dynamically
async function updatePrices() {
    let currency = currencySelector.value;

    if (currency === "auto") {
        currency = await detectCurrency();
    }
    selectedCurrency = currency;

    document.querySelectorAll(".pay-service").forEach(btn => {
        const baseAmount = parseInt(btn.getAttribute("data-amount"), 10);
        const priceTag = btn.parentElement.querySelector(".price-tag");

        if (currency === "NGN") {
            // Convert using a fixed rate for now (you can replace with API)
            const ngnAmount = Math.round(baseAmount * 1500); // example: 1 USD = ₦1500
            priceTag.textContent = `₦${ngnAmount.toLocaleString()}`;
            btn.setAttribute("data-final-amount", ngnAmount);
        } else {
            priceTag.textContent = `$${baseAmount}`;
            btn.setAttribute("data-final-amount", baseAmount);
        }
    });
}

// Listen for manual currency change
if (currencySelector) {
    currencySelector.addEventListener("change", updatePrices);
}

// Run once on page load
updatePrices();

/* =========================
   Override Payment Buttons
========================== */
document.querySelectorAll(".pay-service").forEach(button => {
    button.addEventListener("click", async () => {
        const serviceName = button.getAttribute("data-service");
        const amount = parseInt(button.getAttribute("data-final-amount"), 10);

        const name = document.getElementById("name")?.value.trim() || "DimeTech Client";
        const email = document.getElementById("email")?.value.trim() || "dimetechacademy@gmail.com";

        FlutterwaveCheckout({
            public_key: "FLWPUBK-5371eca8e52f6277d44f696effabbdf7-X",
            tx_ref: "tx_" + Date.now(),
            amount: amount,
            currency: selectedCurrency,
            payment_options: "card, banktransfer, ussd",
            customer: { email, name },
            callback: function (response) {
                console.log("Payment response:", response);
                if (response.status && response.status.toLowerCase().includes("success")) {
                    alert(`🎉 Payment Successful for ${serviceName}!`);
                } else {
                    alert("❌ Payment Failed: " + response.status);
                }
            },
            onclose: function () {
                console.log("Payment modal closed.");
            }
        });
    });
});
