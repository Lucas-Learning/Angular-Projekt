import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; 
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // or your routes file

import { App } from './app/app';


bootstrapApplication(App, {
providers: [
  provideRouter(routes),
  provideHttpClient(),
]
} )
  .catch((err) => console.error(err));
