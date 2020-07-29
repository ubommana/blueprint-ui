import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'bp-landing-page-header',
  templateUrl: './landing-page-header.component.html',
  styleUrls: ['./landing-page-header.component.scss']
})
export class LandingPageHeaderComponent implements OnInit {

  @Input()
  headingText: string;

  @Input()
  actionText: string;

  @Input()
  dropdownItems;

  @Input()
  bpRouterLink: string = undefined;

  @Input()
  href: string = undefined;

  @Input()
  isMarginBottom = true;

  @Output()
  actionClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.validateInputs();
  }

  validateInputs() {
    if (!this.headingText) {
      const err = new Error('headingText is a required Input of bp-landing-page-header');
      err.name = 'Missing Input';
      throw err;
    }
  }

  onActionClick(e) {
    this.actionClick.emit(e);
  }

}