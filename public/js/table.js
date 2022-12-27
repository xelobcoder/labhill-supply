window.onload = (ev) => {
  class Table {
    constructor(columnnumber, columnHeaders, tablename, data, framework, severending, querymode, uniqueId) {
      this.column = columnnumber;
      this.columnHeaders = columnHeaders;
      this.tablename = tablename;
      this.cssFramework = framework;
      this.api = querymode || null;
      this.serverRendering = severending || false;
      this.uniqueId = uniqueId || 'id';
    }


    isConstructorOkay() {
      if (typeof this.columnHeaders != 'object' && !Array.isArray(this.columnHeaders)) {
        throw new Error('columnHeaders must be an iterable object || Array');
      }
      // determine column matches columnHeaders
      if (Object.keys(this.columnHeaders).length != this.column) {
        throw new Error('columnHeaders must be equal to column number');
      }
      // determine if column is a number
      if (typeof this.column != 'number') {
        throw new Error('column must be a number');
      }
      // determine if tablename is a string
      if (typeof this.tablename != 'string') {
        throw new Error('tablename must be a string');
      }
      // check colunmNames are enumerable
      for (let key in this.columnHeaders) {
        if (!this.columnHeaders.propertyIsEnumerable(key)) {
          throw new Error('columnHeaders must be enumerable');
        }
      }
      // RETURN 
      return true;
    }


    getData = async () => {
      let response = await fetch(this.api);
      let data = await response.json();
      return data.data;
    }

    async dataIntegity() {
      let data = await this.getData();
      // check if array
      if (!Array.isArray(data)) {
        throw new Error('data must be an array');
      }
      // check if length is greater
      if (data.length == 0) {
        throw new Error('length must be greater than 0');
      }
      // check for integrity
      for (let i = 0; i < data.length; i++) {
        let KEYSNO = Object.keys(data[i]).length;
        if (KEYSNO != this.column) {
          throw new Error(`${i} of data fields are not equal to provided columnname`);
        }
        else {
          return true;
        }
      }
    }

    createTd() {
      return document.createElement('td');
    }

    createTr() {
      return document.createElement('tr');
    }

    createTh() {
      return document.createElement('th');
    }

    createTable() {
      return document.createElement('table');
    }

    createThead() {
      return document.createElement('thead');
    }

    createTbody() {
      return document.createElement('tbody');
    }

    createTableHead() {
      if (this.dataIntegity()) {
        let thead = this.createThead();
        let tr = this.createTr();
        let current = 0;
        let target = this.column;
        let checkbox = document.createElement('input');
        // create type
        checkbox.type = 'checkbox';
        let checkBoxParent = this.createTh();
        checkBoxParent.appendChild(checkbox);
        // append to thead
        tr.appendChild(checkBoxParent)
        // create th elements
        while (current < target) {
          let th = this.createTh();
          th.innerHTML = this.columnHeaders[current];
          tr.appendChild(th);
          current++;
        }
        thead.appendChild(tr);
        let table = document.getElementById(this.tablename);

        if (this.cssFramework == 'bootstrap') {
          thead.classList.add('table', 'text-capitalize')
        }
        console.log(thead)
        //  add to table
        table.appendChild(thead)
      }
    }

    createTableBody(data) {
      if (this.dataIntegity()) {
        let tbody = this.createTbody();
        // remove all child nodes
        if (tbody.hasChildNodes()) {
          tbody.removeChild(tbody.childNodes);
        }
        let current = 0;
        let target = data.length;
        // data > 0
        if (target > 0) {
          while (current < target) {
            let tr = this.createTr();
            let checkbox = document.createElement('input');
            // create type
            checkbox.type = 'checkbox';
            let checkBoxParent = this.createTd();
            // add attribute of id
            if (data[0][this.uniqueId] != undefined) {
              checkbox.setAttribute('data-id', data[current][this.uniqueId]);
            }
            else { checkbox.setAttribute('data-id', parseInt(data[current]['id'])); }
            checkBoxParent.appendChild(checkbox);
            // append to thead
            tr.appendChild(checkBoxParent)
            for (let key in data[current]) {
              let td = this.createTd();
              td.innerHTML = data[current][key];
              tr.appendChild(td);
            }
            tbody.appendChild(tr);
            console.log(tbody)
            current++;
          }
        }
        let table = document.getElementById(this.tablename);
        if (this.cssFramework == 'bootstrap') {
          tbody.classList.add('table', 'text-capitalize')
        }
        table.appendChild(tbody)
      }
    }

    markRow() {
      let checkboxes = document.querySelectorAll('input[type="checkbox"]');
      let current = 0;
      let target = checkboxes.length;
      // checkAllBoxes
      function checkAll(allcheckbox) {
        for (let i = 0; i < allcheckbox.length; i++) {
          allcheckbox[i].checked = true;
          // add class to show selected
          allcheckbox[i].parentElement.parentElement.classList.add('bg-active', 'text-white');
          // get first checkbox
          let firstCheckbox = allcheckbox[0];
          firstCheckbox.parentElement.parentElement.classList.remove('bg-active', 'text-white');
        }
      }

      function uncheckAll(allcheckbox) {
        for (let i = 0; i < allcheckbox.length; i++) {
          allcheckbox[i].checked = false;
          // add class to show selected
          allcheckbox[i].parentElement.parentElement.classList.remove('bg-active', 'text-white');
          // get first checkbox
          let firstCheckbox = allcheckbox[0];
          firstCheckbox.parentElement.parentElement.classList.remove('bg-active', 'text-white');
        }
      }

      while (current < target) {
        checkboxes[current].addEventListener('click', function () {
          if (this.checked) {
            if (this.hasAttribute('data-id')) {
              this.parentElement.parentElement.classList.add('bg-active', 'text-white');
            }
            else {
              checkAll(checkboxes)
            }
          } else {
            if (this.hasAttribute('data-id')) {
              this.parentElement.parentElement.classList.remove('bg-active', 'text-white');
            }
            else {
              uncheckAll(checkboxes)
            }
          }
        })
        current++;
      }
    }

    deleteCustomers() {
      let allcheckbox = document.querySelectorAll('input[type="checkbox"]');

      let selectedBox = [];

      allcheckbox.forEach((box) => {
        if (box.checked) {
          let id = parseInt(box.getAttribute('data-id'));
          if (isNaN(id)) {
            // do nothing
          }
          else {
            selectedBox.push(id);
          }
        }
      })
      // elements to remove
      return selectedBox;
    }


    async serverSideDeleting() {
      let selectedBox = this.deleteCustomers();
      // send data to server 
      if (this.serverRendering && this.api != undefined && this.api != null) {
        let response = await fetch(this.api, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: selectedBox })
        })
        let data = await response.json();
        console.log(
          data
        )
      }
    }

    async createTable(x) {
      let data = await this.getData();
      this.createTableHead();
      this.createTableBody(data);
      this.markRow();
    }
  }

  const data = [
    { name: 'tIIFU', email: 'HAMZA', address: 'kalpohin lowcost 30A', status: 'true', contact: '0595964565', actions: '' },
    { name: 'tIIFU', email: 'HAMZA', address: 'kalpohin lowcost 30A', status: 'true', contact: '0595964565', actions: '' },
    { name: 'tIIFU', email: 'HAMZA', address: 'kalpohin lowcost 30A', status: 'true', contact: '0595964565', actions: '' },
    { name: 'tIIFU', email: 'HAMZA', address: 'kalpohin lowcost 30A', status: 'true', contact: '0595964565', actions: '' },
    { name: 'tIIFU', email: 'HAMZA', address: 'kalpohin lowcost 30A', status: 'true', contact: '0595964565', actions: '' }
  ]


  let models = ['name', 'email', 'address', 'status', 'contact', 'date', 'actions'];

  let table = new Table(7, models, 'customers', data, 'bootstrap', true, 'http://localhost:4000/api/v1/customers', 'ID');

  console.log(table.createTable())



  let deleteicon = document.getElementById('deletetrash');

  deleteicon.addEventListener('click', function () {
    table.serverSideDeleting();
  })
}