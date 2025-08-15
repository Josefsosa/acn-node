import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'acn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ACN Node';
  
  menuItems: MenuItem[] = [];
  sidebarVisible = false;
  
  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'File Management',
        icon: 'pi pi-folder',
        routerLink: '/file-management'
      },
      {
        label: 'Graph Visualization',
        icon: 'pi pi-share-alt',
        routerLink: '/graph'
      },
      {
        label: 'Chat Interface',
        icon: 'pi pi-comments',
        routerLink: '/chat'
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'MCP Servers',
            icon: 'pi pi-server'
          },
          {
            label: 'Preferences',
            icon: 'pi pi-sliders-h'
          }
        ]
      }
    ];

    // Show welcome message
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'ACN Node Ready',
        detail: 'Active Context Node Intelligence initialized successfully'
      });
    }, 1000);
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}