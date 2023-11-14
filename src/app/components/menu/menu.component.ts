import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavButtonComponent } from '../nav-button/nav-button.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule,NavButtonComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements AfterViewInit{
  @ViewChild('MenuGame') menu!: ElementRef ;
  @ViewChild('MenuTitle') title!: ElementRef ;
  @ViewChild('MenuLogo') logo!: ElementRef ;

  private etat !: boolean
  
  constructor()
  {
    window.addEventListener('resize', () => this.minHeight());
  }

  ngAfterViewInit(): void 
  {
    this.minHeight();
  }

  toggleHeight(isMouseOver: boolean) 
  {    
    if (isMouseOver) 
    {
      this.maxHeight();
    } 
    else 
    {
      this.minHeight();
    }
  }

  toggleMobilHeight() 
  {    
    if (!this.etat) 
    {
      this.maxHeight();
    } 
    else 
    {
      this.minHeight();
    }
    
  }

  minHeight()
  {
    this.etat = false;
    //this.logo.nativeElement.style.height = this.title.nativeElement.scrollHeight/2 + 'px';
    this.menu.nativeElement.style.height = this.title.nativeElement.scrollHeight + 'px';
  }

  maxHeight()
  {
    this.etat = true;
    const contentHeight = this.menu.nativeElement.scrollHeight + 'px';
    this.menu.nativeElement.style.height = contentHeight;
  }
}
