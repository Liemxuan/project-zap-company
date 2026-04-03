const { MongoClient } = require('mongodb');

async function run() {
  const c = new MongoClient('mongodb://localhost:27017');
  await c.connect();
  const db = c.db('olympus');
  const col = db.collection('ZVN_SYS_OS_job_queue');

  console.log('Inserting Job A (PENDING)');
  const A = await col.insertOne({ 
    agentSlug: 'scout', 
    task: 'research X', 
    tenantId: 'ZVN', 
    status: 'PENDING', 
    createdAt: new Date() 
  });
  
  console.log(`Job A inserted: ${A.insertedId.toString()}`);

  console.log('Inserting Job B (BLOCKED, depends on Job A)');
  const B = await col.insertOne({ 
    agentSlug: 'coder', 
    task: 'implement X', 
    dependsOn: [A.insertedId.toString()], 
    tenantId: 'ZVN', 
    status: 'BLOCKED', 
    createdAt: new Date() 
  });

  console.log(`Job B inserted: ${B.insertedId.toString()}`);

  console.log('Waiting 2s before completing Job A...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Completing Job A...');
  await col.updateOne({ _id: A.insertedId }, { $set: { status: 'COMPLETED' } });
  
  console.log('Waiting 6s for DAG executor to unblock Job B...');
  await new Promise(resolve => setTimeout(resolve, 6000));

  const bJob = await col.findOne({ _id: B.insertedId });
  console.log('Final Status of Job B (Expected: PENDING):', bJob.status);
  
  await c.close();
}

run().catch(console.error);
