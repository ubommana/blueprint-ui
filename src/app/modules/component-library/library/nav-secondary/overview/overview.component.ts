import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  navItems = [
    {
      text: 'Active Page',
      route: '/components/nav-secondary/overview'
    },
    {
      text: 'Page',
      route: ''
    },
    {
      text: 'Page',
      route: ''
    },
    {
      text: 'Page',
      route: ''
    },
    {
      text: 'Page',
      route: ''
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
