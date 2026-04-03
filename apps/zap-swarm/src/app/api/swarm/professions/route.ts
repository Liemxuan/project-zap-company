import { NextResponse } from "next/server";

const PERMITTED_PROFESSIONS = {
  STRUCTURAL_BUILDER: {
    label: "Structural Builder",
    description: "Core coding, UI/UX implementation, Next.js rendering. High blast radius.",
    primaryModel: "gemini-3.1-pro-preview",
    secondaryModel: "gemini-3-pro-image-preview",
    tags: ["coding", "architecture", "ui-mockups"],
  },
  CHIEF_OF_STAFF: {
    label: "Chief of Staff",
    description: "DevOps, Telemetry, System Monitoring, Watchdog.",
    primaryModel: "gemini-3-flash-preview",
    secondaryModel: "gemini-3.1-pro-preview",
    tags: ["telemetry", "log-parsing", "complex-logic"],
  },
  SYSTEM_ARCHITECT: {
    label: "System Architect",
    description: "Backend architecture, database modeling, schema design.",
    primaryModel: "gemini-3.1-pro-preview",
    secondaryModel: "gemini-2.5-pro",
    tags: ["coding", "core-reasoning", "long-context"],
  },
  DATA_ANALYST: {
    label: "Data Analyst",
    description: "Python execution, SQL plotting, CSV crunching, stats.",
    primaryModel: "gemini-2.5-pro",
    secondaryModel: "gemini-3-flash-preview",
    tags: ["long-context", "fast"],
  },
  CREATIVE_DIRECTOR: {
    label: "Creative Director",
    description: "Asset generation, cinematic b-roll, high-fidelity UI art.",
    primaryModel: "gemini-3-pro-image-preview",
    secondaryModel: "veo-3.1-generate-preview",
    tags: ["4k-visuals", "cinematic", "image-generation"],
  },
  SECURITY_OFFICER: {
    label: "Security Officer",
    description: "SOP enforcement, static code analysis, vulnerability checking.",
    primaryModel: "gemini-3.1-pro-preview",
    secondaryModel: "gemini-3-flash-preview",
    tags: ["core-reasoning", "complex-logic", "fast"],
  },
  E2E_QA_TESTER: {
    label: "E2E QA Tester",
    description: "Playwright automation, dev-browser driving, DOM validation.",
    primaryModel: "gemini-2.5-computer-use-preview-10-2025",
    secondaryModel: "gemini-3.1-pro-preview",
    tags: ["computer-use", "browser-automation"],
  },
  DEEP_RESEARCHER: {
    label: "Deep Researcher",
    description: "Deep RAG gathering, Google Search crawling, citing sources.",
    primaryModel: "deep-research-pro-preview-12-2025",
    secondaryModel: "gemini-2.5-pro",
    tags: ["deep-research", "autonomous", "long-context"],
  },
  MEMORY_ARCHIVIST: {
    label: "Memory Archivist",
    description: "Vector database indexing, history summarization.",
    primaryModel: "gemini-embedding-2-preview",
    secondaryModel: "gemini-3-flash-preview",
    tags: ["embeddings", "rag", "fast"],
  },
  BRAND_MARKETER: {
    label: "Brand Marketer",
    description: "Social media copy, Podcast scripting, PPT generation.",
    primaryModel: "gemini-3.1-flash-live-preview",
    secondaryModel: "gemini-3-pro-image-preview",
    tags: ["voice", "live-api", "image-generation"],
  }
};

export async function GET() {
  return NextResponse.json({ success: true, professions: PERMITTED_PROFESSIONS }, { status: 200 });
}
