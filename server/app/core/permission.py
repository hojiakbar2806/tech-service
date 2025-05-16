from functools import wraps
from fastapi import Request
from typing import Optional, Union, List

from app.core.enums import Roles
from app.utils.response import response as res


def permission_required(roles: Optional[Union[Roles, List[Roles]]] = None):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request: Request = kwargs.get("request")
            if not request:
                raise res.interval("Request topilmadi")

            user = getattr(request.state, "user", None)

            if user is None:
                raise res.unauthorized("Ro'yxatdan o'tmagansiz")

            if roles:
                allowed_roles = roles if isinstance(roles, list) else [roles]
                if user.get("role") not in allowed_roles:
                    raise res.forbidden("Sizda ruxsat yo'q")

            return await func(*args, **kwargs)

        return wrapper
    return decorator
