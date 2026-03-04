import { Resend } from "resend";
import type { RegistrationData } from "./validations";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(data: RegistrationData) {
  await resend.emails.send({
    from: "Swim for Life <noreply@swimsforlife.com>",
    to: data.parentEmail,
    subject: "Registration Confirmed — Swim for Life",
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #2563EB; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Swim for Life</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #1E293B; font-size: 20px;">Registration Confirmed!</h2>
          <p style="color: #475569; line-height: 1.6;">
            Thank you for registering <strong>${data.childName}</strong> for Swim for Life!
            We've received your submission and a coach will reach out shortly to confirm your session details.
          </p>

          <div style="background: #F8FAFC; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #1E293B; font-size: 16px; margin-top: 0;">Registration Summary</h3>
            <table style="width: 100%; color: #475569; font-size: 14px;">
              <tr><td style="padding: 4px 0;"><strong>Child:</strong></td><td>${data.childName}, Age ${data.childAge}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Experience:</strong></td><td>${data.swimExperience}</td></tr>
              ${data.sessionPreference ? `<tr><td style="padding: 4px 0;"><strong>Preference:</strong></td><td>${data.sessionPreference}</td></tr>` : ""}
            </table>
          </div>

          <div style="background: #F8FAFC; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #1E293B; font-size: 16px; margin-top: 0;">Program Info</h3>
            <ul style="color: #475569; font-size: 14px; padding-left: 20px; line-height: 1.8;">
              <li>10 free lessons, Mon–Thu, 11:00 AM – 12:00 PM</li>
              <li>North Palm Beach Country Club, 951 US-1, North Palm Beach, FL 33408</li>
            </ul>
          </div>

          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Questions? Contact us at
            <a href="mailto:atmccorkle08@gmail.com" style="color: #2563EB;">atmccorkle08@gmail.com</a>
            or call <a href="tel:+19178213667" style="color: #2563EB;">(917)-821-3667</a>.
          </p>
        </div>
        <div style="background: #0F172A; padding: 20px; text-align: center;">
          <p style="color: #94A3B8; font-size: 12px; margin: 0;">
            Swim for Life is a registered 501(c)(3) non-profit.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendCoachNotification(data: RegistrationData) {
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });

  await resend.emails.send({
    from: "Swim for Life <noreply@swimsforlife.com>",
    to: ["atmccorkle08@gmail.com", "bapeters_1@icloud.com"],
    subject: `New Registration: ${data.childName}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1E293B;">New Registration Received</h2>
        <table style="width: 100%; color: #475569; font-size: 14px; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;"><strong>Child:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;">${data.childName}, Age ${data.childAge}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;"><strong>Parent:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;">${data.parentName}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;"><a href="mailto:${data.parentEmail}">${data.parentEmail}</a></td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;"><a href="tel:${data.parentPhone}">${data.parentPhone}</a></td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;"><strong>Experience:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;">${data.swimExperience}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;"><strong>Special Needs:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;">${data.hasSpecialNeeds ? `Yes — ${data.specialNeedsDetails}` : "No"}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;"><strong>Session Pref:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;">${data.sessionPreference || "None"}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>Submitted:</strong></td><td style="padding: 8px 0;">${timestamp}</td></tr>
        </table>
      </div>
    `,
  });
}
