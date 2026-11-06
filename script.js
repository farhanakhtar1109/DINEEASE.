
// =============================================
// DINEEASE - COMPLETE RESTAURANT MANAGEMENT
// =============================================

const $ = id => document.getElementById(id);

const STORAGE_KEY = "dineEaseOrders";

const stateCities = {
    "Punjab": [
        "Ludhiana", "Amritsar", "Jalandhar", "Patiala",
        "Mohali", "Bathinda", "Pathankot", "Hoshiarpur",
        "Moga", "Firozpur"
    ],
    "Maharashtra": [
        "Mumbai", "Pune", "Nagpur", "Nashik",
        "Thane", "Kolhapur", "Aurangabad", "Solapur"
    ],
    "Tamil Nadu": [
        "Chennai", "Coimbatore", "Madurai", "Salem",
        "Tiruppur", "Vellore", "Erode", "Thanjavur"
    ],
    "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket"],
    "Uttar Pradesh": [
        "Lucknow", "Noida", "Agra", "Kanpur",
        "Varanasi", "Prayagraj"
    ],
    "Haryana": [
        "Gurugram", "Faridabad", "Panipat", "Karnal"
    ],
    "Rajasthan": [
        "Jaipur", "Jodhpur", "Udaipur", "Kota"
    ],
    "Karnataka": [
        "Bengaluru", "Mysuru", "Mangalore", "Hubli"
    ]
};

const restaurants = [
    {
        name: "The Royal Kitchen",
        type: "North Indian",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700",
        description: "Authentic Indian food with a premium dining experience."
    },
    {
        name: "Spice Garden",
        type: "Indian & Chinese",
        rating: "4.6",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700",
        description: "Delicious Indian and Chinese flavours."
    },
    {
        name: "Urban Bites",
        type: "Fast Food",
        rating: "4.5",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=700",
        description: "A perfect place for burgers, pizzas and more."
    },
    {
        name: "Italian Corner",
        type: "Italian",
        rating: "4.7",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=700",
        description: "Fresh pizzas and delicious Italian dishes."
    },
    {
        name: "Food Junction",
        type: "Multi Cuisine",
        rating: "4.4",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=700",
        description: "A wide variety of food for everyone."
    }
];

const foods = [
    {
        name: "Paneer Butter Masala",
        price: 220,
        category: "Indian",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=700",
        description: "Creamy paneer curry with rich Indian spices."
    },
    {
        name: "Margherita Pizza",
        price: 249,
        category: "Italian",
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=700",
        description: "Classic pizza with cheese and tomato."
    },
    {
        name: "Veg Burger",
        price: 129,
        category: "Fast Food",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700",
        description: "Crispy veggie patty with fresh vegetables."
    },
    {
        name: "Masala Dosa",
        price: 110,
        category: "South Indian",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=700",
        description: "Crispy dosa with chutney and sambar."
    },
    {
        name: "Veg Fried Rice",
        price: 160,
        category: "Chinese",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=700",
        description: "Fried rice with fresh vegetables."
    },
    {
        name: "White Sauce Pasta",
        price: 190,
        category: "Italian",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=700",
        description: "Creamy pasta with herbs."
    },
    {
        name: "French Fries",
        price: 99,
        category: "Snacks",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700",
        description: "Golden crispy french fries."
    },
    {
        name: "Chocolate Brownie",
        price: 120,
        category: "Dessert",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700",
        description: "Rich chocolate brownie."
    },
    {
        name: "Veg Biryani",
        price: 180,
        category: "Indian",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700",
        description: "Aromatic rice cooked with Indian spices."
    }
];

const statuses = [
    "Confirmed",
    "Preparing",
    "Ready",
    "Completed"
];

let selectedRestaurant = null;
let cart = [];
let toastTimer;


// =============================================
// 1. PAGE NAVIGATION
// =============================================

