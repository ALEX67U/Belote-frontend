import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavButtonComponent } from '../nav-button/nav-button.component';
import { CardsService } from 'src/app/services/3D/card/cards.service';
import { MenuComponent } from '../menu/menu.component';
import { SceneService } from 'src/app/services/3D/scene.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/request/api.service';

@Component({
  selector: 'app-page-game',
  standalone: true,
  imports: [CommonModule,NavButtonComponent,MenuComponent],
  templateUrl: './page-game.component.html',
  styleUrls: ['./page-game.component.css']
})
export class PageGameComponent implements OnInit{

  isClick : boolean = true
  score: string = '0'
  end !: boolean 
  error!: boolean;

  constructor(public cardsService : CardsService,public sceneService:SceneService,private router: Router,public apiService : ApiService) 
  {}

  ngOnInit(): void {

    this.sceneService.CameraGame();
    if (localStorage.getItem('end')) 
    {
      this.end = true
    }
    else
    {
      this.end = false
      this.cardsService.displayHandInit();
      this.cardsService.canPlay().subscribe(() => {
        this.isClick = false;
      });
    }

    if(localStorage.getItem('score'))
    {
      this.score = localStorage.getItem('score') as string;
    }    
  }

  drawCard()
  {
    this.isClick = true;
    this.cardsService.drawCard();
    this.cardsService.canPlay().subscribe(() => {
      if (this.cardsService.end) 
      {
        localStorage.removeItem('gameUuid');
        this.cardsService.end = false;
        this.end = true;
      }  
      else
        this.isClick = false;
      this.score = localStorage.getItem('score') as string;
    });
  }

  giveUp()
  {
    this.isClick = true;
    this.cardsService.cleanHand();
    this.cardsService.displayDeck();
    localStorage.removeItem('gameUuid');
    window.history.back();
  }
    
  newGame() 
  {
    const playerName = localStorage.getItem('userGame');
    if (playerName && this.isClick) 
    {
      this.isClick = false;
      this.apiService.startGame(playerName).subscribe(data => 
      {
        localStorage.setItem('gameUuid', data );
        this.cardsService.cleanHand();
        this.router.navigate(['/game']);
        this.end = false;
        this.score = '0';
        this.cardsService.cleanHand();
      },
      (error: any) => {
        this.error = true;
        this.isClick = true;
        console.error('Error: ', error);
      });
    }
  }
}
