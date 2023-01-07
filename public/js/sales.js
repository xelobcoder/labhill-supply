window.onload = function () {
   let salesApiEndpoint = "/api/v1/sales";


   function DisplaySalesBox(data, target) {
      let summary = data.summary
      const { totalDued, totalPaid, totalTax, totalDisount, transactionCountLength, imbalance } = summary;
      // get next sibling
      let nextSib = target.nextElementSibling;
      // insert amount paid
      let getpaidChild = target.children[1]
      // insert amount due
      getpaidChild.innerHTML = totalPaid;
      // insert currency , ghanian cedi
      target.children[0].innerHTML = "₵";
      // get first ement of parent 
      let snrSibling = target.parentElement.firstElementChild;

      function showHover() {
         let totalsales = document.createElement("div");
         totalsales.setAttribute('id', 'flash-hot')
         totalsales.innerHTML =
            `  <div id='flash-hot-child' class="d-flex justify-content-between">
            <div>Total Sales</div>
            <div>₵ ${totalDued}</div>
         </div>`
         // add Tax
         let tlTax = document.createElement("div");
         tlTax.setAttribute('id', 'flash-hot')
         tlTax.innerHTML =
            `  <div id='flash-hot-child' class="d-flex justify-content-between">
            <div>Total Tax </div>
            <div>₵ ${totalTax}</div>
         </div>`

         // add discount
         let totalDiscount = document.createElement("div");
         totalDiscount.setAttribute('id', 'flash-hot')
         totalDiscount.innerHTML =
            `  <div id='flash-hot-child' class="d-flex justify-content-between">
            <div>Total Discount</div>
            <div>₵ ${totalDisount}</div>
         </div>`
         // add transaction count
         let transactionCount = document.createElement("div");
         transactionCount.setAttribute('id', 'flash-hot')
         transactionCount.innerHTML =
            `  <div id='flash-hot-child' class="d-flex justify-content-between">
            <div>Transaction Count</div>
            <div>${transactionCountLength}</div>
         </div>`;
         // add amount imbalance
         let amountImbalance = document.createElement("div");
         amountImbalance.setAttribute('id', 'flash-hot')
         amountImbalance.innerHTML =
            `  <div id='flash-hot-child' class="d-flex justify-content-between">
            <div>Amount Imbalance</div>
            <div>₵ ${imbalance}</div>
         </div>`;
         // append to next sibling
         nextSib.append(totalsales, tlTax, totalDiscount, transactionCount, amountImbalance);
      }

      // hover effect of target displaying the next sibling
      target.addEventListener("mouseover", function () {
         nextSib.classList.remove("default-card-body-hover");
         nextSib.classList.add("default-card-body-hover-active");
         target.classList.add('d-none');
         snrSibling.classList.add('d-none');
         showHover();
      })

      // remove hover effect

      target.addEventListener("mouseout", function () {
         // nextSib.classList.remove("default-card-body-hover-active");
         nextSib.classList.add("default-card-body-hover");
         target.classList.remove('d-none');
         snrSibling.classList.remove('d-none');
         nextSib.innerHTML = "";
      }
      )
   }

   // chain promises
   function getSalesData() {
      //   using promises.all
      let dailySales = fetch(salesApiEndpoint + "?range=daily")
      let weeklySales = fetch(salesApiEndpoint + "?range=weekly")
      let monthlySales = fetch(salesApiEndpoint + "?range=monthly")
      let yearlySales = fetch(salesApiEndpoint + "?range=yearly")

      Promise.all([dailySales, weeklySales, monthlySales, yearlySales])
         .then(function (responses) {
            return Promise.all(responses.map(function (response) {
               return response.json();
            }));
         })
         .then(function (data) {
            //   get all card body
            let cardBody = document.querySelectorAll(".default-card-body");
            let dailySalesBox = cardBody[0];
            let weeklySalesBox = cardBody[1];
            let monthlySalesBox = cardBody[2];
            let yearlySalesBox = cardBody[3];
            DisplaySalesBox(data[0], dailySalesBox);
            DisplaySalesBox(data[1], weeklySalesBox);
            DisplaySalesBox(data[2], monthlySalesBox);
            DisplaySalesBox(data[3], yearlySalesBox);
         })
   }

   getSalesData();



   function DisplayWeeklyChart() {
      // fetch data
      fetch(salesApiEndpoint + "?range=weeklychart")
         .then(function (response) {
            return response.json();
         })
         .then(function (data) {
            console.log(data.data);
            let chartData = data.data;
            let chartLabels = data.labels;
            console.log(chartLabels,chartData);
         })
         .catch(function (error) {
            console.log(error);
         })
   }

   DisplayWeeklyChart();



}