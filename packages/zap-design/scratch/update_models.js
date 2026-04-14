const fs = require('fs');
const path = require('path');

const directory = 'g:\\zap-builder-v4\\packages\\zap-design\\src\\services';
const models = [
    'brand/brand.model.ts',
    'category/category.model.ts',
    'collection/collection.model.ts',
    'country/country.model.ts',
    'customer/customer.model.ts',
    'dining-option/dining-option.model.ts',
    'group-product/group-product.model.ts',
    'location/location.model.ts',
    'membership/membership.model.ts',
    'menu/menu.model.ts',
    'modifier-group/modifier-group.model.ts',
    'modifier-item/modifier-item.model.ts',
    'policy/policy.model.ts',
    'product/product.model.ts',
    'promotion/promotion.model.ts',
    'unit/unit.model.ts'
];

models.forEach(modelPath => {
    const fullPath = path.join(directory, modelPath);
    if (!fs.existsSync(fullPath)) {
        console.log(`File not found: ${fullPath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    const basename = path.basename(modelPath).replace('.model.ts', '');
    const interfaceName = basename.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

    if (content.includes('acronymn?:')) {
        console.log(`Field already exists in ${modelPath}`);
        return;
    }

    const regex = new RegExp(`export interface ${interfaceName} \\{`);
    const match = content.match(regex);

    if (match) {
        const startIdx = match.index + match[0].length;
        let braceCount = 1;
        let endIdx = -1;

        for (let i = startIdx; i < content.length; i++) {
            if (content[i] === '{') braceCount++;
            else if (content[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    endIdx = i;
                    break;
                }
            }
        }

        if (endIdx !== -1) {
            content = content.slice(0, endIdx) + '  acronymn?: string;\n' + content.slice(endIdx);
            fs.writeFileSync(fullPath, content);
            console.log(`Updated ${modelPath}`);
        } else {
            console.log(`Could not find closing brace for ${interfaceName} in ${modelPath}`);
        }
    } else {
        console.log(`Could not find interface ${interfaceName} in ${modelPath}`);
    }
});
