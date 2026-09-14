import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { contact, serviceOptions } from "./site-data";

export const enquirySchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name").max(80),
  lastName: z.string().trim().min(1, "Enter your last name").max(80),
  // Optional in practice, but typed as a required string so the schema's input
  // and output types match — react-hook-form uses a single generic for both.
  company: z.string().trim().max(140),
  email: z.string().trim().email("Enter a valid email address").max(180),
  service: z.enum(serviceOptions, { errorMap: () => ({ message: "Choose a service" }) }),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters)")
    .max(4000),
  /** Honeypot: real people never fill this in. */
  website: z.string().max(0),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryResult =
  | { status: "sent" }
  /** No mail provider configured — the form falls back to the visitor's mail client. */
  | { status: "unconfigured" }
  | { status: "error"; message: string };

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/**
 * Delivers a contact enquiry.
 *
 * Set `RESEND_API_KEY` (and optionally `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`)
 * in the Vercel project to send mail. Without those variables the function
 * reports `unconfigured` and the form opens the visitor's mail client instead,
 * so the site is never broken by a missing secret. See `.env.example`.
 */
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator(enquirySchema)
  .handler(async ({ data }): Promise<EnquiryResult> => {
    // Silently accept honeypot hits so bots get no signal.
    if (data.website) return { status: "sent" };

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) return { status: "unconfigured" };

    const to = process.env["CONTACT_TO_EMAIL"] ?? contact.email;
    const from = process.env["CONTACT_FROM_EMAIL"] ?? "Emma Global Website <onboarding@resend.dev>";
    const name = `${data.firstName} ${data.lastName}`;

    const rows: [string, string][] = [
      ["Name", name],
      ["Company", data.company || "—"],
      ["Email", data.email],
      ["Service of interest", data.service],
    ];

    const html = `<h2>New website enquiry</h2>
<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
${rows.map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`).join("\n")}
</table>
<h3>Message</h3>
<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(data.message)}</p>`;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: data.email,
          subject: `Website enquiry — ${data.service} — ${name}`,
          html,
        }),
      });

      if (!response.ok) {
        console.error(
          "Enquiry delivery failed",
          response.status,
          await response.text().catch(() => ""),
        );
        return {
          status: "error",
          message: "We couldn't send that just now. Please email us directly.",
        };
      }
      return { status: "sent" };
    } catch (error) {
      console.error("Enquiry delivery threw", error);
      return {
        status: "error",
        message: "We couldn't send that just now. Please email us directly.",
      };
    }
  });
