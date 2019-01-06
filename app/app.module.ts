import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlogService } from './blog.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { PreviewComponent } from './preview/preview.component';
import { AppRoutingModule } from './app-routing.module';
import {APP_BASE_HREF} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    EditComponent,
    PreviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    HttpClientModule
  ],
  //providers: [BlogService, {provide: APP_BASE_HREF, useValue: '/editor/'}],
  providers: [BlogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
