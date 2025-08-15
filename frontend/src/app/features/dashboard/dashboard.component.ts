import { Component, OnInit } from '@angular/core';

interface SystemMetric {
  label: string;
  value: string | number;
  unit?: string;
  status: 'success' | 'warning' | 'error';
  icon: string;
}

interface RecentActivity {
  timestamp: Date;
  action: string;
  description: string;
  type: 'file' | 'system' | 'user';
}

@Component({
  selector: 'acn-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  systemMetrics: SystemMetric[] = [];
  recentActivities: RecentActivity[] = [];
  
  // Dashboard stats
  totalFiles = 0;
  activeNodes = 37;
  memoryEfficiency = 87;
  processingSpeed = 340;
  
  constructor() {}

  ngOnInit() {
    this.initializeSystemMetrics();
    this.loadRecentActivities();
    this.simulateRealTimeUpdates();
  }

  private initializeSystemMetrics() {
    this.systemMetrics = [
      {
        label: 'Memory Efficiency',
        value: this.memoryEfficiency,
        unit: '%',
        status: 'success',
        icon: 'pi-chart-pie'
      },
      {
        label: 'Processing Speed',
        value: this.processingSpeed,
        unit: '% improvement',
        status: 'success',
        icon: 'pi-bolt'
      },
      {
        label: 'Active Nodes',
        value: this.activeNodes,
        status: 'success',
        icon: 'pi-share-alt'
      },
      {
        label: 'File Operations',
        value: 156,
        unit: 'today',
        status: 'success',
        icon: 'pi-folder'
      },
      {
        label: 'Response Time',
        value: '<50',
        unit: 'ms',
        status: 'success',
        icon: 'pi-clock'
      },
      {
        label: 'System Health',
        value: 'Optimal',
        status: 'success',
        icon: 'pi-heart'
      }
    ];
  }

  private loadRecentActivities() {
    this.recentActivities = [
      {
        timestamp: new Date(Date.now() - 2 * 60000),
        action: 'File Organization',
        description: 'Auto-organized 15 files in /projects/acn-node',
        type: 'file'
      },
      {
        timestamp: new Date(Date.now() - 5 * 60000),
        action: 'Memory Optimization',
        description: 'Applied memory compression, 12% space saved',
        type: 'system'
      },
      {
        timestamp: new Date(Date.now() - 8 * 60000),
        action: 'Graph Update',
        description: 'Added 3 new nodes to learning graph',
        type: 'system'
      },
      {
        timestamp: new Date(Date.now() - 12 * 60000),
        action: 'File Monitoring',
        description: 'Started monitoring /Users/jose.sosa/Documents/git',
        type: 'file'
      },
      {
        timestamp: new Date(Date.now() - 18 * 60000),
        action: 'MCP Server',
        description: 'Filesystem MCP server connected on port 5001',
        type: 'system'
      }
    ];
  }

  private simulateRealTimeUpdates() {
    // Simulate real-time metric updates
    setInterval(() => {
      // Update memory efficiency slightly
      this.memoryEfficiency = Math.min(90, this.memoryEfficiency + Math.random() * 0.5 - 0.25);
      
      // Update active nodes occasionally
      if (Math.random() < 0.1) {
        this.activeNodes += Math.floor(Math.random() * 3) - 1;
        this.activeNodes = Math.max(30, Math.min(50, this.activeNodes));
      }
      
      // Update metrics array
      this.systemMetrics[0].value = Math.round(this.memoryEfficiency);
      this.systemMetrics[2].value = this.activeNodes;
    }, 5000);
  }

  getStatusClass(status: string): string {
    return `acn-metric-${status}`;
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'file': return 'pi-folder';
      case 'system': return 'pi-cog';
      case 'user': return 'pi-user';
      default: return 'pi-info-circle';
    }
  }

  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  refreshDashboard() {
    this.initializeSystemMetrics();
    this.loadRecentActivities();
  }
}