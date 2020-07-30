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
import { ColumnType, Properties } from '../../models/table-models';
import { parseLookupString, generateUniqueId } from '../../helpers';

@Component({
  selector: 'bp-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit, OnChanges {

  @Input() data: {
    [key: string]: any;
  }[];
  @Input() dataLength: number;
  @Input() isDataLoading: boolean;
  @Input() properties: Properties;

  @Output() action = new EventEmitter();
  @Output() onSort = new EventEmitter();
  @Output() rowSelected = new EventEmitter();
  @Output() viewChange = new EventEmitter();

  @ViewChild('selectAllRowsRef', { static: false })
  selectAllRowsRef: ElementRef;

  // Data
  tableData = [];

  selectedRows = new Set();
  expandedRows = new Set();

  // Select All Rows
  isSelectAllChecked = false;
  isSelectAllIndeterminate = false;
  numRowsSelected = 0;

  // Sorting
  sortColumnKey: string;
  sortOrder: string;

  // Scopes imported function to the class
  parseLookupString = parseLookupString;

  uuid = 'table' + generateUniqueId();

  // displayDensity
  densityClass: string;

  constructor() { }

  // column type
  get columnType() {
    return ColumnType;
  }

  ngOnInit(): void {
    // Defaults
    const propertyDefaults = {
      sort: {
        defaultSortOrder: 'ascending'
      },
      hasSelectableRows: false,
      hasViewSelector: false,
      hasColumnSelector: true,
      hasDisplayDensity: true,
      internationalization: {
        'Select all rows': 'Select all rows',
        'Actions': 'Actions',
        'Expand/Collapse': 'Expand/Collapse',
        'Loading data': 'Loading data',
        'No data': 'No data available',
        'Select Row': `Select Row #{${this.properties.rowId}}`,
        'Toggle Row': `Toggle Row #{${this.properties.rowId}}`,
        'Actions Menu': 'Actions Menu',
        'Column Selector': 'Column Selector:',
        'Default': '(Default)',
        'Showing numVisible out of numTotal': 'Showing #{numVisible} out of #{numTotal}',
        'Display Density': 'Display Density:',
        'Display Density Options': {
          'Comfortable': 'Comfortable',
          'Compact': 'Compact'
        },
        'View': 'View:',
        'View Options': {
          'Table': 'Table',
          'Alternate': 'List'
        }
      }
    };

    const columnDefaults = {
      isColumnDisplayed: true,
      isSortable: true
    };
    // Set defaults
    this.properties = Object.assign(
      propertyDefaults,
      this.properties
    );
    this.properties.columns = this.properties.columns.map(column =>
      Object.assign({ ...columnDefaults }, column)
    );

    this.sortOrder = this.properties.sort.defaultSortOrder;
    this.sortColumnKey = this.properties.sort.defaultSortedColumn;

    this.properties.columns.forEach((col, i) => col.columnIndex = i);

    // LocalStorage
    const displayDensityName
      = localStorage.getItem('selectedDensity') || 'Comfortable';
    this.setDisplayDensity(displayDensityName);

    // Input Validations
    this.properties.columns.forEach(col => {
      if (!col.key && col.type !== ColumnType.TEMPLATE) {
        const err = new Error(
          `Missing 'key' property in\n${JSON.stringify(col)}`
        );
        err.name = 'Missing Input';
        throw err;
      }
      if (
        col.icon
        && !(col.icon.color === 'warning' || col.icon.color === 'midnight')
      ) {
        console.warn(
          `"${col.icon.color}" invalid value for bp-table icon column color: expects either "midnight" or "warning".`
        );
      }
      if (col.link) {
        if (col.link.path) {
          console.warn('Table link property "path" is deprecated. Use bpRouterLink instead.');
          if (!col.link.bpRouterLink) {
            col.link.bpRouterLink = col.link.path;
          }
        }
        if (col.link.element) {
          console.warn('Table link property "element" is deprecated. It is no longer needed.');
        }
      }
    });

    // TODO: Figure out local storage issues
    /* if (localStorage.getItem('columns')) {
      this.properties.columns = JSON.parse(localStorage.getItem('columns'));
    } */
  }

  ngOnChanges(changes): void {
    if (
      (changes.isDataLoading
        && changes.isDataLoading.currentValue === false
        && this.tableData.length > 0)
      || (changes.data && !changes.data.firstChange)
    ) {
      this.tableData = changes.data.currentValue;
      if (this.isSelectAllChecked) {
        this.tableData.forEach(row => this.selectedRows.add(row));
      } else if (!this.isSelectAllChecked && !this.isSelectAllIndeterminate) {
        this.tableData.forEach(row => this.selectedRows.delete(row));
      }
    }
  }

  getColumn(key) {
    return this.properties.columns.filter(column => column.key === key)[0];
  }

  // --------------- Sorting ---------------

  defaultSort() {
    this.sortOrder = this.properties.sort.defaultSortOrder;
    this.sortColumnKey = this.properties.sort.defaultSortedColumn;
  }

  getAriaSortOrder(key: string): string {
    // Set aria attributes before data is loaded, but after column headers have rendered
    if (this.isDataLoading && key === this.sortColumnKey) {
      return this.properties.sort.defaultSortOrder;
    } else if (key === this.sortColumnKey) {
      // Set aria attributes after data is loaded
      return this.sortOrder;
    } else {
      return null;
    }
  }

  sort(colHeader: string) {
    if (colHeader === this.sortColumnKey) {
      if (this.sortOrder === '' || this.sortOrder === 'descending') {
        this.sortOrder = 'ascending';
      } else {
        this.sortOrder = 'descending';
      }
    } else {
      this.sortColumnKey = colHeader;
      this.sortOrder = 'ascending';
    }
    this.onSort.emit({
      column: this.sortColumnKey,
      order: this.sortOrder
    });
  }

  // --------------- Selectable Rows ---------------

  // To select/unselect one row at a time
  onSelectRow(e) {
    const event = e.event;
    const selectedRow = e.row;
    if (event.target.checked) {
      this.numRowsSelected++;
      this.selectedRows.add(selectedRow);
    } else {
      this.numRowsSelected--;
      this.selectedRows.delete(selectedRow);
    }
    if (this.selectedRows.size === this.dataLength || this.numRowsSelected === this.dataLength) {
      this.isSelectAllIndeterminate = false;
      this.isSelectAllChecked = true;
    } else if (
      this.selectedRows.size > 0
      && this.selectedRows.size < this.dataLength
    ) {
      this.isSelectAllIndeterminate = true;
      this.isSelectAllChecked = false;
    } else if (this.selectedRows.size === 0) {
      this.isSelectAllIndeterminate = false;
      this.isSelectAllChecked = false;
    }
    this.rowSelected.emit({
      areAllSelected: this.isSelectAllChecked,
      selected: selectedRow,
      numRowsSelected: this.numRowsSelected
    });
  }

  // To select/deselect all the rows
  onSelectAllRows() {
    this.isSelectAllChecked = !this.isSelectAllChecked;
    this.isSelectAllIndeterminate = false;
    if (this.isSelectAllChecked) {
      this.numRowsSelected = this.dataLength;
      this.tableData.forEach(d => this.selectedRows.add(d));
    } else {
      this.numRowsSelected = 0;
      this.tableData.forEach(d => this.selectedRows.delete(d));
    }
    this.rowSelected.emit({
      areAllSelected: this.isSelectAllChecked,
      selected: null,
      numRowsSelected: this.numRowsSelected
    });
  }

  // --------------- DisplayDensity ---------------

  setDisplayDensity(density) {
    this.densityClass = density === 'Comfortable' ? null : 'table-compact';
    localStorage.setItem('selectedDensity', density);
  }

  // --------------- View Selector ---------------

  emitTableView(view) {
    this.viewChange.emit(view);
  }

  // --------------- Actions ---------------

  emitAction(action: string) {
    this.action.emit(action);
  }

}