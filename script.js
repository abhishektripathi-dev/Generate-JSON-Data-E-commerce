document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const categoryFilter = document.getElementById('category-filter');
  const priceFilter = document.getElementById('price-filter');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');

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
          <p class="product-rating">⭐ ${product.rating}</p>
          <p class="product-description">${product.description}</p>
          <p class="product-reviews">${product.reviews.length} review(s)</p>
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
        alert(`${product.name} has been added to the cart!`);
      });
    });
  }

  // Update pagination
  function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
  }

  // Pagination event listeners
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
      updatePagination();
    }
  });

  nextPageButton.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
      updatePagination();
    }
  });

  // Filter by category
  categoryFilter.addEventListener('change', () => {
    const categoryId = categoryFilter.value;
    filteredProducts = categoryId
      ? products.filter(product => product.categoryId == categoryId)
      : products;
    currentPage = 1;
    renderProducts();
    updatePagination();
  });

  // Filter by price
  priceFilter.addEventListener('change', () => {
    const priceRange = priceFilter.value;
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filteredProducts = products.filter(product => product.price >= min && product.price <= max);
    } else {
      filteredProducts = products;
    }
    currentPage = 1;
    renderProducts();
    updatePagination();
  });
});