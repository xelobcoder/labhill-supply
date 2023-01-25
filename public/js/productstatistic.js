window.onload = (ev) => {
 let temporayDataStrorage = [];
 const searchBar = document.getElementById('searchstat');

 const getProductData = () => {

  const searchBarFiltering = function (data) {
   searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredProducts = data.filter((product) => {
     return (
      product.name.toLowerCase().includes(searchString)
     );
    });
    displayProductData(filteredProducts);

   })
  }


  const displayProductData = (data) => {
   if (Array.isArray && data.length > 0) {
    const html = data.map((product) => {
     return `
      <div class="statistics-product-list" dataid=${product.productid}>
       ${product.name}
      </div>
     `;
    });

    let productContainer = document.createElement('div');
    productContainer.classList.add('stas-group');
    productContainer.innerHTML = html.join('');
    // append to .stas-products
    let parentContainer = document.querySelector('.stas-products');
    // append to container
    if (parentContainer.hasChildNodes) {
     parentContainer.innerHTML = '';
     parentContainer.appendChild(productContainer);

     // get all statistics-product-list div
     let productDivs = document.querySelectorAll('.statistics-product-list');
     productDivs.forEach((productDiv) => {
      productDiv.addEventListener('click', (e) => {
       let innerVaalue = e.target.innerHTML;
       let dataid = e.target.getAttribute('dataid');
       //  get the product statistics
       const url = `/api/v1/productstatistic?productid=${dataid}`;
       fetch(url)
        .then((res) => res.json())
        .then((data) => {
         console.log(data);
        })
        .catch((err) => console.log(err));
      })
     })
    }
   }
   else {
    return false;
   }
  };
  const url = `/api/v1/productstatistic`;
  fetch(url)
   .then((res) => res.json())
   .then((data) => {
    displayProductData(data);
    searchBarFiltering(data);
   })
   .catch((err) => console.log(err));
 }


 getProductData();
}