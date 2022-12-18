window.onload = (ev) => {
 // get all inputs 
 let inputs = document.querySelectorAll('input');
 // loop through inputs

 // change border color to red if input is required and value is empty

 function changeBorder(ev, color) {
  ev.style.borderColor = color;
 }
 for (let i = 0; i < inputs.length; i++) {
  // get input
  let input = inputs[i];
  // add event listener
  input.addEventListener('blur', (ev) => {
   if (input.hasAttribute('required')) {
    // create span element to display error message
    let span = document.createElement('span');
    // add class to span
    span.classList.add('error-text');
    // get parent of input
    let parent = input.parentNode;
    // get next sibling of input
    let nextSibling = input.nextElementSibling;
    // if next sibling is null and input value is empty
    if (input.value == '') {
     if (nextSibling == null) {
      // add span to parent
      parent.appendChild(span);
      // add text to span
      span.innerHTML = 'This field is required';
      // change border color to red
      changeBorder(input, 'red');
     }
    }
    else {
     if (nextSibling != null) {
      // remove span from parent
      parent.removeChild(nextSibling);
      // change border color to green
      changeBorder(input, 'green');
     }
    }

   }
  })


 }


 // handle product view 
 const listGroup = async function () {
  const sectionHeadliner = document.querySelector('.list-view-group');
  if (sectionHeadliner) {
   function createElement() {
    let parent = document.createElement('div');
    parent.classList.add('list-group');
    // create an image tag
    const imgTag = document.createElement('img');
    // now append image Tag
    parent.appendChild(imgTag);
    imgTag.classList.add('resize-img')
    // append element to parent element
    let counter = 0;
    while (counter < 4) {
     let childElement = document.createElement('div');
     childElement.classList.add('list-group-item');
     parent.appendChild(childElement)
     counter++;
    }
    // return parent 
    return parent;
   }
   // append Text 

   function AppendText(name, desc, quantity, price, imagepath, dataid) {
    const parent = createElement();
    // make img first to be resolved 
    let image = parent.firstChild;
    image.src = `http://localhost:4000/api/v1/image?id=${imagepath}`;
    // add selected attrbute to image
    image.setAttribute('selected', 'false');
    // return parent
    // append values to created element
    let productName = image.nextSibling;
    productName.innerHTML = 'product Name: ' + '' + name;
    // second element
    let description = productName.nextSibling;
    description.innerHTML = 'description:' + ' ' + desc;

    // third element 
    let priceElement = description.nextSibling;
    priceElement.innerText = 'price: ' + " " + price + ' GHC';
    // add quantity value
    let quantityElement = priceElement.nextSibling;
    quantityElement.innerText = 'available stock: ' + '' + quantity;
    // add image 
    parent.setAttribute('data-id', dataid);
    console.log(parent);
    return parent
   }

   async function getDataSource() {
    let getdata = await fetch('http://localhost:4000/api/v1/product')
    let response = await getdata.json();
    return response;
   }

   // get data 

   let FetchedData = await getDataSource().catch((err) => { throw err })


   // defautl view if fetched DATA IS EMPTY 

   function DefaultView() {
    // create a div holder
    let DivHolder = document.createElement('div');
    // attach classlist of alert-info
    DivHolder.classList.add('alert');
    DivHolder.classList.add('alert-info');
    DivHolder.setAttribute('id', 'no-product-found');
    // create a text node
    let textNode = document.createElement('h2');
    textNode.innerHTML = 'Empty Product List. click on the button above to add a product';
    // append text node to div
    DivHolder.appendChild(textNode);
    // add suugestion div as a span element
    let suggestion = document.createElement('div');
    suggestion.classList.add('alert-link');
    suggestion.innerHTML = 
    `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z"/>
    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
  </svg>`
    // append suggestion to div
    DivHolder.appendChild(suggestion);
    // append div to section
    sectionHeadliner.appendChild(DivHolder);
   }

   function AppendToDocument(datasource) {
    if (datasource.length == 0) {
     DefaultView();
    }
    else {
     datasource.forEach((item, index) => {
      let productname = item.name;
      let productPrice = item.price;
      let quantity = item.quantity;
      let imagepath = item.imageid;
      let description = item.description;
      let dataid = item.productid;

      let finalProduct = AppendText(productname, description, quantity, productPrice, imagepath, dataid);
      // append product list to main body
      sectionHeadliner.appendChild(finalProduct)
     })
    }

   }

   AppendToDocument(FetchedData)

   // array to hold id of selected items
   let selectedItems = [];

   // this function enlarges image when hover on

   function MouseOverEffect() {
    let imageDiv = document.querySelectorAll('.resize-img');
    // loop over image
    for (let i = 0; i < imageDiv.length; i++) {
     // get single image
     let img = imageDiv[i];
     // create button for editing and position it on img top
     function ImageButton() {
      let elementDiv = document.createElement('button');
      elementDiv.setAttribute('id', 'product-edit-button');
      elementDiv.classList.add('btn')
      elementDiv.classList.add('btn-warning')
      elementDiv.innerText = 'Edit'
      return elementDiv;
     }
     // add a mouseneter listerner
     img.addEventListener('mouseenter', (ev) => {
      img.style.height = '36vh';
      img.nextSibling.style.color = 'blue';
      img.nextSibling.style.fontSize = '1.5rem';
      // make border to show that it is selected
      img.style.border = '1px solid lightgray';
     })
     // add mouseleave event listener
     img.addEventListener('mouseleave', (ev) => {
      img.style.height = '30vh';
      img.nextSibling.style.color = 'black';
      img.nextSibling.style.fontSize = '1rem';
      // remove border if attibute is false
      if (img.getAttribute('selected') == 'false') {
       img.style.border = 'none';
      }

     })

     // add click event listener to delete and edit button
     img.addEventListener('click', (ev) => {
      // turn border green to signal selection
      img.parentElement.style.border = '1px solid red';
      // change selected attribute to true
      img.setAttribute('selected', 'true');
      // reduce height of parent by 5vh
      // img.parentElement.lastElementChild.remove();
      img.parentElement.style.height = '36vh';
      // add parent dataid to selected items array
      selectedItems.push(parseInt(img.parentElement.getAttribute('data-id')));
     })

     // double click to deselect
     img.addEventListener('dblclick', (ev) => {

     })
    }
   }

   MouseOverEffect()

   // handle View Search

   function SearchViewHandle() {
    let searchDiv = document.getElementById('searchproducts');
    // get search value
    searchDiv.addEventListener('keypress', function (ev) {
     let pressedValue = ev.target.value;
     let MatchQuery = FetchedData.filter((item, index) => {
      return (new String(item.name).toLowerCase().startsWith(pressedValue.toLowerCase()) || new String(item.name).toLowerCase().includes(pressedValue.toLowerCase()));
     })
     // // remove all dom element from searchHeadliner
     // let target = sectionHeadliner.children.length;
     // // counter 
     // let counter = 0;
     // // remove incrematally all children node
     // while (counter < target) {
     //  sectionHeadliner.remove(sectionHeadliner.firstElementChild)
     //  counter++;
     // }
     // call AppendToDocument
     sectionHeadliner.innerHTML = ''
     AppendToDocument(MatchQuery);
    })
   }

   SearchViewHandle();

   // remove selection border status from selected items\
   function RemoveSelection() {
    // change all selected attribute to false
    let selectedImages = document.querySelectorAll('[selected="true"]');
    // loop over selected images
    for (let i = 0; i < selectedImages.length; i++) {
     // get single image
     let img = selectedImages[i];
     // change attribute to false
     img.setAttribute('selected', 'false');
     // remove border
     img.style.border = 'none';
     // remove parent border
     img.parentElement.style.border = 'none';
     // remove parent height
     img.parentElement.style.height = '30vh';
     // remove parent dataid from selected items array

    }
   }

   // handle delete button
   function DeleteButtonHandle() {
    let deleteButton = document.getElementById('maj-delete');
    deleteButton.addEventListener('click', (ev) => {
     let choice = window.confirm('Are you sure you want to delete this item?')
     if (choice) {
      // send delete request to server
      let deleteRequest = fetch('http://localhost:4000/api/v1/product', {
       method: 'DELETE',
       headers: {
        'Content-Type': 'application/json'
       },
       body: JSON.stringify({
        productid: selectedItems
       })
      })
      // get response
      let response = deleteRequest.then((res) => res.json());
      // handle response
      response.then((data) => {
       // remove all dom element from searchHeadliner
       let target = sectionHeadliner.children.length;
       // counter 
       let counter = 0;
       // remove incrematally all children node
       while (counter < target) {
        sectionHeadliner.remove(sectionHeadliner.firstElementChild)
        counter++;
       }
       // call AppendToDocument
       AppendToDocument(FetchedData);
      })
     } else {
      let secondOpts = 'Do you remove the selection?'
      // ask user if he wants to remove selection
      let secondChoice = window.confirm(secondOpts);
      if (secondChoice) {
       RemoveSelection()
      }
     }
    })

   }

   DeleteButtonHandle();



  }




 }

 listGroup()
}