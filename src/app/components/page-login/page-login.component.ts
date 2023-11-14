import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavButtonComponent } from '../nav-button/nav-button.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/request/api.service';
import { CardsService } from 'src/app/services/3D/card/cards.service';
import { MenuComponent } from '../menu/menu.component';
import { SceneService } from 'src/app/services/3D/scene.service';

@Component({
  selector: 'app-page-login',
  standalone: true,
  imports: [
    CommonModule,
    NavButtonComponent,
    ReactiveFormsModule,
    MenuComponent
  ],
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit{

  private playerName = localStorage.getItem('username');
  public error : boolean = false ;
  public gameRecuperation: boolean = false ;
  public isClick : boolean = false;

  public playerForm = new FormGroup({
    playerName: new FormControl('', Validators.required),
  });

  constructor(private fb: FormBuilder, private router: Router,public apiService : ApiService,public cardsService : CardsService, public sceneService : SceneService) 
  {
    this.playerForm= this.fb.group({
      playerName: [this.playerName, Validators.required],
    });
  }

  ngOnInit(): void 
  {
    this.sceneService.CameraHome();
  }

  submitForm() {
    const playerNameControl = this.playerForm.get('playerName');

    if (playerNameControl) 
    {
      this.playerName = playerNameControl.value as string;
      localStorage.setItem('username', this.playerName);
      if (localStorage.getItem('gameUuid') && (localStorage.getItem('userGame') == this.playerName))
      {
        this.gameRecuperation = true;
      }
      else
      {
        this.newGame();
      }
    }
  }

  newGame() 
  {
    const gameUuid = localStorage.getItem('gameUuid');
    if(gameUuid)
    {
      this.apiService.quit(gameUuid);
    }

    if (this.playerName && !this.isClick) 
    {
      this.isClick = true;
      this.apiService.startGame(this.playerName).subscribe(data => 
      {
        localStorage.setItem('gameUuid', data );
        localStorage.setItem('userGame', this.playerName as string);
        this.cardsService.cleanHand();
        this.router.navigate(['/game']);
        this.error = false;
        this.isClick = false;
      },
      (error: any) => {
        this.error = true;
        this.isClick = false;
        console.error('Error: ', error);
      });
    }
  }

  recoverGame() 
  {
    const gameUuid = localStorage.getItem('gameUuid')
    if(gameUuid && !this.isClick)
    {
      this.isClick = true;
      this.apiService.getCard(gameUuid).subscribe(data => 
      {
        //this.cardsService.cleanHand();
        this.router.navigate(['/game']);
        this.error = false;
        this.isClick = false;
      },
      (error: any) => {
        this.error = true;
        this.isClick = false;
        console.error('Error: ', error);
      });
    }
  }
}
