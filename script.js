// ===== UNIFIED CART SYSTEM - FOR MAIN PAGE (script.js) =====

document.addEventListener("DOMContentLoaded", function () {
    // ===== THEME TOGGLE FUNCTIONALITY =====
    
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const body = document.body;

    // Load saved theme
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        body.setAttribute("data-theme", "light");
        if (themeIcon) themeIcon.classList.replace("fa-sun", "fa-moon");
    } else {
        body.removeAttribute("data-theme");
        if (themeIcon) themeIcon.classList.replace("fa-moon", "fa-sun");
    }

    // Toggle theme
    let currentTheme = savedTheme;
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isLight = currentTheme === "light";
            if (isLight) {
                body.removeAttribute("data-theme");
                currentTheme = "dark";
                localStorage.setItem("theme", "dark");
                if (themeIcon) themeIcon.classList.replace("fa-moon", "fa-sun");
            } else {
                body.setAttribute("data-theme", "light");
                currentTheme = "light";
                localStorage.setItem("theme", "light");
                if (themeIcon) themeIcon.classList.replace("fa-sun", "fa-moon");
            }
        });
    }

    // ===== SEARCH FUNCTIONALITY =====
    
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
            const category = card.querySelector('.product-category')?.textContent.toLowerCase() || '';
            const condition = card.querySelector('.product-condition')?.textContent.toLowerCase() || '';
            
            const isMatch = searchTerm === '' || 
                          title.includes(searchTerm) || 
                          category.includes(searchTerm) || 
                          condition.includes(searchTerm);
            
            if (isMatch) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Search event listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => performSearch(e.target.value));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchInput.value);
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (searchInput) performSearch(searchInput.value);
        });
    }

    // ===== USER AUTHENTICATION =====
    
    const userMenu = document.getElementById("userMenu");
    const userInitials = document.getElementById("userInitials");
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    
    let user = JSON.parse(localStorage.getItem("user"));

    function updateAuthUI() {
        if (user) {
            if (loginBtn) loginBtn.style.display = "none";
            if (signupBtn) signupBtn.style.display = "none";
            if (userMenu) userMenu.style.display = "inline-block";
            
            if (userInitials) {
                if (user.initials) {
                    userInitials.textContent = user.initials;
                } else if (user.fullName) {
                    const nameParts = user.fullName.split(' ');
                    const initials = (nameParts[0][0] || "").toUpperCase() + 
                                   (nameParts[1] ? nameParts[1][0].toUpperCase() : "");
                    userInitials.textContent = initials;
                }
            }
        } else {
            if (loginBtn) loginBtn.style.display = "inline-block";
            if (signupBtn) signupBtn.style.display = "inline-block";
            if (userMenu) userMenu.style.display = "none";
        }
    }

    updateAuthUI();

    // User dropdown functionality
    if (userInitials) {
        userInitials.addEventListener("click", function (e) {
            e.stopPropagation();
            if (userDropdown) {
                userDropdown.style.display =
                    userDropdown.style.display === "block" ? "none" : "block";
            }
        });
    }

    document.addEventListener("click", function (event) {
        if (userMenu && userDropdown && !userMenu.contains(event.target)) {
            userDropdown.style.display = "none";
        }
    });

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("user");
            localStorage.removeItem("cart"); // Clear cart on logout
            window.location.href = "index.html";
        });
    }

    // Sell link authentication
    document.addEventListener("click", function(e) {
        const sellLinkElement = e.target.closest('a[href="listing.html"]');
        if (sellLinkElement) {
            e.preventDefault();
            const currentUser = JSON.parse(localStorage.getItem("user"));
            
            if (currentUser) {
                window.location.href = "listing.html";
            } else {
                window.location.href = "login.html?redirect=sell";
            }
        }
    });

    // ===== UNIFIED CART SYSTEM =====
    
    let cart = [];
    
    // Load cart from localStorage (CONSISTENT storage)
    try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.log("No saved cart found, starting fresh");
        cart = [];
    }
    
    const cartButton = document.getElementById("cartButton");
    const cartCountElement = document.getElementById("cartCount");

    // Save cart to localStorage
    function saveCart() {
        try {
            localStorage.setItem("cart", JSON.stringify(cart));
            console.log('Cart saved:', cart);
        } catch (e) {
            console.error('Failed to save cart:', e);
        }
    }

    // Calculate cart totals
    function getCartTotals() {
        const subtotal = cart.reduce((total, item) => {
            return total + ((item.price || 0) * (item.quantity || 0));
        }, 0);
        
        const itemCount = cart.reduce((count, item) => {
            return count + (item.quantity || 0);
        }, 0);
        
        return {
            subtotal: subtotal,
            itemCount: itemCount,
            formattedSubtotal: formatPrice(subtotal)
        };
    }
    
    function formatPrice(price) {
        return `₹${(price || 0).toLocaleString('en-IN')}`;
    }
    
    // Update cart UI
    function updateCartUI() {
        const totals = getCartTotals();
        const cartCount = totals.itemCount;
        
        console.log('Updating cart UI, count:', cartCount);
        
        if (cartCountElement) {
            cartCountElement.textContent = cartCount.toString();
            if (cartCount > 0) {
                cartCountElement.style.display = 'flex';
            } else {
                cartCountElement.style.display = 'none';
            }
        }
        
        if (cartButton) {
            cartButton.classList.toggle('has-items', cartCount > 0);
        }
    }

    // Extract product data from card
    function extractProductData(cardElement) {
        const titleElement = cardElement.querySelector('.product-title');
        const priceElement = cardElement.querySelector('.product-price');
        const conditionElement = cardElement.querySelector('.product-condition');
        const categoryElement = cardElement.querySelector('.product-category');
        const imageIcon = cardElement.querySelector('.product-image i');
        
        const id = titleElement ? 
            titleElement.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 
            'item-' + Date.now();
        
        return {
            id: id,
            title: titleElement ? titleElement.textContent.trim() : 'Unknown Product',
            price: priceElement ? parseInt(priceElement.textContent.replace(/[₹,]/g, '')) || 0 : 0,
            condition: conditionElement ? conditionElement.textContent.trim() : 'Unknown',
            category: categoryElement ? categoryElement.textContent.trim() : 'General',
            icon: imageIcon ? imageIcon.className : 'fas fa-box',
            image: cardElement.querySelector('.product-image') ? 
                   window.getComputedStyle(cardElement.querySelector('.product-image')).background : 
                   'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
        };
    }

    // Add item to cart
    function addToCart(item) {
        console.log('Adding item to cart:', item);
        
        const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex > -1) {
            // Item exists, increase quantity
            cart[existingItemIndex].quantity += 1;
            showNotification("Quantity increased!", "success");
        } else {
            // New item, add to cart
            cart.push({
                ...item,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
            showNotification("Added to cart!", "success");
        }
        
        saveCart();
        updateCartUI();
        updateButtonState(item.id, true);
    }

    // Check if item is in cart
    function isItemInCart(itemId) {
        return cart.some(item => item.id === itemId);
    }

    // Update button state
    function updateButtonState(itemId, isInCart) {
        const buttons = document.querySelectorAll('.addtocartbtn button');
        buttons.forEach(button => {
            const card = button.closest('.card');
            if (card) {
                const productData = extractProductData(card);
                if (productData.id === itemId) {
                    if (isInCart) {
                        button.innerHTML = '<i class="fas fa-check"></i> In Cart';
                        button.classList.add('in-cart');
                    } else {
                        button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
                        button.classList.remove('in-cart');
                    }
                }
            }
        });
    }

    // Update all button states
    function updateAllButtonStates() {
        const buttons = document.querySelectorAll('.addtocartbtn button');
        buttons.forEach(button => {
            const card = button.closest('.card');
            if (card) {
                const productData = extractProductData(card);
                const inCart = isItemInCart(productData.id);
                updateButtonState(productData.id, inCart);
            }
        });
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `cart-notification cart-notification-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // ===== EVENT LISTENERS =====
    
    // Initialize cart
    updateCartUI();
    updateAllButtonStates();
    
    // SINGLE add to cart event listener
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.addtocartbtn button');
        if (button && !button.disabled) {
            e.preventDefault();
            
            // Prevent multiple clicks
            button.disabled = true;
            setTimeout(() => button.disabled = false, 1000);
            
            // Check authentication
            if (!window.isUserAuthenticated()) {
                showNotification('Please login to add items to your cart.', 'error');
                setTimeout(() => window.location.href = 'login.html', 1500);
                return;
            }
            
            const cardElement = button.closest('.card');
            if (cardElement) {
                const productData = extractProductData(cardElement);
                console.log('Product data extracted:', productData);
                
                if (isItemInCart(productData.id)) {
                    // Already in cart, go to cart page
                    window.location.href = 'cart.html';
                } else {
                    // Add to cart
                    addToCart(productData);
                }
                
                // Visual feedback
                button.style.transform = 'scale(0.95)';
                setTimeout(() => button.style.transform = 'scale(1)', 150);
            }
        }
    });

    // Cart button click
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }

    // ===== UTILITY FUNCTIONS =====
    
    window.isUserAuthenticated = function() {
        return localStorage.getItem("user") !== null;
    };
    
    window.getCurrentUser = function() {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
    };

    function generateInitials(fullName) {
        if (!fullName) return 'U';
        const nameParts = fullName.trim().split(' ');
        const firstLetter = (nameParts[0][0] || "").toUpperCase();
        const secondLetter = nameParts.length > 1 ? (nameParts[1][0] || "").toUpperCase() : "";
        return firstLetter + secondLetter;
    }

    window.handleLoginSuccess = function(userData) {
        const user = {
            fullName: userData.fullName || userData.full_name,
            email: userData.email,
            year: userData.year,
            rollNo: userData.rollNo || userData.roll_no,
            phone: userData.phone,
            hostel: userData.hostel,
            initials: userData.initials || generateInitials(userData.fullName || userData.full_name),
            firstName: (userData.fullName || userData.full_name).split(' ')[0],
            lastName: (userData.fullName || userData.full_name).split(' ').slice(1).join(' ') || ''
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        
        if (redirect === 'sell') {
            window.location.href = "listing.html";
        } else {
            window.location.href = "index.html";
        }
    };

    // Listen for storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'user') {
            user = e.newValue ? JSON.parse(e.newValue) : null;
            updateAuthUI();
        } else if (e.key === 'cart') {
            // Reload cart when it changes in another tab
            try {
                cart = e.newValue ? JSON.parse(e.newValue) : [];
                updateCartUI();
                updateAllButtonStates();
            } catch (err) {
                console.error('Error syncing cart:', err);
            }
        }
    });

    // Debug functions
    window.debugCart = function() {
        console.log('Current cart:', cart);
        console.log('Local storage cart:', localStorage.getItem('cart'));
        return { cart, count: getCartTotals().itemCount };
    };
    
    window.resetCart = function() {
        cart = [];
        localStorage.removeItem('cart');
        updateCartUI();
        updateAllButtonStates();
        console.log('Cart reset');
    };
});

