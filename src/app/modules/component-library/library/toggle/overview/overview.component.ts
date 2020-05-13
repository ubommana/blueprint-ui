import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  exampleTwoOptions = [
    {
      id: 'ex1-Opt1',
      text: 'Option 1',
      value: 'option1',
      isChecked: true
    },
    {
      id: 'ex1-Opt2',
      text: 'Option 2',
      value: 'option2'
    }
  ];

  exampleThreeOptions = [
    {
      id: 'ex2-Opt1',
      text: 'Option 1',
      value: 'option1',
      isChecked: true
    },
    {
      id: 'ex2-Opt2',
      text: 'Option 2',
      value: 'option2'
    },
    {
      id: 'ex2-Opt3',
      text: 'Option 3',
      value: 'option3',
      isDisabled: true
    }
  ];

  constructor() { }

  ngOnInit() { }

}