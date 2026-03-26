import { Project, SyntaxKind } from 'ts-morph';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

function main() {
    const args = process.argv.slice(2);
    const fileArg = args.find(a => a.startsWith('--file='));
    const exportArg = args.find(a => a.startsWith('--export='));
    
    if (!fileArg || !exportArg) {
        console.error("Usage: tsx extract_ast.ts --file=<path> --export=<ExportName>");
        process.exit(1);
    }
    
    const filePath = fileArg.split('=')[1] as string;
    const targetExport = exportArg.split('=')[1] as string;
    const absolutePath = path.resolve(process.cwd(), filePath);
    
    if (!existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        process.exit(1);
    }
    
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(absolutePath);
    
    let extractedCode = '';
    
    // Find target declaration
    const func = sourceFile.getFunction(targetExport);
    const varDec = sourceFile.getVariableDeclaration(targetExport);
    const classDec = sourceFile.getClass(targetExport);
    const typeDec = sourceFile.getTypeAlias(targetExport);
    const interfaceDec = sourceFile.getInterface(targetExport);
    
    const targetNode = func || varDec || classDec || typeDec || interfaceDec;
    
    if (targetNode) {
        let nodeToPrint: any = targetNode;
        if (varDec) {
            nodeToPrint = varDec.getVariableStatement() || varDec;
        }
        extractedCode += `// Extracted: ${targetExport}\n`;
        extractedCode += nodeToPrint.getText() + '\n\n';
    } else {
        console.error(`Export '${targetExport}' not found in ${absolutePath}`);
        process.exit(1);
    }
    
    // Associated Interfaces/Types
    const propsInterface = sourceFile.getInterface(`${targetExport}Props`);
    if (propsInterface) {
        extractedCode += `// Extracted Interface: ${targetExport}Props\n`;
        extractedCode += propsInterface.getText() + '\n\n';
    }
    
    const propsType = sourceFile.getTypeAlias(`${targetExport}Props`);
    if (propsType) {
        extractedCode += `// Extracted Type: ${targetExport}Props\n`;
        extractedCode += propsType.getText() + '\n\n';
    }
    
    const stateInterface = sourceFile.getInterface(`${targetExport}State`);
    if (stateInterface) {
        extractedCode += `// Extracted Interface: ${targetExport}State\n`;
        extractedCode += stateInterface.getText() + '\n\n';
    }
    
    // If it's a giant file, we only output these pieces.
    console.log(extractedCode.trim());
}

try {
    main();
} catch (error) {
    console.error("AST Extraction Failed:", error);
    process.exit(1);
}
