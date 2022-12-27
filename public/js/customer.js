window.onload = function () {
  class Customer {
    constructor(name, email, phone) {
      this.name = name;
      this.email = email;
      this.phone = phone;
    }
    // create a message log
    createMessage(message, type) {
      let messageLog = document.getElementById('message-log');
      // add margin to the top
      messageLog.style.paddingTop = '20px'
      // create a div
      let div = document.createElement('div');
      // add classes
      div.className = `alert alert-${type}`;
      // add text
      div.appendChild(document.createTextNode(message));
      // insert into DOM
      if (messageLog.hasChildNodes()) {
        messageLog.innerHTML = '';
        messageLog.appendChild(div);
        // set timeout
        setTimeout(function () {
          messageLog.innerHTML = '';
        }, 3000);
      }
      else {
        messageLog.appendChild(div);
        // set timeout
        setTimeout(function () {
          messageLog.innerHTML = '';
        }, 3000);
      }
    }

    validateForm() {
      let form = document.getElementById('nwcustomerform');
      // get form values
      let formdata = {
        name: form.customerName.value,
        email: form.customerEmail.value,
        phone: form.customerPhone.value,
        address: form.customerAddress.value,
        status: form.customerStatus.value,
      }

      // error count 
      let emptyfieldCount = 0;
      // get the location of message 
      const messageLog = document.getElementById('message-log');
      // loop through for enmpty field values
      for (let key in formdata) {
        if (formdata[key] === '') {
          this.createMessage('Please fill in all fields.', 'danger');
          emptyfieldCount++;
          return false;
        }
        else {
          return formdata;
        }
      }
    }

    async forwardToDb() {
      let formvalidation = this.validateForm();

      if (!formvalidation) {
        return
      }

      if (formvalidation) {
        let endpoint = 'http://localhost:4000/api/v1/customers';
        let response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formvalidation)
        });
        let data = await response.json();
        console.log(data);
        if (data.status === 'success') {
          this.createMessage(data.message, 'success');
          // clear form
          document.getElementById('nwcustomerform').reset();
        }

        if (data.status === 'error') {
          this.createMessage(data.message, 'danger');
        }

        if (data.status === 'incomplete') {
          this.createMessage(data.message, 'warning');
        }

        if (data.status === 'info') {
          this.createMessage(data.message, 'info');
        }

      }

    }

  }

  let name = document.getElementById('customerName');
  let email = document.getElementById('customerEmail');
  let phone = document.getElementById('customerPhone');

  let customer = new Customer(name.value, email.value, phone.value);

  // save button
  let saveBtn = document.getElementById('savebtn');
  // add event listener
  saveBtn.addEventListener('click', function (e) {
    e.preventDefault();
    customer.forwardToDb()
  })

  
}





