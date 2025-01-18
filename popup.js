document.addEventListener('DOMContentLoaded', function () {
  const backendUrl = 'http://localhost:8000/api';

  async function uploadToFacebook(productId) {
    try {
      const response = await fetch(`${backendUrl}/products/${productId}`);
      const product = await response.json();

      chrome.runtime.sendMessage({
        action: 'uploadProduct',
        product: product
      });
    } catch (error) {
      console.error('Error uploading product:', error);
    }
  }

  async function fetchProducts() {
    try {
      const response = await fetch(`${backendUrl}/products`);
      const products = await response.json();
      displayProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product-card';

      const uploadButton = document.createElement('button');
      uploadButton.textContent = 'Publish to Facebook';
      uploadButton.dataset.productId = product.id;
      uploadButton.addEventListener('click', () => uploadToFacebook(product.id));

      div.innerHTML = `
          <h3>Title: ${product.title}</h3>
          <p>Price: ${product.price} Euro</p>
          <img src="${product.image}" alt="${product.title}" height="100" width="100" style="display:block">
        `;
      div.appendChild(uploadButton);
      productList.appendChild(div);
    });
  }

  document.getElementById('refreshProducts').addEventListener('click', fetchProducts);

  fetchProducts();
});