function showPage(pageId) {

    const target = $(pageId);

    if (!target || !target.classList.contains("page-view")) {
        return;
    }

    document.querySelectorAll(".page-view").forEach(page => {
        page.classList.remove("active-page");
    });

    target.classList.add("active-page");

    document.querySelectorAll("[data-page]").forEach(link => {
        link.classList.toggle(
            "active-link",
            link.dataset.page === pageId
        );
    });

    history.replaceState(null, "", "#" + pageId);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.addEventListener("click", event => {

    const link = event.target.closest("[data-page]");

    if (!link) return;

    event.preventDefault();

    showPage(link.dataset.page);

});

window.addEventListener("hashchange", () => {

    const pageId = location.hash.substring(1);

    if ($(pageId)?.classList.contains("page-view")) {
        showPage(pageId);
    }

});


// =============================================
// 2. LOCAL STORAGE
// =============================================

function getOrders() {

    try {
        const orders = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        return [];
    }

}

function saveOrders(orders) {

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        return true;
    } catch (error) {
        showToast("Unable to save order.");
        return false;
    }

}


// =============================================
// 3. STATE DROPDOWN
// =============================================

Object.keys(stateCities).sort().forEach(state => {

    const option = document.createElement("option");

    option.value = state;
    option.textContent = state;

    $("stateSelect").appendChild(option);

});

$("stateSelect").addEventListener("change", function() {

    $("citySelect").innerHTML =
        '<option value="">Choose City</option>';

    $("restaurantSelect").innerHTML =
        '<option value="">Choose Restaurant</option>';

    $("citySelect").disabled = !this.value;
    $("restaurantSelect").disabled = true;

    selectedRestaurant = null;

    $("restaurantDetails").classList.add("hidden");

    $("menuGrid").innerHTML =
        '<div class="empty">Select a restaurant to explore the menu.</div>';

    if (!this.value) return;

    stateCities[this.value].forEach(city => {

        const option = document.createElement("option");

        option.value = city;
        option.textContent = city;

        $("citySelect").appendChild(option);

    });

});


// =============================================
// 4. CITY DROPDOWN
// =============================================

$("citySelect").addEventListener("change", function() {

    $("restaurantSelect").innerHTML =
        '<option value="">Choose Restaurant</option>';

    $("restaurantSelect").disabled = !this.value;

    selectedRestaurant = null;

    $("restaurantDetails").classList.add("hidden");

    $("menuGrid").innerHTML =
        '<div class="empty">Select a restaurant to explore the menu.</div>';

    if (!this.value) return;

    restaurants.forEach((restaurant, index) => {

        const option = document.createElement("option");

        option.value = index;
        option.textContent = restaurant.name;

        $("restaurantSelect").appendChild(option);

    });

});


// =============================================
// 5. RESTAURANT SELECTION
// =============================================

$("restaurantSelect").addEventListener("change", function() {

    if (this.value === "") return;

    selectedRestaurant = restaurants[Number(this.value)];

    $("restaurantDetails").classList.remove("hidden");

    $("restaurantDetails").innerHTML = `
        <img src="${selectedRestaurant.image}"
             alt="Restaurant"
             onerror="this.src='https://placehold.co/600x400?text=Restaurant'">

        <div>
            <h3>${selectedRestaurant.name}</h3>
            <p>${selectedRestaurant.description}</p>
            <p>🍽️ ${selectedRestaurant.type}</p>
            <p>⭐ ${selectedRestaurant.rating}</p>
            <p>📍 ${$("citySelect").value}, ${$("stateSelect").value}</p>
        </div>
    `;

    showMenu(foods);

    showToast("Restaurant selected!");

});


// =============================================
// 6. FOOD MENU
// =============================================

function showMenu(items) {

    $("menuGrid").innerHTML = "";

    if (!items.length) {
        $("menuGrid").innerHTML =
            '<div class="empty">No food found.</div>';
        return;
    }

    items.forEach(food => {

        const index = foods.indexOf(food);

        const card = document.createElement("div");

        card.className = "food-card";

        card.innerHTML = `
            <img src="${food.image}"
                 alt="${food.name}"
                 loading="lazy"
                 onerror="this.src='https://placehold.co/600x400?text=Food'">

            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>

                <div class="food-bottom">
                    <span class="price">₹${food.price}</span>
                    <button class="add-btn" data-id="${index}">
                        + Add
                    </button>
                </div>
            </div>
        `;

        $("menuGrid").appendChild(card);

    });

}


// =============================================
// 7. FOOD SEARCH
// =============================================

