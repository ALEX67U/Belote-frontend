import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SceneService } from './services/3D/scene.service';
import { ApiService } from './services/request/api.service';
import { CardsService } from './services/3D/card/cards.service';
import { DecorsService } from './services/3D/decor/decors.service';
import { OptionService } from './services/config/option.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,

  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(
    public sceneService :SceneService,
    public apiService : ApiService , 
    public cardsService : CardsService, 
    public decorsService : DecorsService,
    public optionService : OptionService
    ) 
  { 
    sceneService.newScene("scene_1").changeScene("scene_1").displayRenderer();
    cardsService.generateCardsMesh();
    decorsService.init();
  }
}

