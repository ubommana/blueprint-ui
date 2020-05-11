import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Column, ColumnType } from './models/column';
import Properties from './models/properties';
import { parseLookupString } from '../../helpers';

@Component({
  selector: 'bp-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit, OnChanges {
  @Input() data: {
    [key: string]: any;
  }[];
  @Input() isDataLoading: boolean;
  @Input() properties: Properties;

  @Output() action = new EventEmitter();
  @Output() selectedRowsAction = new EventEmitter();
  @Output() pageChange = new EventEmitter();

  // Defaults
  propertyDefaults = {
    sort: {
      defaultSortOrder: 'ascending'
    },
    hasSelectableRows: false,
    hasColumnSelector: true,
    hasDisplayDensity: true,
    pagination: {
      hasPagination: true,
      isServerside: false
    },
    internationalization: {
      'Select all rows': 'Select all rows',
      'Actions': 'Actions',
      'Expand/Collapse': 'Expand/Collapse',
      'Loading data': 'Loading data',
      'No data': 'No data available',
      'Select Row': 'Select Row',
      'Actions Menu': 'Actions Menu',
      'Column Selector': 'Column Selector:',
      'Default': '(Default)',
      'Showing numVisible out of numTotal':
        'Showing #{numVisible} out of #{numTotal}',
      'Display Density': 'Display Density:',
      'Display Density Options': {
        'Comfortable': 'Comfortable',
        'Compact': 'Compact'
      }
    }
  };

  columnDefaults = {
    isColumnDisplayed: true,
    isSortable: true
  };

  // Data
  filteredData = [];
  tableData = [];

  // Select All Rows
  isSelectAllChecked = false;
  isSelectAllIndeterminate = false;

  // Sorting
  sortColumnKey: string;
  sortOrder: string;

  // Pagination
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  numberOfRows;
  currentPage = 1;
  pageBuffer = 1;
  defaultNumberOfRows = 10;

  // Scopes imported function to the class
  parseLookupString = parseLookupString;

  // displayDensity
  densityClass: string;

  showSelectedRowsAction = false;
  @ViewChild('selectAllRowsRef', { static: false })
  selectAllRowsRef: ElementRef;

  // Used for pagination
  pageData: {
    currentPage: number;
    numberOfRows: number;
  };

  constructor() {}

  // column type
  get columnType() {
    return ColumnType;
  }

  ngOnInit() {
    // Set defaults
    this.properties = Object.assign(this.propertyDefaults, this.properties);
    this.properties.columns = this.properties.columns.map(column =>
      Object.assign({ ...this.columnDefaults }, column)
    );

    // LocalStorage
    const displayDensityName =
      localStorage.getItem('selectedDensity') || 'Comfortable';
    this.setDisplayDensity(displayDensityName);

    // Input Validations
    this.properties.columns.forEach(col => {
      if (!col.key && col.type !== ColumnType.TEMPLATE) {
        let err = new Error(
          `Missing 'key' property in\n${JSON.stringify(col)}`
        );
        err.name = 'Missing Input';
        throw err;
      }
      if (
        col.link &&
        !(col.link.element === 'a' || col.link.element === 'button')
      ) {
        let err = new Error(
          `Link element must be either 'a' or 'button' in\n${JSON.stringify(
            col
          )}`
        );
        err.name = 'Invalid Input';
        throw err;
      }
      if (
        col.link &&
        col.link.element === 'a' &&
        !(col.link.path || col.link.href)
      ) {
        let err = new Error(
          `Link must have either href or path when element is 'a' in\n${JSON.stringify(
            col
          )}`
        );
        err.name = 'Missing Input';
        throw err;
      }
      if (col.link && col.link.element === 'button' && !col.link.action) {
        let err = new Error(
          `Link must have action when element is 'button' in\n${JSON.stringify(
            col
          )}`
        );
        err.name = 'Missing Input';
        throw err;
      }
      if (
        col.icon &&
        !(col.icon.color === 'warning' || col.icon.color === 'midnight')
      ) {
        console.warn(
          `"${col.icon.color}" invalid value for bp-table icon column color: expects either "midnight" or "warning".`
        );
      }
    });

    // TODO: Figure out local storage issues
    /* if (localStorage.getItem('columns')) {
      this.properties.columns = JSON.parse(localStorage.getItem('columns'));
    } */
  }

  ngOnChanges(changes) {
    if (
      (changes.isDataLoading &&
        changes.isDataLoading.currentValue === false &&
        this.data.length > 0) ||
      (changes.data && !changes.data.firstChange)
    ) {
      this.data = changes.data.currentValue;
      this.data.forEach(row => {
        row._meta = {};
        if (this.properties.hasSelectableRows) {
          row._meta.isChecked = false;
        }
        if (this.properties.expandableRowsTemplate) {
          row._meta.isExpanded = false;
        }
      });
      this.filteredData = [...this.data];
      this.totalRecords = this.data.length;
      this.defaultSort();
    }
  }

  getColumn(key) {
    return this.properties.columns.filter(column => column.key === key)[0];
  }

  // --------------- Sorting ---------------

  defaultSort() {
    this.sortOrder = this.properties.sort.defaultSortOrder;
    this.sortColumnKey = this.properties.sort.defaultSortedColumn;

    this.sortOrder === 'ascending'
      ? this.ascSort(this.properties.sort.defaultSortedColumn)
      : this.descSort(this.properties.sort.defaultSortedColumn);
  }

  ascSort(colHeader: string) {
    this.sortByKeyAsc(this.filteredData, colHeader);
  }

  descSort(colHeader: string) {
    this.sortByKeyDesc(this.filteredData, colHeader);
  }

  sortByKeyAsc(array, key) {
    const column: any = this.properties.columns.filter(
      column => column.key === key
    )[0];
    if (column.sortFunctionAsc) {
      return array.sort((a, b) => column.sortFunctionAsc(a[key], b[key]));
    } else {
      return array.sort((a, b) => {
        const x = a[key];
        const y = b[key];
        return x < y ? -1 : 1;
      });
    }
  }

  sortByKeyDesc(array, key) {
    const column: any = this.properties.columns.filter(
      column => column.key === key
    )[0];
    if (column.sortFunctionAsc) {
      return array.sort((a, b) => column.sortFunctionAsc(a[key], b[key])).reverse();
    } else {
      return array.sort((a, b) => {
        const x = a[key];
        const y = b[key];
        return x > y ? -1 : 1;
      });
    }
  }

  getAriaSortOrder(key: string): string {
    // Set aria attributes before data is loaded, but after column headers have rendered
    if (this.isDataLoading && key === this.sortColumnKey) {
      return this.properties.sort.defaultSortOrder;
    }
    // Set aria attributes after data is loaded
    else if (key === this.sortColumnKey) {
      return this.sortOrder;
    } else {
      return null;
    }
  }

  sort(colHeader: string) {
    if (colHeader === this.sortColumnKey) {
      if (this.sortOrder === '' || this.sortOrder === 'descending') {
        this.sortOrder = 'ascending';
        this.ascSort(colHeader);
      } else {
        this.sortOrder = 'descending';
        this.descSort(colHeader);
      }
    } else {
      this.sortColumnKey = colHeader;
      this.sortOrder = 'ascending';
      this.ascSort(colHeader);
    }
  }

  // --------------- Selectable Rows ---------------

  // To select/unselect one row at a time
  onSelectRow(e) {
    const event = e.event;
    const rowId = e.rowId;
    const selectedRow = this.filteredData.find(
      // Double equals to allow flexibility in the data since we aren't concerned with type here
      data => data[this.properties.rowId] == rowId
    );
    selectedRow._meta.isChecked = event.target.checked;
    const selectedRowsCount = this.filteredData
      .filter(data => data._meta.isChecked)
      .length;
    
    if (selectedRowsCount === this.filteredData.length) {
      this.isSelectAllIndeterminate = false;
      this.isSelectAllChecked = true;
    } else if (
      selectedRowsCount > 0 &&
      selectedRowsCount < this.filteredData.length
    ) {
      this.isSelectAllIndeterminate = true;
      this.isSelectAllChecked = false;
    } else if (selectedRowsCount === 0) {
      this.isSelectAllIndeterminate = false;
      this.isSelectAllChecked = false;
    }
    this.emitSelectedRowsAction();
  }

  // To select/deselect all the rows
  onSelectAllRows(event) {
    this.isSelectAllChecked = !this.isSelectAllChecked;
    this.isSelectAllIndeterminate = false;
    this.filteredData.forEach(row => {
      row._meta.isChecked = this.isSelectAllChecked;
    });
    this.emitSelectedRowsAction();
  }

  // --------------- DisplayDensity ---------------

  setDisplayDensity(density) {
    this.densityClass = density === 'Comfortable' ? null : 'table-compact';
    localStorage.setItem('selectedDensity', density);
  }

  // --------------- Actions ---------------

  emitAction(action: string) {
    this.action.emit(action);
  }

  // To perform an action on selected rows
  emitSelectedRowsAction() {
    const selectedRowsIds = [];
    this.filteredData.forEach(data => {
      if (data._meta.isChecked) {
        selectedRowsIds.push(data[this.properties.rowId]);
      }
    });

    this.selectedRowsAction.emit(selectedRowsIds);
  }
}
