import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { SceneService } from './scene.service';

@Injectable({
  providedIn: 'root'
})

export class Object3dService 
{
  private geometrys = new Map<string, THREE.BoxGeometry>();
  private materials = new Map<string, any>();
  private textures = new Map<string, THREE.Texture>();
  private loader = new THREE.TextureLoader();
  private objects = new Map<{ scene: string, name: string }, Object3d>();

  constructor() 
  { 
    this.addTexture("MISSING_TEXTURE","assets/MISSING_TEXTURE.png");
  }

  // Récupérer une géométrie à partir de la carte des géométries
  getGeometry(name: string): any
  {
    return this.geometrys.get(name);
  }

  // Récupérer un matériau à partir de la carte des matériaux
  getMaterial(name: string): any
  {
    return this.materials.get(name);
  }

  getTexture(name: string): THREE.Texture
  {
    if (!this.textures.has(name)) 
      return this.textures.get("MISSING_TEXTURE") as THREE.Texture
    return this.textures.get(name) as THREE.Texture;
  }

  // Ajouter une géométrie à la map des géométries
  addGeometry(name: string, geometry: any): any  
  {
    if (!this.geometrys.has(name)) 
      this.geometrys.set(name, geometry);
    return this.getGeometry(name); 
  }

  // Supprimer une géométrie de la map des géométries
  removeGeometry(name: string): void 
  {
    if (this.geometrys.has(name)) 
      this.geometrys.delete(name);
  }

  // Ajouter un matériau à la map des matériaux
  addMaterial(name: string, material: any): any 
  {
    if (!this.materials.has(name)) 
      this.materials.set(name, material)
    return this.getMaterial(name); 
  }

  // Supprimer un matériau de la map des matériaux
  removeMaterial(name: string): void 
  {
    if (this.materials.has(name)) 
      this.materials.delete(name);
  }

  public addTexture(name: string, path: string): THREE.Texture  
  {
    if (!this.textures.has(name)) 
    {
      let textures = this.textures;
      const texture = this.loader.load(
        path,
        undefined,
        undefined,
        function () 
        {
          let t = textures.get("MISSING_TEXTURE") as THREE.Texture;
          texture.image = t.image;
          texture.needsUpdate = true;
        });

        this.textures.set(name,texture);
      return texture ;
    }

    return this.getTexture(name) as THREE.Texture; 
  }

  removeTextures(name: string): void 
  {
    if (this.textures.has(name)) 
      this.textures.delete(name);
  }

  // Ajouter un objet à la map des objets
  addObject(scene: string, name: string, object: Object3d): boolean
  {
    let notExist = true;
    this.objects.forEach((value, key) => 
    {
      if (key.name === name) 
      {
        notExist = false;
        return;
      }
    });

   
    if(notExist)
    {
      this.objects.set({ scene, name }, object);
      return true;
    }
    return false; 
  }

  // Supprimer un/des objet/s de la map des objets
  removeObjects(scene?: string, name?: string): void 
  {
    if (scene && name) 
    {
      this.objects.delete({ scene, name });
    } 
    else if (scene) 
    {
      this.objects.forEach((value, key) => {
        if (key.scene === scene) 
        {
          this.objects.delete(key);
        }
      });
    } 
    else if (name) 
    {
      this.objects.forEach((value, key) => 
      {
        if (key.name === name) 
        {
          this.objects.delete(key);
        }
      });
    }
  }

  getObjectByName(name: string): Object3d | null 
  {
    for (const [key, value] of this.objects) 
    {
      if (key.name === name) 
      {
        return value;
      }
    }
    return null;
  }

  getAllObjectsByScene(sceneName: string): Object3d[] 
  {
    const objects: Object3d[] = [];
    
    this.objects.forEach((value, key) => {
        if (key.scene === sceneName)
        {
          if (Array.isArray(value)) 
          {
              objects.push(...value);
          } 
          else 
          {
              objects.push(value);
          }
        }
    });

    return objects;
  }

  // Supprimer toutes les géométries
  clearGeometries(): void 
  {
    this.geometrys.clear();
  }

  // Supprimer tous les matériaux
  clearMaterials(): void 
  {
    this.materials.clear();
  }

  // Supprimer tous les objets
  clearObjects(): void 
  {
    this.objects.clear();
  }

  // Supprimer toutes les données (géométries, matériaux, objets)
  clearAll(): void 
  {
    this.geometrys.clear();
    this.materials.clear();
    this.objects.clear();
  }
}

export class AnimationPosition
{
  public isAnimate : boolean = false;
  public lookAT !: THREE.Vector3 | undefined;
  public frame : number = 0;
  public frameEnd : number = 0;
  public keyAnimation : number = 0;
  public framekey !: Array<{ speed : number, translation ?: THREE.Vector3,  rotation ?: THREE.Euler}>;

  init()
  {
    this.frame = 0;
    this.frameEnd = 0;
    this.keyAnimation = 0;
    this.isAnimate = true;
  }

  frameAnimation(obj : any)
  {
    if (this.isAnimate && Array.isArray(this.framekey)) 
    {
      
      if (this.framekey.length == this.keyAnimation +1) 
      {
        this.isAnimate = false;
        this.keyAnimation = 0;
      }
      else
      {
        const A = this.framekey[this.keyAnimation].translation;
        const B = this.framekey[this.keyAnimation+1].translation;

        const R1 = this.framekey[this.keyAnimation].rotation;
        const R2 = this.framekey[this.keyAnimation+1].rotation;

        this.frameEnd = this.framekey[this.keyAnimation].speed;
        this.frame ++;
  
        if(A && B)
        {
          const vector = new THREE.Vector3();
          vector.subVectors(B,A);
          vector.divideScalar(this.frameEnd);    
          obj.position.addVectors(obj.position, vector);
        }

        if(R1 && R2)
        {
          
          const rotation = new THREE.Euler(
            (R2.x - R1.x) / this.frameEnd, 
            (R2.y - R1.y) / this.frameEnd, 
            (R2.z - R1.z) / this.frameEnd
          ); 
          obj.rotation.x += rotation.x;
          obj.rotation.y += rotation.y;
          obj.rotation.z += rotation.z;
        }
  
        if(this.frameEnd <= this.frame)
        {
          this.frameEnd = 0;
          this.frame = 0;
          this.keyAnimation++;
          if(B)
          obj.position.copy(B) ;
          if(R2)
          obj.rotation.copy(R2) ;
        }
      }
    }
    if (this.lookAT) 
    {
      obj.lookAt(this.lookAT);
    }
  }
}

export abstract class Object3d
{
  protected mesh : THREE.Mesh;
  public animation= new AnimationPosition();

  constructor(geometry: any, material: any)
  {
    this.mesh = new THREE.Mesh(geometry, material);
  }

  getMesh() : THREE.Mesh
  {
    return this.mesh;
  }

  abstract animationPlay () : Object3d;
}
