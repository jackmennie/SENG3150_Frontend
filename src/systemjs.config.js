/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      'app': 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/material': 'npm:@angular/material/bundles/material.umd.js',
      '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
      '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
      '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js', 
      '@angular/cdk': 'npm:@angular/cdk/bundles/cdk.umd.js',
      'mydaterangepicker': 'npm:mydaterangepicker/bundles/mydaterangepicker.umd.js',
      'date-fns': 'npm:date-fns@1.28.4',
      '@agm/core': 'npm:@agm/core/core.umd.js',
      

      // other libraries
      'rxjs':                      'npm:rxjs',
      'md2': 'node_modules/md2/bundles/md2.umd.js',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      'angular2-jwt' : 'node_modules/angular2-jwt/angular2-jwt.js',
      'auth0': '../auth0.umd.js',
      'ng2-aside': 'node_modules/ng2-aside/dist/ng2-aside.umd.js',
      'ng2-slim-loading-bar': 'node_modules/ng2-slim-loading-bar/bundles/index.umd.js',
      '@ng-bootstrap/ng-bootstrap': 'node_modules/@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js',
      'angular-calendar': 'npm:angular-calendar/dist/umd/angular-calendar.js',
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        defaultExtension: 'js',
        meta: {
          './*.js': {
            loader: 'systemjs-angular-loader.js'
          }
        }
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'angular2-jwt' : { 
        "defaultExtension" : 'js'
      },
      'angular-in-memory-web-api' : {
        main: './index.js',
        defaultExtension: 'js'
      }
    }
  });
})(this);
