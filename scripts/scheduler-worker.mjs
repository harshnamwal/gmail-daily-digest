/**
 * Scheduled Daily Summary Background Worker
 * 
 * Periodically calls the local /api/cron/daily-summary endpoint to sweep
 * all active accounts and dispatch daily email digests according to each
 * user's chosen delivery time and timezone.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const CHECK_INTERVAL_MS = 60 * 1000; // Check every 60 seconds

console.log(`[Worker] Daily Summary Background Worker started.`);
console.log(`[Worker] Polling ${APP_URL}/api/cron/daily-summary every 60 seconds...`);

async function sweep() {
  try {
    const res = await fetch(`${APP_URL}/api/cron/daily-summary`);
    if (!res.ok) {
      console.warn(`[Worker] Sweep returned status ${res.status}`);
      return;
    }
    const data = await res.json();
    if (data.dispatched > 0) {
      console.log(`[Worker] Successfully dispatched ${data.dispatched} scheduled daily digests.`);
    }
  } catch (err) {
    // Server might be starting up
    console.debug(`[Worker] Waiting for server at ${APP_URL}...`);
  }
}

// Initial sweep then interval
sweep();
setInterval(sweep, CHECK_INTERVAL_MS);
