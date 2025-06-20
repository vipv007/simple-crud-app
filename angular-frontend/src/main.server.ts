import type { ApplicationRef } from '@angular/core';
import { AppComponent } from './app/app.component';

export default function (): Promise<ApplicationRef> {
  return renderApplication(AppComponent, {
    providers: [provideHttpClient()]
  });
}
function renderApplication(AppComponent: any, arg1: { providers: any[]; }): Promise<ApplicationRef> {
    throw new Error('Function not implemented.');
}

function provideHttpClient(): any {
    throw new Error('Function not implemented.');
}

