const { MongoClient } = require('mongodb');
async function run() {
  const c = new MongoClient('mongodb://localhost:27017');
  await c.connect();
  const db = c.db('olympus');
  await db.collection('ZVN_SYS_SKILLS').insertOne({
    name: 'deep-research',
    dirName: 'df-deep-research',
    desc: 'Deep Research Skill for mock test',
    group: 'DeerFlow',
    agent: 'ralph',
    tags: ['research'],
    path: '../../.agent/skills/df-deep-research'
  });
  console.log("Skill inserted");
  c.close();
}
run();
