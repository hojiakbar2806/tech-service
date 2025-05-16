from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.enums import TokenType
from app.database.models.mixin import BlacklistedToken


class AuthRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def add_token_blacklist(self, token: str, type: TokenType):
        token = BlacklistedToken(token=token, type=type)
        self.db.add(token)
        await self.db.commit()
        return token

    async def check_token_blacklist(self, token: str):
        query = select(BlacklistedToken).where(BlacklistedToken.token == token)
        result = await self.db.execute(query)
        return result.scalars().first()
