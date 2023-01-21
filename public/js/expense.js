window.onload = (ev) => {
 let orderdate = document.getElementById("expenseDate");
 let expensename = document.getElementById("expenseName");
 let amountspent = document.getElementById("expenseAmount");
 const expenseCategory = document.getElementById("expenseCategory");
 let expensebutton = document.getElementById("expensebutton");


 let ConstantDataHolder = [];


 expensebutton.addEventListener("click", (ev) => {
  ev.preventDefault();
  refreshingSpinningLoader();
  let expenseObject = {
   expenseDate: orderdate.value,
   expenseName: expensename.value,
   expenseAmount: amountspent.value,
   expenseCategory: expenseCategory.value
  }

  fetch(`/api/v1/expenses?expenseDate=${expenseObject.expenseDate}&expenseName=${expenseObject.expenseName}&expenseAmount=${expenseObject.expenseAmount}&expenseCategory=${expenseObject.expenseCategory}`)

   .then((response) => {
    return response.json();
   })
   .then((data) => {
    if (data.status === 'success') {
     alert(data.message);
     getExpenses();
    }
    else {
     alert(data.message);
    }
   })
 })



 function refreshingSpinningLoader() {
  // create a spinning loader
  let loader = document.createElement('div');
  loader.classList.add('loader');
  // laodeer wrapper
  let loaderWrapper = document.createElement('div');
  loaderWrapper.classList.add('loader-wrapper');
  // append loader to wrapper
  if (loaderWrapper) {
   if (loaderWrapper.hasChildNodes) {
    return;
   }
   loaderWrapper.appendChild(loader);
  }
  // make table display none
  let table = document.querySelector('#expense-list-table');
  table.classList.add('d-none');
  // append loader wrapper to table body
  const expenselistWrapper = document.querySelector('.expense-list');
  expenselistWrapper.appendChild(loaderWrapper);
 }





 function AppendListBody(data) {
  let tbody = document.querySelector('#expense-list-table-body');
  const isValid = Array.isArray(data) && data.length > 0;
  if (isValid) {
   let expenseList = data.map((expense) => {
    return `<tr>
     <td>${expense.expenseName}</td>
     <td>${expense.expenseAmount}</td>
     <td>${expense.expenseDate}</td>
     <td>
       <button class="btn btn-danger" dataid=${expense.expenseid} id='deleteexpense'> Delete</button>
     </td>
    </tr>`
   })
   // remove loader wrapper from section-list
   let loaderWrapper = document.querySelector('.loader-wrapper');
   if (loaderWrapper) {
    loaderWrapper.remove();
   }
   let table = document.querySelector('#expense-list-table');
   if (table.classList.contains('d-none')) {
    table.classList.remove('d-none');
   }
   tbody.innerHTML = '';
   tbody.innerHTML = expenseList.join('');
  }
 }


 deleteexpense = (ev) => {
  const deleteButtons = document.querySelectorAll('#deleteexpense');
  // add a click event listener to each button
  deleteButtons.forEach((button) => {
   const expenseId = button.getAttribute('dataid');
   button.addEventListener('click', (ev) => {
    ev.preventDefault();
    let confimation = confirm('Are you sure you want to delete this expense?');
    if (confimation) {
     fetch(`/api/v1/expenses`, {
      method: 'DELETE',
      headers: {
       'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expenseId: expenseId })
     })
      .then((response) => {
       return response.json();
      })
      .then((data) => {
       getExpenses();
      })
    }
    else {
     return;
    }
   })
  });
 }

 function getExpenses() {
  fetch('/api/v1/expenses')
   .then((response) => {
    return response.json();
   }
   )
   .then((data) => {
    let result = data.expenses;
    if (result.length > 0) {
     // push data to constant data holder
     ConstantDataHolder = result;
     AppendListBody(result);
     deleteexpense();
    }

    if (result.length === 0) {
     let tbody = document.querySelector('#expense-list-table-body');
     tbody.innerHTML = '';
     let table = document.querySelector('#expense-list-table');
     table.style.display = 'none';
     let noExpense = document.createElement('div');
     noExpense.classList.add('no-expense');
     noExpense.innerHTML = 'No Expense';
     const expenselistWrapper = document.querySelector('.expense-list');
     expenselistWrapper.appendChild(noExpense);
    }
   })
   .catch((err) => {
    console.log(err);
   })
 }


 getExpenses();


 // add click event to query list
 const topquery = document.querySelector('.top-query');
 topquery.addEventListener('click', (ev) => {
  // 
  ev.preventDefault();
  let addexpensionUiSection = document.querySelector('#adding-expense');
  // hide add expense section
  addexpensionUiSection.classList.add('d-none');
  // make query section visible
  let querySection = document.querySelector('#query-expense-section');
  querySection.classList.remove('d-none');

  const searchElement = document.querySelector('#queryexpesen');
  const categoryElement = document.querySelector('#querycategoryupload');
  searchElement.addEventListener('keyup', (ev) => {
   ev.preventDefault();
   // filter based on cate gory and searched item
   const searchValue = searchElement.value;
   const categoryValue = categoryElement.value;
   if (searchValue.length > 0) {
    // filter category
    const filteredCategory = ConstantDataHolder.filter((expense) => {
     return expense.category.toLowerCase() === categoryValue.toLowerCase();
    })
    // filter search
    const filteredSearch = filteredCategory.filter((expense) => {
     return expense.expenseName.toLowerCase().includes(searchValue.toLowerCase());
    })
    // append to table
    AppendListBody(filteredSearch);
    deleteexpense();
   }
   else {
    // append to table
    AppendListBody(ConstantDataHolder);
    deleteexpense();
   }
  })
 })



 // add click event to add expense list
 const addexpense = document.querySelector('.top-add');

 addexpense.addEventListener('click', (ev) => {
  ev.preventDefault();
  let addexpensionUiSection = document.querySelector('#adding-expense');
  // hide add expense section
  addexpensionUiSection.classList.remove('d-none');
  // hide query section
  let querySection = document.querySelector('#query-expense-section');
  querySection.classList.add('d-none');
  // hide expense list section
  // let expenseListSection = document.querySelector('#expense-list-section');
  // expenseListSection.classList.add('d-none');
 })
}



