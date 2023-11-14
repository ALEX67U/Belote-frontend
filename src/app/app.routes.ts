import { Routes } from '@angular/router';
import { PageLoginComponent } from './components/page-login/page-login.component';
import { PageGameComponent } from './components/page-game/page-game.component';
import { PageScoreComponent } from './components/page-score/page-score.component';
import { PageHomeComponent } from './components/page-home/page-home.component';
import { PageOptionComponent } from './components/page-option/page-option.component';
import { RuleComponent } from './components/rule/rule.component';

export const routes: Routes = [
    { path: 'home', component: PageHomeComponent },
    { path: 'login', component: PageLoginComponent },
    { path: 'option', component: PageOptionComponent },
    { path: 'game', component: PageGameComponent },
    { path: 'score', component: PageScoreComponent },
    { path: 'rule', component: RuleComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' } 
  ];
