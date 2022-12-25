window.onload = (ev) => {
 let url = window.location.href.split('?')[1];
 let keys = url.split('=');
 // check if url has transaction id
 if (keys.includes('transactionid')) {
  let transactionid = parseInt(keys[1]);
  if (transactionid) {
   // display cart data
   function displayCartData(data,product) {
    // parse for the selected product to get image
    function getProductImage(productname) {
     if (product && product.length > 0) {
      let selectedproduct = product.filter((item) => {
       return item.name == productname;
      })
      return selectedproduct[0].imageid;
     }
    }
    // check if is an array
    const isArrayorObject = Array.isArray(data);
    // is it an array and greater than 0
    if (isArrayorObject && data.length > 0) {
     // create cart
     function mycart(item) {
      // create div
      let div = document.createElement('div');
      // add classList
      div.classList.add('list-group-item');
      // create img 
      let img = document.createElement('img');
      // add classList
      img.classList.add('img-thumbnail');
      // add src
      img.src = `/api/v1/image?id=${getProductImage(item.productname)}`;
      // add productname
      // create product div
      let product = document.createElement('div');
      // add classList
      product.classList.add('product');
      // add productname
      product.innerHTML = item.productname;
      // create quantity div
      let quantity = document.createElement('div');
      // add classList
      quantity.classList.add('quantity');
      // add quantity
      quantity.innerHTML = item.quantity;
      // // create price div
      // let price = document.createElement('div');
      // // add classList
      // price.classList.add('price');
      // // create total div
      // // add price
      // price.innerHTML = item.price;
      let total = document.createElement('div');
      // add classList
      total.classList.add('total');
      // add total
      total.innerHTML = item.totalcost;
      // append to div
      div.appendChild(img);
      div.appendChild(product);
      div.appendChild(quantity);
      // div.appendChild(price);
      div.appendChild(total);
      // append to parent
      document.getElementById('cart').appendChild(div);
     }

     // loop through data
     data.forEach((item) => {
      mycart(item);
     });
   
    } else { return }
   }
   // get data from server
   function getData(transactionid) {
    fetch(`http://localhost:4000/api/v1/transaction/?transactionid=${transactionid}`)
     .then((response) => response.json())
     .then((data) => {
      displayCartData(data.cart,data.product);
     })
   }
   getData(transactionid);
  }
 }
}