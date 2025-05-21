from functools import wraps
from fastapi import HTTPException, Request
from typing import Optional, Union, List

from app.core.enums import Roles


def permission_required(roles: Optional[Union[Roles, List[Roles]]] = None):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request: Request = kwargs.get("request")
            if not request:
                raise HTTPException(status_code=400, detail="Request not found")

            user = getattr(request.state, "user", None)

            if user is None:
                raise HTTPException(status_code=401, detail="Unauthorized")

            if roles:
                allowed_roles = roles if isinstance(roles, list) else [roles]
                if user.get("role") not in allowed_roles:
                    raise HTTPException(status_code=403, detail="Forbidden")

            return await func(*args, **kwargs)

        return wrapper
    return decorator
