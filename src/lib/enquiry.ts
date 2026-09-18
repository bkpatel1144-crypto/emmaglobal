import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { contact, primaryEmail, serviceOptions, site } from "./site-data";

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
  /** No SMTP credentials configured — the form falls back to the mail client. */
  | { status: "unconfigured" }
  | { status: "error"; message: string };

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/** Reads an env var without tripping `noPropertyAccessFromIndexSignature`. */
const env = (key: string) => (process.env as Record<string, string | undefined>)[key];

/**
 * Delivers a contact enquiry over SMTP with Nodemailer.
 *
 * This handler only ever runs on the server — `createServerFn` compiles the body
 * out of the client bundle entirely — so the SMTP credentials are never exposed
 * to the browser and no separate backend service is needed.
 *
 * Configure in Vercel: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and
 * optionally CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL. Without SMTP_HOST the
 * function reports `unconfigured` and the form hands the enquiry to the
 * visitor's own mail client, so a missing secret can never break the site.
 * See `.env.example`.
 */
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator(enquirySchema)
  .handler(async ({ data }): Promise<EnquiryResult> => {
    // Silently accept honeypot hits so bots get no signal.
    if (data.website) return { status: "sent" };

    const host = env("SMTP_HOST");
    const user = env("SMTP_USER");
    // Gmail shows app passwords as four groups of four ("abcd efgh ijkl mnop")
    // and they are almost always pasted that way. The spaces are display-only —
    // leaving them in produces a confusing "invalid credentials" failure.
    const pass = env("SMTP_PASS")?.replace(/\s+/g, "");
    if (!host || !user || !pass) return { status: "unconfigured" };

    const port = Number(env("SMTP_PORT") ?? 587);
    const to = env("CONTACT_TO_EMAIL") ?? contact.emails.join(", ");
    const from = env("CONTACT_FROM_EMAIL") ?? `"${site.name} Website" <${user}>`;
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

    const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", "Message:", data.message].join("\n");

    try {
      // Imported inside the handler so the dependency is only ever pulled into
      // the server bundle.
      const nodemailer = (await import("nodemailer")).default;

      const transport = nodemailer.createTransport({
        host,
        port,
        // 465 is implicit TLS; 587 and 25 start plaintext and upgrade via STARTTLS.
        secure: port === 465,
        auth: { user, pass },
        // Serverless invocations are short-lived, so fail fast rather than
        // holding the request open when the mail host is unreachable.
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
      });

      await transport.sendMail({
        from,
        to,
        replyTo: `"${name}" <${data.email}>`,
        subject: `Website enquiry — ${data.service} — ${name}`,
        text,
        html,
      });

      return { status: "sent" };
    } catch (error) {
      console.error("Enquiry delivery failed", error);
      return {
        status: "error",
        message: `We couldn't send that just now. Please email us directly at ${primaryEmail}.`,
      };
    }
  });
