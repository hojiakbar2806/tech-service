from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from typing import Any


class Response:
    @staticmethod
    def success(message: str, data: Any = None) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"status": "success", "message": message, "data": data},
        )

    @staticmethod
    def interval(message: str, data: Any = None) -> HTTPException:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"status": "error", "message": message},
        )

    @staticmethod
    def unauthorized(message: str = "Unauthorized") -> HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"status": "error", "message": message},
        )
    
    @staticmethod
    def not_found(message: str = "Not found") -> HTTPException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"status": "error", "message": message},
        )

    @staticmethod
    def bad_request(message: str = "Bad request") -> HTTPException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"status": "warning", "message": message},
        )

    @staticmethod
    def forbidden(message: str = "Forbidden", data: Any = None) -> HTTPException:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"status": "error", "message": message},
        )


response = Response()
