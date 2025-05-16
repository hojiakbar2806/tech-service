from enum import Enum


class Roles(str, Enum):
    USER = "user"
    MANAGER = "manager"
    MASTER = "master"


class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"
    ONE_TIME = "one_time"


class IssueType(str, Enum):
    HARDWARE = "hardware"
    SOFTWARE = "software"
    OTHER = "other"


class RequestStatus(str, Enum):
    CREATED = "created"
    APPROVED = "approved"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"
