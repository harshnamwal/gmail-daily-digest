import { DailyDigest, EmailSummaryItem } from "./types";

export function renderDigestHtml(digest: DailyDigest, recipientName: string): string {
  const categoryLabels: Record<string, { label: string; icon: string; color: string }> = {
    work: { label: "Work & Projects", icon: "💼", color: "#2563eb" },
    personal: { label: "Personal & Friends", icon: "👤", color: "#16a34a" },
    bills: { label: "Bills & Finance", icon: "💳", color: "#dc2626" },
    travel: { label: "Travel & Bookings", icon: "✈️", color: "#9333ea" },
    promotions: { label: "Promotions & News", icon: "🏷️", color: "#d97706" },
    updates: { label: "Updates & Security", icon: "⚙️", color: "#475569" },
  };

  const actionItems = digest.items.filter(
    (i) => i.highlights.includes("reply_needed") || i.highlights.includes("deadline")
  );

  const renderItemHtml = (item: EmailSummaryItem) => `
    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
        <span style="font-weight: 600; font-size: 14px; color: #1e293b;">${item.sender.name}</span>
        <span style="font-size: 12px; color: #64748b;">${new Date(item.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div style="font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 6px;">
        ${item.subject}
      </div>
      <p style="font-size: 13px; color: #475569; line-height: 1.5; margin: 0 0 10px 0;">
        ${item.summary}
      </p>
      ${
        item.actionItem
          ? `<div style="background-color: #fef3c7; color: #92400e; font-size: 12px; font-weight: 500; padding: 6px 10px; border-radius: 6px; margin-bottom: 10px; display: inline-block;">
               ⚡ <strong>Action:</strong> ${item.actionItem}
             </div>`
          : ""
      }
      <div>
        <a href="${item.gmailUrl}" target="_blank" style="display: inline-block; font-size: 12px; font-weight: 600; color: #2563eb; text-decoration: none;">
          Open in Gmail &rarr;
        </a>
      </div>
    </div>
  `;

  // Group items by category
  const categoriesPresent = Object.keys(digest.categoryCounts).filter(
    (cat) => (digest.categoryCounts as any)[cat] > 0
  );

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Daily Gmail Digest</title>
</head>
<body style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 28px 24px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="background-color: rgba(255,255,255,0.15); border-radius: 6px; padding: 4px 8px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">GMAIL DAILY BRIEF</span>
      </div>
      <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 6px 0;">Good morning, ${recipientName}</h1>
      <p style="font-size: 13px; color: #cbd5e1; margin: 0;">
        Summary for ${new Date(digest.generatedAt).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })} • ${digest.totalSummarized} new emails analyzed
      </p>
    </div>

    <!-- Highlights Section -->
    ${
      actionItems.length > 0
        ? `
      <div style="background-color: #fffbeb; border-bottom: 1px solid #fef3c7; padding: 18px 24px;">
        <h2 style="font-size: 14px; font-weight: 700; color: #92400e; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
          ⚡ Priority Action Items (${actionItems.length})
        </h2>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #78350f;">
          ${actionItems
            .map(
              (item) => `
            <li style="margin-bottom: 6px;">
              <strong>${item.sender.name}:</strong> ${item.actionItem || item.subject}
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `
        : ""
    }

    <!-- Content Sections -->
    <div style="padding: 24px; background-color: #f8fafc;">
      ${categoriesPresent
        .map((cat) => {
          const info = categoryLabels[cat] || { label: cat, icon: "✉️", color: "#334155" };
          const items = digest.items.filter((i) => i.category === cat);
          if (items.length === 0) return "";
          return `
          <div style="margin-bottom: 24px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="font-size: 16px; margin-right: 8px;">${info.icon}</span>
              <h3 style="font-size: 15px; font-weight: 700; color: #1e293b; margin: 0;">
                ${info.label} (${items.length})
              </h3>
            </div>
            ${items.map(renderItemHtml).join("")}
          </div>
        `;
        })
        .join("")}
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; background-color: #ffffff; font-size: 12px; color: #64748b;">
      <p style="margin: 0 0 8px 0;">
        Generated securely by Gmail Daily Digest • Read-only access requested
      </p>
      <p style="margin: 0;">
        <a href="http://localhost:3000" style="color: #2563eb; text-decoration: none;">Manage Delivery Schedule</a> • 
        <a href="http://localhost:3000/privacy" style="color: #2563eb; text-decoration: none;">Privacy & Data Policy</a>
      </p>
    </div>

  </div>
</body>
</html>
  `;
}
