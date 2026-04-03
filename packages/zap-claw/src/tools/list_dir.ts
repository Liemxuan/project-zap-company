import fs from "fs";
import path from "path";

export const definition = {
    type: "function" as const,
    function: {
        name: "list_dir",
        description: "List the contents of a directory.",
        parameters: {
            type: "object",
            properties: {
                DirectoryPath: { type: "string" }
            },
            required: ["DirectoryPath"]
        }
    }
};

export async function handler(input: any) {
    try {
        const files = fs.readdirSync(input.DirectoryPath);
        return { output: JSON.stringify(files, null, 2), isError: false };
    } catch (e: any) {
        return { output: e.message, isError: true };
    }
}
