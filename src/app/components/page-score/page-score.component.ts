import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/request/api.service';
import { NavButtonComponent } from '../nav-button/nav-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-page-score',
  standalone: true,
  imports: [
    CommonModule,
    NavButtonComponent,
    ReactiveFormsModule,],
  templateUrl: './page-score.component.html',
  styleUrls: ['./page-score.component.css']
})
export class PageScoreComponent implements OnInit{

  public isClick : boolean = false;
  public listeUser : any;
  public playerForm = new FormGroup({
    playerName: new FormControl('', Validators.required),
  });

  constructor(public apiService :ApiService){  
  
  }

  ngOnInit(): void 
  {
    this.listAll();
  }

  listAll()
  {
    this.apiService.scores().subscribe((data: any) =>
    {
      console.log(data);
      this.listeUser = data;
      this.listeUser.sort((a: { score: number; }, b: { score: number; }) => a.score - b.score);
    });
  }

  get listeMax(): { name: string, score: number , gamePlayed : number }[] {
    if (this.listeUser) 
    {
      return this.listeUser.slice(0,100);
    }
    return []
  }

  submitForm() {
    const playerNameControl = this.playerForm.get('playerName');
    this.isClick = true;
    
    if (playerNameControl) 
    {
      const playerName = playerNameControl.value as string;
      if(playerName == "")
      {
        this.listAll();
        return
      }
      this.apiService.getUser(playerName).subscribe(data => 
      {
        this.listeUser = [data];
        this.isClick = false;
      },
      (error: any) => {
        this.isClick = false;
        console.error('Error: ', error);
      });
    }
    
  }
}