$("foodSearch").addEventListener("input", function() {

    if (!selectedRestaurant) {
        showToast("Select a restaurant first!");
        return;
    }

    const query = this.value.toLowerCase();

    const filtered = foods.filter(food =>
        food.name.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query)
    );

    showMenu(filtered);

});


// =============================================
// 8. ADD TO CART
// =============================================

$("menuGrid").addEventListener("click", event => {

    const button = event.target.closest(".add-btn");

    if (!button) return;

    const id = Number(button.dataset.id);

    const food = foods[id];

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: id,
            name: food.name,
            price: food.price,
            quantity: 1
        });
    }

    renderCart();

    showToast(food.name + " added to cart!");

});


// =============================================
// 9. CART DISPLAY
// =============================================

function renderCart() {

    $("cartItems").innerHTML = "";

    let total = 0;
    let count = 0;

    if (!cart.length) {

        $("cartItems").innerHTML =
            '<div class="empty">Your cart is empty.</div>';

    }

    cart.forEach(item => {

        total += item.price * item.quantity;
        count += item.quantity;

        const row = document.createElement("div");

        row.className = "cart-row";

        row.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <p>₹${item.price} × ${item.quantity}</p>
            </div>

            <div class="quantity">
                <button data-action="minus" data-id="${item.id}">−</button>
                <span>${item.quantity}</span>
                <button data-action="plus" data-id="${item.id}">+</button>
            </div>
        `;

        $("cartItems").appendChild(row);

    });

    $("total").textContent = total;
    $("checkoutTotal").textContent = total;
    $("cartCount").textContent = count;

}


// =============================================
// 10. CART QUANTITY
// =============================================

$("cartItems").addEventListener("click", event => {

    const button = event.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);

    const item = cart.find(x => x.id === id);

    if (!item) return;

    if (button.dataset.action === "plus") {

        item.quantity++;

    } else {

        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(x => x.id !== id);
        }

    }

    renderCart();

});


// =============================================
// 11. PAYMENT DEMO
// =============================================

$("payment").addEventListener("change", function() {

    const info = $("paymentInfo");

    const messages = {
        Cash: "Pay your bill directly at the restaurant after your meal.",
        UPI: "UPI Demo: Payment confirmation will be simulated. No UPI PIN or real payment is required.",
        Card: "Card Demo: Payment confirmation will be simulated. Do not enter real card information."
    };

    info.textContent = messages[this.value];

});


// =============================================
// 12. DATE VALIDATION
// =============================================

function setMinimumDate() {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    $("arrivalDate").min = `${year}-${month}-${day}`;

}

setMinimumDate();


// =============================================
// 13. BOOKING SUBMISSION
// =============================================

$("orderForm").addEventListener("submit", function(event) {

    event.preventDefault();

    if (!selectedRestaurant) {
        showToast("Please select a restaurant!");
        showPage("restaurants");
        return;
    }

    if (!cart.length) {
        showToast("Please add food to your cart!");
        showPage("menu");
        return;
    }

    const date = $("arrivalDate").value;
    const time = $("arrivalTime").value;

    const bookingDate = new Date(`${date}T${time}`);

    if (bookingDate.getTime() < Date.now()) {
        showToast("Please choose a future arrival time!");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const payment = $("payment").value;

    const order = {
        id: "DE" + Date.now().toString().slice(-8),
        name: $("customerName").value.trim(),
        phone: $("phone").value.trim(),
        restaurant: selectedRestaurant.name,
        city: $("citySelect").value,
        state: $("stateSelect").value,
        date: date,
        time: time,
        guests: $("guests").value,
        orderType: $("orderType").value,
        payment: payment,
        paymentStatus: payment === "Cash"
            ? "Pay at Restaurant"
            : "Demo Payment Successful",
        instructions: $("instructions").value,
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: total,
        status: "Confirmed",
        createdAt: new Date().toLocaleString()
    };

    const orders = getOrders();

    orders.unshift(order);

    if (!saveOrders(orders)) return;

    alert(
        "BOOKING CONFIRMED!\n\n" +
        "Order ID: " + order.id +
        "\nRestaurant: " + order.restaurant +
        "\nAmount: ₹" + order.total +
        "\nPayment: " + order.payment +
        "\nStatus: " + order.status
    );

    cart = [];

    renderCart();

    this.reset();

    setMinimumDate();

    $("paymentInfo").textContent =
        "Pay your bill directly at the restaurant after your meal.";

    loadOrders();

    showToast("Your booking has been confirmed!");

    showPage("tracking");

});


// =============================================
// 14. TRACKING STEPS
// =============================================

function renderTracking(order) {

    const current = statuses.indexOf(order.status);

    const steps = statuses.map((status, index) => {

        const active = index <= current ? "active" : "";

        const symbol = index <= current ? "✓" : index + 1;

        return `
            <div class="track-step ${active}">
                <div class="circle">${symbol}</div>
                <div>${status}</div>
            </div>
        `;

    }).join("");

    return `
        <div class="tracking-card">

            <div class="tracking-header">
                <div>
                    <h3>Order #${order.id}</h3>
                    <p>${order.restaurant}</p>
                </div>

                <span class="status-badge">${order.status}</span>
            </div>

            <p><strong>Customer:</strong> ${order.name}</p>
            <p><strong>Amount:</strong> ₹${order.total}</p>
            <p><strong>Arrival:</strong> ${order.date} at ${order.time}</p>

            <div class="tracking-steps">
                ${steps}
            </div>

            ${
                order.status !== "Completed"
                ? `<button class="btn update-status" data-id="${order.id}">
                    Update Demo Status →
                   </button>`
                : `<p class="completed-message">✓ Order Completed Successfully!</p>`
            }

        </div>
    `;

}


// =============================================
// 15. LOAD TRACKING AND HISTORY
// =============================================

function loadOrders() {

    const orders = getOrders();

    const activeOrders = orders.filter(
        order => order.status !== "Completed"
    );

    $("activeTracking").innerHTML = "";

    $("orderHistory").innerHTML = "";

    if (!activeOrders.length) {

        $("activeTracking").innerHTML =
            '<div class="empty">No active orders available.</div>';

    }

    activeOrders.forEach(order => {

        $("activeTracking").insertAdjacentHTML(
            "beforeend",
            renderTracking(order)
        );

    });

    if (!orders.length) {

        $("orderHistory").innerHTML =
            '<div class="empty">Your orders will appear here.</div>';

        return;

    }

    orders.forEach(order => {

        const card = document.createElement("div");

        card.className = "history-card";

        const items = order.items.map(item =>
            `${item.name} × ${item.quantity}`
        ).join(", ");

        card.innerHTML = `
            <strong>Order #${order.id}</strong>
            <p>Customer: ${order.name}</p>
            <p>Restaurant: ${order.restaurant}</p>
            <p>Food: ${items}</p>
            <p>Amount: ₹${order.total}</p>
            <p>Payment: ${order.payment}</p>
            <p>Payment Status: ${order.paymentStatus}</p>
            <p>Order Status: <strong>${order.status}</strong></p>
            <p>Booking: ${order.date} at ${order.time}</p>

            ${
                order.status !== "Completed"
                ? `<button class="update-status" data-id="${order.id}">
                    Update Demo Status
                   </button>`
                : `<p class="completed-message">✓ Completed</p>`
            }
        `;

        $("orderHistory").appendChild(card);

    });

}


// =============================================
// 16. UPDATE ORDER STATUS
// =============================================

document.addEventListener("click", event => {

    const button = event.target.closest(".update-status");

    if (!button) return;

    const orderId = button.dataset.id;

    const orders = getOrders();

    const order = orders.find(item => item.id === orderId);

    if (!order) return;

    const currentIndex = statuses.indexOf(order.status);

    if (currentIndex < 0 || currentIndex >= statuses.length - 1) {
        return;
    }

    order.status = statuses[currentIndex + 1];

    if (!saveOrders(orders)) return;

    loadOrders();

    showToast("Order status updated: " + order.status);

});


// =============================================
// 17. TOAST NOTIFICATION
// =============================================

function showToast(message) {

    const toast = $("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}


// =============================================
// 18. WEBSITE START
// =============================================

renderCart();

loadOrders();

const firstPage = location.hash.substring(1);

if ($(firstPage)?.classList.contains("page-view")) {
    showPage(firstPage);
} else {
    showPage("home");
}

console.log("DineEase successfully loaded!");
