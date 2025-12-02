import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const EMAIL_ENABLED = process.env.EMAIL_ENABLED === 'true';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Developing Africa <noreply@example.com>';

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function createTransporterIfNeeded() {
  if (!EMAIL_ENABLED) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });

  return transporter;
}

export const isEmailEnabled = EMAIL_ENABLED;

export async function sendMail(opts: { to: string; subject: string; text: string; html?: string }) {
  if (!EMAIL_ENABLED) {
    console.info('[email] EMAIL_DISABLED - skipping send to:', opts.to);
    return { ok: false, reason: 'disabled' };
  }

  const t = createTransporterIfNeeded();
  if (!t) {
    console.error('[email] transporter not configured');
    return { ok: false, reason: 'no-transporter' };
  }

  try {
    const info = await t.sendMail({
      from: EMAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });

    console.info('[email] sent ok:', info && (info as any).messageId);
    return { ok: true, info };
  } catch (err) {
    console.error('[email] send failed', err);
    return { ok: false, reason: err };
  }
}

export async function sendWelcomeEmail(params: {
  to: string;
  fullName?: string | null;
  applicationId?: string | null;
  setPasswordUrl?: string | null;
}) {
  const { to, fullName, applicationId, setPasswordUrl } = params;

  const nameOrEmail = fullName || to;
  const subject = `Welcome to Developing Africa — set your password`;

  const lines = [];
  lines.push(`Hi ${nameOrEmail},`);
  lines.push('');
  lines.push("Welcome to Developing Africa! We're excited to have you join the JAPA Initiative — congratulations on taking this important step.");
  lines.push('');
  if (applicationId) {
    lines.push(`Application ID: ${applicationId}`);
    lines.push('');
  }

  if (setPasswordUrl) {
    lines.push('Set your password:');
    lines.push(`  ${setPasswordUrl}`);
    lines.push('');
    lines.push('This link will expire in 24 hours. If it expires, you can request a new password reset link by signing in.');
    lines.push('');
  }

  lines.push('Next steps:');
  lines.push('  1. Click the link above to set your secure password.');
  lines.push('  2. After setting your password, sign in at https://your-site.example.com/auth/login');
  lines.push('  3. Complete your profile and ensure all information is accurate.');
  if (!applicationId) lines.push('  4. If you have not yet submitted an application, please complete your application to be considered.');
  lines.push('  5. You will receive updates via email about your application status.');
  lines.push('');
  lines.push('If you need assistance, reply to this email or reach out to our support team.');
  lines.push('');
  lines.push('Warm regards,');
  lines.push('The Developing Africa — JAPA Initiative Team');

  const text = lines.join('\n');

  const htmlParts: string[] = [];
  htmlParts.push(`<p>Hi ${nameOrEmail},</p>`);
  htmlParts.push(`<p>Welcome to <strong>Developing Africa</strong> — we're excited to have you join the <em>JAPA Initiative</em>. Congratulations on taking this important step.</p>`);
  if (applicationId) htmlParts.push(`<p><strong>Application ID:</strong> ${applicationId}</p>`);
  if (setPasswordUrl) {
    htmlParts.push(`<h3>Set your password</h3>`);
    htmlParts.push(`<p><a href="${setPasswordUrl}" style="background-color:#059669;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:600">Set Password</a></p>`);
    htmlParts.push(`<p style="color:#666;font-size:14px">Or copy this link: <code>${setPasswordUrl}</code></p>`);
    htmlParts.push(`<p style="color:#b45309;font-size:14px"><strong>Note:</strong> This link will expire in 24 hours.</p>`);
  }
  htmlParts.push('<h3>Next steps</h3>');
  htmlParts.push('<ol>');
  htmlParts.push('<li>Click the button above to set your secure password.</li>');
  htmlParts.push('<li>After setting your password, <a href="/auth/login">sign in here</a>.</li>');
  htmlParts.push('<li>Complete your profile with accurate information.</li>');
  if (!applicationId) htmlParts.push('<li>Submit your application when ready.</li>');
  htmlParts.push('<li>We will notify you by email about your application status.</li>');
  htmlParts.push('</ol>');
  htmlParts.push('<p>If you need help, reply to this email or contact our support team.</p>');
  htmlParts.push('<p>Warm regards,<br/>The Developing Africa — JAPA Initiative Team</p>');

  const html = htmlParts.join('\n');

  return sendMail({ to, subject, text, html });
}

export default sendWelcomeEmail;

// Password reset token management
export async function generatePasswordResetToken(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  // Delete any existing tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });

  // Create new token
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function getPasswordResetToken(token: string) {
  return prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });
}

export async function deletePasswordResetToken(token: string) {
  return prisma.passwordResetToken.delete({
    where: { token },
  });
}

export function getSetPasswordUrl(token: string, baseUrl?: string): string {
  const url = baseUrl || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return `${url}/auth/set-password?token=${token}`;
}
