const apiUrl = 'http://api.valantis.store:40000/';

let currentPage = 1;
let totalPages = 1;
let currentFilter = {};

function getAuthString() {
  const password = 'Valantis';
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  return md5(`${password}_${timestamp}`);
}

function fetchData() {
  const authString = getAuthString();
  const request = new XMLHttpRequest();
  request.open('POST', apiUrl);
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('X-Auth', authString);
  request.onload = function() {
    if (request.status === 200) {
      const response = JSON.parse(request.responseText);
      const products = response.result;
      // Display products
      displayProducts(products);
    } else {
      console.error('Error:', request.statusText);
    }
  };
  request.onerror = function() {
    console.error('Network Error');
  };
  request.send(JSON.stringify({ action: 'filter', params: { ...currentFilter, offset: (currentPage - 1) * 50, limit: 50 } }));
}

function displayProducts(products) {
  const productsDiv = document.getElementById('products');
  productsDiv.innerHTML = '';
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.textContent = `ID: ${product.id}, Name: ${product.product}, Price: ${product.price}, Brand: ${product.brand}`;
    productsDiv.appendChild(productDiv);
  });
}

function updatePageInfo() {
  const pageInfo = document.getElementById('pageInfo');
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function updatePaginationButtons() {
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

function updatePage() {
  fetchData();
  updatePaginationButtons();
  updatePageInfo();
}

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    updatePage();
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    updatePage();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});
