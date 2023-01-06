window.onload = (ev) => {

  // get fields text
  const name = document.getElementById('name')
  const quantity = document.getElementById('quantity')
  const image = document.getElementById('image');
  const description = document.getElementById('description')
  const message = document.getElementById('message-field');
  const price = document.getElementById('price');
  const minqty = document.getElementById('minqty');
  const nprice = document.getElementById('noprice');

  // on button click

  const button = document.getElementById('product-button');

  button.addEventListener('click', function (ev) {
    // send data to backend 

    // handle product 

    // add messagefiled 

    function Message(type, message) {
      function createMessage(element) {
        let div = document.createElement('div');
        // add class
        div.classList.add('alert', `alert-${type}`);
        // append message
        div.innerHTML = message;
        // append to parentELement
        element.appendChild(div)
        setTimeout(function () {
          element.style.display = 'none';
        }, 3000)
      }
      // get parent element
      const parent = document.getElementById('message-field');
      // is parent showed
      const isparent_showed = parent.style.display == 'none' ? true : false;
      // if parent is showed
      if (isparent_showed) {
        parent.style.display = 'block';
        createMessage(parent)
      }
      else {
        parent.innerHTML = '';
        createMessage(parent)
      }
    }


    const imageHandle = async function () {
      // handle image upload
      let endpoint = '/api/v1/product';

      // get image file
      let file = image.files[0];
      // create form data
      let formData = new FormData();
      // append file to form data
      formData.append('image', file);
      // append other data to form data
      formData.append('name', name.value);
      formData.append('type', 'product');
      formData.append('quantity', quantity.value);
      formData.append('description', description.value);
      formData.append('price', price.value);
      formData.append('minqty', minqty.value);
      formData.append('nprice', nprice.value);


      // send data to server
      let push = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })
      let response = await push.json();
      return response;
    }

    if (!name.value && !quantity.value && !description.value && !price.value) {
      message.innerText = 'fill all field';
    }


    if (nprice.value.length == 0) {
      alert('fill in price without profit')
    }

    if (name.value && quantity.value && description.value && price.value) {
      message.innerText = '';
      // productHandle();
      imageHandle()
        .then((response) => {
          if (response.status == 'success') {
            Message('success', response.message)
            // clear the form
            document.querySelector('.newproductform').reset()
          }
          else {
            Message('error', response.message)
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  })


  const viewButton = document.getElementById('btn-view-products');

  if (viewButton != null) {
    viewButton.onclick = function (ev) {
      // change url
      window.location.href = '/viewproducts';
    }
  }


}