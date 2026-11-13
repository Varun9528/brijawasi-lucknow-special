import { NextRequest, NextResponse } from "next/server";
import { exchangeGoogleCode } from "@/lib/google-business";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const state = req.nextUrl.searchParams.get("state");
  const businessId = state || "default";
  const origin = req.nextUrl.origin;

  if (error) {
    return new NextResponse(
      renderHtmlPage("Authorization Error", `Google returned an error: <strong>${error}</strong>`, false, businessId),
      { headers: { "Content-Type": "text/html" }, status: 400 }
    );
  }

  if (!code) {
    return new NextResponse(
      renderHtmlPage("Missing Authorization Code", "No authorization code was provided by Google.", false, businessId),
      { headers: { "Content-Type": "text/html" }, status: 400 }
    );
  }

  try {
    const tokens = await exchangeGoogleCode(code, origin, businessId);
    const clientName = "Brijawasi Lucknow Special";
    const returnUrl = "/";
    const details = `
      <p style="margin-bottom: 8px;">✅ <strong>Business:</strong> ${clientName}</p>
      <p style="margin-bottom: 8px;">✅ <strong>Account:</strong> ${tokens.accountId || "Discovered"}</p>
      <p style="margin-bottom: 8px;">✅ <strong>Location:</strong> ${tokens.locationId || "Discovered"}</p>
      <p style="margin-bottom: 8px;">✅ <strong>Refresh Token:</strong> Securely stored</p>
      <p style="margin-top: 16px; color: #a1a1aa; font-size: 14px;">
        Automatic AI replies are now activated for ${clientName}. New incoming Google reviews will receive tailored owner responses automatically without requiring manual action.
      </p>
    `;

    return new NextResponse(
      renderHtmlPage(`Google Business Profile Connected (${clientName})`, details, true, businessId, returnUrl),
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new NextResponse(
      renderHtmlPage("Connection Failed", `Failed to complete OAuth exchange: <br/><br/><code>${msg}</code>`, false, businessId),
      { headers: { "Content-Type": "text/html" }, status: 500 }
    );
  }
}

function renderHtmlPage(title: string, content: string, success: boolean, businessId: string = "brijawasi", returnUrl: string = "/"): string {
  const goldColor = "#D4AF37";
  const bgDark = "#123D2B";
  const cardBg = "#174A32";
  const btnLabel = "Return to Brijawasi Hub";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Brijawasi Lucknow Special</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      background-color: ${bgDark};
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .card {
      background-color: ${cardBg};
      border: 1px solid ${success ? "rgba(212, 175, 55, 0.4)" : "rgba(239, 68, 68, 0.4)"};
      border-radius: 16px;
      max-width: 520px;
      width: 100%;
      padding: 32px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 700;
      background: ${success ? "rgba(212, 175, 55, 0.15)" : "rgba(239, 68, 68, 0.15)"};
      color: ${success ? goldColor : "#ef4444"};
      border: 1px solid ${success ? goldColor : "#ef4444"};
      margin-bottom: 20px;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 16px 0;
      color: #ffffff;
    }
    .body-box {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      padding: 16px;
      text-align: left;
      font-size: 14px;
      line-height: 1.6;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .btn {
      display: inline-block;
      margin-top: 24px;
      padding: 12px 28px;
      background: linear-gradient(135deg, #D4AF37 0%, #AA771C 100%);
      color: #000;
      text-decoration: none;
      font-weight: 700;
      border-radius: 8px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${success ? "OAuth 2.0 Success" : "OAuth 2.0 Notice"}</div>
    <h1>${title}</h1>
    <div class="body-box">
      ${content}
    </div>
    <a href="${returnUrl}" class="btn">${btnLabel}</a>
  </div>
</body>
</html>
  `;
}

