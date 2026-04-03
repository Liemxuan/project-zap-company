import { exec } from "child_process";
import util from "util";
const execAsync = util.promisify(exec);

export const definition = {
    type: "function" as const,
    function: {
        name: "grep_search",
        description: "Search file contents and directory.",
        parameters: {
            type: "object",
            properties: {
                Query: { type: "string" },
                SearchPath: { type: "string" },
                MatchPerLine: { type: "boolean" }
            },
            required: ["Query", "SearchPath"]
        }
    }
};

export async function handler(input: any) {
    try {
        const flag = input.MatchPerLine ? "-n" : "-l";
        const { stdout } = await execAsync(`grep -r ${flag} "${input.Query}" "${input.SearchPath}"`);
        return { output: stdout, isError: false };
    } catch (e: any) {
        return { output: e.stdout || e.message, isError: true };
    }
}
