import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MessageService } from 'primeng/api';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Core Components
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { FileManagementComponent } from './features/file-management/file-management.component';
import { GraphVisualizationComponent } from './features/graph-visualization/graph-visualization.component';
import { ChatInterfaceComponent } from './features/chat-interface/chat-interface.component';

// Services
import { WebSocketService } from './core/services/websocket.service';
import { McpService } from './core/services/mcp.service';
import { FileSystemService } from './core/services/filesystem.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FileManagementComponent,
    GraphVisualizationComponent,
    ChatInterfaceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    
    // PrimeNG Modules
    ButtonModule,
    CardModule,
    MenubarModule,
    SidebarModule,
    PanelModule,
    InputTextModule,
    TableModule,
    ToastModule,
    ProgressBarModule,
    TabViewModule,
    ToolbarModule,
    SplitButtonModule
  ],
  providers: [
    MessageService,
    WebSocketService,
    McpService,
    FileSystemService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }