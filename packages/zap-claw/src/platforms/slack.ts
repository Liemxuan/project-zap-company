// packages/zap-claw/src/platforms/slack.ts

export interface SlackContext {
  userId: string;
  channelId: string;
  threadTs: string | undefined;
  text: string;
}

export function extractSlackContext(event: any): SlackContext {
  return {
    userId: event.user,
    channelId: event.channel,
    threadTs: event.thread_ts || event.ts,
    text: event.text || '',
  };
}

export function buildSlackReply(channel: string, threadTs: string, text: string) {
  return { channel, thread_ts: threadTs, text };
}

/**
 * Start the Slack Socket Mode listener.
 * Requires SLACK_BOT_TOKEN and SLACK_APP_TOKEN env vars.
 * Import @slack/bolt at runtime to keep it optional.
 */
export async function startSlackAdapter(botName: string = 'Spike') {
  const { App } = await import('@slack/bolt');

  const app = new App({
    token: process.env.SLACK_BOT_TOKEN || '',
    appToken: process.env.SLACK_APP_TOKEN || '',
    socketMode: true,
  });

  app.message(async ({ message, say }) => {
    if ((message as any).subtype) return;
    const ctx = extractSlackContext(message);

    const { AgentLoop } = await import('../agent.js');
    const agent = new AgentLoop('tier_p3_heavy', botName);
    const sessionId = `SLACK:${ctx.channelId}:${ctx.threadTs}`;

    try {
      const response = await agent.run(
        parseInt(ctx.userId.replace(/\D/g, ''), 10) || 0,
        ctx.text,
        `SLACK:${botName}`,
        sessionId
      );
      const reply = buildSlackReply(ctx.channelId, ctx.threadTs!, response);
      await say(reply);
    } catch (e: any) {
      await say(buildSlackReply(ctx.channelId, ctx.threadTs!, `Error: ${e.message}`));
    }
  });

  await app.start();
  console.log(`[slack] ${botName} Slack adapter running (Socket Mode)`);
  return app;
}
