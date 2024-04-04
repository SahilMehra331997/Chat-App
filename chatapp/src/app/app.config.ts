import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage  } from '@angular/fire/storage';
import { getFirestore, provideFirestore  } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
              provideClientHydration(), 
              importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"chat-app-d0f72","appId":"1:996808410885:web:447ba795d9f6d18bde196c","storageBucket":"chat-app-d0f72.appspot.com","apiKey":"AIzaSyCl0pY22VoyEADOAPF95Ph1UZWXfPyE9T0","authDomain":"chat-app-d0f72.firebaseapp.com","messagingSenderId":"996808410885"}))), 
              importProvidersFrom(provideAuth(() => getAuth()),
                                  provideStorage(() => getStorage()),
                                  provideFirestore(() => getFirestore())),
             ]
};
