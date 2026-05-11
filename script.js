// =====================================================
//   GreenHarvest Agriculture - JavaScript (script.js)
// =====================================================

let loggedInUser = "";

// --- SINGLE PAGE NAVIGATION ---
function showPage(pageId) {
    const sections = ['home', 'subsidies', 'about', 'services', 'products', 'stats', 'serviceDetailPage'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const activePage = document.getElementById(pageId);
    if (activePage) {
        if (pageId === 'home') {
            activePage.style.display = 'flex';
            const stats = document.getElementById('stats');
            if (stats) stats.style.display = 'block';
        } else {
            activePage.style.display = 'block';
        }
    }
    window.scrollTo(0, 0);
}

// --- MODAL LOGIC ---
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
};

// --- SUBSIDY ELIGIBILITY CHECK ---
let currentScheme = "";

function applySubsidy(schemeName) {
    currentScheme = schemeName;
    document.getElementById('subsidySchemeName').innerText = "Scheme: " + schemeName;
    document.getElementById('subsidyForm').style.display = 'block';
    document.getElementById('subsidyResult').style.display = 'none';
    document.getElementById('subsidyForm').reset();
    openModal('subsidyModal');
}

document.getElementById('subsidyForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const land = parseFloat(document.getElementById('subLand').value);
    const income = parseFloat(document.getElementById('subIncome').value);
    const resultDiv = document.getElementById('subsidyResult');

    let eligible = false;
    let reason = "";

    if (currentScheme.includes("PM-KISAN") || currentScheme.includes("KUSUM")) {
        if (land <= 5) {
            eligible = true;
        } else {
            reason = "Land size must be 5 acres or less to qualify for this scheme.";
        }
    } else {
        if (income <= 300000) {
            eligible = true;
        } else {
            reason = "Annual income must be under ₹3,00,000 for this scheme.";
        }
    }

    this.style.display = 'none';
    resultDiv.style.display = 'block';

    if (eligible) {
        resultDiv.style.backgroundColor = "#e8f5e9";
        resultDiv.style.color = "#2e7d32";
        resultDiv.style.border = "1px solid #4caf50";
        resultDiv.innerHTML = `<strong>✅ You are Eligible!</strong><br>
            <p style='margin-top: 10px;'>Your application for <b>${currentScheme}</b> has been successfully verified and submitted to the local agriculture department.</p>
            <button class='btn' style='margin-top:15px; width:100%;' onclick='closeModal("subsidyModal")'>Done</button>`;
    } else {
        resultDiv.style.backgroundColor = "#ffebee";
        resultDiv.style.color = "#c62828";
        resultDiv.style.border = "1px solid #ef5350";
        resultDiv.innerHTML = `<strong>❌ Eligibility Failed</strong><br>
            <p style='margin-top: 10px;'>${reason}</p>
            <button class='btn' style='margin-top:15px; width:100%; background-color:#d32f2f;' onclick='closeModal("subsidyModal")'>Close</button>`;
    }
});

// --- SERVICE DATA ---
const serviceData = {
    'Crop Advisory': {
        img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: ['Personalized Soil Report', 'Pest Management Tips', 'Weekly Growth Tracking']
    },
    'Equipment Rental': {
        img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: ['Verified & Serviced Machines', 'Expert Operators Available', 'Flexible Hourly/Daily Rates']
    },
    'Market Price Tracker': {
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: ['Live Mandi Price Updates', 'Price Trend Analysis', 'SMS Alerts for Price Hikes']
    }
};

// --- SERVICE DETAIL LOGIC ---
function showServiceDetails(title, description) {
    const data = serviceData[title];
    if (!data) return;

    document.getElementById('detailTitle').innerText = title;
    document.getElementById('detailImg').src = data.img;
    document.getElementById('detailDescription').innerText = description;

    const featureList = document.getElementById('detailFeatures');
    featureList.innerHTML = "";
    data.features.forEach(f => {
        featureList.innerHTML += `<li>${f}</li>`;
    });

    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('serviceDetailPage').style.display = 'block';
    window.scrollTo(0, 0);
}

function closeServiceDetail() {
    document.getElementById('serviceDetailPage').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    showPage('services');
}

// --- LOGIN & LOGOUT LOGIC ---
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const pwdError = document.getElementById('loginPwdError');
    pwdError.style.display = 'none';

    if (username === "" || password === "") {
        alert("Login Error: Fields cannot be empty.");
        return;
    }
    if (password.length < 6) {
        pwdError.style.display = 'block';
        return;
    }

    loggedInUser = username;
    document.getElementById('cartUserName').innerText = loggedInUser + "'s";

    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';

    showPage('home');
    this.reset();
});

function logout() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';

    loggedInUser = "";
    document.getElementById('cartUserName').innerText = "Your";
    cart = [];
    updateCartUI();
}

// --- CART LOGIC & CALCULATION ---
let cart = [];

function addToCart(productName, productPrice, buttonElement) {
    let existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    updateCartUI();

    let originalText = buttonElement.innerText;
    buttonElement.innerText = "Added! ✓";
    buttonElement.classList.add("btn-added");

    setTimeout(() => {
        buttonElement.innerText = originalText;
        buttonElement.classList.remove("btn-added");
    }, 1000);
}

