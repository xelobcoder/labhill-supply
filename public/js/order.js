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
      
      if (data.length == 0) {
        return `<div> No customers found </div>`
      }
      else {

        // add class
      customerListParent.classList.add('list-group-list-group');
      // create child elements function
      let datelement = document.createElement("div");
      let namelement = document.createElement("div");
      let addresslement = document.createElement("div");
      let viewbtn = document.createElement("button");

      // add class to each child
      datelement.classList.add('list-group-item-list');
      namelement.classList.add('list-group-item-list');
      addresslement.classList.add('list-group-item-list');
      viewbtn.classList.add('btn', 'btn-primary', 'float-right');
      viewbtn.setAttribute('id','viewbtn');


      // append the data
      datelement.innerHTML = data.date;
      namelement.innerHTML = data.paymentTo;
      addresslement.innerHTML = data.transactionid;
      viewbtn.innerHTML = 'View';

      // append the children to the parent
      customerListParent.appendChild(datelement);
      customerListParent.appendChild(namelement);
      customerListParent.appendChild(addresslement);
      customerListParent.appendChild(viewbtn);

      return customerListParent;
      }

    }


    AppendCustomerList(data) {
      let customFoundSection = document.getElementById("customFoundSection");

      if (customFoundSection) {
        // clear the section
        customFoundSection.innerHTML = '';
        // make it visible
        customFoundSection.style.display = 'block';

        // append the data
        data.forEach((customer) => {
          customFoundSection.appendChild(this.foundCustomersList(customer));
        })
  
      }
    }


    AppendCartProducts(cart) {
      let cartpanel = document.getElementById("order-cart-item");
      cartpanel.style.display = 'block';

      if (cart.length == 0) {
        return `<tr> <td colspan='4'> No products found </td> </tr>`
      }
      else {
        let cartProducts = cart.map((product, index) => {
          return `<tr>
          <td>${index + 1}</td>
          <td>${product.name}</td>
          <td>${product.quantity}</td>
          <td>${product.price}</td>
          <td>${product.totalcost}</td>
          </tr>`
        })

        // append to table body
        const tbody = document.getElementById("order-tbody");
        tbody.innerHTML = cartProducts.join('');
      }
    }


    AppendClientDetails(clientDetails) {
      let textBasedNodes = document.querySelectorAll('.-xxx');
      // clear all children 
      textBasedNodes.forEach((node) => {
        node.innerHTML = '';
      })
      // make visible
      let clientDetailSection = document.getElementById("order-client-details");
      clientDetailSection.style.display = 'block';
      // append to the DOM
      let client = textBasedNodes[0];
      let email = textBasedNodes[1];
      let phone = textBasedNodes[2];
      let address = textBasedNodes[3];
      const { clientName, clientEmail, clientPhone, clientAddress } = clientDetails;
      client.innerHTML = clientName;
      email.innerHTML = clientEmail || 'Not provided';
      phone.innerHTML = clientPhone || 'Not provided';
      address.innerHTML = clientAddress || 'Not provided';
    }


    AppendFinancialDetails(financialDetails) {
      // create a nice list of the finacual payment details
      const { amountdue, amountpaid, discount, paymentmode, totalTax } = financialDetails;
      let balancedue = amountdue - amountpaid;

      let totalcost = `<div> Total cost: ${amountdue} </div>`;

      let paidAmount = `<div> Paid amount: ${amountpaid} </div>`;

      let discounted = `<div> Discount: ${discount} </div>`;

      let balance = `<div> Balance: ${balancedue} </div>`;

      let tax = `<div> Total Tax Applied: ${totalTax} </div>`;

      let paymentMethod = `<div> Payment method: ${paymentmode} </div>`;

      // append to the DOM
      let paymentSection = document.querySelector('.payment-section');
      // clear the section
      paymentSection.innerHTML = '';
      // make it visible
      paymentSection.style.display = 'block';
      // append the data

      // payment section header
      let paymentSectionHeader = `<div class='text-center' id='ph'> Payment details </div>`;
      paymentSection.innerHTML = paymentSectionHeader +
        totalcost + paidAmount + discounted + balance + paymentMethod +
        tax;


      let paySectChildren = paymentSection.children;

      // add class to each child
      for (let i = 0; i < paySectChildren.length; i++) {
        paySectChildren[i].classList.add('text-left');
      }

      // if amount due is greater than amount paid, then add a class to the balance
      if (balancedue > 0) {
        paySectChildren[4].classList.add('text-warning');
      }

      if (balancedue < 0) {
        paySectChildren[4].classList.add('text-danger');
      }
    }


    AppendTaxlist(taxlist) {
      let taxSection = document.querySelector(".taxes-list");
      taxSection.style.display = 'block';

      if (taxlist.length == 0) {
        return `<div> No taxes applied </div>`
      }
      else {
        // tax header
        let taxHeader = `<div class='text-center' id='th'> Taxes applied </div>`;
        let taxList = taxlist.map((tax, index) => {
          return `<div> ${tax.taxname}: ${tax.rate} </div>`
        })

        // append to table body
        taxSection.innerHTML = taxHeader + taxList.join('');
      }

    }


    AppendAllData(data) {
      let cart = data.transactionHistory.cart;
      let paymentDetails = data.transactionHistory.payment;
      let taxApplied = data.transactionHistory.taxapplied;
      let discountDetails = data.transactionHistory.discount;

      let order = new orders;
      order.AppendCartProducts(cart);

      // append client details
      const { paymentTo, deliveryaddress, email, phone } = paymentDetails[0];

      let clientDetails = {
        clientName: paymentTo,
        clientEmail: email,
        ClientPhone: phone || null,
        clientAddress: deliveryaddress || null
      }
      order.AppendClientDetails(clientDetails);
      order.AppendFinancialDetails(paymentDetails[0]);
      order.AppendTaxlist(taxApplied);
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
          if (data.status === 'success') {
            let order = new orders;
            let mkq = document.querySelector("#mkq");
            mkq.style.display = 'none';
            order.AppendAllData(data);
            console.log(data.transactionHistory);
          }
          else {

            console.log(data)
            if (data.status === 'incomplete' && data.data) {
              let datalist = data.data;
              if (datalist.length === 0) {
                alert('No data found');
                 //  make the payment section invisible
                 let paymentSection = document.querySelector('.payment-section');
                 paymentSection.style.display = 'none';
                 // make the client details section invisible
                 let clientDetailSection = document.getElementById("order-client-details");
                 clientDetailSection.style.display = 'none';
                 // make the tax section invisible
                 let taxSection = document.querySelector(".taxes-list");
                 taxSection.style.display = 'none';
                 // make the cart section invisible
                 let cartSection = document.querySelector("#order-cart-item");
                 cartSection.style.display = 'none';
                 // create default view
                 let mkq = document.querySelector("#mkq");
                 mkq.style.display = 'block';
                 mkq.innerHTML = `<h4 class='text-center mt-0 p-5 bg-white text-danger'> No order found </h4>`;

              } else {
                // remove block of mkq if it exists
                let mkq = document.querySelector("#mkq");
                mkq.style.display = 'none';
                let order = new orders;
                order.AppendCustomerList(datalist);
              }
            }
            else if (data.status === 'incomplete' && !data.data) {
              // remove custom found children
              let customerFound = document.querySelector("#customFoundSection");
              customerFound.innerHTML = '';
              // display not found message
              let mkq = document.querySelector("#mkq");
              mkq.style.display = 'block';
              mkq.innerHTML = `<h4 class='text-center mt-0 p-5 bg-white text-danger'> No order found </h4>`;
              
            } else {
              alert(data.message);
            }
          }
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