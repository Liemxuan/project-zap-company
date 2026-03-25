const { Project, SyntaxKind } = require("ts-morph");

const project = new Project({
  tsConfigFilePath: "./packages/zap-design/tsconfig.json",
});

const sourceFiles = project.getSourceFiles("packages/zap-design/src/app/design/zap/**/*.tsx");
let updatedCount = 0;

for (const sf of sourceFiles) {
  let needsSave = false;
  const filePath = sf.getFilePath().replace(process.cwd() + "/", "");
  if (!filePath.includes("page.tsx")) continue;

  // Find the inspectorFooter variable declaration
  const varDecls = sf.getDescendantsOfKind(SyntaxKind.VariableDeclaration);
  const footerDecl = varDecls.find((d: any) => d.getName() === "inspectorFooter");

  if (footerDecl) {
    const initializer = footerDecl.getInitializer();
    if (initializer && initializer.isKind(SyntaxKind.ParenthesizedExpression) || initializer?.isKind(SyntaxKind.JsxElement)) {
      
      // Determine if there are special props inside the button
      let extraPropsStr = "";
      const jsxElements = initializer.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
          .concat(initializer.getDescendantsOfKind(SyntaxKind.JsxElement) as any);
      
      const buttonEl = jsxElements.find(el => {
         const name = el.isKind(SyntaxKind.JsxSelfClosingElement) 
             ? el.getTagNameNode().getText() 
             : el.getOpeningElement().getTagNameNode().getText();
         return name === "Button";
      });

      if (buttonEl) {
          // Check for `size` prop via text parsing to avoid JsxAttribute typing issues
          const buttonText = buttonEl.getText();
          const sizeMatch = buttonText.match(/size=\{([^}]+)\}/);
          if (sizeMatch) {
              extraPropsStr += ` size={${sizeMatch[1]}}`;
          }
      }

      // We replace the initializer with the new ThemePublisher component
      const newInitializer = `(
        <ThemePublisher 
            theme={theme} 
            onPublish={handlePublish} 
            filePath="${filePath}"
            ${extraPropsStr ? `buttonProps={{${extraPropsStr.replace(" size=", "size:")}}}` : ""}
        />
    )`;
      
      initializer.replaceWithText(newInitializer);
      
      // Now inject the import
      const imports = sf.getImportDeclarations();
      const hasThemePublisher = imports.some(i => i.getModuleSpecifierValue() === "@/components/dev/ThemePublisher");
      
      if (!hasThemePublisher) {
          // find last import to insert after, or insert at top
          if (imports.length > 0) {
              const lastImport = imports[imports.length - 1];
              sf.insertImportDeclaration(lastImport.getChildIndex() + 1, {
                  namedImports: [{ name: "ThemePublisher" }],
                  moduleSpecifier: "@/components/dev/ThemePublisher"
              });
          } else {
              sf.addImportDeclaration({
                  namedImports: [{ name: "ThemePublisher" }],
                  moduleSpecifier: "@/components/dev/ThemePublisher"
              });
          }
      }
      
      needsSave = true;
      console.log(`Updated footer in ${filePath}`);
    }
  }

  if (needsSave) {
    sf.saveSync();
    updatedCount++;
  }
}

console.log(`\nCompleted. Updated ${updatedCount} files.`);
