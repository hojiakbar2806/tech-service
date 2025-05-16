import jwt
from typing import Any, List
from datetime import datetime, timedelta, timezone


from app.core.config import settings
from app.core.exceptions import JWTException


SECRET_KEY = settings.jwt_secret_key.get_secret_value()


def generate_jwt_token(data: dict, expires_delta: timedelta = None) -> str:
    try:
        to_encode = data.copy()
        if expires_delta:
            utc_now = datetime.now(timezone.utc)
            to_encode.update({"iat": utc_now, "exp": utc_now + expires_delta})
        return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    except Exception as e:
        raise JWTException(f"Error generating JWT token: {str(e)}")


def decode_jwt_token(encoded_jwt: str, audience: List[str]) -> dict[str, Any]:
    try:
        return jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"], audience=audience)
    except jwt.ExpiredSignatureError:
        raise JWTException("Token muddati tugagan")
    except jwt.InvalidAudienceError:
        raise JWTException("Token audience yaroqsiz")
    except jwt.InvalidTokenError:
        raise JWTException("Token yaroqsiz")
    except Exception as e:
        raise JWTException(f"Error decoding JWT token: {str(e)}")
