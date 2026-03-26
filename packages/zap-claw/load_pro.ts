import fs from "fs";

const envPath = "/Users/zap/Workspace/zap-core/.env";
let envParams = fs.readFileSync(envPath, "utf8");

const proPool = `\nGOOGLE_PRO_POOL='[{"id":"gen-lang-client-0480917183","keys":["AIzaSyDLciyoM1l0y1Fq_v4vl0l067sW7jfjDi4","AIzaSyClDBInb8gHLSMSqKxcnZtmgWtxMdgvReM","AIzaSyBfvCAN0md8U25-5BSIWlKYHAGbV1xGCcQ","AIzaSyC6O3Y09-wqKVTCKTTD05PYgWnLFYI9T_Q","AIzaSyC84Gd96yp5drkS3fq5OXdBFLr6LeuNzIo","AIzaSyAUwtPueUWsWdE4ZCrkWm8R4vp2dChSSDo","AIzaSyD4yi0Kt4PWk_62UHlmMn7C-TS-G3oPghs","AIzaSyB5hfUvqFZIEXn3ojyEyTZWL1kYQ5Mj548","AIzaSyB6SvmX4V8iHoELBdJ3sbG0FRUGDBa-17Y","AIzaSyDJabqHMTKFJv21gzgz3PM0ah7kVjq3gNY","AIzaSyA9oArJ1Jl7PIfsr1zijM-gr4J0tj_zxJ4","AIzaSyCNRNA7PsM-DnYlRivP9v_n4mAsBAXvq4o","AIzaSyD2Pck2LXSq6MMLtrwxjoPfur5HX4m4mvU","AIzaSyC1CUXmcrOy8DaUXarZnPDtXKUR3eNL69A"]}]'\n`;

if (!envParams.includes("GOOGLE_PRO_POOL")) {
    fs.appendFileSync(envPath, proPool);
    console.log("✅ Appended GOOGLE_PRO_POOL successfully.");
} else {
    console.log("⚠️ GOOGLE_PRO_POOL already exists! Skipping injection.");
}

// Generate a Pro tier version of the matrix test
const testScriptPath = "/Users/zap/Workspace/olympus/packages/zap-claw/test_matrix.ts";
if (fs.existsSync(testScriptPath)) {
    const testScript = fs.readFileSync(testScriptPath, "utf8");
    const newTestScript = testScript.replace(/resolveBalancedKey\("ULTRA"\)/g, 'resolveBalancedKey("PRO")')
                                   .replace(/Tier ULTRA/g, 'Tier PRO')
                                   .replace(/MATRIX \(ULTRA\)/g, 'MATRIX (PRO)');
    fs.writeFileSync("/Users/zap/Workspace/olympus/packages/zap-claw/test_pro_matrix.ts", newTestScript);
    console.log("✅ Spawned test_pro_matrix.ts");
}
