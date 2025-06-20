import 'zone.js/node'; // Required for server-side rendering
import { renderApplication } from '@angular/platform-server';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

export default () => {
  return renderApplication(AppComponent, {
    providers: [provideHttpClient()]
  });
};
