import { NextResponse } from "next/server";
import http from "http";
import { logger } from "@/lib/logger";

const fetchDockerAPI = (path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const req = http.request({
            socketPath: '/var/run/docker.sock',
            path: path,
            method: 'GET'
        }, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => resolve(data));
        });
        req.on("error", reject);
        req.end();
    });
};

export async function GET() {
    try {
        const stdoutObj = await fetchDockerAPI('/containers/json?all=true');
        
        if (!stdoutObj) {
            return NextResponse.json({ error: "Docker daemon unreachable or path resolution failed." }, { status: 503 });
        }

        const rawContainers = JSON.parse(stdoutObj);
        
        // Enhance with structured mapping for known Swarm Agents
        const swarmContainers = rawContainers.map((container: any) => ({
            id: container.Id.substring(0, 12),
            names: container.Names.map((n: string) => n.replace(/^\//, '')).join(', '),
            image: container.Image,
            state: container.State, // "running", "exited", etc.
            status: container.Status,
            created: new Date(container.Created * 1000).toISOString(),
        }));

        return NextResponse.json({ containers: swarmContainers });
    } catch (error: any) {
        logger.error("Docker telemetry failed", { error: error.message });
        return NextResponse.json({ error: `Docker unix socket telemetry failed: ${error.message}` }, { status: 500 });
    }
}
