import { Injectable, OnInit } from '@angular/core';
import { Object3d, Object3dService } from '../object3d.service';
import { SceneService } from '../scene.service';
import * as THREE from 'three';
import { JsonLoaderService } from '../../request/json-loader.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DecorsService {
  
  private SkyboxJson : any;
  private defaultPath = "assets/files/options/skybox.json"
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getDataLoadedObservable(): Observable<boolean> 
  {
    return this.loading.asObservable();
  }

  constructor(
    public object3DService :Object3dService,
    public sceneService : SceneService,
    public jsonLoaderService : JsonLoaderService) 
  { 
    this.jsonLoaderService.getJSON(this.defaultPath).subscribe(data => {   
      this.SkyboxJson = data;
      this.loading.next(true);
    })

    object3DService.addGeometry("TABLE",new THREE.BoxGeometry(14,0.2,7));
    object3DService.addGeometry("BOARDGAME",new THREE.BoxGeometry(13,0.01,6));
    //object3DService.addGeometry("TABLE",new THREE.CylinderGeometry(4, 4,0.2));
    object3DService.addGeometry("SKYBOX_CUBE",new THREE.BoxGeometry(500, 500, 500));
    object3DService.addGeometry("SKYBOX_SPHERE",new THREE.SphereGeometry(500, 500, 100));
    
    object3DService.addMaterial("WOOD",new THREE.MeshPhongMaterial({map: object3DService.addTexture("WOOD","assets/WOOD.jpg")}));
    object3DService.addMaterial("BOARDGAME",new THREE.MeshPhongMaterial({map: object3DService.addTexture("BOARDGAME","assets/BOARDGAME.jpg")}));
  }

  setSkybox(index: number) 
  {
    this.getDataLoadedObservable().subscribe(load =>
    {
      if(load)
      {
        console.log("test")
        const sphere = this.object3DService.getObjectByName("SKYBOX_SPHERE");
        const cube = this.object3DService.getObjectByName("SKYBOX_CUBE");
        
        if(cube)
        {
          cube.getMesh().visible = false;
        }

        if(sphere)
        {
          sphere.getMesh().visible = false;
        }
        if((index <= 0) || (index > this.SkyboxJson.length))
        {
          this.sceneService.setColorLight(new THREE.Color(1,1,1));
          return;
        }

        const color = this.SkyboxJson[index - 1].color;
        this.sceneService.setColorLight(new THREE.Color(color.r,color.g,color.b));

        this.object3DService.removeTextures("SKYBOX");
        this.object3DService.removeMaterial("SKYBOX");
        const texture = this.object3DService.addTexture("SKYBOX","../../../assets/Skybox/" + this.SkyboxJson[index - 1].texture);
        if(this.SkyboxJson[index - 1].shape == "cube")
        { 
          if(cube)
          {
            cube.getMesh().visible = true;
            var materialArray = [];
            materialArray.push(this.addFace(0, 1.01/3 , 0.25, 0.98/3 ));
            materialArray.push(this.addFace(2/4, 1.01/3, 0.25, 0.98/3 ));
            materialArray.push(this.addFace(1.99/4, -0.0005, -0.247, -1/3 ));
            materialArray.push(this.addFace(1.995/4, 1.001/3, -0.248, -0.99/3 ));
            materialArray.push(this.addFace(3/4, 1.01/3 ,0.25, 0.98/3));
            materialArray.push(this.addFace( 1/4, 1/3 ,0.25, 1/3));
            cube.getMesh().material = this.object3DService.addMaterial("SKYBOX",materialArray);
          }
        }
        else
        {
          if(sphere)
          {
            sphere.getMesh().visible = true;
            sphere.getMesh().material = this.object3DService.addMaterial("SKYBOX",new THREE.MeshBasicMaterial({map:  texture , side: THREE.BackSide}));
          }
        }
      }
    })
  }

  private addFace(x : number,y : number,w : number,h : number) : THREE.MeshBasicMaterial
  {
    const texture = this.object3DService.getTexture("SKYBOX");
    const material = new THREE.MeshBasicMaterial({map: texture.clone(), side: THREE.BackSide});
    let map = material.map as THREE.Texture
    map.wrapS = texture.wrapT = THREE.RepeatWrapping;
    map.offset.set( x,y );
    map.repeat.set( w,h );
    return material;
  }

  init()
  {
    const table = new Decor(this.object3DService.getGeometry("TABLE"),this.object3DService.getMaterial("WOOD"));
    this.sceneService.addObjToScene(this.sceneService.getCurrentSceneName(),"TABLE",table);
    const boardgame = new Decor(this.object3DService.getGeometry("BOARDGAME"),this.object3DService.getMaterial("BOARDGAME"));
    this.sceneService.addObjToScene(this.sceneService.getCurrentSceneName(),"BOARDGAME",boardgame);
    
    const skybox_cube = new Decor(this.object3DService.getGeometry("SKYBOX_CUBE"),this.object3DService.getMaterial("SKYBOX"));
    this.sceneService.addObjToScene(this.sceneService.getCurrentSceneName(),"SKYBOX_CUBE",skybox_cube);
    
    const skybox_sphere = new Decor(this.object3DService.getGeometry("SKYBOX_SPHERE"),this.object3DService.getMaterial("WOOD"));
    this.sceneService.addObjToScene(this.sceneService.getCurrentSceneName(),"SKYBOX_SPHERE",skybox_sphere);
    console.log(skybox_sphere);
    table.getMesh().position.y = -1.5;
    boardgame.getMesh().position.y = -1.4;
    table.getMesh().castShadow = true;
    table.getMesh().receiveShadow = true
    skybox_cube.getMesh().visible = false;
    skybox_sphere.getMesh().visible = false;
  }
}

class Decor extends Object3d
{
  constructor(geometry: any, material: any) 
  { 
    super(geometry,material);
  }

  animationPlay()
  {
    return this;
  }
}