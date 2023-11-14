import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-button.component.html',
  styleUrls: ['./nav-button.component.css']
})

export class NavButtonComponent {
  @Input() path!: string;
  @Input() class_button?: string;

  constructor(private router: Router) {}

  navigateTo(path: string) {
    if(path == "retour")
      window.history.back();
    else
      this.router.navigate(['/'+ path ]);
  }
}