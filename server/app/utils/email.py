import os
import smtplib
from email.message import EmailMessage
from app.core.config import settings
from app.core.exceptions import EmailException


async def send_email(to_email: str, subject: str, html_content: str):
    EMAIL_ADDRESS = settings.email_address
    EMAIL_PASSWORD = settings.email_password

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg.set_content(
        "Agar siz HTML formatini ko‘rmasangiz, tugmani bosish uchun brauzerdan foydalaning.")
    msg.add_alternative(html_content, subtype='html')

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)


async def send_auth_link_to_user(email: str, link: str):
    with open("app/template/auth_link.html", "r", encoding="utf-8") as f:
        template = f.read()

    html_content = template.replace("{{ link }}", link)

    try:
        await send_email(email, "Shaxsiy kabinetga kirish", html_content)
    except smtplib.SMTPRecipientsRefused as e:
        raise EmailException(
            "Qabul qiluvchi email manzili noto'g'ri yoki mavjud emas"
        )
