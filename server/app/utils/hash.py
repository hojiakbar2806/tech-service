import secrets
from typing import Tuple, Union
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

argon2_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return argon2_hasher.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> Tuple[bool, Union[str, None]]:
    try:
        return argon2_hasher.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False


def generate_password(length: int = 16) -> str:
    return secrets.token_urlsafe(length)
