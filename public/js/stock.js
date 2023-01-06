window.onload = (ev) => {
 const searchField = document.getElementById('searchproduct');
 const searchButton = document.getElementById('searchbutton');
 const qtyfield = document.getElementById('quantity');

 const stock = {};

 stock.getData = async function () {
  let endpoint = '/api/v1/stock';
  let fetchData = await fetch(endpoint)
  let response = await fetchData.json();
  return response;
 }


 stock.displaySingle = function (name, productid) {
  // create child div
  let childiv = document.createElement('div');
  // add class
  childiv.classList.add('list-group-item-item');
  // add value
  childiv.innerHTML = name;
  // add an attribute
  childiv.setAttribute('data-id', productid);
  // return 
  return childiv;
 }


 stock.displayAllData = function () {
  let listheader = document.createElement('div');
  // append class
  listheader.classList.add('productlist');
  // get data 
  stock.getData()
   .then((data) => {
    if (data.result && Array.isArray(data.result) && data.result.length > 0) {
     // transformed data
     let transformedData = data.result.map((item) => {
      return stock.displaySingle(item.productname, item.productid);
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
       let productname = ev.target.innerHTML;
       // set the value
       searchField.value = productname;
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
     document.addEventListener('keyup', (ev) => {
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
        let productname = activeElements.innerHTML;
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
   })

 }


 stock.queryData = function (query) {
  searchField.addEventListener('keyup', (ev) => {
   let keypressed = ev.target.value;

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

 }






 stock.displayAllData()
 stock.queryData();
 stock.ArrowEvent();
}