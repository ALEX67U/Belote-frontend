import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Object3dService ,Object3d} from '../object3d.service';
import { SceneService } from '../scene.service';
import { ApiService } from '../../request/api.service';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardsService 
{
  public firstLoad = true;
  public end : boolean = false
  private speed: number = 100;
  private play : boolean = false;

  setSpeedGame(Speed : number )
  {
    this.speed = 50/Speed
  }


  constructor(public object3DService :Object3dService,public sceneService : SceneService, public apiService : ApiService) 
  { 
    object3DService.addGeometry("MESH_CARD",new THREE.BoxGeometry(1, 2, 0.025));
    object3DService.addMaterial("WHITE",new THREE.MeshPhongMaterial({color: 0xffffff}));
    object3DService.addMaterial("BACK_CARD",new THREE.MeshPhongMaterial({map: object3DService.addTexture("BACK_CARD","assets/cards/dos.png")}));
  }

  generateCardsMesh()
  {
    this.apiService.getDeck().subscribe(data => {
        if (Array.isArray(data)) 
        {
          const white = this.object3DService.getMaterial("WHITE");
          const back = this.object3DService.getMaterial("BACK_CARD");
          
          let i = 0;
          for (const objet of data) 
          {          
            let name = objet.value + "_" + objet.color.category
            const face = this.object3DService.addMaterial(name,new THREE.MeshPhongMaterial({map: this.object3DService.addTexture(name,"assets/cards/" + name + ".png")}));
            name = name +"_CARD";

            const material = this.object3DService.addMaterial(name,[white, white, white, white, back, face]);
            const card3d = new Card3d(this.object3DService,this,material);

            this.sceneService.addObjToScene(this.sceneService.getCurrentSceneName(),name,card3d);

            localStorage.setItem('cardDeck_'+i,name);
            i++;
          } 
          this.displayInit();
        } 
        else 
        {
          console.error('Error: apiService.getDeck() : data is not an Array');
        }
      },
      (error: any) => {
        console.error('Error: ', error);
      }); 
  }


  displayHand()
  {
    let i = 0;
    let nameCard ;
    const length = parseInt(localStorage.getItem('nb_card') as string) 
    while(nameCard = localStorage.getItem('cardHand_'+i))
    {
      const card3d = this.object3DService.getObjectByName(nameCard) as Card3d;
      card3d.animation.init();
      card3d.animation.framekey = new Array();
      const vector = card3d.getMesh().position.clone()
      const rotation = card3d.getMesh().rotation.clone()

      card3d.animation.framekey.push({speed: this.speed, translation: vector, rotation :rotation});
      
      if((card3d.isDraw != true) && ((length-1 == i) || (length-2 == i)))
      {
        card3d.animation.framekey.push({speed: this.speed, translation: new THREE.Vector3(vector.x,vector.y + 2,vector.z), rotation : new THREE.Euler(rotation.x,rotation.y,0)});
        card3d.animation.framekey.push({speed: this.speed, translation: new THREE.Vector3((i - length + 1)*1.2 + 0.5*1.2,1,3),rotation : new THREE.Euler(-Math.PI * 1.1,0,0)});
      }
      else
      {
        const vectorNew = new THREE.Vector3(i*0.6,-1.375,0);
        const rotationNew = new THREE.Euler(-Math.PI*1.5,-0.05,0);
        if(i == 0)
        {
          rotationNew.y = 0
        }

        card3d.animation.framekey.push({speed: this.speed, translation: vectorNew , rotation :rotationNew});
      }
      
      
      card3d.isDraw = true;
      i++;
    }
    this.displayDeck();
  }

  displayInit()
  {
    const length = 32
    let i = 0;
    let nameCard ;
    if(this.firstLoad)
    {
      
      while(nameCard = localStorage.getItem('cardDeck_'+i))
      {
        const card3d = this.object3DService.getObjectByName(nameCard) as Card3d;
        
        if((length-4 < i))
        {
          if(i == length-3)
          {
            card3d.getMesh().rotation.y = 0
          }
          else
          {
            card3d.getMesh().rotation.y =  -0.03;
          }
          card3d.getMesh().rotation.x = -Math.PI*1.5;
          card3d.getMesh().rotation.z =  (i-length+2)*0.2 + 0.25;
          card3d.getMesh().position.x =  (i-length)*0.6 + 6
          card3d.getMesh().position.y =  -1.375;
          card3d.getMesh().position.z =  (i-length+3)*0.1;
        }
        else
        {
          card3d.getMesh().rotation.x = -Math.PI/2;
          card3d.getMesh().rotation.z =  Math.PI/12;
          card3d.getMesh().position.x =  -4.5;
          card3d.getMesh().position.y =  i*0.025 -1.4;
          card3d.getMesh().position.z =  0;
        }
        i++;
      }
      this.firstLoad = false;
    }
    else
    {
      while(nameCard = localStorage.getItem('cardDeck_'+i))
      {
        const card3d = this.object3DService.getObjectByName(nameCard) as Card3d;
        
        card3d.animation.init();
        card3d.animation.framekey = new Array();
        const vector = card3d.getMesh().position.clone()
        const rotation = card3d.getMesh().rotation.clone()

        card3d.animation.framekey.push({speed: this.speed, translation: vector, rotation :rotation});
        if((length-4 < i))
        {
          const vectorNew = new THREE.Vector3((i-length)*0.6 + 6,-1.375,(i-length+3)*0.1);
          const rotationNew = new THREE.Euler(-Math.PI*1.5,-0.03,(i-length+2)*0.2 + 0.25);
          if(i == 0)
          {
            rotationNew.y = 0
          }

          card3d.animation.framekey.push({speed: this.speed, translation: vectorNew , rotation :rotationNew});
        }
        else
        {
          card3d.animation.framekey.push({speed: this.speed, translation: new THREE.Vector3(-4.5,i*0.025 -1.4,0), rotation :new THREE.Euler(-Math.PI/2,0,Math.PI/12)});
        }
        
        i++;
      }
    }
    
  }

  displayHandInit()
  {
    this.play = true
    this.apiService.getCard(localStorage.getItem('gameUuid') as string).subscribe((data: any) => {
      const hand = data.user.hand;
      let i = 0;
      if (Array.isArray(hand)) 
      {
        for (const objet of hand) 
        {
          const nameCard = objet.value + "_" + objet.color.category + "_CARD";
          localStorage.setItem('cardHand_'+i,nameCard);
          i++
        }
      }
      localStorage.setItem('nb_card',data.user.hand.length ) ;
      localStorage.setItem('score',data.user.score) ;

      this.displayHand();
      this.play = false
    },
    (error: any) => {
      console.error('Error: ', error);
    });    
  }

  canPlay(): Observable<boolean> 
  {
    return new Observable<boolean>(ob=>
    {
      let i = 0;
      let nameCard ;
      let finish = false;   

      const checkAnimation = () => 
      {
        if(this.play && ! this.end)
          setTimeout(() => { checkAnimation()}, 100);
      
        else
        {
          finish = true
          i = 0;
          while(nameCard = localStorage.getItem('cardHand_'+i))
          {
            const card3d = this.object3DService.getObjectByName(nameCard) as Card3d;
            if(card3d.animation.isAnimate)
            {
              finish = false
            }
            i++;
          }

          if(finish) 
            ob.next(true) ;

          else
            setTimeout(() => { checkAnimation()}, 100) 
        }
      }
      checkAnimation();
    })
  }

  displayDeck()
  {
    let i = 0;
    let j = 0;
    let nameCard ;
    while(nameCard = localStorage.getItem('cardDeck_'+i))
    {
      const card3d = this.object3DService.getObjectByName(nameCard) as Card3d;
      if(!card3d.isDraw)
      {
        card3d.animation.init();
        card3d.animation.framekey = new Array();
        const vector = card3d.getMesh().position.clone()
        const rotation = card3d.getMesh().rotation.clone()

        card3d.animation.framekey.push({speed: this.speed, translation: vector, rotation :rotation});
        card3d.animation.framekey.push({speed: this.speed, translation: new THREE.Vector3(-4.5,j*0.025 -1.4,0), rotation :new THREE.Euler(-Math.PI/2,0,Math.PI/12)});

        j++;
      }
      i++;
    }
  }

  drawCard()
  {
    this.play = true
    this.apiService.drawCard(localStorage.getItem('gameUuid') as string).subscribe((data: any) => {
      const hand = data.game.user.hand;
      let i = 0;
      if (Array.isArray(hand)) 
      {
        for (const objet of hand) 
        {
          const nameCard = objet.value + "_" + objet.color.category + "_CARD";
          localStorage.setItem('cardHand_'+i,nameCard);
          i++
        }
      }
      
      localStorage.setItem('score',data.game.user.score) ;
      this.end = data.isFinish;
      
      if(!data.isFinish)
      {
        this.play = false
      }
      else
      {
        localStorage.setItem('end','true') ;
      }

      localStorage.setItem('nb_card',data.game.user.hand.length ) ;
      this.displayHand();
    },
    (error: any) => {
      console.error('Error: ', error);
      if(!this.end)
      {
        this.play = false
      } 
    });
  }

  cleanHand()
  {
    let i = 0;
    let nameCard ;
    while(nameCard = localStorage.getItem('cardHand_'+i))
    {
      localStorage.removeItem('cardHand_'+i);
      const card3d = this.object3DService.getObjectByName(nameCard) as Card3d;
      card3d.isDraw = false;
      i++;
    }
    localStorage.setItem('nb_card','0') ;
    localStorage.setItem('score','0') ;
    localStorage.removeItem('end') ;
    this.displayDeck();
  }
}

class Card3d extends Object3d
{
  public isDraw : boolean = false;
   
  constructor(public object3DService :Object3dService,public cardsService  :CardsService , material?: any) 
  { 
    if(!material)
    {
      material = object3DService.getMaterial("BACK_CARD");
    }

    super(object3DService.getGeometry("MESH_CARD"),material);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true
  }

  animationPlay()
  {
    this.animation.frameAnimation(this.getMesh());
    return this;
  }
}