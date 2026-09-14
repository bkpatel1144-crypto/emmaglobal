import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { enquirySchema, submitEnquiry, type EnquiryInput } from "../lib/enquiry";
import { contact, serviceOptions } from "../lib/site-data";

type Status = "idle" | "sending" | "sent" | "mail-client" | "error";

/** Builds the mailto fallback used when no mail provider is configured. */
function mailtoHref(data: EnquiryInput) {
  const body = [
    `Name: ${data.firstName} ${data.lastName}`,
    `Company: ${data.company || "—"}`,
    `Email: ${data.email}`,
    `Service of interest: ${data.service}`,
    "",
    data.message,
  ].join("\n");
  return `mailto:${contact.email}?subject=${encodeURIComponent(
    `Website enquiry — ${data.service}`,
  )}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setStatus("sending");
    setError("");
    try {
      const result = await submitEnquiry({ data });
      if (result.status === "sent") {
        setStatus("sent");
        reset();
        return;
      }
      if (result.status === "unconfigured") {
        // No provider wired up yet — hand the enquiry to the visitor's mail client.
        window.location.href = mailtoHref(data);
        setStatus("mail-client");
        return;
      }
      setStatus("error");
      setError(result.message);
    } catch {
      setStatus("error");
      setError("Something went wrong sending that. Please email us directly.");
    }
  });

  if (status === "sent") {
    return (
      <div className="contact-form form-done" role="status">
        <span className="form-done-icon">
          <CheckCircle2 aria-hidden="true" />
        </span>
        <h3>Thank you — your message is on its way.</h3>
        <p className="f-note">
          A member of the Emma Global team will reply shortly. If it's urgent, email us at{" "}
          <a href={`mailto:${contact.email}`} style={{ color: "var(--sky)", fontWeight: 600 }}>
            {contact.email}
          </a>
          .
        </p>
        <button type="button" className="btn-send" onClick={() => setStatus("idle")}>
          <Send aria-hidden="true" />
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="f-row">
        <Field id="firstName" label="First Name" error={errors.firstName?.message}>
          <input
            id="firstName"
            {...register("firstName")}
            placeholder="Your first name"
            autoComplete="given-name"
          />
        </Field>
        <Field id="lastName" label="Last Name" error={errors.lastName?.message}>
          <input
            id="lastName"
            {...register("lastName")}
            placeholder="Your last name"
            autoComplete="family-name"
          />
        </Field>
      </div>

      <Field id="company" label="Company Name" error={errors.company?.message}>
        <input
          id="company"
          {...register("company")}
          placeholder="Your organisation"
          autoComplete="organization"
        />
      </Field>

      <Field id="email" label="Email Address" error={errors.email?.message}>
        <input
          id="email"
          {...register("email")}
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
        />
      </Field>

      <Field id="service" label="Service of Interest" error={errors.service?.message}>
        <select id="service" {...register("service")} defaultValue="">
          <option value="">Select a service...</option>
          {serviceOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Message" error={errors.message?.message}>
        <textarea
          id="message"
          {...register("message")}
          placeholder="Tell us about your business needs..."
          rows={5}
        />
      </Field>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="website">Website</label>
        <input id="website" {...register("website")} tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn-send" disabled={status === "sending"}>
        <Send aria-hidden="true" />
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>

      {status === "mail-client" && (
        <p className="f-note" role="status">
          We've opened your email app with the message ready to send. If nothing happened, email us
          at{" "}
          <a href={`mailto:${contact.email}`} style={{ color: "var(--sky)", fontWeight: 600 }}>
            {contact.email}
          </a>
          .
        </p>
      )}
      {status === "error" && (
        <p className="f-error" role="alert">
          {error}{" "}
          <a href={`mailto:${contact.email}`} style={{ color: "var(--sky)", fontWeight: 600 }}>
            {contact.email}
          </a>
        </p>
      )}
    </form>
  );
}

/**
 * Label and control are siblings, as in the reference markup — nesting the
 * control inside the label would inherit the label's uppercase transform into
 * the input text and its placeholder.
 */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="f-group">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <span className="f-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
