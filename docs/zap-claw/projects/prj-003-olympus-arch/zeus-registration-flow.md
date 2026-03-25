# Zeus (Olympus Admin) Registration Flow

## Objective
To map out the step-by-step process of registering Zeus (the system administrator) and his first agent (sidekick) into the Olympus System. This process will serve as the template for onboarding Merchants and their employees.

## Initial Discovery Questionnaire

Please provide the answers to the following questions to build the initial configuration for Zeus and his sidekick:

### Part 1: Zeus (The God Mode User)
1. **Admin Credentials:** What is the primary email or identifier for Zeus's Olympus login? (e.g., `zeus@olympus.local`)
2. **Contact Info:** What is Zeus's personal Telegram ID or primary contact method for emergency system alerts?

### Part 2: The Sidekick (The First Agent)
3. **Agent Name:** What is the name of Zeus's sidekick?
4. **Agent Role/Function:** What is the primary role of this sidekick? (e.g., System Monitor, Billing Overseer, General Assistant)
5. **Agent Persona:** How should the sidekick behave? (e.g., Professional, sarcastic, concise, detailed)

### Part 3: Infrastructure & Keys
6. **LLM Provider:** Which LRM/LLM model are we using for this sidekick? (e.g., `openai:gpt-4o`, `anthropic:claude-3-5-sonnet`)
7. **Billing Model:** Are we using a system-provided key (Infrastructure Key from Olympus) or a Bring Your Own Key (BYOK) for this specific agent?
8. **Bot Token:** Do we already have the Telegram Bot Token for this sidekick, or do we need to generate a placeholder? (Format: `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`)

---
**Next Steps:** Once these questions are answered, we will generate the specific MongoDB documents (`SYS_OS_settings` and `SYS_OS_users`) and outline the exact API calls needed to register them via the Admin Titan Registry (`POST /api/admin/keys`).
