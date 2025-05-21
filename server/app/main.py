from fastapi.security import HTTPBearer
from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, repair_request, user, component, notification
from app.core.enums import TokenType
from app.utils.auth import auth_service


oauth2_scheme = HTTPBearer(auto_error=False)

app = FastAPI(
    dependencies=[Depends(oauth2_scheme)],
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    )

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(component.router)
app.include_router(repair_request.router)
app.include_router(notification.router)

origins = [
    "https://computer-service.hojiakbar.me/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not len(auth_header.split(" ")) == 2:
        request.state.user = None
        return await call_next(request)
    try:
        token = auth_header.split(" ")[1]
        payload = await auth_service.verify_jwt_token(token, [TokenType.ACCESS])
        request.state.user = payload
        return await call_next(request)
    except Exception:
        request.state.user = None
        return await call_next(request)
