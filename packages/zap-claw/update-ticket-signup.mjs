import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.extractionTicket.update({
        where: { urlPath: '/signup' },
        data: {
            zapLevel: 'L7',
            l6Layout: 'BrandedLayout (2-col grid: form card + hero image panel)',
            l5Organisms: JSON.stringify(['BrandedLayout', 'AuthFormCard']),
            l4Molecules: JSON.stringify([
                'FormFieldGroup (Name, Email, Password, Confirm Password)',
                'PasswordInputGroup x2 (show/hide toggle)',
                'OAuthButtonGroup (Google SSO)',
                'OrDivider',
                'PrivacyPolicyCheckGroup (Checkbox + Link)',
                'RecaptchaPopover',
            ]),
            l3Atoms: JSON.stringify([
                'Button (solid)', 'Button (outline)', 'Button (ghost/icon)',
                'Input (text)', 'Input (password)',
                'Checkbox',
                'Alert (success)', 'Alert (destructive)',
                'FormLabel', 'FormMessage', 'Link',
            ]),
            l2Primitives: JSON.stringify(['Card', 'CardContent', 'Form', 'Grid']),
            l1Tokens: JSON.stringify([
                '--color-primary', '--color-muted-foreground',
                '--color-background', '--color-foreground',
                '--color-accent-foreground', '--color-destructive',
            ]),
            assignedWorker: 'ZAP (G-102 Manual Audit)',
            status: 'DOM_RIPPED',
        }
    });
    console.log('[G-102] /signup ticket updated: DOM_RIPPED');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
