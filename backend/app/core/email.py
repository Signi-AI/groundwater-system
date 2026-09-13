import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings


def send_otp_email(to_email: str, otp: str) -> bool:
    if settings.DEBUG_OTP:
        print(f"[DEBUG OTP] {to_email} -> {otp}")

    user = (settings.MAIL_USERNAME or "").strip()
    password = (settings.MAIL_PASSWORD or "").strip().replace(" ", "")
    mail_from = (settings.MAIL_FROM or user).strip()
    server_host = (settings.MAIL_SERVER or "smtp.gmail.com").strip()
    port = int(settings.MAIL_PORT or 587)

    if not user or not password:
        print("[EMAIL] MAIL_USERNAME or MAIL_PASSWORD empty — check backend/.env")
        return False

    print(f"[EMAIL] Trying SMTP user={user} server={server_host}:{port}")

    subject = "Groundwater System — Password Reset OTP"
    body = (
        f"Hello,\n\n"
        f"Your password reset OTP is: {otp}\n\n"
        f"It expires in 10 minutes.\n"
        f"Do not share this code.\n\n"
        f"— Groundwater Prediction System\n"
    )

    msg = MIMEMultipart()
    msg["From"] = mail_from
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        server = smtplib.SMTP(
            server_host,
            port,
            timeout=settings.SMTP_TIMEOUT_SECONDS,
        )
        server.ehlo()
        if settings.MAIL_STARTTLS:
            server.starttls()
            server.ehlo()
        server.login(user, password)
        server.sendmail(mail_from, [to_email], msg.as_string())
        server.quit()
        print(f"[EMAIL] Sent OK to {to_email}")
        return True
    except smtplib.SMTPAuthenticationError as e:
        print(f"[EMAIL AUTH ERROR] {e}")
        print("→ Use Gmail App Password (16 chars), not normal password.")
        print("→ 2-Step Verification must be ON.")
        return False
    except Exception as e:
        print(f"[EMAIL ERROR] {type(e).__name__}: {e}")
        return False