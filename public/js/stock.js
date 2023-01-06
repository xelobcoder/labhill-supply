window.onload = (ev) => {
 const searchField = document.getElementById('searchproduct');
 const searchButton = document.getElementById('searchbutton');
 const qtyfield = document.getElementById('quantity');

 const stock = {};


 stock.initdata = [];

 stock.getData = async function () {
  let endpoint = '/api/v1/stock';
  let fetchData = await fetch(endpoint)
  let response = await fetchData.json();
  // set the data to the initdata
  stock.initdata = response;
  return response;
 }


 stock.displaySingle = function (name, productid, imageid) {
  // create child div
  let childiv = document.createElement('div');
  // add class
  childiv.classList.add('list-group-item-item');
  // create an image
  let img = document.createElement('img');
  // add src
  img.src = `/api/v1/image?id=${imageid}`;
  // add class
  img.classList.add('img-thumbnail', 'img-fluid');
  childiv.appendChild(img);
  // add value
  // create textnode
  let textnode = document.createTextNode(name);
  childiv.appendChild(textnode);
  // add an attribute
  childiv.setAttribute('data-id', productid);
  // create an image

  console.log(childiv);
  // return 
  return childiv;

 }


 stock.displayAllData = function (data) {
  let listheader = document.createElement('div');
  // append class
  listheader.classList.add('productlist');
  // get data 
  if (data.result && Array.isArray(data.result) && data.result.length > 0) {
   // transformed data
   let transformedData = data.result.map((item) => {
    return stock.displaySingle(item.name, item.productid, item.imageid);
   })
   // append to the list
   transformedData.forEach((item) => {
    listheader.appendChild(item);
   })
   // append to the dom
   let productdata = document.getElementById('productsearchedhere');
   productdata.appendChild(listheader);


   const productlistItem = document.querySelectorAll('.list-group-item-item');

   for (let i = 0; i < productlistItem.length; i++) {
    productlistItem[i].addEventListener('click', (ev) => {
     let productid = ev.target.getAttribute('data-id');
     // set the value of the searchfield
     searchField.value = ev.target.textContent;
     searchField.setAttribute('data-id', productid);
    })
   }

   document.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown') {
     // check the element with class productlist-active
     // if none then add class to the first child
     // loop 
     // create an array from productlistitem
     let productlistItemArray = Array.from(productlistItem);
     const activeElements = productlistItemArray.find((item) => {
      return item.classList.contains('productlist-active');
     })

     if (activeElements === undefined) {
      // make forst child active
      productlistItem[0].classList.add('productlist-active');
     }

     if (activeElements) {
      let nexttSib = activeElements.nextElementSibling;
      if (nexttSib) {
       nexttSib.classList.add('productlist-active');
       activeElements.classList.remove('productlist-active');
      }
     }
    }
   })

   // keyup event
   document.addEventListener('keyup', (ev) => {
    if (ev.key === 'ArrowUp') {
     // check the element with class productlist
     // if none then add class to the last child
     // loop
     // create an array from productlistitem
     let productlistItemArray = Array.from(productlistItem);
     const activeElements = productlistItemArray.find((item) => {
      return item.classList.contains('productlist-active');
     })

     if (activeElements === undefined) {
      // make last child active
      productlistItem[productlistItem.length - 1].classList.add('productlist-active');
     }

     if (activeElements) {
      let prevSib = activeElements.previousElementSibling;
      if (prevSib) {
       prevSib.classList.add('productlist-active');
       activeElements.classList.remove('productlist-active');
      }
     }
    }
   })

   // enter key
   document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
     // check the element with class productlist
     // if none then add class to the last child
     // loop
     // create an array from productlistitem
     let productlistItemArray = Array.from(productlistItem);
     const activeElements = productlistItemArray.find((item) => {
      return item.classList.contains('productlist-active');
     })

     if (activeElements) {
      let productid = activeElements.getAttribute('data-id');
      let productname = activeElements.textContent;
      // set the value
      searchField.value = productname;
      searchField.setAttribute('data-id', productid);
     }

     if (activeElements === undefined) {
      // make last child active
      return;
     }
    }
   })
  }

 }


 stock.queryData = function (query) {
  searchField.addEventListener('keyup', (ev) => {
   let keypressed = ev.target.value;
   // filter value from the array
   let filteredData = stock.initdata.result.filter((item) => {
    return item.name.toLowerCase().includes(keypressed.toLowerCase());
   })
   // clear the dom
   let productlist = document.querySelector('.productlist');
   if (productlist) {
    productlist.remove();
   }
   // display the data
   if (filteredData.length > 0) {
    stock.displayAllData({ result: filteredData });
   }
   else {
    let productdata = document.getElementById('productsearchedhere');
    productdata.innerHTML = `<p style={fontSize:'14px'} class="productlist">No product found</p>`;
   }
  })
 }

 stock.ArrowEvent = function () {
  const productsearchedhere = document.getElementById('productsearchedhere');
  // is display
  if (productsearchedhere) {
   // if arrow down is pressed at search field
   searchField.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown') {
     ev.preventDefault();
     let firstChild = productsearchedhere.firstElementChild.firstChild;
     firstChild.classList.add('productlist-active');
     // searchField to lose focus
     searchField.blur();
    }
   })
  }


  stock.Message = function (message, type) {
   // scroll to top
   window.scrollTo({
    top: 0,
    left: 0
   })
   // create message div
   const messageDiv = document.createElement('div');
   messageDiv.className = `alert alert-${type}`;
   let messageContainer = document.querySelector('.message-container');
   messageContainer.appendChild(messageDiv);
   messageDiv.innerHTML = message;
   messageDiv.style.fontSize = '14px';
   // timeout after 3 seconds
   setTimeout(() => {
    messageContainer.innerHTML = '';
   }
    , 3000);
  }



 }






 const onLoad = async () => {
  let data = await stock.getData();
  stock.displayAllData(data)
  stock.queryData();
  stock.ArrowEvent();
 }


 onLoad();


 // send data to the server

 const sendData = async (data) => {
  // send data to the server
  let response = await fetch('/api/v1/stock', {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json'
   },
   body: JSON.stringify(data)
  })
  let result = await response.json();

  if (result.status === 'success') {
   stock.Message('product stock updated successfully', 'success');
   // clear the form
   searchField.value = '';
   qtyfield.value = '';
  }

  if (result.status === 'error') {
   stock.Message('product not added', 'danger');
  }
 }


 // button click event


 searchButton.addEventListener('click', (ev) => {
  if (searchField.value === '') {
   alert('enter product name');
  }

  if (qtyfield.value === '') {
   alert('enter quantity');
  }

  let productname = searchField.value;
  let isproduct = stock.initdata.result.find((item) => {
   return item.name === productname;
  })

  if (isproduct) {
   const { name, productid, quantity } = isproduct;
   let addedqty = parseInt(qtyfield.value);
   let totalqty = parseInt(quantity) + addedqty;
   let data = {
    productname: name,
    productid,
    instock: quantity,
    addedqty,
    totalqty
   }
   sendData(data);
  }

  if (isproduct === undefined) {
   alert('product not found');
  }
 })


}