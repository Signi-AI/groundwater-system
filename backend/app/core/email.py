import httpx
from app.core.config import settings


def send_otp_email(to_email: str, otp: str) -> bool:
    """
    Send 6-digit OTP for password reset.
    Returns True if Resend accepted the email.
    """
    api_key = (getattr(settings, "RESEND_API_KEY", None) or "").strip()
    if not api_key:
        print("[EMAIL] RESEND_API_KEY missing — set it on Render Environment")
        return False

    from_addr = (getattr(settings, "MAIL_FROM", None) or "").strip()
    if not from_addr:
        print("[EMAIL] MAIL_FROM missing — e.g. noreply@e.signiai.co.tz")
        return False

    payload = {
        "from": f"GP Groundwater <{from_addr}>",
        "to": [to_email],
        "subject": "GP – Your password reset code",
        "html": f"""
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2>Password reset</h2>
          <p>Your OTP code is:</p>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">{otp}</p>
          <p>This code expires in a few minutes. If you did not request it, ignore this email.</p>
        </div>
        """,
    }

    try:
        r = httpx.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=30.0,
        )
        if r.status_code >= 400:
            print("[EMAIL ERROR] Resend", r.status_code, r.text)
            return False
        print("[EMAIL] Sent via Resend to", to_email)
        return True
    except Exception as e:
        print("[EMAIL ERROR]", type(e).__name__, str(e))
        return False


def send_email(to_email: str, subject: str, body: str) -> bool:
    """Generic send (optional — for other notifications)."""
    api_key = (getattr(settings, "RESEND_API_KEY", None) or "").strip()
    from_addr = (getattr(settings, "MAIL_FROM", None) or "").strip()
    if not api_key or not from_addr:
        print("[EMAIL] RESEND_API_KEY or MAIL_FROM missing")
        return False

    try:
        r = httpx.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": f"GP Groundwater <{from_addr}>",
                "to": [to_email],
                "subject": subject,
                "html": f"<div style='font-family:sans-serif'>{body}</div>",
            },
            timeout=30.0,
        )
        if r.status_code >= 400:
            print("[EMAIL ERROR] Resend", r.status_code, r.text)
            return False
        print("[EMAIL] Sent via Resend to", to_email)
        return True
    except Exception as e:
        print("[EMAIL ERROR]", type(e).__name__, str(e))
        return False