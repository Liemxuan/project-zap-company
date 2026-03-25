# OpenWhispr Feature Analysis for ZAP-Claw

OpenWhispr serves as an excellent reference implementation for frictionless, voice-first desktop interactions. By analyzing its architecture (specifically the local `whisper.cpp` server and its Electron-based system integrations), we can extract the highest-yield features to integrate directly into ZAP-Claw and the upcoming OpenClaw native app.

## Core Features of OpenWhispr

1. **Global Push-to-Talk Hotkey** (`dbus-next` / GNOME / `CGEvent` on Mac)
2. **Local Transcription Engine** (`whisper.cpp` running as a bundled background server)
3. **Automatic Language Detection** (`--language auto` parsed by `whisper.cpp`)
4. **Clipboard Hijacking / Injection** (Simulating `Cmd+V` or `Ctrl+V` to paste text anywhere)
5. **Streaming vs Batch Processing** (Supporting APIs like Deepgram/AssemblyAI or local chunking)

---

## What We Should Focus On for ZAP-Claw

### 1. Automatic Language Detection (High Priority)

As you noted, the ability to switch speaking languages effortlessly is critical for a global Swarm commander.

**How OpenWhispr does it:**
When compiling the request to its local `whisper-server`, if the user hasn't explicitly locked a language, it passes the `--language auto` flag. The internal `ggml` model analyzes the first few audio tokens to determine the spoken language before transcribing.
*Reference: `/src/helpers/whisperServer.js:*`args.push("--language", options.language || "auto");``*

**How ZAP-Claw will use it:**
When a voice command hits the OmniRouter, the payload will include the detected language. This means you could speak to Jerry in English (*"Jerry, check the console for errors"*) and to another agent or UI module in Vietnamese, and ZAP-Claw will automatically append the correct localization context to the prompt before hitting Claude.

### 2. The Local Whisper Server (Medium Priority)

OpenWhispr pre-bundles `whisper.cpp` binaries (`OpenWhispr.app/Contents/Resources/app.asar.unpacked/resources/bin/whisper-server-mac-arm64`) and executes them on app startup.

**How ZAP-Claw will use it:**
Instead of sending your voice recordings to the cloud (which adds latency and privacy concerns for ZAP's proprietary code), OpenClaw can bundle a lightweight `ggml-base.bin` model. The transcription happens locally in milliseconds, and only the *text prompt* is sent to the Anthropic LLM.

### 3. Context-Aware Clipboard Injection (High Priority)

OpenWhispr's "magic" is that it pastes text into whatever window is currently active.

**How ZAP-Claw will use it:**
We use this for **output**, not just input.

1. You highlight a messy React component in VS Code.
2. You hold the hotkey and say: *"Spike, refactor this to use our new M3 tokens."*
3. The OpenClaw app grabs the highlighted text (via `Cmd+C`), sends your voice query + the copied code to Spike.
4. Spike streams the refactored code back.
5. OpenClaw simulates `Cmd+V` (using the Accessibility permissions we debugged earlier) to instantly replace your highlighted code with Spike's result.

### Implementation Strategy

Our immediate focus should be replicating the **HotKey -> Local Whisper (Auto-Language) -> OmniRouter** pipeline inside OpenClaw. The `macos-fast-paste` mechanism we discovered earlier will be our exact blueprint for returning agent results back into the IDE.
