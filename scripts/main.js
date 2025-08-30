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
   Currency Detection + Flutterwave Payment
========================== */

let usdToNgnRate = null;
let userCurrency = "USD"; // default
let userCountry = "INTL"; // default

// 1. Fetch NGN conversion rate
async function fetchRate() {
    try {
        const res = await fetch("https://api.exchangerate.host/convert?from=USD&to=NGN");
        const data = await res.json();
        if (data && data.result) {
            usdToNgnRate = data.result;
        }
    } catch (err) {
        console.error("Failed to fetch conversion rate:", err);
    }
}

// 2. Detect user location
async function detectLocation() {
    try {
        const res = await fetch("https://ipapi.co/json/"); // free IP location API
        const data = await res.json();
        if (data && data.country_code) {
            userCountry = data.country_code;
            if (userCountry === "NG") {
                userCurrency = "NGN";
            } else {
                userCurrency = "USD";
            }
        }
    } catch (err) {
        console.error("Failed to detect location:", err);
    }
}

// 3. Initialize (fetch rate + location before updating buttons)
async function initPayments() {
    await Promise.all([fetchRate(), detectLocation()]);

    const serviceButtons = document.querySelectorAll(".pay-service");
    serviceButtons.forEach(button => {
        const amountUSD = parseInt(button.getAttribute("data-amount"), 10);

        let displayLabel = "";

        if (userCurrency === "NGN") {
            if (usdToNgnRate) {
                displayLabel = `Pay ₦${Math.round(amountUSD * usdToNgnRate).toLocaleString()}`;
            } else {
                displayLabel = "Pay NGN (loading...)";
            }
        } else {
            if (amountUSD > 1000 && usdToNgnRate) {
                displayLabel = `Pay ₦${Math.round(amountUSD * usdToNgnRate).toLocaleString()}`;
            } else {
                displayLabel = `Pay $${amountUSD}`;
            }
        }

        button.textContent = displayLabel;

        // Payment handler
        button.addEventListener("click", async () => {
            let currency = userCurrency;
            let amount = amountUSD;

            if (currency === "NGN" || amountUSD > 1000) {
                if (!usdToNgnRate) {
                    await fetchRate();
                }
                if (usdToNgnRate) {
                    currency = "NGN";
                    amount = Math.round(amountUSD * usdToNgnRate);
                } else {
                    alert("❌ Could not fetch conversion rate. Try again.");
                    return;
                }
            }

            const name = document.getElementById("name")?.value.trim() || "DimeTech Client";
            const email = document.getElementById("email")?.value.trim() || "dimetechacademy@gmail.com";

            FlutterwaveCheckout({
                public_key: "FLWPUBK-5371eca8e52f6277d44f696effabbdf7-X",
                tx_ref: "tx_" + Date.now(),
                amount: amount,
                currency: currency,
                payment_options: "card, banktransfer, ussd",
                customer: { email, name },
                callback: function (response) {
                    console.log("Payment response:", response);
                    if (response.status && response.status.toLowerCase().includes("success")) {
                        alert(`🎉 Payment Successful for ${button.getAttribute("data-service")}!`);
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
}

// Run everything
initPayments();
