
import { HttpClientModule } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { provideRouter } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";
import { routes } from "./app/app.routes";

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientModule),provideRouter(routes), provideAnimations()]
}).catch((err) => console.error(err));