import fs from "fs";
import path from "path";

export const definition = {
    type: "function" as const,
    function: {
        name: "write_to_file",
        description: "Write code or content to a specific file.",
        parameters: {
            type: "object",
            properties: {
                TargetFile: { type: "string" },
                CodeContent: { type: "string" },
                Overwrite: { type: "boolean" }
            },
            required: ["TargetFile", "CodeContent"]
        }
    }
};

export async function handler(input: any) {
    const filePath = input.TargetFile;
    if (fs.existsSync(filePath) && !input.Overwrite) {
        return { output: "File already exists. Use Overwrite=true to overwrite.", isError: true };
    }
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, input.CodeContent);
    return { output: `File written successfully to ${filePath}`, isError: false };
}
