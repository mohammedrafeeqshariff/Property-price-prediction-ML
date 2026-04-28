from pydantic import BaseModel, Field, field_validator
from typing import Optional

### User schema
class users(BaseModel):
    username: str = Field(..., min_length=8, max_length=20)
    country: str = Field(...,min_length=4)
    age: int = Field(..., gt=0, lt=150)
    password: str = Field(..., min_length=8)

    @field_validator('username')
    def no_space(cls, v):
        if ' ' in v:
            raise ValueError('Username must not contain spaces')
        return v
    
### Content schema
class contents(BaseModel):
    content:str = Field(..., min_length=1)
    userID: str
    username:str
    age:int
    country:str
