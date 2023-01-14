window.onload = (ev) => {
  let orderdate = document.getElementById("orderdate");
  let customerName = document.getElementById("customerName");
  let billingAddress = document.getElementById("billingAddress");
  let transactionid = document.getElementById("transactionid");
  let buttonQuery = document.getElementById("buttonQuery");


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
        .catch((err) => { console.log(err)})
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