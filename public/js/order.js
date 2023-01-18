window.onload = (ev) => {
  let orderdate = document.getElementById("orderdate");
  let customerName = document.getElementById("customerName");
  let billingAddress = document.getElementById("billingAddress");
  let transactionid = document.getElementById("transactionid");
  let buttonQuery = document.getElementById("buttonQuery");



  class orders {
    foundCustomersList(data) {
      // create a nice list of customers
      let customerListParent = document.createElement("div");
      // add class
      customerListParent.classList.add('list-group');
      // create child elements function
      function createChildElements(customer) {
        let child = document.createElement('list-group-item');
        return child;
      }
      // append child elements to parent
      if (data.length === 0) {
        return `<div> No customers found </div>`
      }
      else {
        data.forEach((customer) => {
          customerListParent.appendChild(createChildElements(customer));
        })

        return customerListParent;
      }
    }


    AppendCustomerList(data) {
      let customFoundSection = document.getElementById("customFoundSection");

      if (customFoundSection) {
        customFoundSection.remove();
        customFoundSection.appendChild(this.foundCustomersList(data));
      }
    }


    AppendCartProducts(cart) {
      if (cart.length == 0) {
        return `<tr> <td colspan='4'> No products found </td> </tr>`
      }
      else {
        let cartProducts = cart.map((product) => {
          return `<tr>
          <td>${product.productid}</td>
          <td>${product.productname}</td>
          <td>${product.quantity}</td>
          <td>${product.price}</td>
          </tr>`
        })

        // append to table body
        const tbody = document.getElementById("order-tbody");
        tbody.innerHTML = cartProducts.join('');
      }
    }


    AppendClientDetails(clientDetails) {
      let textBasedNodes = document.querySelectorAll('.-xxx');
      let client = textBasedNodes[0];
      let email = textBasedNodes[1];
      let phone = textBasedNodes[2];
      let address = textBasedNodes[3];
      const { clientName, clientEmail, ClientPhone } = clientDetails;
      client.innerHTML = clientName;
      email.innerHTML = clientEmail;
      phone.innerHTML = ClientPhone;
    }





  }

  buttonQuery.addEventListener("click", (ev) => {
    const carryGo = function () {
      fetch(`/api/v1/orders?transactionid=${transactionid.value}&orderdate=${orderdate.value}&customerName=${customerName.value}&billingAddress=${billingAddress.value}`)
        .then((response) => {
          return response.json();
        }
        )
        .then((data) => {
          console.log(data);
        }
        )
        .catch((err) => { console.log(err) })
    }


    if (transactionid.value === '') {
      let notKnownTransactionid = confirm("Transaction ID is not known. Do you want to continue?");
      if (notKnownTransactionid) {
        carryGo();
      }
      else {
        // do nothing
      }
    }
    else {
      carryGo();
    }
  })
}