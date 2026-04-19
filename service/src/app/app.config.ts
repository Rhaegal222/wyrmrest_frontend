// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
// import { routes } from './app.routes'; // opzionale, puoi anche passare []

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter([]),
    provideTranslateService({ lang: 'it', fallbackLang: 'it' }),
    provideTranslateHttpLoader({ prefix: 'assets/i18n/', suffix: '.json' }),
  ],
};
