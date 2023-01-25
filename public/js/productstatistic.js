window.onload = (ev) => {
 let temporayDataStrorage = [];
 const searchBar = document.getElementById('searchstat');

 const getProductData = () => {

  const searchBarFiltering = function (data) {
   searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredProducts = data.filter((product) => {
     return (
      product.name.toLowerCase().includes(searchString)
     );
    });
    displayProductData(filteredProducts);

   })
  }


  const inWeekChart = (data) => { }
  const inMonthChart = (data) => { }
  const inYearChart = (data) => { }

  const productDetails = (data) => {
   const { productid, name, price, quantity, minqty, imageid, description } = data.product;
   const imagehtml = document.querySelector('.product-image > img');
   imagehtml.setAttribute('src', `/api/v1/image?id=${imageid}`);
   // set product name
   const productname = document.querySelector('.product-name > h3');
   productname.textContent = name;
   // set product price
   const productprice = document.querySelector('.product-price > h4');
   productprice.textContent = 'GH¢' + price;
   // set product quantity
   const productquantity = document.querySelector('.product-quantity > h5');
   productquantity.textContent = quantity;
   // set product description
   const productdescription = document.querySelector('.product-description > h4');
   productdescription.textContent = description;
  }


  const ordersTable = (data) => {
   const { orders } = data;
   let html = '';
   if (Array.isArray(orders) && orders.length > 0) {
    orders.forEach((order, index) => {
     html += `
      <tr>
       <td>${index + 1}</td>
       <td>${order.date.slice(0, 16)}</td>
       <td>${order.transactionid}</td>
       <td>${order.quantity}</td>
       <td>${order.totalcost}</td>
      </tr>
     `;
    });
    const tableBody = document.querySelector('#orders-table > tbody');
    tableBody.innerHTML = html;
   }
   else {
    const tableBody = document.querySelector('#orders-table > tbody');
    tableBody.innerHTML = '';
   }
  }


  const weekChart = (data) => {
   const { weekstats } = data;
   const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } = weekstats;
   let section = document.querySelector('#chart-weekly');
   section.innerHTML = '';

   let canvas = document.createElement('canvas');
   canvas.setAttribute('id', 'chart-weekly-canvas');
   canvas.style.width = '100%';
   canvas.style.height = '100%';
   section.appendChild(canvas);
   let ctx = canvas.getContext('2d');
   let chart = new Chart(ctx, {
    type: 'bar',
    data: {
     labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
     datasets: [{
      label: 'Week  Sales',
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
       'rgb(255, 99, 132)',
      ],
      borderWidth: 1,
      data: [sunday.total, monday.total, tuesday.total, wednesday.total, thursday.total, friday.total, saturday.total],
     }]
    },
    options: {
     scales: {
      yAxes: {
       beginAtZero: true,
       ticks: {
        stepSize: 1,
       }

      }
     }
    }
   })
  }


  const monthChart = (data) => {
   const { monthstats } = data;
   const { firstweek,  secondweek, thirdweek, fourthweek} = monthstats;
   let section = document.querySelector('#chart-monthly');
   section.innerHTML = '';

   let canvas = document.createElement('canvas');
   canvas.setAttribute('id', 'chart-monthly-canvas');
   canvas.style.width = '100%';
   canvas.style.height = '100%';
   section.appendChild(canvas);
   let ctx = canvas.getContext('2d');
   let chart = new Chart(ctx, {
    type: 'bar',
    data: {
     labels: ['firstweek', 'secondweek', 'thirdweek', 'fourthweek'],
     datasets: [{
      label: 'Month Sales',
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
       'rgb(255, 99, 132)',
      ],
      borderWidth: 1,
      data: [firstweek.total, secondweek.total, thirdweek.total, fourthweek.total],
     }]
    },
    options: {
     scales: {
      yAxes: {
       beginAtZero: true,
       ticks: {
        stepSize: 1,
       }

      }
     }
    }
   })
  }

  const yearChart = (data) => {
   const { yearstats } = data;
   const {january, february,
    march, april, may, june, july, august, september, october, november, december} = yearstats;

   let section = document.querySelector('#chart-yearly');
   section.innerHTML = '';

   let canvas = document.createElement('canvas');
   canvas.setAttribute('id', 'chart-yearly-canvas');
   canvas.style.width = '100%';
   canvas.style.height = '100%';
   section.appendChild(canvas);
   let ctx = canvas.getContext('2d');
   let chart = new Chart(ctx, {
    type: 'bar',
    data: {
     labels: ['january','febraury','march','april','may','june','july','august','september','october','november','december'],
     datasets: [{
      label: 'year Sales',
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
       'rgb(255, 99, 132)',
      ],
      borderWidth: 1,
      data: [
       january.total, february.total, march.total, april.total, may.total, june.total, july.total, august.total, september.total, october.total, november.total, december.total
      ],
     }]
    },
    options: {
     scales: {
      yAxes: {
       beginAtZero: true,
       ticks: {
        stepSize: 1,
       }

      }
     }
    }
   })
  }

  const displayProductData = (data) => {
   if (Array.isArray && data.length > 0) {
    const html = data.map((product) => {
     return `
      <div class="statistics-product-list" dataid=${product.productid}>
       ${product.name}
      </div>
     `;
    });

    let productContainer = document.createElement('div');
    productContainer.classList.add('stas-group');
    productContainer.innerHTML = html.join('');
    // append to .stas-products
    let parentContainer = document.querySelector('.stas-products');
    // append to container
    if (parentContainer.hasChildNodes) {
     parentContainer.innerHTML = '';
     parentContainer.appendChild(productContainer);

     // get all statistics-product-list div
     let productDivs = document.querySelectorAll('.statistics-product-list');
     productDivs.forEach((productDiv) => {
      productDiv.addEventListener('click', (e) => {
       let dataid = e.target.getAttribute('dataid');
       //  get the product statistics
       const url = `/api/v1/productstatistic?productid=${dataid}`;
       fetch(url)
        .then((res) => res.json())
        .then((data) => {
         if (Object.hasOwnProperty(data, 'status') && data.status === 'error') {
          alert(data.message)
         }
         else {
          console.log(data.stats);
          productDetails(data.stats);
          ordersTable(data.stats);
          weekChart(data.stats);
          monthChart(data.stats);
          yearChart(data.stats);
         }
        })
        .catch((err) => console.log(err));
      })
     })
    }
   }
   else {
    return false;
   }
  };
  const url = `/api/v1/productstatistic`;
  fetch(url)
   .then((res) => res.json())
   .then((data) => {
    displayProductData(data);
    searchBarFiltering(data);
   })
   .catch((err) => console.log(err));
 }


 getProductData();
}