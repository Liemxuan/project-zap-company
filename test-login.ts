
import { loginAction } from './packages/zap-auth/src/actions';

async function test() {
    process.env.NEXT_PUBLIC_IS_MOCK = 'true';
    process.env.NODE_ENV = 'development';
    const result = await loginAction('name.zap', '1234');
    console.log('Result:', result);
}

test();