function updateCartUI() {
    let container = document.getElementById("cartItemsContainer");
    let totalElement = document.getElementById("cartTotalAmount");
    let countElement = document.getElementById("cartCount");

    container.innerHTML = "";
    let totalAmount = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach(item => {
            let itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            totalItems += item.quantity;
            container.innerHTML += `
                <div class="cart-item">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>₹${itemTotal}</span>
                </div>
            `;
        });
    }

    totalElement.innerText = totalAmount;
    countElement.innerText = totalItems;
}

// --- CHECKOUT WITH BILL ---
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        closeModal('cartModal');
        let finalAmount = document.getElementById("cartTotalAmount").innerText;
        document.getElementById('checkoutTotalAmount').innerText = finalAmount;
        document.getElementById('paymentForm').reset();
        openModal('checkoutModal');
    }
}

document.getElementById('paymentForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const method = document.querySelector('input[name="paymentMethod"]:checked').value;
    const address = document.getElementById('deliveryAddress').value.trim();
    const finalAmount = document.getElementById("checkoutTotalAmount").innerText;

    let paymentMessage = "";
    if (method === "UPI")        paymentMessage = "A UPI payment request has been sent to your registered number.";
    else if (method === "Card")  paymentMessage = "Your card payment was processed securely.";
    else if (method === "NetBanking") paymentMessage = "Net banking transaction completed.";
    else if (method === "COD")   paymentMessage = "You have chosen Cash on Delivery. Please pay the exact amount at the time of delivery.";

    alert(`🧾 ORDER CONFIRMED!\n\nCustomer Name: ${loggedInUser || "Guest"}\nTotal Amount: ₹${finalAmount}\nPayment Method: ${method}\nDelivery Address: ${address}\n\n${paymentMessage}\n\nThank you for shopping with GreenHarvest!`);

    cart = [];
    updateCartUI();
    closeModal('checkoutModal');
});

// --- FORM VALIDATIONS ---
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name     = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirm  = document.getElementById('regConfirm').value.trim();
    const matchError = document.getElementById('regMatchError');
    matchError.style.display = 'none';

    if (name === "" || email === "" || password === "" || confirm === "") {
        alert("Registration Error: All fields are required.");
        return;
    }
    if (!isValidEmail(email)) {
        alert("Registration Error: Invalid email.");
        return;
    }
    if (password !== confirm) {
        matchError.style.display = 'block';
        return;
    }

    alert("Registration Successful! Account created for " + name + ".\nYou can now login.");
    closeModal('registerModal');
    this.reset();
});

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (name === "" || email === "" || message === "") {
        alert("Contact Error: Please fill out all fields.");
        return;
    }
    if (!isValidEmail(email)) {
        alert("Contact Error: Invalid email.");
        return;
    }

    alert("Thank you, " + name + "! Your message has been submitted.");
    closeModal('contactModal');
    this.reset();
});

document.getElementById('sellProductForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name  = document.getElementById('sellProdName').value.trim();
    const icon  = document.getElementById('sellProdIcon').value.trim();
    const desc  = document.getElementById('sellProdDesc').value.trim();
    const price = document.getElementById('sellProdPrice').value.trim();

    if (name === "" || icon === "" || desc === "" || price === "") {
        alert("Please fill out all fields.");
        return;
    }

    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        const newCard = document.createElement('div');
        newCard.className = 'service-card';
        newCard.innerHTML = `
            <div>
                <span class="icon">${icon}</span>
                <h3>${name} <span style="font-size: 0.7rem; background: #e8f5e9; color: #2e7d32; padding: 2px 6px; border-radius: 10px; vertical-align: middle; margin-left: 5px;">Farmer Choice</span></h3>
                <p>${desc}</p>
                <div class="rating">★★★★★ <span>(New)</span></div>
                <div class="price">₹${price}</div>
            </div>
            <button class="btn" onclick="addToCart('${name}', ${price}, this)">Add to Cart</button>
        `;
        productsGrid.insertBefore(newCard, productsGrid.firstChild);
    }

    alert("Product successfully listed! Buyers can now see your product in the Marketplace.");
    closeModal('sellProductModal');
    this.reset();
});

// --- ACCORDION LOGIC FOR SUBSIDIES ---
const accTitles = document.querySelectorAll('.scheme-title-acc');
accTitles.forEach(title => {
    title.addEventListener('click', function () {
        const icon = this.querySelector('.acc-icon');
        icon.innerText = (icon.innerText === '+') ? '-' : '+';

        const details = this.nextElementSibling;
        if (details.style.maxHeight) {
            details.style.maxHeight = null;
        } else {
            details.style.maxHeight = details.scrollHeight + "px";
        }
    });
});

// --- COUNTER ANIMATION ---
const counters = document.querySelectorAll('.counter');
const speed = 50;
let animated = false;

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count  = +counter.innerText;
            const inc    = Math.max(1, Math.floor(target / speed));

            if (count < target) {
                counter.innerText = count + inc;
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

window.addEventListener('scroll', () => {
    const statsSection = document.getElementById('stats');
    if (!statsSection || animated) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
        animateCounters();
        animated = true;
    }
});
