import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavButtonComponent } from '../nav-button/nav-button.component';
import { SceneService } from 'src/app/services/3D/scene.service';
import { CardsService } from 'src/app/services/3D/card/cards.service';


@Component({
  selector: 'app-page-home',
  standalone: true,
  imports: [CommonModule,NavButtonComponent],
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.css']
})
export class PageHomeComponent implements OnInit{

  constructor( public sceneService : SceneService, public cardsService: CardsService){}

  ngOnInit(): void 
  {
    this.sceneService.CameraHome();
    this.cardsService.displayInit()
  }
}
