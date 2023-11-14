import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { SceneService } from '../3D/scene.service';
import { JsonLoaderService } from '../request/json-loader.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ParserColorBack} from '../config/parserOption/parserColorBack.model'
import { CardsService } from '../3D/card/cards.service';
import { ParserSpeedGame } from './parserOption/parserSpeedGame.model';
import { ParserSkybox } from './parserOption/parserSkybox.model';
import { DecorsService } from '../3D/decor/decors.service';

@Injectable({
  providedIn: 'root'
})
export class OptionService {

  private defaultData : any = undefined;
  private defaultPath : string = "assets/files/options/default.json";
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private colorBackground = new ParserColorBack();
  private speedGame = new ParserSpeedGame();
  private skybox = new ParserSkybox();


  constructor(
    public sceneService : SceneService, 
    public cardsService : CardsService, 
    public decorsService: DecorsService,
    public jsonLoaderService : JsonLoaderService) 
  { 
    this.colorBackground.setSuc(this.speedGame.setSuc(this.skybox));
    this.loadOption(); 
    this.getDataLoadedObservable().subscribe(loaded => 
    {
      if (loaded) 
      {
        this.tryLoadOption();
      }
      
    });
  }

  private apply()
  {
    const currentScene = this.sceneService.getCurrentSceneName()
    this.sceneService.setBackground(currentScene,this.colorBackground.getValue());
    this.cardsService.setSpeedGame(this.speedGame.getValue());
    this.decorsService.setSkybox(this.skybox.getValue());
  }

  getColorBackground(): THREE.Color 
  {
    return this.colorBackground.getValue()
  }

  getSpeedGame(): number
  {
    return this.speedGame.getValue()
  }

  setSpeedGame(speed : number)
  {
    this.cardsService.setSpeedGame(this.speedGame.setValue(speed));
  }

  getSkybox(): number 
  {
    return this.skybox.getValue()
  }

  setSkybox(index : number)
  {
    this.decorsService.setSkybox(this.skybox.setValue(index));
  }

  setColorBackground(R:number, G:number, B:number)
  {    
    this.sceneService.setBackground(this.sceneService.getCurrentSceneName(),this.colorBackground.setValue(new THREE.Color(R,G,B)));
  }

  saveOption()
  {
    this.colorBackground.handleRequest(this.defaultData,"save");
  }

  defaultOption()
  {
    this.colorBackground.handleRequest(this.defaultData,"default");
    this.apply()
  }

  tryLoadOption()
  {
    this.colorBackground.handleRequest(this.defaultData,"tryLoad");
    this.apply()
  }

  loadOption()
  {
    this.jsonLoaderService.getJSON(this.defaultPath).subscribe(data => {
      
      this.defaultData = data;
      this.loading.next(true);
    })
  }

  getDataLoadedObservable(): Observable<boolean> 
  {
    return this.loading.asObservable();
  }
}
