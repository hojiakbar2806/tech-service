import smtplib
from app.core.config import settings
from email.message import EmailMessage
from app.core.exceptions import EmailException

EMAIL_ADDRESS = settings.email_address
EMAIL_PASSWORD = settings.email_password


async def send_notification(title: str, to_email: str, message: str):
    with open("app/template/notification.html", "r", encoding="utf-8") as f:
        template = f.read()

    html_content = template.replace(
        "{{ message }}", message).replace("{{ title }}", title)

    msg = EmailMessage()
    msg["Subject"] = title
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg.add_alternative(html_content, subtype='html')

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)


async def send_auth_link_to_user(email: str, link: str):
    with open("app/template/auth_link.html", "r", encoding="utf-8") as f:
        template = f.read()

    html_content = template.replace("{{ link }}", link)

    try:
        msg = EmailMessage()
        msg["Subject"] = "Shaxsiy kabinetga kirish"
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = email
        msg.add_alternative(html_content, subtype='html')
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
    except smtplib.SMTPRecipientsRefused:
        raise EmailException(
            "Email manziliga yuborishda xatolik yuz berdi")
