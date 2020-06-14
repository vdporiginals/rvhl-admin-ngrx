import { Component } from '@angular/core';
import { SideBar } from './shared/data/right-menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;
  rightMenu = SideBar;
}
