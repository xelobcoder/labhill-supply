window.onload = (ev) => {
  let url = window.location.href.split('?')[1];
  let keys = url.split('=');
  // check if url has transaction id
  if (keys.includes('transactionid')) {
    let transactionid = parseInt(keys[1]);
    if (transactionid) {
      // display cart data
      function displayCartData(data, product) {
        // parse for the selected product to get image
        function getProductImage(productname) {
          if (product && product.length > 0) {
            let selectedproduct = product.filter((item) => {
              return item.name == productname;
            })
            return selectedproduct[0].imageid;
          }
        }

        // get product Price
        function getProductPrice(productname) {
          if (product && product.length > 0) {
            let selectedproduct = product.filter((item) => {
              return item.name == productname;
            })
            return selectedproduct[0].price;
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
            // create price div
            let price = document.createElement('div');
            // add classList
            price.classList.add('price');
            // create total div
            // add price
            price.innerHTML = getProductPrice(item.productname);
            // create total div
            let total = document.createElement('div');
            // add classList
            total.classList.add('total');
            // add total
            total.innerHTML = item.totalcost;
            // append to div
            div.appendChild(img);
            div.appendChild(product);
            div.appendChild(quantity);
            div.appendChild(price);
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

      // display transaction details

      function paymentStructures(transactions, products, cart, taxapplied, discountApplied) {
        let subtotalField = document.getElementById('subtotal');
        let taxField = document.getElementById('tax');
        let shippingField = document.getElementById('shipping');
        let totalField = document.getElementById('total');
        // display tax html
        let taxdisplay = function (totalcost) {
          if (taxapplied.length > 0) {
            let taxHtml = taxapplied.map((item, index) => {
              let total = (totalcost / 100) * item.rate;
              return (
                ` <div>
           <div id='taxname'>${item.taxname} </div>
           <div id='taxrate'>rate (${item.rate} %)</div>
           <div id='taxtotal'>${total} </div>
         </div>               
        `
              )
            })
            taxField.innerHTML = taxHtml.join('');
          }
          else {
            return null
          }
        }

        taxdisplay(transactions[0].totalcost);


        // display discount html
        let discountdisplay = function (discountObject) {
          console.log(discountObject)
          if (discountObject.length > 0) {
            let discountAmount = discountObject[0].discount;
            // get discount html
            let discountHtml = document.getElementById('discount');
            // display discount html
            discountHtml.innerHTML = parseInt(discountAmount);
            // rrturn discount
            return discountAmount;
          }
        }

        discountdisplay(discountApplied);

        // append subtotal value
        subtotalField.innerHTML = transactions[0].totalcost + ' ';

        function CalculateTotalTax() {
          // reduce tax 
          function totalTax(taxArray) {
            let taxesValues = [];
            const isHas = Array.isArray(taxArray) && taxArray.length > 0 ? true : false;

            if (isHas) {
              for (let i = 0; i < taxArray.length; i++) {
                let percentage = (parseFloat(taxArray[i]['rate']) / 100) * transactions[0].totalcost;
                // push to array
                taxesValues.push(percentage)
              }
              // reduce taxesValues 
              let sum = taxesValues.reduce((prev, current) => {
                return prev + current;
              })

              return sum;
            }
            else {
              return 'No tax Applied for transaction'
            }

          }

          let taxesSum = totalTax(taxapplied);

          return taxesSum;
        }

        // append total to DOM


        // function to calculate total cost using subtotal tax and discount

        function calculateTotalCost() {
          // get discount
          let discount = discountApplied.length > 0 ? discountApplied[0].discount : 0;
          // get tax
          let totalTax = taxapplied.length > 0 ? CalculateTotalTax() : 0;
          // get subtotal
          let subtotal = transactions[0].totalcost;
          // calculate total
          let total = subtotal + totalTax - discount;
          // appenf to DOM
          totalField.innerHTML = total + ' ' + 'GHC'
          // return total
          return total;
        }

        // calculate total cost
        calculateTotalCost();



        // provide shipping route 

        function ProvideDeliveryAddress() {
          let input = document.createElement('textarea');
          // set class attriibute
          input.classList.add('form-control', 'text-dark');
          // add id attru
          input.setAttribute('id', 'deliveryaddress');
          input.style.height = '60px';
          // add to field
          shippingField.appendChild(input);
        }

        ProvideDeliveryAddress()




        function ProvidePaymentField() {
          let input = document.createElement('input');
          // set attribute 
          input.classList.add('form-control', 'payment-field', 'text-dark');
          // add id
          input.setAttribute('id', 'paymentfield');
          // get payment field;
          let paymentField = document.querySelector('#payment-field-holder');
          // append child
          paymentField.appendChild(input);
        }


        function ProvidePayToQuery() {
          function Getalllist(parentBody, customers) {
            let listitems = document.querySelectorAll('.paytolist');
            // loop

            listitems.forEach((item, index) => {
              // add event listener
              item.addEventListener('click', function (ev) {
                payTo.value = ev.target.innerHTML;
                // remove parent body nodes
                if (parentBody.hasChildNodes()) {
                  parentBody.style.display = 'none'
                } else {
                  return;
                }
                let name = ev.target.innerHTML;
                let address = customers.find((item) => { return item.name == name }).address;
                // get delivery address
                document.getElementById('deliveryaddress').innerHTML = address;
              })
            })
          }

          let payTo = document.getElementById('payto');

          async function getCustomersDaata() {
            let getdata = await fetch('/api/v1/customers');
            let response = await getdata.json();
            return await response;
          }
          getCustomersDaata()
            .then((data) => {
              let parentBody = document.getElementById('paytoquery');
              // get payto
              payTo.addEventListener('keypress', (e) => {
                let pressedValues = e.target.value;
                // if value is not null
                if (data.data.length > 0 && pressedValues.length > 0) {
                  let customers = data.data;
                  // filter customers
                  let filteredData = customers.filter((item, index) => {
                    return item.name.startsWith(pressedValues)
                  })
                  //  transform the data
                  let TransformedData = filteredData.map((item, index) => {
                    return `<div class='paytolist' >${item.name}</div>`;
                  })
                  // add to parent body
                  parentBody.style.display = 'block';
                  parentBody.innerHTML = TransformedData.join('');
                  Getalllist(parentBody, customers);
                }
              })
            })
            .catch((err) => { return })
        }

        ProvidePayToQuery();


        ProvidePaymentField()


        // submit payment
        function submitPayment() {
          let payment = {
            transactionid: transactionid,
            paymentmode: document.getElementById('paymentmethod').value,
            deliveryaddress: document.getElementById('deliveryaddress').value,
            totalcost: document.getElementById('total').innerHTML,
            paymentTo: document.getElementById('payto').value,
            paidAmount: parseInt(document.getElementById('paymentfield').value),
            subtotal: transactions[0].totalcost,
            tax: CalculateTotalTax(),
            total: parseInt(calculateTotalCost()),
            discount: discountdisplay(discountApplied) || 0,
          }

          console.log(payment)

          let target = 0;

          for (const key in payment) {
            if (payment.hasOwnProperty(key)) {
              if (payment[key] === '') {
                alert('Please fill all fields')
                return
              }
              else {
                target++;
              }
            }
          }

          if (target === 10) {
            if (payment.paidAmount > payment.totalcost) {
              alert('Please pay the exact amount or less. NB:.NB:Amout paid must be equal to total cost\n' + 'Total cost: ' + payment.totalcost + '\n' + 'Amount paid: ' + payment.paidAmount + '\n' + 'Amount to be paid: ' + payment.totalcost + '\n' + 'Amount to be returned: ' + (parseInt(payment.paidAmount) - parseInt(payment.totalcost) + ' ' + 'GHC')
              )
            }
            else {
              // send to server
              fetch('/api/v1/payments', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payment) })
                .then((data) => { return data.json() })
                .then((data) => {
                  if (data.status == 'info') {
                    alert(data.message);
                    // window.location.href = '/dashboard';
                  }

                  if (data.status == 'success') {
                    alert(data.message);
                    // create a dialog 
                    let question = confirm('Do you want to print an invoice?');
                    if (question) {
                      // print invoice
                      window.print();
                    }
                    else {
                      let questionEmail = confirm('Do you want to send an invoice to the customer via Email?');

                      if (questionEmail) {
                        // send email
                        console.log('send email')
                      } else {
                        window.location.href = '/';
                      }
                    }
                  }
                })
                .catch((err) => console.log(err))
            }
          }
        }



        let paymentButton = document.getElementById('payment-button');

        paymentButton.addEventListener('click', (e) => {
          e.preventDefault();
          submitPayment();
        })

      }



      // get data from server
      function getData(transactionid) {
        fetch(`/api/v1/transaction/?transactionid=${transactionid}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            displayCartData(data.cart, data.product);
            paymentStructures(data.transaction, data.product, data.cart, data.taxesApplied, data.discountApplied);
          })
      }
      getData(transactionid);




    }


    // display payment sttuctures
  }




}


