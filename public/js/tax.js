window.onload = (ev) => {
 // FUNCTION TO DEAL WITH PAGE TAX AND DISCOUNT
 let taxName = document.getElementById('tax-name');
 let taxRate = document.getElementById('tax-rate');

 class Tax {
  constructor(name, rate) {
   this.name = name.value;
   this.rate = parseFloat(rate.value);
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


  createTaxTable (data) {
   let taxTableBody = document.getElementById('taxes-table');
   if(Array.isArray(data) && data.length > 0) {
     let taxHtml = data.forEach((item,index) => {
       return (
         `<tr>
           <td>${index + 1}</td>
           <td>${item.name}</td>
           <td>${item.rate}</td>
           <td>
             <button class="btn btn-danger btn-sm" id="delete-tax" data-id="${item.id}">Delete</button>
             <button class="btn btn-primary btn-sm" id="edit-tax" data-id="${item.id}">Edit</button>
           </td>
         </tr>`
       )
     })
     taxTableBody.innerHTML = taxHtml;
   }
   else {
     taxTableBody.innerHTML = `<tr><td colspan="4">No Tax Found</td></tr>`;
   }
  }

 }
}