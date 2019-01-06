import { PreviewComponent } from './preview/preview.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EditComponent } from './edit/edit.component'

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full'},
  { path: 'edit/:id', component: EditComponent },
  { path: 'preview/:id', component: PreviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
