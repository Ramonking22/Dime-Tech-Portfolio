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

            const name = form.querySelector("[name='name']").value.trim();
            const email = form.querySelector("[name='email']").value.trim();
            const message = form.querySelector("[name='message']").value.trim();

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
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3; // Desktop shows 3
    }

    function updateSlider() {
        if (slides.length > 0) {
            const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
            const maxIndex = slides.length - getVisibleSlides();
            if (current > maxIndex) current = maxIndex;
            if (current < 0) current = 0;
            slidesRow.style.transform = `translateX(-${current * slideWidth}px)`;
        }
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
            current--;
            updateSlider();
        });

        nextBtn.addEventListener("click", () => {
            current++;
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

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.style.display = "none";
            });
        }

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
       FAQ Toggle (FIXED)
    ========================== */
    document.querySelectorAll(".faq-question").forEach(button => {
        button.addEventListener("click", () => {
            const faqItem = button.closest(".faq-item");
            const answer = faqItem.querySelector(".faq-answer");
            const icon = button.querySelector(".faq-icon");

            faqItem.classList.toggle("open");
            if (answer) {
                answer.style.display = answer.style.display === "block" ? "none" : "block";
            }
            if (icon) icon.textContent = faqItem.classList.contains("open") ? "−" : "+";
        });
    });

    /* =========================
       Flutterwave Payment with Auto Currency
    ========================== */
    let selectedCurrency = "USD"; // default

    async function detectCurrency() {
        try {
            const res = await fetch("https://ipwhois.app/json/");
            const data = await res.json();
            console.log("User Location:", data);
            if (data && data.country_code === "NG") return "NGN";
            return "USD";
        } catch (err) {
            console.error("Currency detection failed:", err);
            return "USD"; // fallback
        }
    }

    async function updatePayButtons() {
        selectedCurrency = await detectCurrency();
        const buttons = document.querySelectorAll(".pay-service");

        buttons.forEach(btn => {
            const baseUSD = parseFloat(btn.getAttribute("data-amount-usd")) || 100;
            let finalAmount = baseUSD;

            if (selectedCurrency === "NGN") {
                // Example conversion rate 1 USD = ₦1500
                finalAmount = Math.round(baseUSD * 1500);
                btn.textContent = `Pay ₦${finalAmount.toLocaleString()}`;
            } else {
                btn.textContent = `Pay $${baseUSD}`;
            }

            btn.setAttribute("data-final-amount", finalAmount);
            btn.setAttribute("data-currency", selectedCurrency);
        });
    }

    // Run once on page load
    updatePayButtons();

    // Optional: allow manual currency selector override
    const currencySelector = document.getElementById("currency");
    if (currencySelector) {
        currencySelector.addEventListener("change", async () => {
            let currency = currencySelector.value;
            if (currency === "auto") currency = await detectCurrency();
            selectedCurrency = currency;
            updatePayButtons();
        });
    }

    // Flutterwave Checkout
    document.querySelectorAll(".pay-service").forEach(button => {
        button.addEventListener("click", () => {
            const serviceName = button.getAttribute("data-service");
            const amount = parseFloat(button.getAttribute("data-final-amount"));
            const currency = button.getAttribute("data-currency") || "USD";

            const name = document.getElementById("name")?.value.trim() || "DimeTech Client";
            const email = document.getElementById("email")?.value.trim() || "dimetechacademy@gmail.com";

            FlutterwaveCheckout({
                public_key: "FLWPUBK-5371eca8e52f6277d44f696effabbdf7-X",
                tx_ref: "tx_" + Date.now(),
                amount,
                currency,
                payment_options: "card, banktransfer, ussd",
                customer: { email, name },
                customizations: {
                    title: "DimeTech Agency",
                    description: `Payment for ${serviceName} package`,
                    logo: "https://ramonking22.github.io/Dime-Tech-Portfolio/images/dimetech_preview.jpg"
                },
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
});
