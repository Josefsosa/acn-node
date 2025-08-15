#!/usr/bin/env node

/**
 * Filesystem MCP Server with Auto File Management
 * Provides intelligent file organization, project detection, and real-time file operations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';
import { glob } from 'glob';
import mime from 'mime-types';
import { WebSocketServer } from 'ws';
import express from 'express';

class FilesystemMCP {
  constructor() {
    this.server = new Server(
      {
        name: 'filesystem-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.watchers = new Map();
    this.config = {
      watchPaths: ['/Users/jose.sosa/Documents/git/pathfinder'],
      excludePatterns: ['node_modules/**', '.git/**', '*.log', 'dist/**'],
      autoOrganize: true,
      autoAccept: true // Auto-accept file operations
    };

    this.fileOperationHistory = [];
    this.projectStructures = new Map();
    
    this.setupTools();
    this.setupFileWatching();
    this.setupWebSocketServer();
    
    // Auto-organize on startup
    if (this.config.autoOrganize) {
      this.autoOrganizeProjects();
    }
  }

  setupWebSocketServer() {
    this.app = express();
    this.app.use(express.json());
    
    const server = this.app.listen(5001, () => {
      console.log('🗂️  Filesystem MCP Server running on port 5001');
    });

    this.wss = new WebSocketServer({ server });
    
    this.wss.on('connection', (ws) => {
      console.log('📡 Frontend connected to Filesystem MCP');
      
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          const response = await this.handleWebSocketMessage(message);
          ws.send(JSON.stringify(response));
        } catch (error) {
          ws.send(JSON.stringify({ error: error.message }));
        }
      });

      // Send initial file structure
      this.sendFileStructure(ws);
    });
  }

  async handleWebSocketMessage(message) {
    const { type, payload } = message;

    switch (type) {
      case 'LIST_FILES':
        return await this.listFiles(payload.path);
      case 'ORGANIZE_PROJECT':
        return await this.organizeByProject(payload.files);
      case 'MOVE_FILE':
        return await this.moveFile(payload.source, payload.destination, true); // auto-accept
      case 'CREATE_FOLDER':
        return await this.createFolder(payload.path, true); // auto-accept
      case 'GET_PROJECT_STRUCTURE':
        return this.getProjectStructure(payload.path);
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  }

  setupTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_files',
          description: 'List files and directories with intelligent categorization',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Directory path to list',
              },
              includeHidden: {
                type: 'boolean',
                description: 'Include hidden files and directories',
                default: false,
              },
              filterType: {
                type: 'string',
                enum: ['all', 'code', 'docs', 'images', 'data'],
                description: 'Filter files by type',
                default: 'all',
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'organize_by_project',
          description: 'Intelligently organize files by detected project structure',
          inputSchema: {
            type: 'object',
            properties: {
              files: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    path: { type: 'string' },
                    type: { type: 'string' },
                    size: { type: 'number' },
                  },
                },
                description: 'Array of file information objects',
              },
            },
            required: ['files'],
          },
        },
        {
          name: 'organize_by_type',
          description: 'Organize files by type (code, docs, images, etc.)',
          inputSchema: {
            type: 'object',
            properties: {
              files: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    path: { type: 'string' },
                    type: { type: 'string' },
                  },
                },
              },
            },
            required: ['files'],
          },
        },
        {
          name: 'move_file',
          description: 'Move file or directory to new location with auto-accept',
          inputSchema: {
            type: 'object',
            properties: {
              source: {
                type: 'string',
                description: 'Source file or directory path',
              },
              destination: {
                type: 'string',
                description: 'Destination path',
              },
              autoAccept: {
                type: 'boolean',
                description: 'Auto-accept the move operation',
                default: true,
              },
            },
            required: ['source', 'destination'],
          },
        },
        {
          name: 'create_folder',
          description: 'Create new folder with optional auto-accept',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Path for new folder',
              },
              autoAccept: {
                type: 'boolean',
                description: 'Auto-accept the creation',
                default: true,
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'detect_project_type',
          description: 'Detect project type based on files and structure',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Project directory path',
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'get_file_insights',
          description: 'Get intelligent insights about file organization and structure',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Directory to analyze',
              },
            },
            required: ['path'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_files':
            return { content: [{ type: 'text', text: JSON.stringify(await this.listFiles(args.path, args.includeHidden, args.filterType), null, 2) }] };
          
          case 'organize_by_project':
            return { content: [{ type: 'text', text: JSON.stringify(await this.organizeByProject(args.files), null, 2) }] };
          
          case 'organize_by_type':
            return { content: [{ type: 'text', text: JSON.stringify(await this.organizeByType(args.files), null, 2) }] };
          
          case 'move_file':
            return { content: [{ type: 'text', text: JSON.stringify(await this.moveFile(args.source, args.destination, args.autoAccept), null, 2) }] };
          
          case 'create_folder':
            return { content: [{ type: 'text', text: JSON.stringify(await this.createFolder(args.path, args.autoAccept), null, 2) }] };
          
          case 'detect_project_type':
            return { content: [{ type: 'text', text: JSON.stringify(await this.detectProjectType(args.path), null, 2) }] };
          
          case 'get_file_insights':
            return { content: [{ type: 'text', text: JSON.stringify(await this.getFileInsights(args.path), null, 2) }] };
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
      }
    });
  }

  async listFiles(dirPath, includeHidden = false, filterType = 'all') {
    try {
      const fullPath = path.resolve(dirPath);
      const items = await fs.readdir(fullPath, { withFileTypes: true });
      
      const files = [];
      
      for (const item of items) {
        if (!includeHidden && item.name.startsWith('.')) continue;
        
        const itemPath = path.join(fullPath, item.name);
        const stats = await fs.stat(itemPath);
        
        const fileInfo = {
          name: item.name,
          path: itemPath,
          type: item.isDirectory() ? 'directory' : this.getFileType(item.name),
          size: stats.size,
          modified: stats.mtime,
          isDirectory: item.isDirectory(),
          extension: path.extname(item.name),
          mimeType: mime.lookup(item.name) || 'unknown',
        };

        // Apply filter
        if (this.matchesFilter(fileInfo, filterType)) {
          files.push(fileInfo);
        }
      }

      return {
        path: fullPath,
        files: files.sort((a, b) => {
          // Directories first, then by name
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        }),
        totalFiles: files.filter(f => !f.isDirectory).length,
        totalDirectories: files.filter(f => f.isDirectory).length,
        insights: await this.generatePathInsights(fullPath, files),
      };
    } catch (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  async organizeByProject(files) {
    const projects = new Map();
    
    for (const file of files) {
      const projectInfo = await this.detectProjectFromFile(file.path);
      const projectKey = projectInfo.name || 'uncategorized';
      
      if (!projects.has(projectKey)) {
        projects.set(projectKey, {
          name: projectKey,
          type: projectInfo.type,
          rootPath: projectInfo.rootPath,
          files: [],
          structure: projectInfo.structure,
        });
      }
      
      projects.get(projectKey).files.push(file);
    }
    
    return {
      projects: Array.from(projects.values()),
      suggestions: await this.generateOrganizationSuggestions(projects),
    };
  }

  async organizeByType(files) {
    const typeCategories = {
      code: { extensions: ['.js', '.ts', '.py', '.java', '.cpp', '.c', '.html', '.css', '.scss'], files: [] },
      docs: { extensions: ['.md', '.txt', '.pdf', '.doc', '.docx'], files: [] },
      images: { extensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'], files: [] },
      data: { extensions: ['.json', '.xml', '.csv', '.yaml', '.yml'], files: [] },
      config: { extensions: ['.config', '.env', '.ini', '.toml'], files: [] },
      other: { extensions: [], files: [] },
    };

    for (const file of files) {
      const ext = path.extname(file.path).toLowerCase();
      let categorized = false;

      for (const [category, info] of Object.entries(typeCategories)) {
        if (info.extensions.includes(ext)) {
          info.files.push(file);
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        typeCategories.other.files.push(file);
      }
    }

    return typeCategories;
  }

  async moveFile(source, destination, autoAccept = true) {
    try {
      if (!autoAccept) {
        // In a real implementation, this would prompt the user
        console.log(`📋 Move operation pending approval: ${source} → ${destination}`);
        return { status: 'pending', source, destination };
      }

      // Ensure destination directory exists
      const destDir = path.dirname(destination);
      await fs.ensureDir(destDir);

      // Perform the move
      await fs.move(source, destination);

      // Log the operation
      const operation = {
        type: 'move',
        source,
        destination,
        timestamp: new Date(),
        autoAccepted: autoAccept,
      };
      
      this.fileOperationHistory.push(operation);
      
      console.log(`✅ File moved: ${source} → ${destination}`);
      
      // Broadcast to connected clients
      this.broadcastFileOperation(operation);

      return { 
        status: 'success', 
        operation,
        message: `Successfully moved ${path.basename(source)} to ${destination}`,
      };
    } catch (error) {
      console.error(`❌ Failed to move file: ${error.message}`);
      throw new Error(`Failed to move file: ${error.message}`);
    }
  }

  async createFolder(folderPath, autoAccept = true) {
    try {
      if (!autoAccept) {
        console.log(`📋 Folder creation pending approval: ${folderPath}`);
        return { status: 'pending', path: folderPath };
      }

      await fs.ensureDir(folderPath);

      const operation = {
        type: 'create_folder',
        path: folderPath,
        timestamp: new Date(),
        autoAccepted: autoAccept,
      };

      this.fileOperationHistory.push(operation);
      
      console.log(`✅ Folder created: ${folderPath}`);
      
      this.broadcastFileOperation(operation);

      return { 
        status: 'success', 
        operation,
        message: `Successfully created folder: ${path.basename(folderPath)}`,
      };
    } catch (error) {
      console.error(`❌ Failed to create folder: ${error.message}`);
      throw new Error(`Failed to create folder: ${error.message}`);
    }
  }

  async detectProjectType(projectPath) {
    try {
      const files = await fs.readdir(projectPath);
      const projectMarkers = {
        'package.json': 'Node.js/JavaScript',
        'requirements.txt': 'Python',
        'Cargo.toml': 'Rust',
        'pom.xml': 'Java (Maven)',
        'build.gradle': 'Java (Gradle)',
        'angular.json': 'Angular',
        'next.config.js': 'Next.js',
        'vue.config.js': 'Vue.js',
        'Dockerfile': 'Docker',
        'docker-compose.yml': 'Docker Compose',
      };

      const detectedTypes = [];
      const technologies = [];

      for (const file of files) {
        if (projectMarkers[file]) {
          detectedTypes.push(projectMarkers[file]);
          technologies.push(file);
        }
      }

      // Additional detection based on folder structure
      const hasSource = files.includes('src');
      const hasTests = files.some(f => f.includes('test') || f.includes('spec'));
      const hasDocs = files.includes('docs') || files.includes('documentation');

      return {
        path: projectPath,
        types: detectedTypes.length > 0 ? detectedTypes : ['Unknown'],
        technologies,
        structure: {
          hasSource,
          hasTests,
          hasDocs,
          folders: files.filter(async f => {
            const stat = await fs.stat(path.join(projectPath, f));
            return stat.isDirectory();
          }),
        },
        confidence: detectedTypes.length > 0 ? 0.9 : 0.3,
      };
    } catch (error) {
      throw new Error(`Failed to detect project type: ${error.message}`);
    }
  }

  async getFileInsights(dirPath) {
    try {
      const files = await this.listFiles(dirPath, false, 'all');
      const projects = await this.organizeByProject(files.files);
      const typeOrganization = await this.organizeByType(files.files);

      const insights = {
        overview: {
          totalFiles: files.totalFiles,
          totalDirectories: files.totalDirectories,
          projectsDetected: projects.projects.length,
        },
        projectBreakdown: projects.projects.map(p => ({
          name: p.name,
          type: p.type,
          fileCount: p.files.length,
        })),
        typeDistribution: Object.entries(typeOrganization).map(([type, info]) => ({
          type,
          count: info.files.length,
          percentage: ((info.files.length / files.totalFiles) * 100).toFixed(1),
        })),
        recommendations: [
          ...projects.suggestions,
          ...this.generateCleanupRecommendations(files.files),
        ],
        duplicateAnalysis: await this.findPotentialDuplicates(files.files),
      };

      return insights;
    } catch (error) {
      throw new Error(`Failed to generate insights: ${error.message}`);
    }
  }

  // Helper methods
  getFileType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const typeMap = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.py': 'python',
      '.html': 'html',
      '.css': 'css',
      '.json': 'json',
      '.md': 'markdown',
      '.txt': 'text',
      '.png': 'image',
      '.jpg': 'image',
      '.jpeg': 'image',
      '.gif': 'image',
      '.svg': 'image',
    };
    return typeMap[ext] || 'file';
  }

  matchesFilter(fileInfo, filterType) {
    if (filterType === 'all') return true;
    
    const filterMap = {
      code: ['javascript', 'typescript', 'python', 'html', 'css'],
      docs: ['markdown', 'text'],
      images: ['image'],
      data: ['json'],
    };

    return filterMap[filterType]?.includes(fileInfo.type) || false;
  }

  async generatePathInsights(dirPath, files) {
    const codeFiles = files.filter(f => ['javascript', 'typescript', 'python', 'html', 'css'].includes(f.type));
    const imageFiles = files.filter(f => f.type === 'image');
    const docFiles = files.filter(f => ['markdown', 'text'].includes(f.type));

    return {
      summary: `${files.length} items (${codeFiles.length} code, ${imageFiles.length} images, ${docFiles.length} docs)`,
      hasProject: files.some(f => ['package.json', 'requirements.txt', 'Cargo.toml'].includes(f.name)),
      needsOrganization: files.length > 20 && files.filter(f => !f.isDirectory).length > 15,
    };
  }

  async detectProjectFromFile(filePath) {
    const dir = path.dirname(filePath);
    let currentDir = dir;
    
    // Walk up the directory tree looking for project markers
    while (currentDir !== path.dirname(currentDir)) {
      try {
        const files = await fs.readdir(currentDir);
        const projectMarkers = ['package.json', 'requirements.txt', 'Cargo.toml', 'pom.xml'];
        
        for (const marker of projectMarkers) {
          if (files.includes(marker)) {
            return {
              name: path.basename(currentDir),
              type: await this.detectProjectType(currentDir),
              rootPath: currentDir,
              structure: await this.analyzeProjectStructure(currentDir),
            };
          }
        }
        
        currentDir = path.dirname(currentDir);
      } catch (error) {
        break;
      }
    }

    return {
      name: path.basename(dir),
      type: 'unknown',
      rootPath: dir,
      structure: {},
    };
  }

  async analyzeProjectStructure(projectPath) {
    try {
      const files = await fs.readdir(projectPath);
      return {
        hasSource: files.includes('src'),
        hasTests: files.some(f => f.includes('test')),
        hasDocs: files.includes('docs'),
        hasConfig: files.some(f => f.includes('config')),
      };
    } catch (error) {
      return {};
    }
  }

  async generateOrganizationSuggestions(projects) {
    const suggestions = [];
    
    projects.forEach((project, name) => {
      if (project.files.length > 50) {
        suggestions.push({
          type: 'organize',
          priority: 'high',
          message: `Project "${name}" has ${project.files.length} files and may benefit from better organization`,
          action: 'create_subfolders',
        });
      }
    });

    return suggestions;
  }

  generateCleanupRecommendations(files) {
    const recommendations = [];
    
    // Look for potential temporary files
    const tempFiles = files.filter(f => 
      f.name.includes('temp') || 
      f.name.includes('tmp') || 
      f.extension === '.log'
    );

    if (tempFiles.length > 0) {
      recommendations.push({
        type: 'cleanup',
        priority: 'medium',
        message: `Found ${tempFiles.length} potential temporary files that could be cleaned up`,
        files: tempFiles.map(f => f.name),
      });
    }

    return recommendations;
  }

  async findPotentialDuplicates(files) {
    const duplicates = [];
    const sizeGroups = new Map();

    // Group files by size (simple duplicate detection)
    files.forEach(file => {
      if (!file.isDirectory && file.size > 0) {
        if (!sizeGroups.has(file.size)) {
          sizeGroups.set(file.size, []);
        }
        sizeGroups.get(file.size).push(file);
      }
    });

    // Find groups with multiple files
    sizeGroups.forEach((fileGroup, size) => {
      if (fileGroup.length > 1) {
        duplicates.push({
          size,
          files: fileGroup.map(f => ({ name: f.name, path: f.path })),
          potentialSavings: size * (fileGroup.length - 1),
        });
      }
    });

    return duplicates;
  }

  setupFileWatching() {
    this.config.watchPaths.forEach(watchPath => {
      if (fs.existsSync(watchPath)) {
        const watcher = chokidar.watch(watchPath, {
          ignored: this.config.excludePatterns,
          persistent: true,
          ignoreInitial: true,
        });

        watcher
          .on('add', (filePath) => this.handleFileEvent('add', filePath))
          .on('change', (filePath) => this.handleFileEvent('change', filePath))
          .on('unlink', (filePath) => this.handleFileEvent('unlink', filePath))
          .on('addDir', (dirPath) => this.handleFileEvent('addDir', dirPath))
          .on('unlinkDir', (dirPath) => this.handleFileEvent('unlinkDir', dirPath));

        this.watchers.set(watchPath, watcher);
        console.log(`👁️  Watching: ${watchPath}`);
      }
    });
  }

  handleFileEvent(event, filePath) {
    const eventInfo = {
      event,
      path: filePath,
      timestamp: new Date(),
      relativePath: path.relative(process.cwd(), filePath),
    };

    console.log(`📁 File ${event}: ${eventInfo.relativePath}`);
    
    // Broadcast to connected clients
    this.broadcastFileEvent(eventInfo);

    // Auto-organize if enabled
    if (this.config.autoOrganize && (event === 'add' || event === 'addDir')) {
      this.autoHandleNewFile(filePath);
    }
  }

  async autoHandleNewFile(filePath) {
    try {
      const projectInfo = await this.detectProjectFromFile(filePath);
      
      if (projectInfo.type !== 'unknown') {
        console.log(`🤖 Auto-detected project: ${projectInfo.name} (${projectInfo.type})`);
        
        // Could trigger auto-organization here
        if (this.config.autoAccept) {
          // Example: move file to appropriate project subdirectory
          // await this.organizeFileIntoProject(filePath, projectInfo);
        }
      }
    } catch (error) {
      console.error(`Failed to auto-handle new file: ${error.message}`);
    }
  }

  async autoOrganizeProjects() {
    console.log('🤖 Running auto-organization...');
    
    for (const watchPath of this.config.watchPaths) {
      try {
        const files = await this.listFiles(watchPath);
        const projects = await this.organizeByProject(files.files);
        
        console.log(`📊 Found ${projects.projects.length} projects in ${watchPath}`);
        
        // Store project structures for later use
        projects.projects.forEach(project => {
          this.projectStructures.set(project.name, project);
        });
      } catch (error) {
        console.error(`Failed to auto-organize ${watchPath}: ${error.message}`);
      }
    }
  }

  broadcastFileEvent(eventInfo) {
    const message = JSON.stringify({
      type: 'FILE_EVENT',
      data: eventInfo,
    });

    this.wss.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message);
      }
    });
  }

  broadcastFileOperation(operation) {
    const message = JSON.stringify({
      type: 'FILE_OPERATION',
      data: operation,
    });

    this.wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  }

  async sendFileStructure(ws) {
    try {
      const structure = await this.getProjectStructure(this.config.watchPaths[0]);
      ws.send(JSON.stringify({
        type: 'INITIAL_STRUCTURE',
        data: structure,
      }));
    } catch (error) {
      console.error('Failed to send initial structure:', error.message);
    }
  }

  async getProjectStructure(basePath) {
    try {
      const files = await this.listFiles(basePath);
      const projects = await this.organizeByProject(files.files);
      
      return {
        basePath,
        projects: projects.projects,
        insights: await this.getFileInsights(basePath),
        operationHistory: this.fileOperationHistory.slice(-10), // Last 10 operations
      };
    } catch (error) {
      throw new Error(`Failed to get project structure: ${error.message}`);
    }
  }

  async shutdown() {
    console.log('🔌 Shutting down Filesystem MCP...');
    
    // Close file watchers
    this.watchers.forEach(watcher => watcher.close());
    
    // Close WebSocket server
    this.wss.close();
    
    console.log('✅ Filesystem MCP shutdown complete');
  }
}

// Initialize and start the server
const filesystemMCP = new FilesystemMCP();

const transport = new StdioServerTransport();
await filesystemMCP.server.connect(transport);

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await filesystemMCP.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await filesystemMCP.shutdown();
  process.exit(0);
});