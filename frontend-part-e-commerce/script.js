document.addEventListener('DOMContentLoaded', () => {
  const homeLink = document.getElementById('home-link');
  const cartLink = document.getElementById('cart-link');
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  const homePage = document.getElementById('home-page');
  const loginPage = document.getElementById('login-page');
  const cartPage = document.getElementById('cart-page');
  const checkoutPage = document.getElementById('checkout-page');
  const productGrid = document.getElementById('product-grid');
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const checkoutButton = document.getElementById('checkout-button');
  const checkoutForm = document.getElementById('checkout-form');

  let currentUser = null;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let products = [];
  let filteredProducts = [];
  let currentPage = 1;
  const itemsPerPage = 18;

  // Fetch products from the API
  fetch('http://localhost:3000/products')
    .then(response => response.json())
    .then(data => {
      products = data;
      filteredProducts = data;
      renderProducts();
      updatePagination();
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });

  // Render products
  function renderProducts() {
    productGrid.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    paginatedProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';

      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        </div>
      `;

      productGrid.appendChild(productCard);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        const product = products.find(p => p.id == productId);
        addToCart(product);
      });
    });
  }

  // Add product to cart
  function addToCart(product) {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} has been added to the cart!`);
  }

  // Update cart count
  function updateCartCount() {
    cartCount.textContent = cart.length;
  }

  // Render cart items
  function renderCartItems() {
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <span>${item.name} - $${item.price.toFixed(2)}</span>
        <button onclick="removeFromCart(${index})">Remove</button>
      `;
      cartItems.appendChild(cartItem);
    });
  }

  // Remove product from cart
  window.removeFromCart = function (index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
  };

  // Checkout
  checkoutButton.addEventListener('click', () => {
    cartPage.style.display = 'none';
    checkoutPage.style.display = 'block';
  });

  // Mock payment
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Payment successful! Thank you for your purchase.');
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    renderCartItems();
    checkoutPage.style.display = 'none';
    homePage.style.display = 'block';
  });

  // Navigation
  homeLink.addEventListener('click', () => {
    homePage.style.display = 'block';
    loginPage.style.display = 'none';
    cartPage.style.display = 'none';
    checkoutPage.style.display = 'none';
  });

  cartLink.addEventListener('click', () => {
    homePage.style.display = 'none';
    loginPage.style.display = 'none';
    cartPage.style.display = 'block';
    checkoutPage.style.display = 'none';
    renderCartItems();
  });

  loginLink.addEventListener('click', () => {
    homePage.style.display = 'none';
    loginPage.style.display = 'block';
    cartPage.style.display = 'none';
    checkoutPage.style.display = 'none';
  });

  logoutLink.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('user');
    loginLink.style.display = 'inline';
    logoutLink.style.display = 'none';
    alert('You have been logged out.');
  });

  // Login
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Mock authentication
    if (username === 'user' && password === 'password') {
      currentUser = { username };
      localStorage.setItem('user', JSON.stringify(currentUser));
      loginLink.style.display = 'none';
      logoutLink.style.display = 'inline';
      alert('Login successful!');
      homePage.style.display = 'block';
      loginPage.style.display = 'none';
    } else {
      alert('Invalid username or password.');
    }
  });

  // Check if user is logged in
  const savedUser = JSON.parse(localStorage.getItem('user'));
  if (savedUser) {
    currentUser = savedUser;
    loginLink.style.display = 'none';
    logoutLink.style.display = 'inline';
  }

  // Update cart count on page load
  updateCartCount();
});