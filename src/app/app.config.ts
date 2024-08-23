import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import {provideToastr } from 'ngx-toastr';
import {TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';


export const appConfig: ApplicationConfig = {
  providers: [
     provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
    provideAnimations(),
    provideToastr(
      {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
      }
    ),
    
  ]
};
