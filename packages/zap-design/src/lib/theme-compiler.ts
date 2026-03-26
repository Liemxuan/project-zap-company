import fs from 'fs';
import path from 'path';

export async function compileThemeCSS(theme: string, variables: Record<string, string>) {
    const themePath = path.join(process.cwd(), `src/themes/${theme.toUpperCase()}/theme-${theme.toLowerCase()}.css`);

    let css = '';
    if (!fs.existsSync(themePath)) {
        console.log(`[ZAP PUBLISH] Theme file not found: ${themePath}. Creating a new one...`);
        fs.mkdirSync(path.dirname(themePath), { recursive: true });
        css = `/* Auto-generated ${theme} Theme */\n.theme-${theme.toLowerCase()} {\n}\n`;
    } else {
        css = fs.readFileSync(themePath, 'utf-8');
    }

    console.log(`[ZAP PUBLISH] Persisting ${theme} theme changes to ${themePath}...`);

    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`(${key}:\\s*)[^;!]+(?:\\s*!important)?;`, 'i');
        if (regex.test(css)) {
            css = css.replace(regex, `$1${value};`);
        } else {
            // insert before the closing brace of :root or .theme-*
            const insertRegex = /((?::root|\.theme-[a-zA-Z0-9_-]+)\s*\{[^}]*)(\})/;
            if (insertRegex.test(css)) {
                css = css.replace(insertRegex, `$1    ${key}: ${value};\n$2`);
            } else {
                css += `\n.theme-${theme.toLowerCase()} {\n    ${key}: ${value};\n}\n`;
            }
        }
    }

    fs.writeFileSync(themePath, css, 'utf-8');
}
