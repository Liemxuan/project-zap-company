import { redirect } from 'next/navigation';

export default function Page() {
  // If the user hits the root of mission-control app, redirect to the mission-control path
  // which will trigger the proxy rewrite we set up in next.config.js
  redirect('/mission-control');
}
