import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavButtonComponent } from '../nav-button/nav-button.component';

@Component({
  selector: 'app-rule',
  standalone: true,
  imports: [CommonModule,NavButtonComponent],
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.css']
})
export class RuleComponent {

}
