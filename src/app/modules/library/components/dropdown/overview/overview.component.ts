import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {

  exampleItems = [
    {
      heading: 'Heading Text'
    },
    {
      text: 'Dropdown Item',
      action: 'item1'
    },
    {
      text: 'Dropdown Item',
      action: 'item2',
      isDisabled: true
    },
    {
      text: 'Dropdown Item',
      action: 'item3',
      isDestructive: true
    },
    {
      isDivider: true
    },
    {
      plainText: 'Dropdown Text'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}