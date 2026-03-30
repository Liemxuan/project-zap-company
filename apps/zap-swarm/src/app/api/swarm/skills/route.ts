import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";
const SKILLS_DIR = path.resolve(process.cwd(), "../../.agent/skills");

export async function GET() {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection("ZVN_SYS_SKILLS");

    let skills = await col.find({}).toArray();

    // Auto-seed/Sync from File System
    if (fs.existsSync(SKILLS_DIR)) {
      const dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
      const fsSkills = dirs.map(dir => {
        const skillPathMd = path.join(SKILLS_DIR, dir.name, "SKILL.md");
        const skillPathLower = path.join(SKILLS_DIR, dir.name, "skill.md");
        let content = "";
        
        if (fs.existsSync(skillPathMd)) {
          content = fs.readFileSync(skillPathMd, "utf-8");
        } else if (fs.existsSync(skillPathLower)) {
          content = fs.readFileSync(skillPathLower, "utf-8");
        } else {
          return null;
        }

        // Extremely native frontmatter extraction without extra dependencies
        const nameMatch = content.match(/name:\s*(.+)/);
        const descMatch = content.match(/description:\s*(.+)/);
        
        return {
          name: nameMatch ? nameMatch[1].trim() : dir.name,
          desc: descMatch ? descMatch[1].trim() : "No description provided.",
          cat: dir.name.includes('zap') ? 'ZAP Native' : dir.name.includes('df-') ? 'Analysis' : 'Workflow',
          path: `../../.agent/skills/${dir.name}`
        };
      }).filter(Boolean);

      // Upsert matching FS skills into MongoDB so we don't duplicate
      if (fsSkills.length > 0) {
        const bulkOps = fsSkills.map((s: any) => ({
          updateOne: {
            filter: { name: s.name },
            update: { $set: { ...s, updatedAt: new Date() } },
            upsert: true
          }
        }));
        await col.bulkWrite(bulkOps);
      }
    }

    skills = await col.find({}).toArray();
    return NextResponse.json({ success: true, skills: skills.map(s => ({ ...s, _id: s._id.toString() })) });
  } catch (error: any) {
    console.error(`[api/swarm/skills GET] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
