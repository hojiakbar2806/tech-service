class ResourceNotFoundException(Exception):
    def __init__(self, resource: str, resource_id: str):
        self.resource = resource
        self.resource_id = resource_id
        self.message = f"{resource.capitalize()} ID {resource_id} bo‘yicha topilmadi"
        super().__init__(self.message)


class ResourceAlreadyExistException(Exception):
    def __init__(self, resource: str, stmt: str):
        self.resource = resource
        self.stmt = stmt
        self.message = f"Ushbu {stmt} bilan {resource} allaqachon mavjud"
        super().__init__(self.message)


class JWTException(Exception):
    pass


class EmailException(Exception):
    pass
