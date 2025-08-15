import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { FileManagementComponent } from './features/file-management/file-management.component';
import { GraphVisualizationComponent } from './features/graph-visualization/graph-visualization.component';
import { ChatInterfaceComponent } from './features/chat-interface/chat-interface.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'file-management', component: FileManagementComponent },
  { path: 'graph', component: GraphVisualizationComponent },
  { path: 'chat', component: ChatInterfaceComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false, // Set to true for debugging
    useHash: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }