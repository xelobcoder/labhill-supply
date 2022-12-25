window.onload = (ev) => {
 // get all data of profduct from db
 // display only images 
 // attach listener to both top input fields

 class Cart {

  async getProductList() {
   // get all products from db
   let fetchData = await fetch('/api/v1/product');
   let data = await fetchData.json();
   return await data;
  }

  SelectedProductArray = [];
  SelectedTemporaryLocation = [];
  taxApplied = false;
  discountApplied = false;

  displayProduct(data) {
   // remove all child nodes
   let parent = document.querySelector('.img-product-view');
   // remove all child nodes
   parent.innerHTML = '';
   data.forEach((item) => {
    // create a div for each product
    let productDiv = document.createElement('div');
    // create image tag
    let productImage = document.createElement('img');
    // create div for stock available and we place on the image top
    let stockDiv = document.createElement('div');
    // add class to stock div
    stockDiv.classList.add('stock-div');
    // add text to stock div
    stockDiv.innerText = item.quantity;
    // add image src
    productImage.src = '/api/v1/image?id=' + item.imageid;
    // add height and weight attribute
    productImage.setAttribute('height', '170px');
    productImage.setAttribute('width', '200px');
    // append text to div
    productDiv.innerText = item.name;
    // create a container
    let container = document.createElement('div');
    // append image to container
    // append stock div to container
    container.appendChild(stockDiv);
    container.appendChild(productImage);
    // append div to container
    container.appendChild(productDiv);
    // add class to container
    container.classList.add('product-container');
    // add a selected attribute
    container.setAttribute('selected', 'false');
    // add product id to container as an attrute
    container.setAttribute('dataid', item.productid)
    // append container to parent
    // if available stock is 0, change the background color of stock div to red
    if (item.quantity == 0) {
     stockDiv.style.backgroundColor = 'red';
    }
    parent.appendChild(container);
   });
  }

  async AddSelectedProduct(id) {
   let searchField = document.getElementById('searchitem');
   // get data and filter for the id
   let data = await this.getProductList().catch((err) => { console.log(err) });

   let filteredProduct = data.filter((product) => {
    return product.productid == id;
   })
   // add the filtered product to the search field
   searchField.value = filteredProduct[0].name;
   // add the filtered product to the selected product array only a time 
   function AddOneAgo() {
    // remoe all items from the array
    cart.SelectedTemporaryLocation = [];
    // add the filtered product to the array
    cart.SelectedTemporaryLocation.push(filteredProduct[0]);
   }
   AddOneAgo();
  }

  MakeOneSelectionAtATime() {
   // make one selection at a time
   let productContainer = document.querySelectorAll('.product-container');
   productContainer.forEach((container) => {
    container.addEventListener('click', (ev) => {
     // check if the clicked container is selected
     if (container.getAttribute('selected') == 'false') {
      // make all other container unselected
      productContainer.forEach((item) => {
       item.setAttribute('selected', 'false');
      });
      // make the clicked container selected
      container.setAttribute('selected', 'true');
      // add selected product to search input field
      if (container.hasAttribute('dataid')) {
       let dataid = container.getAttribute('dataid');
       this.AddSelectedProduct(dataid);
      }
     } else {
      // make the clicked container unselected
      container.setAttribute('selected', 'false');
     }
    });
   });
  }

  CheckForDuplicates() {
   // check if the selected product is already in the cart
   // if it is, increase the quantity
   // if it is not, add it to the cart
   let isDuplicate = false;
   this.SelectedProductArray.forEach((product) => {
    if (product.productid == this.SelectedTemporaryLocation[0].productid) {
     isDuplicate = true;
    }
   });
   return isDuplicate;
  }




  addTaxHtml(data, totalAmount) {
   // create tax 
   function createTaxTbody(taxname, taxrate) {
    let taxAmount = (totalAmount * taxrate) / 100;
    return (
     `
     <div  id='tax-list'>
       <div class='tax-name'>${taxname}</div>
       <div class='tax-rate'>${taxAmount}</div>
     </div>
     `
    )
   }
   if (data.length > 0) {
    // change the tax applied to true
    this.taxApplied = true;
    // get body
    const taxbody = document.getElementById('tax-table');
    // for each tax
    if (data.length > 0) {
     let TransformedHtml = data.map((item, index) => {
      return createTaxTbody(item.taxname, item.taxrate, totalAmount)
     })

     if (taxbody) {
      taxbody.innerHTML = '';
      taxbody.innerHTML = TransformedHtml.join('');
     }
    }
   }

  }

  removeTax() {
   // remove tax
   let taxbody = document.getElementById('tax-table');
   if (taxbody) {
    taxbody.innerHTML = '';
    // change the tax applied to false
    this.taxApplied = false;
   }
  }

  async getTaxData() {
   // get tax data
   let taxData = await fetch('http://localhost:4000/api/v1/tax?taxtoapply')
   let taxDataJson = await taxData.json();
   return taxDataJson;
  }


  AddProductToCart() {
   // check length of temporary location
   const isLengthOne = this.SelectedTemporaryLocation.length == 1;
   if (isLengthOne) {
    // make quantity field focused
    let quantityField = document.getElementById('quantity');
    quantityField.focus();
    // get the value of quantity field
    let quantity = parseInt(quantityField.value);
    // check to verify is not more than available stock
    let availableStock = parseInt(this.SelectedTemporaryLocation[0].quantity);
    if (quantity > availableStock) {
     alert('Quantity is more than available stock');
    }

    if (availableStock == 0) {
     alert('Product is out of stock');
    }

    if (quantity < availableStock && quantity > 0) {
     console.log('hti')
     // redifine the quantity of the selected product
     let salesProduct = {
      productid: this.SelectedTemporaryLocation[0].productid,
      quantity: quantity,
      total: this.SelectedTemporaryLocation[0].price * quantity,
      price: this.SelectedTemporaryLocation[0].price,
      name: this.SelectedTemporaryLocation[0].name,
     }
     // add the product to the cart
     if (!this.CheckForDuplicates()) {
      this.SelectedProductArray.push(salesProduct);
      // clear the temporary location
      this.SelectedTemporaryLocation = [];
      // clear the search field
      let searchField = document.getElementById('searchitem');
      searchField.value = '';
      // clear the quantity field
      quantityField.value = 0;
      console.log(cart.SelectedProductArray)
     } else {
      alert('Product is already in the cart');
     }
    }
   }
   else {
    this.SelectedTemporaryLocation = [];
   }

   if (this.SelectedProductArray.length > 0) {
    this.DisplayCart();
   } else {
    alert('No product selected');
    // hide the cart
    let cart = document.querySelector('.cart-view');
    cart.style.display = 'none';
   }
  }

  displayTax = async () => {
   // get tax data
   let taxData = await this.getTaxData();

   // reduce the tax data to get the total tax
   let totalTax = this.SelectedProductArray.reduce((acc, item) => {
    return acc + item.total;
   }, 0);
   // add tax html
   this.addTaxHtml(taxData, totalTax);
   // 
  }

  // discount applied 
  getDiscount() {
   // get discount
   let discount = document.getElementById('discount');
   // get discount if discount is applied
   if (this.discountApplied) {
    return discount.value;
   }
   else {
    return 0;
   }
  }
  RemoveProductFromCart(element) {
   let productid = element;
   // filter the selected product array
   let filteredArray = this.SelectedProductArray.filter((product, index) => {
    if (product.productid == productid) {
     return index
    }
   });
   // set the filtered array to the selected product array
   this.SelectedProductArray.splice(filteredArray[0], 1);
   // display the cart
   this.DisplayCart();
   console.log(this.SelectedProductArray)
  }

  CalculateTotalCost() {
   let totalCost = 0;
   this.SelectedProductArray.forEach((product) => {
    totalCost += product.total;
   });
   return totalCost;
  }
  DisplayCart() {
   // get table and make it visible
   let cart = document.querySelector('.cart-view');
   cart.style.display = 'block';
   let table = document.querySelector('.cart-view > table');
   table.style.display = 'block';
   // get the table body
   let tableBody = document.getElementById('table-body');
   // body childreen to be appended;
   let cartitems = this.SelectedProductArray.map((item, index) => {
    return (
     ` <tr class='p-5 border-bottom'>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td> ${item.price}</td>
        <td>${item.quantity}</td>
        <td>${item.total}</td>
        <td>
       <button class='btn btn-danger' id='remove' dataid=${item.productid}>
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
       <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
     </svg>
       </button>
      </td>
     </tr>
    `
    )
   })
   // append to body
   tableBody.innerHTML = cartitems.join('');
   // display tax
   this.displayTax();


   // remove an item from the cart
   // do tbody has childnodes
   if (tableBody.hasChildNodes && this.SelectedProductArray.length != 0) {
    let removeButtons = document.querySelectorAll('#remove');
    removeButtons.forEach((button) => {
     button.addEventListener('click', (e) => {
      let element = e.target;
      let productid = parseInt(element.getAttribute('dataid'));
      this.RemoveProductFromCart(productid);
     })
    })
   }

   // append total cost to tfoot
   let tabelfoot = document.querySelector('.table-foot');
   // append total cost
   tabelfoot.innerHTML = this.CalculateTotalCost() + ' GHC';
  }

  async getSearchedProductValue() {
   let searchField = document.querySelector('#searchitem');
   let searchValue = searchField.value;
   // filter the product list
   // display the filtered product 
   let productList = await cart.getProductList();
   let filteredProduct = productList.filter((product) => {
    return product.name.toLowerCase().includes(searchValue.toLowerCase());
   });
   // display the filtered product
   cart.displayProduct(filteredProduct);
   cart.MakeOneSelectionAtATime();
  }

  // empty the cart
  EmptyCart() {
   let discountField = document.querySelector('.cart-discount');
   this.SelectedProductArray = [];
   this.DisplayCart();
   // display the discount none if at anytie the cart is emptied
   if (discountField) {
    discountField.style.display = 'none';
   }
   // hide the cart section
   let cart = document.querySelector('.cart-view');
   cart.style.display = 'none';
  }

  displayorHideDiscount() {
   let discountField = document.querySelector('.cart-discount');
   function commandDisplay() {
    if (discountField) {
     const display = discountField.style.display;

     if (display == 'none') {
      discountField.style.display = 'block';
      // set discount applied to true
      cart.discountApplied = true;
     } else {
      discountField.style.display = 'none';
      // set discount applied to false
      cart.discountApplied = false;
     }
    }
   }
   // only display if cart is not empty

   if (this.SelectedProductArray.length > 0) {
    commandDisplay();

   } else {
    alert('Cart is empty. add product to cart to get discount');
   }


  }

  initiateTransaction(transaction) {
   // send data to server
   fetch('http://localhost:4000/transaction', {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
   })
    .then((res) => res.json())
    .then((data) => {
     console.log(data);
     // empty the cart
     if (data.status == 'success') {
      this.EmptyCart();
      window.location.href = `http://localhost:4000/viewtransaction?transactionid=${data.transactionid}`;
     }
    })
    .catch((err) => {
     console.log(err);
    })
  }


 }

 let cart = new Cart();

 // display all products

 function displayAllProduct() {
  cart.getProductList().then((data) => {
   cart.displayProduct(data);
  });

  // listen for discount button

  let discountButton = document.getElementById('discount-card');

  discountButton.addEventListener('click', function (ev) {
   cart.displayorHideDiscount();
  })

 }
 displayAllProduct();

 // append a search listener to search field

 function SearchListerner() {
  let searchField = document.querySelector('#searchitem');
  searchField.addEventListener('keyup', cart.getSearchedProductValue);
 }
 SearchListerner();

 // increase or decrease the value of quantity in the quantity number field

 function IncreamentOrDecreement(opts) {
  let quantity = document.getElementById('quantity');
  let value = parseInt(quantity.value);
  if (opts == 'decrement') {
   value--;
   quantity.value = value;
  }

  if (opts == 'increment') {
   value++;
   quantity.value = value;
  }

 }

 // get decrement button

 let decrementButton = document.getElementById('decrebtn');

 decrementButton.addEventListener('click', function (ev) {
  IncreamentOrDecreement('decrement');
 })

 // get increment button

 let incrementButton = document.getElementById('increbtn');

 incrementButton.addEventListener('click', function (ev) {
  IncreamentOrDecreement('increment');
 })



 // make one selection at a time
 // get parent div
 let productParent = document.querySelector('.img-product-view');

 setTimeout(() => {
  if (productParent.hasChildNodes()) {
   cart.MakeOneSelectionAtATime();
   // listener for add to cart button

   let addToCartButton = document.getElementById('addtocartbtn');

   addToCartButton.addEventListener('click', function (ev) {
    cart.AddProductToCart();
    cart.DisplayCart();
    console.log(cart.SelectedProductArray, 1)
   })
  }

 }, 1000);


 // listener for empty cart button

 let emptyCartButton = document.querySelectorAll('.card-button-wrapper > .card-button')[0];

 emptyCartButton.addEventListener('click', function (ev) {
  cart.EmptyCart();
 })

 // listener for remove tax button

 let removeTaxButton = document.getElementById('remove-tax');

 removeTaxButton.addEventListener('click', function (ev) {
  cart.removeTax();
 })


 // listener for initiate transaction button
 let initiateTransactionButton = document.getElementById('initiate-transaction');

 initiateTransactionButton.addEventListener('click', function (ev) {
  // get tax applied status
  let taxApplied = cart.taxApplied;
  // get discount applied status
  let discountApplied = cart.discountApplied;
  // get total cost
  let totalCost = cart.CalculateTotalCost();
  // get selected product array
  let selectedProductArray = cart.SelectedProductArray;
  // check if cart is empty
  const isCartEmpty = selectedProductArray.length == 0;
  // create a transaction object
  let transaction = {
   transactionid: Date.now(),
   cart: selectedProductArray,
   taxApplied,
   discountApplied,
   discount: cart.getDiscount(),
   totalCost
  }
  // check if cart is empty
  if (isCartEmpty) {
   alert('Cart is empty. Add product to cart to initiate transaction');
  } else {
   // initiate transaction
   cart.initiateTransaction(transaction);
  }

 });

}