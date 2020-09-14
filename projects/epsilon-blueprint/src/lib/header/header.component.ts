import { Component, OnInit, Input } from '@angular/core';
import { generateUniqueId, isDefined } from '../../helpers';

@Component({
  selector: 'bp-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  @Input() logoSrc: string;
  @Input() logoAlt: string;
  @Input() logoHref?: string;
  @Input() logoRouterLink?: string;
  @Input() hasCollapsibleMenu?: boolean = true;
  @Input() hasContextSelector?: boolean = true;
  @Input() hasNavigation?: boolean = true;
  @Input() expandBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  @Input() bpID: string;
  @Input() internationalization: {
    'Menu': string;
    'MenuAriaLabel': string;
    'navAriaLabel': string;
  };

  constructor() { }

  ngOnInit(): void {
    if (!this.bpID) {
      this.bpID = 'collapsibleMenu' + String(generateUniqueId());
    }

    const intlDefaults = {
      'Menu': 'Menu',
      'MenuAriaLabel': 'Toggle primary navigation',
      'navAriaLabel': 'Primary Navigation'
    };
    Object.assign(intlDefaults, this.internationalization);
  }

  isLogoLink(): boolean {
    return isDefined(this.logoHref) || isDefined(this.logoRouterLink);
  }

}