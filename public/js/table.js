window.onload = (ev) => {
  class Table {
    constructor(columnnumber, columnHeaders, tablename, framework, severending, querymode, uniqueId) {
      this.column = columnnumber;
      this.columnHeaders = columnHeaders;
      this.tablename = tablename;
      this.cssFramework = framework;
      this.api = querymode || null;
      this.serverRendering = severending || false;
      this.uniqueId = uniqueId || 'id';
    }

    frontenddata = [];

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
      data.data.forEach((item) => {
        this.frontenddata.push(item);
      })
      // return
      // this data while used when delete or edit take place 
      // if not the front end dat will alway e used for sorting
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
        } else {
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

    createTableFoot() {
      return document.createElement('tfoot');
    }


    createTdSpan() {
      let span = document.createElement('span');
      // add top symbol
      let top = document.createElement('i');
      top.className = "bi bi-caret-up";
      // add bottom symbol
      let bottom = document.createElement('i');
      bottom.setAttribute('id', 'caret-down');
      bottom.className = "bi bi-caret-down d-none";
      // add text
      span.appendChild(top)
      span.appendChild(bottom);
      // reutrn span
      return span;
    }

    async sortDataAsc(orderby) {
      let data = [...this.frontenddata];
      console.log(data);
      // sort string 
      if (typeof data[0][orderby] == 'string') {
        data.sort((a, b) => {
          let x = a[orderby].toLowerCase();
          let y = b[orderby].toLowerCase();
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        })
      }
      // sort number
      else if (typeof data[0][orderby] == 'number') {
        data.sort((a, b) => {
          return a[orderby] - b[orderby];
        })
      }
      // sort date
      else if (typeof data[0][orderby] == 'object') {
        data.sort((a, b) => {
          return new Date(a[orderby]) - new Date(b[orderby]);
        })
      }
      // return
      return data;

    }


    async sortDataDesc(orderby) {
      // sort string desc
      if (typeof this.frontenddata[0][orderby] == 'string') {
        this.frontenddata.sort((a, b) => {
          let x = a[orderby].toLowerCase();
          let y = b[orderby].toLowerCase();
          if (x > y) {
            return -1;
          }
          if (x < y) {
            return 1;
          }
          return 0;
        })
      }
      // sort number desc
      else if (typeof this.frontenddata[0][orderby] == 'number') {
        this.frontenddata.sort((a, b) => {
          return b[orderby] - a[orderby];
        })
      }
      // sort date desc
      else if (typeof this.frontenddata[0][orderby] == 'object') {
        this.frontenddata.sort((a, b) => {
          return new Date(b[orderby]) - new Date(a[orderby]);
        })
      }
      // return data
      return this.frontenddata;
    }

    footerShowSelect(data) {
      // get select element
      let select = document.getElementById('tfoot-show-level');
      // get options
      let requiredTarget = select.value;
      if (requiredTarget == 'all' && isNaN(requiredTarget)) {
        this.createTableBody(data);
      } else {
        let newData = data.slice(0, requiredTarget);
        this.createTableBody(newData);
      }

    }

    toggleCaret(th) {
      let a = th.firstChild;
      let span = th.lastChild;
      let caretup = span.firstChild;
      let caretdown = span.lastChild;
      let orderby = a.innerHTML;
      // th has  0  children nodes ignore
      let thHasChildren = th.childNodes.length;
      if (thHasChildren == 2) {
        a.addEventListener('click', (ev) => {
          if (caretup.classList.contains('d-none')) {
            caretup.classList.remove('d-none');
            caretdown.classList.add('d-none');
            this.sortDataAsc(orderby).then((data) => {
              this.footerShowSelect(data);
            })
          } else {
            caretup.classList.add('d-none');
            caretdown.classList.remove('d-none');
            this.sortDataDesc(orderby).then((data) => {
              this.footerShowSelect(data);
            })
          }
        })
      } else {
        return;
      }
    }


    createTableHead() {
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
        th.innerHTML = `<a>${this.columnHeaders[current]}</a>`;
        // add span
        th.appendChild(this.createTdSpan());
        tr.appendChild(th);
        current++;
      }
      thead.appendChild(tr);

      let table = document.getElementById(this.tablename);

      if (this.cssFramework == 'bootstrap') {
        thead.classList.add('table', 'text-capitalize')
      }

      //  add to table
      table.appendChild(thead)
      // toggle caret
      let ths = thead.querySelectorAll('th');
      ths.forEach(th => {
        this.toggleCaret(th);
      })
    }

    createTableBody(data) {
      function RemoveFirstCheckBoxChecked() {
        let checkbox = document.querySelectorAll('input[type="checkbox"]');
        checkbox.forEach((check) => {
          if (check.checked) {
            if (!check.hasAttribute('data-id')) {
              check.checked = false;
            }
            return;
          }
        })
      }
      RemoveFirstCheckBoxChecked();
      // create tbody
      let tbody = this.createTbody();
      // get all children nodes
      let childrenNodes = document.getElementById(this.tablename).childNodes;
      // length greater than 0
      // and remove all children of tagelement TBODY of that table
      // new insertion could be made later
      if (childrenNodes.length > 0) {
        for (let i = 0; i < childrenNodes.length; i++) {
          if (childrenNodes[i].nodeName == 'TBODY') {
            childrenNodes[i].innerHTML = ''
          }
        }
      }
      // add tbody to table
      let current = 0;
      let target = data.length;
      // data > 0
      if (target > 0 && tbody.childNodes.length == 0) {
        while (current < target) {
          let tr = this.createTr();
          let checkbox = document.createElement('input');
          // create type
          checkbox.type = 'checkbox';
          let checkBoxParent = this.createTd();
          // add attribute of id
          if (data[0][this.uniqueId] != undefined) {
            checkbox.setAttribute('data-id', data[current][this.uniqueId]);
          } else {
            checkbox.setAttribute('data-id', parseInt(data[current]['id']));
          }

          checkBoxParent.appendChild(checkbox);
          // append to thead
          tr.appendChild(checkBoxParent)
          for (let key in data[current]) {
            let td = this.createTd();
            td.innerHTML = data[current][key];
            tr.appendChild(td);
          }
          tbody.appendChild(tr);
          current++;
        }
      }
      let table = document.getElementById(this.tablename);
      if (this.cssFramework == 'bootstrap') {
        tbody.classList.add('table', 'text-capitalize')
      }
      table.appendChild(tbody)
      // mark row
      this.markRow();
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
            } else {
              checkAll(checkboxes)
            }
          } else {
            if (this.hasAttribute('data-id')) {
              this.parentElement.parentElement.classList.remove('bg-active', 'text-white');
            } else {
              uncheckAll(checkboxes)
            }
          }
        })
        current++;
      }
    }

    createTableFooter() {
      let tfoot = this.createTableFoot();
      let table = document.getElementById(this.tablename);
      tfoot.innerHTML = `
          <tr>
            <td>
              show
            </td>
            <td>
              <select class="form-control" id='tfoot-show-level'>
                <option value="all">all</option>
                <option value="4">4</option>  
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
              </select>
            </td>
          </tr>
    `
      table.appendChild(tfoot);
      // get show element
      let show = document.getElementById('tfoot-show-level');
      if (show) {
        // add event listener
        show.onchange = (ev) => {
          this.footerShowSelect(this.frontenddata);
        }
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
          } else {
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
          body: JSON.stringify({
            id: selectedBox
          })
        })
        let data = await response.json();

        return;
      }
    }

    createMessageLog(message, type) {
      let table = document.getElementById(this.tablename);
      // table parent
      let tableParent = table.parentElement;
      // create div
      let div = document.createElement('div');
      // attach classlist depending on type
      div.classList.add('alert', `alert-${type}`);
      // create text node
      let text = document.createTextNode(message);
      // append text to div
      div.appendChild(text);
      // append div to table parent
      tableParent.prepend(div);
      // remove div after 3 seconds
      setTimeout(() => {
        tableParent.removeChild(div);
      }, 3000)
      // call create table
      this.getData()
        .then((data) => {
          this.createTableBody(data);
        })
    }



    async createTable() {
      let data = await this.getData();
      this.createTableHead();
      this.createTableBody(data);
      this.createTableFooter();
      this.markRow();
    }

  }




  let models = ['id', 'name', 'email', 'contact', 'address', 'status', 'date', 'actions'];

  let table = new Table(7, models, 'customers', 'bootstrap', true, 'http://localhost:4000/api/v1/customers', 'ID');

  table.createTable();


  let deleteicon = document.getElementById('deletetrash');

  deleteicon.addEventListener('click', function () {
    table.serverSideDeleting()
      .then((data) => {
        table.createMessageLog('Customers deleted successfully', 'success');
      })
      .catch((err) => {
        table.createMessageLog('Error deleting customers', 'danger');
      })
  })
}