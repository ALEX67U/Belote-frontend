import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { AnimationPosition, Object3d, Object3dService } from './object3d.service';
import { Vector2 } from 'three';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  private scenes: Map<string, THREE.Scene> = new Map<string, THREE.Scene>();
  private camera: THREE.PerspectiveCamera;
  public movingCamera = new AnimationPosition() ;
  private webGLRenderer: THREE.WebGLRenderer;
  private currentScene : string = "";

  private PointLight : THREE.PointLight;
  private Directionellight : THREE.DirectionalLight ;
  private ambientLight : THREE.AmbientLight;

  private axesHelper : THREE.AxesHelper;
  private mouseDown: boolean = false;
  private previousMousePosition = new Vector2();
  private posX: number = 0;
  private posY: number = 0;

  private onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerWidth/2.1;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.webGLRenderer.setSize(width, height);
  }

  setColorLight(color : THREE.Color)
  {
    this.Directionellight.color = color;
  }

  constructor(public object3dService : Object3dService) 
  { 
    // Initialise la caméra perspective
    this.camera = new THREE.PerspectiveCamera(75, 2.1, 0.1, 1000);
    this.camera.position.set(0, 3.25, 0);
    this.camera.lookAt(0,0,0);

    this.axesHelper = new THREE.AxesHelper(5);
    this.axesHelper.visible = false;

    this.Directionellight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.Directionellight.position.set(0,5,10);
    this.Directionellight.lookAt(0,0,0);
    
    this.PointLight = new THREE.PointLight(0xffffff, 100,100); // Lumière blanche
    this.PointLight.position.set(0, 10, 10); // Position de la lumière

    this.PointLight.castShadow = true;
    this.PointLight.shadow.bias = -0.001;

    this.ambientLight = new THREE.AmbientLight(0x999999);

    // Initialise le moteur de rendu WebGL
    this.webGLRenderer = new THREE.WebGLRenderer({ antialias: true });
    this.webGLRenderer.setSize(window.innerWidth, window.innerWidth/2.1);
    //document.body.appendChild(this.webGLRenderer.domElement);

    this.webGLRenderer.shadowMap.enabled = true;
    //this.webGLRenderer.shadowMap.darkness = 0.5;
    this.webGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    // Gérez le redimensionnement de la fenêtre
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    const animate = () => {
      requestAnimationFrame(animate);
      const scene = this.scenes.get(this.currentScene);

      if (scene) 
      {
        for (const object of this.object3dService.getAllObjectsByScene(this.currentScene)) 
        {
          object.animationPlay();
        }
        this.moveCamera();
        this.webGLRenderer.render(scene, this.camera);
      }
    }

    document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    
    animate();
  }

  public CameraHome()
  {
    this.movingCamera.init();
    this.movingCamera.framekey = new Array();
    this.movingCamera.lookAT = undefined;
    const vector = this.camera.position.clone();
    const rotation = this.camera.rotation.clone();
    this.movingCamera.framekey.push({speed: 100, translation: vector, rotation: rotation});
    this.movingCamera.framekey.push({speed: 100, translation: new THREE.Vector3(0, 3.25, 0), rotation: new THREE.Euler(-1.57069632679523,0,0)});
  }

  public CameraGame()
  {
    this.movingCamera.init();
    this.movingCamera.framekey = new Array();
    this.movingCamera.lookAT = new THREE.Vector3(0,0,0);
    const vector = this.camera.position.clone()
    this.movingCamera.framekey.push({speed: 100, translation: vector});
    this.movingCamera.framekey.push({speed: 100, translation: new THREE.Vector3(0, 2, 6)});
  }

  // Méthode pour gérer le clic de la souris
  private onMouseDown(event: MouseEvent): void {
    if (window.location.pathname === '/game' && !this.movingCamera.isAnimate)
    {
      this.mouseDown = true;
      this.previousMousePosition.set(event.clientX, event.clientY);
    }
  }

  // Méthode pour gérer le relâchement du bouton de la souris
  private onMouseUp(event: MouseEvent): void {  
      this.mouseDown = false;
  }

  // Méthode pour gérer le mouvement de la souris
  private onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) 
    {
      const currentMousePosition = new Vector2(event.clientX, event.clientY);
      const delta = currentMousePosition.clone().sub(this.previousMousePosition);
      this.previousMousePosition.copy(currentMousePosition);
      
      // Ajustez la rotation de la caméra en fonction du mouvement de la souris
      if (this.camera && this.axesHelper) 
      {
        const limite = 0.5;
        this.posX = delta.x * 0.002;
        this.posY = delta.y * 0.002;

        if (this.posX  > limite) 
        {
          this.posX  = -limite;
        } 
        else if (this.posX  < -limite) 
        {
          this.posX  = limite;
        }
      
        // Vérifiez si PosY dépasse les limites
        if (this.posY > limite) 
        {
          this.posY = -limite;
        } 
        else if (this.posY < -limite) 
        {
          this.posY = limite;
        }

        const localPositionX = new THREE.Vector3(1, 0, 0); // L'extrémité de l'axe X local
        const localPositionY = new THREE.Vector3(0, 1, 0); // L'extrémité de l'axe Y local

        // Transformez ces positions locales en positions mondiales
        const worldPositionX = this.axesHelper.localToWorld(localPositionX.clone());
        const worldPositionY = this.axesHelper.localToWorld(localPositionY.clone());
        
        this.camera.position.applyAxisAngle(worldPositionX, -this.posY);
        this.camera.position.applyAxisAngle(worldPositionY, -this.posX);
        
        // Appliquez la matrice de transformation au plan
        this.axesHelper.lookAt(this.camera.position);
        this.camera.lookAt(0, 0, 0); 
        
      }
    }
  }

  private SceneExist(sceneName: string) : boolean
  {
    if (this.scenes.has(sceneName)) 
      return true;
    
    console.error("ERROR : SceneExist name is unknown");

    return false;
  }

  public changeScene(sceneName: string) : SceneService {
    if (this.SceneExist(sceneName)) 
      this.currentScene = sceneName;
   
    return this;
  }

  public getCurrentSceneName() : string
  {
    return this.currentScene;
  }

  public setBackground(sceneName:string, color : THREE.Color) : SceneService
  {
    const scene = this.scenes.get(sceneName);
    if (scene) 
    {
      const color1 = color; 
      const color2 = new THREE.Color(0x000000);

      // Créer un dégradé linéaire horizontalement en changeant les couleurs de gauche à droite
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      if (context) 
      {
        const gradient = context.createLinearGradient(0, 0, 0, 256);

        gradient.addColorStop(0, '#' + color1.getHexString());
        gradient.addColorStop(1, '#' + color2.getHexString());

        context.fillStyle = gradient;
        context.fillRect(0, 0, 1, 256);

        const gradientTexture = new THREE.CanvasTexture(canvas);
        scene.background = gradientTexture;
      }
      else
      {
        scene.background = color;
      }  
    }
    
    return this;
  }

  public newScene(sceneName: string) : SceneService {
    let s = new THREE.Scene;
    this.scenes.set(sceneName, s);
    s.add(this.axesHelper);
    s.add(this.PointLight);
    s.add(this.Directionellight);
    s.add(this.ambientLight);
    
    return this;
  }
  
  public addObjToScene(sceneName: string, objectName : string , obj : Object3d): SceneService {
    
    const scene = this.scenes.get(sceneName);
    if (scene && this.object3dService.addObject(sceneName, objectName , obj)) 
    {
      obj.getMesh().receiveShadow = true;
      scene.add(obj.getMesh());
    }
     
    return this;
  }
  
  public displayRenderer() : SceneService {
    document.body.appendChild(this.webGLRenderer.domElement);
    
    return this;
  }

  public removeRenderer() : SceneService {
    const domElement = this.webGLRenderer.domElement;
  
    if (domElement.parentElement) 
      domElement.parentElement.removeChild(domElement); 
    
    return this;
  }

  public removeScene(sceneName: string) : SceneService 
  {
    this.clearSceneObjects(sceneName).scenes.delete(sceneName);
    return this;
  }

   // Supprimer tous les objets d'une scène spécifique
   clearSceneObjects(sceneName: string): SceneService 
   {
    const scene = this.scenes.get(sceneName);
    if (scene) 
    {
      while (scene.children.length > 0) 
      {
        scene.remove(scene.children[0]);
      }
    }

    return this;
  }

  public moveCamera()
  {
    this.movingCamera.frameAnimation(this.camera);
  }
}
