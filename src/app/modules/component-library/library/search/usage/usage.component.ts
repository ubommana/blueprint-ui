import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.scss']
})
export class UsageComponent implements OnInit {

  isSearching = false;

  constructor() { }

  ngOnInit() { }

  handleSearch(e) { }

  handleClearSearch(e) { }

}