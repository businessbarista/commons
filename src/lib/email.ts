import { Resend } from "resend";

// Lazy init to avoid build-time errors when RESEND_API_KEY isn't set
let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

interface SendRejectionEmailParams {
  to: string;
  skillName: string;
}

export async function sendRejectionEmail({
  to,
  skillName,
}: SendRejectionEmailParams) {
  return getResend().emails.send({
    from: "Commons <noreply@commons.dev>",
    to,
    subject: `Update on your skill submission: ${skillName}`,
    html: `
      <p>Hey there,</p>
      <p>Thanks for submitting <strong>${skillName}</strong> to Commons.</p>
      <p>After reviewing it against our quality rubric, this one didn't make the cut this time.</p>
      <p>You can check out <a href="https://commons.dev/rubric">what we look for</a> and resubmit anytime — we'd love to see a revised version.</p>
      <p>— The Commons team</p>
    `,
  });
}
