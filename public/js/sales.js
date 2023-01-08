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
    let chartLabels = data.labels;
    let chartData = data.data;
    console.log(chartLabels, chartData);
    const ctx = document.getElementById('weeklyChart').getContext('2d');

    const myChart = new Chart(ctx, {
     type: 'bar',
     data: {
      labels: chartLabels.map((item, index) => {
       return item.toUpperCase()
      }),
      fontSize: 20,
      datasets: [{
       label: 'WEEKLY SALES',
       datalabels: {
        align: 'end',
        anchor: 'end',
        offset: 10,
        color: 'red',
        fontSize: 20,
       },
       data: [chartData.sunday.amount, chartData.monday.amount, chartData.tuesday.amount, chartData.wednesday.amount, chartData.thursday.amount, chartData.friday.amount, chartData.saturday.amount],
       backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(245, 40, 145, 0.8)',
        'rgba(245, 166, 87, 0.8)',
        'rgba(45, 166, 87, 0.8)',
        'rgba(45, 107, 87, 0.8)'
       ],
       borderColor: [
        'rgba(255, 99, 132, 1)',
       ],
       borderWidth: 1
      }],
      options: {
       scales: {
        yAxes: {
         beginAtZero: true,
         ticks: {
          stepSize: 10
         }

        }
       }
      }
     },
    });


   })
   .catch(function (error) {
    console.log(error);
   })
 }

 DisplayWeeklyChart();


 function Monthlychart() {
  var ctx = document.getElementById('monthlyChart').getContext('2d');
  var myChart = new Chart(ctx, {
   type: 'bar',
   data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
     label: '# of Votes',
     data: [12, 19, 3, 5, 2, 3],
     backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)'
     ],
     borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'
     ],
     borderWidth: 1
    }]
   },
   options: {
    scales: {
     yAxes: [{
      ticks: {
       beginAtZero: true
      }
     }]
    }
   }
  });
 }

 Monthlychart()

}