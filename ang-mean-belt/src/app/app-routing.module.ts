import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";
import {DetailsComponent} from "./details/details.component";
import {CreateComponent} from "./create/create.component";
import {EditComponent} from "./edit/edit.component";

const routes: Routes = [
  {path: 'edit', component: EditComponent},
  {path: 'edit/:belt_test_model_id', component: EditComponent},
  {path: 'create', component: CreateComponent},
  {path: 'details', component: DetailsComponent },
  {path: 'details/:belt_test_model_id', component: DetailsComponent },
  {path: 'home', component: HomeComponent},
  {path: '', component: HomeComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
