import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FilterComponent} from "./pokemon/filter/filter.component";


const routes: Routes = [
  { path: 'pokemon', component: FilterComponent },
  { path: '**', redirectTo: '/pokemon' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
