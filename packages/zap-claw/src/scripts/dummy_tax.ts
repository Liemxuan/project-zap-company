import { fileURLToPath } from 'node:url';

export function calculateTax(amount: number) {
    return amount * 0.2;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    console.log("Tax for 100:", calculateTax(100));
}
