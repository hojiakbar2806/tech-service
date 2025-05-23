from postmarker.core import PostmarkClient
from app.core.exceptions import EmailException

POSTMARK_API_TOKEN = "bc33f36c-f1b6-4d16-a5fe-af60c5df1fb2"

client = PostmarkClient(server_token=POSTMARK_API_TOKEN)


def send_email_via_postmark(to_email: str, subject: str, html_content: str):
    try:
        response = client.emails.send(
            From='computer-service@hojiakbar.me',
            To=to_email,
            Subject=subject,
            HtmlBody=html_content,
        )
        return response
    except Exception as e:
        raise EmailException(
            f"Postmark email yuborishda xatolik yuz berdi: {e}")
