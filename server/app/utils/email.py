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


async def send_auth_link_to_user(email: str, link: str, name, new_password=None):
    with open("app/template/auth_link.html", "r", encoding="utf-8") as f:
        template = f.read()

    html_content = template.replace("{{ link }}", link)
    html_content = html_content.replace("{{ name }}", name if name else email)
    if new_password:
        html = """
            <div class = "password-box" >
                <p > Sizning vaqtinchalik parolingiz: < strong > {{new_password}} < /strong > </p >
                <p > Kirish uchun ushbu paroldan foydalaning va xavfsizlik uchun sozlamalar bo'limida uni o'zgartiring. < /p >
            </div>
            """.replace("{{new_password}}", new_password)
        html_content = html_content.replace("{{ html }}", html)
    else:
        html_content = html_content.replace("{{ html }}", "")

    try:
        msg = EmailMessage()
        msg["Subject"] = "Kabinetga kirish"
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = email
        msg.add_alternative(html_content, subtype='html')
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
    except smtplib.SMTPRecipientsRefused:
        raise EmailException(
            "Email manziliga yuborishda xatolik yuz berdi")
