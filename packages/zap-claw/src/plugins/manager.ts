import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ToolDefinition } from '../runtime/conversation/types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  tools: ToolDefinition[];
}

export interface PluginTools {
  definitions: ToolDefinition[];
  handlers: Record<string, any>;
}

export class PluginManager {
  private pluginsDir: string;

  constructor(pluginsDir = path.join(__dirname, '../../src/plugins')) {
    this.pluginsDir = pluginsDir;
  }

  async loadPlugins(): Promise<PluginTools> {
    const definitions: ToolDefinition[] = [];
    const handlers: Record<string, any> = {};
    
    try {
      // Ensure directory exists
      await fs.mkdir(this.pluginsDir, { recursive: true });
      
      const entries = await fs.readdir(this.pluginsDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const manifestPath = path.join(this.pluginsDir, entry.name, 'manifest.json');
          const entryPointPath = path.join(this.pluginsDir, entry.name, 'index.js');
          
          try {
            const manifestContent = await fs.readFile(manifestPath, 'utf-8');
            const manifest: PluginManifest = JSON.parse(manifestContent);
            
            console.log(`[PluginManager] Loaded plugin: ${manifest.name} v${manifest.version}`);
            definitions.push(...manifest.tools);

            // Attempt to load handler if it exists
            try {
              const handlerModule = await import(entryPointPath);
              for (const tool of manifest.tools) {
                if (handlerModule[tool.name]) {
                  handlers[tool.name] = handlerModule[tool.name];
                }
              }
            } catch (e: any) {
              // Not every plugin needs a local handler if it maps to existing registry
              console.log(`[PluginManager] No local JS handler found for ${entry.name}, skipping execution binding.`);
            }
          } catch (e: any) {
            console.warn(`[PluginManager] Failed to load manifest in ${entry.name}:`, e.message);
          }
        }
      }
    } catch (e: any) {
      console.error('[PluginManager] Search failed:', e.message);
    }
    
    return { definitions, handlers };
  }
}
