window.onload = (ev) => {

 // get fields text
 const name = document.getElementById('name')
 const quantity = document.getElementById('quantity')
 const image = document.getElementById('image');
 const description = document.getElementById('description')
 const message = document.getElementById('message-field');
 const price = document.getElementById('price');

 // on button click

 const button = document.getElementById('product-button');

 button.addEventListener('click', function (ev) {
  // send data to backend 

  // handle product 


  const imageHandle = async function () {
  // handle image upload
  let endpoint = 'http://localhost:4000/api/v1/product';

  // get image file
  let file = image.files[0];
  // create form data
  let formData = new FormData();
  // append file to form data
  formData.append('image', file);
  // append other data to form data
  formData.append('name', name.value);
  formData.append('type','product');
  formData.append('quantity', quantity.value);
  formData.append('description', description.value);
  formData.append('price', price.value);


  // send data to server
  let push = await fetch(endpoint, {
   method: 'POST',
   body: formData,
  })
  let response = await push.json();
  console.log(response);

  }

  if (!name.value && !quantity.value && !description.value && !price.value) {
   message.innerText = 'fill all field';
  }

  if (name.value && quantity.value && description.value && price.value) {
   message.innerText = '';
   // productHandle();
   imageHandle();
  }

 })


 const viewButton = document.getElementById('btn-view-products');

 if(viewButton != null) {
  viewButton.onclick = function(ev) {
   // change url
  window.location.href = '/viewproducts';
  }
 } 
}