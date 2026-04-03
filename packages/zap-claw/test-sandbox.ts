import { SafeExecutor } from './src/security/safe-executor';
const e = new SafeExecutor({ allowedCommands: ['echo'] });
e.execute('echo', ['Phase 2 works!']).then(console.log).catch(console.error);
