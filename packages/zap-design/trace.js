/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');

const html = fs.readFileSync('dom.html', 'utf8');
const stack = [];
const regex = /<\/?([a-zA-Z0-9]+)([^>]*)>/g;
let match;
let found = false;

while ((match = regex.exec(html)) !== null) {
    const isClosing = match[0].startsWith('</');
    const tagName = match[1];
    const attrs = match[2];
    
    if (isClosing) {
        stack.pop();
    } else {
        let className = '';
        const classMatch = attrs.match(/class="([^"]+)"/);
        if (classMatch) className = classMatch[1];
        
        stack.push({ tag: tagName, cls: className });
        
        if (className.includes('bg-green-500')) {
            found = true;
            break;
        }
    }
}

if (found) {
    stack.forEach((el, i) => {
        const indent = '  '.repeat(i);
        console.log(`${indent}<${el.tag} class="${el.cls}">`);
    });
} else {
    console.log('Not found');
}
