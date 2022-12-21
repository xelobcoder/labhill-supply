window.onload = (ev) => {
 // FUNCTION TO DEAL WITH PAGE TAX AND DISCOUNT
 let taxName = document.getElementById('tax-name');
 let taxRate = document.getElementById('tax-rate');

 class Tax {
  constructor(name, rate) {
   this.name = name;
   this.rate = parseFloat(rate);
  }

  async PostTax() {
   let TaxObject = {
    name: this.name,
    rate: this.rate
   }
   let response = await fetch('/api/v1/tax', {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json'
    },
    body: JSON.stringify(TaxObject)
   })
   let data = await response.json();
   return data;
  }

  async GetTax() {
   let response = await fetch('/api/v1/tax');
   let data = await response.json();
   return data;
  }


  createAmessageLog(type, typeMessage) {
   console.log(typeMessage, type)
   let messageLog = document.getElementById('message-log');
   let message = document.createElement('div');
   if (type === 'success') {
    message.setAttribute('class', 'alert alert-success');
   }
   if (type === 'error') {
    message.setAttribute('class', 'alert alert-danger');
   }
   if (type === 'warning') {
    message.classList.add('alert', 'alert-warning');
   }
   message.setAttribute('role', 'alert');
   message.innerHTML = typeMessage;
   messageLog.appendChild(message);
   setTimeout(() => {
    messageLog.removeChild(message);
   }, 3000);
   console.log(typeMessage)
  }


  ApplyTax(element) {
   let dataid = element.getAttribute('data-id');
   //  check if element is checked
   const ischecked = element.checked ? 'TRUE' : 'FALSE';
   // send to server
   fetch(`/api/v1/tax?taxapplied=${ischecked}&&taxid=${dataid}`)
    .then((data) => {
     return data.json();
    })
    .then((data) => {
     if (data.message == 'Tax applied status updated') {
      this.createAmessageLog('success', data.message + '.This will affect all products')
     }
    })
    .catch((err) => console.log(err))
  }


  async DeleteTaxId(id) {
   // delete a tax using the id
   fetch(`/api/v1/tax`, {
    method: 'DELETE',
    headers: {
     'Content-Type': 'application/json'
    },
    body: JSON.stringify({ taxid: id })
   }).then((data) => {
    return data.json()
   })
    .then((data) => {
     console.log(
      data
     )
     if (data.status == 'success') {
      this.createAmessageLog('success', data.message);
      this.createTaxTable(data.result)
     }
    })
    .catch((err) => console.log(err))
  }

  async updateTaxApplied(id, status) {
   let response = await fetch(`/api/v1/tax?taxapplied=${status}&&taxid=${id}`);
   let data = await response.json();
   return data;
  }


  async deleteTax(id) {
   let response = await fetch(`/api/v1/tax`, {
    method: 'DELETE',
    headers: {
     'Content-Type': 'application/json'
    },
    body: JSON.stringify({ taxid: id })
   });
   let data = await response.json();
   return data;
  }

  createTaxTable(data) {
   let taxTableBody = document.getElementById('taxes-tbody');
   if (Array.isArray(data) && data.length > 0) {
    let taxHtml = data.map((item, index) => {
     return (
      `
      <tr>
      <td>${index + 1}</td>
      <td>${item.taxname}</td>
      <td>${item.taxrate}</td>
      <td>
     <button class="btn btn-danger btn-sm" id="delete-tax" data-id="${item.taxid}">
       <svg
         xmlns="http://www.w3.org/2000/svg"
         width="16"
         height="16"
         fill="currentColor"
         class="bi bi-trash-fill"
         viewBox="0 0 16 16"
         data-id='${item.taxid}'
       >
         <path data-id='${item.taxid}'
           d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"
         />
       </svg>
     </button>
     <button class="btn btn-primary btn-sm" id="edit-tax" data-id="${item.taxid}">
       <svg
         xmlns="http://www.w3.org/2000/svg"
         width="16"
         height="16"
         fill="currentColor"
         data-id='${item.taxid}'
         class="bi bi-pen"
         viewBox="0 0 16 16"
       >
         <path  data-id='${item.taxid}'
           d="m13.498.795.149-.149a1.207  1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
         />
       </svg>
     </button>
   </td>
   <td>
     <input
     ${item.taxapplied == 'TRUE' ? 'checked' : ''}
      type='checkbox'
       id="tax-checkbox"
       min="0"
       max="1"
       data-id="${item.taxid}"
     />
   </td>
   </tr>

      `
     )
    })
    if (taxTableBody.hasChildNodes()) {
     // clear the table body
     taxTableBody.innerHTML = '';
     // add the new data
     taxTableBody.insertAdjacentHTML('beforeend', taxHtml.join(''))
    }
    else {
     taxTableBody.innerHTML = taxHtml.join('')
    }

    let allCheckBox = document.querySelectorAll('#tax-checkbox');

    allCheckBox.forEach((item) => {
     item.addEventListener('click', (ev) => {
      // get tax id
      let id = parseInt(ev.target.getAttribute('data-id'));
      // get checked status
      let status = ev.target.checked ? 'TRUE' : 'FALSE';
      // update tax applied
      this.updateTaxApplied(id, status).then((data) => {
       // get response from server
       if (data.status == 'success') {
        this.createAmessageLog('success', data.message);
        this.GetTax().then((data) => {
         // display the data 
         this.createTaxTable(data)
        })
       }
      })
     })
    })

    // get all delete buttons
    let allDeleteBtn = document.querySelectorAll('#delete-tax');
    // add event listener to all delete buttons
    allDeleteBtn.forEach((item) => {
     item.addEventListener('click', (ev) => {
      // get tax id
      let id = parseInt(ev.target.getAttribute('data-id'));
      // delete tax
      this.deleteTax(id).then((data) => {
       // get response from server
       if (data.status == 'success') {
        this.createAmessageLog('success', data.message);
        this.GetTax().then((data) => {
         // display the data 
         this.createTaxTable(data)
        })
       }
      })
     })
    })

   }
   else {
    taxTableBody.innerHTML = `<tr><td colspan="4">No Tax Found</td></tr>`;
   }
  }


 }



 // onload get tax from server
 async function displayTaxes() {
  const name = taxName.value;
  const rate = taxRate.value;
  const tax = new Tax(name, rate);
  let taxList = await tax.GetTax();
  tax.createTaxTable(taxList);
 }

 displayTaxes();


 // add tax button
 const TaxBtn = document.getElementById('add-tax');

 // add tax event listener
 TaxBtn.addEventListener('click', (ev) => {
  const name = taxName.value;
  const rate = taxRate.value;
  const tax = new Tax(name, rate);
  ev.preventDefault();
  tax.PostTax()
   .then((data) => {
    if (data.status === 'success') {
     tax.createAmessageLog('success', data.message);
     taxName.value = '';
     taxRate.value = '';
    }
    else {
     tax.createAmessageLog('error', data.message);
    }
    tax.GetTax()
     .then((data) => {
      tax.createTaxTable(data);
     })
   })
 })


 // Add checkbox event listener




}