import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionService } from 'src/app/services/config/option.service';

@Component({
  selector: 'app-page-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-option.component.html',
  styleUrls: ['./page-option.component.css']
})
export class PageOptionComponent{

  red: number = 0;
  green: number = 0;
  blue: number = 0;
  speedGame : number = 1;
  skybox : number = 0;

  constructor(public optionService :OptionService)
  {
    this.optionService.getDataLoadedObservable().subscribe(loaded => 
    {
      this.updateColorBackground();
      this.speedGame = this.optionService.getSpeedGame();
      this.skybox =this.optionService.getSkybox()
    });
  }

  updateColorBackground(color?: string, event?: Event) 
  {
    if(event)
    {
      const value = (event.target as HTMLInputElement).value;
      const numericValue = parseInt(value, 10);
      switch (color) 
      {
        case 'red':
          this.red = numericValue/255;
          break;
        case 'green':
          this.green = numericValue/255;
          break;
        case 'blue':
          this.blue = numericValue/255;
          break;
      }
      this.optionService.setColorBackground(this.red,this.green,this.blue);
    }
    else
    {
      const color = this.optionService.getColorBackground();
      this.red = color.r
      this.green = color.g
      this.blue = color.b
    }
  }

  Skybox(index : number)
  {
    this.optionService.setSkybox(this.skybox = index )
  }

  SpeedGame(speed: number) 
  {
    this.optionService.setSpeedGame(this.speedGame = speed);
  }
  
  cancel() 
  {
    this.optionService.tryLoadOption();
    this.updateColorBackground();
  }
  
  default() 
  {
    this.optionService.defaultOption();
    this.updateColorBackground();
  }

  apply() 
  {
    this.optionService.saveOption();
    window.history.back();
  }
  
}
