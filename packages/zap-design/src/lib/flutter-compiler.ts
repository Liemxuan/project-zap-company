import fs from 'fs';
import path from 'path';

export async function compileFlutterColors(theme: string, colors: Record<string, string>) {
    const dirPath = path.join('/Users/zap/Workspace/references/themes', theme.toLowerCase());
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, 'app_colors.dart');
    
    let content = `import 'package:flutter/material.dart';\n\nclass AppColors {\n`;
    if (colors) {
        for (const [key, val] of Object.entries(colors)) {
            // basic safety check
            if (typeof val === 'string' && val.startsWith('#')) {
                let hex = val.replace('#', '');
                if (hex.length === 6) hex = 'FF' + hex;
                // cleanup key if necessary, convert kebab case to camel case
                const safeKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
                content += `  static const Color ${safeKey} = Color(0x${hex.toUpperCase()});\n`;
            }
        }
    }
    content += `}\n`;
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`[FLUTTER SYNC] Synced ${theme} colors to ${filePath}`);
}

export async function compileFlutterTypography(theme: string, typographyState: { primaryFont?: string }) {
    const dirPath = path.join('/Users/zap/Workspace/references/themes', theme.toLowerCase());
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, 'app_typography.dart');
    
    let content = `import 'package:flutter/material.dart';\n\nclass AppTypography {\n`;
    content += `  static const String primaryFont = '${typographyState.primaryFont || 'BeVietnamPro'}';\n`;
    content += `}\n`;
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`[FLUTTER SYNC] Synced ${theme} typography to ${filePath}`);
}

export async function compileFlutterRadius(theme: string, _radiusState: Record<string, unknown>) {
    const dirPath = path.join('/Users/zap/Workspace/references/themes', theme.toLowerCase());
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, 'app_radius.dart');
    
    let content = `import 'package:flutter/material.dart';\n\nclass AppRadius {\n`;
    // We would parse the radius state logically here. Keeping it hollow for the mapping.
    content += `}\n`;
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`[FLUTTER SYNC] Synced ${theme} border radius to ${filePath}`);
}
