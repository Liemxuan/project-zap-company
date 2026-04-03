const fs = require('fs');
const path = require('path');

function replaceClassClient(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Step 1: Replace this.client.db(DB_NAME) with (await this.clientPromise).db(DB_NAME) FIRST
    content = content.replace(/this\.client\.db\(/g, '(await this.clientPromise).db(');

    // Step 2: Handle constructor
    content = content.replace(/this\.client = await (getGlobalMongoClient\([^)]*\));/g, 'this.clientPromise = $1;');
    
    // Step 3: Handle other strict this.client usages like this.client; (excluding this.clientPromise which we just made)
    content = content.replace(/this\.client([^\wP])/g, 'this.clientPromise$1');
    
    // Step 4: Handle declarations
    content = content.replace(/private client: MongoClient;/g, 'private clientPromise: Promise<MongoClient>;');

    fs.writeFileSync(filePath, content, 'utf8');
}

function processFiles() {
    replaceClassClient(path.join(__dirname, 'packages/zap-claw/src/runtime/engine/omni_queue.ts'));
    replaceClassClient(path.join(__dirname, 'packages/zap-claw/src/runtime/engine/vfs_backends/mongo_adapter.ts'));
}

processFiles();
