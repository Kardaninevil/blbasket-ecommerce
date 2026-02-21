// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Featured Products Data
const featuredProducts = [
    {
        id: 'featured1',
        name: 'Premium Coffee Beans',
        price: 24.99,
        image: 'images/coffee.jpg',
        description: 'High-quality coffee beans from Ethiopia'
    },
    {
        id: 'featured2',
        name: 'Organic Green Tea',
        price: 18.99,
        image: 'images/tea.jpg',
        description: 'Fresh organic green tea from Japan'
    },
    {
        id: 'featured3',
        name: 'Artisan Chocolate',
        price: 12.99,
        image: 'images/chocolate.jpg',
        description: 'Handcrafted dark chocolate'
    },
    {
        id: 'featured4',
        name: 'Spice Collection',
        price: 29.99,
        image: 'images/spices.jpg',
        description: 'Premium spices from around the world'
    }
];

// Function to render featured products
function renderFeaturedProducts() {
    const featuredContainer = document.querySelector('.featured-products');
    if (!featuredContainer) return;

    const productsHTML = featuredProducts.map(product => `
        <div class="featured-product">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">$${product.price.toFixed(2)}</div>
            <button onclick="addToCart('${product.id}')" class="add-to-cart-btn">Add to Cart</button>
        </div>
    `).join('');

    featuredContainer.innerHTML = productsHTML;
}

// Function to update cart count in the navigation bar
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Function to add item to cart
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Item added to cart!');
}

// Function to remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems(cart);
    updateCartSummary();
}

// Function to update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems(cart);
            updateCartSummary();
        }
    }
}

// Function to render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Function to update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + shipping;

    const subtotalElement = document.getElementById('cart-subtotal');
    const shippingElement = document.getElementById('shipping-cost');
    const totalElement = document.getElementById('cart-total');

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Product data
const products = {
    'saree1': {
        id: 'saree1',
        name: 'Handwoven Silk Saree',
        price: 299.99,
        image: 'images/saree1.jpg'
    },
    'spice1': {
        id: 'spice1',
        name: 'Premium Spice Collection',
        price: 49.99,
        image: 'images/spice1.jpg'
    },
    'tea1': {
        id: 'tea1',
        name: 'Organic Green Tea',
        price: 24.99,
        image: 'images/tea1.jpg'
    },
    'craft1': {
        id: 'craft1',
        name: 'Handcrafted Pottery',
        price: 79.99,
        image: 'images/craft1.jpg'
    }
};

// Function to get product by ID
function getProductById(id) {
    return products[id];
}

// Initialize cart page if on cart.html
if (window.location.pathname.includes('cart.html')) {
    renderCartItems();
    updateCartSummary();

    // Add event listener to checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            // Redirect to checkout page or handle checkout process
            alert('Proceeding to checkout...');
        });
    }
}

// User authentication
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Function to check if user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Function to update UI based on login status
function updateAuthUI() {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    
    if (isLoggedIn()) {
        if (loginBtn) loginBtn.textContent = 'Logout';
        if (signupBtn) signupBtn.style.display = 'none';
    } else {
        if (loginBtn) loginBtn.textContent = 'Login';
        if (signupBtn) signupBtn.style.display = 'inline-block';
    }
}

// Function to handle login
function handleLogin(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { email: user.email, firstName: user.firstName, lastName: user.lastName };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        return true;
    }
    
    return false;
}

// Function to handle signup
function handleSignup(firstName, lastName, email, password) {
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        return false;
    }
    
    // Create new user
    const newUser = { firstName, lastName, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after signup
    currentUser = { email, firstName, lastName };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    
    return true;
}

// Function to handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    window.location.href = 'index.html';
}

// Form validation for login and signup
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (formId === 'loginForm') {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (handleLogin(email, password)) {
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password. Please try again.');
            }
        } 
        else if (formId === 'signupForm') {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match. Please try again.');
                return;
            }
            
            if (handleSignup(firstName, lastName, email, password)) {
                window.location.href = 'index.html';
            } else {
                alert('Email already exists. Please use a different email or login.');
            }
        }
    });
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add active class to current navigation item
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation.split('/').pop()) {
            link.classList.add('active');
        }
    });
    
    // Handle login/logout button click
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            if (isLoggedIn()) {
                e.preventDefault();
                handleLogout();
            }
        });
    }
    
    // Update UI based on login status
    updateAuthUI();
});

// Initialize form validation
validateForm('loginForm');
validateForm('signupForm');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderFeaturedProducts();
    
    // Add search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const products = document.querySelectorAll('.product-card, .featured-product');
            
            products.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                const productDescription = product.querySelector('p')?.textContent.toLowerCase() || '';
                
                if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
}); 