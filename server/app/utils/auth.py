import json
from typing import List
from datetime import timedelta


from app.core.enums import TokenType
from app.core.config import settings
from app.utils.jwt import decode_jwt_token, generate_jwt_token


class AuthService:
    @staticmethod
    def create_access_token(sub) -> str:
        exp_delta = timedelta(minutes=settings.jwt_access_token_expire_minutes)
        jwt_payload = {
            "sub": json.dumps(sub, default=str),
            "aud": TokenType.ACCESS.value
        }
        return generate_jwt_token(jwt_payload, exp_delta)

    @staticmethod
    def create_refresh_token(sub) -> str:
        exp_delta = timedelta(
            minutes=settings.jwt_refresh_token_expire_minutes)
        jwt_payload = {
            "sub": json.dumps(sub, default=str),
            "aud": TokenType.REFRESH.value
        }
        return generate_jwt_token(jwt_payload, exp_delta)

    @staticmethod
    def create_one_time_token(sub) -> str:
        jwt_payload = {"sub": json.dumps(sub), "aud": TokenType.ONE_TIME.value}
        return generate_jwt_token(jwt_payload, timedelta(minutes=3600))

    @staticmethod
    async def verify_jwt_token(token: str, audience: List[TokenType]):
        payload = decode_jwt_token(token, audience).get("sub")
        return json.loads(payload)


auth_service = AuthService()
