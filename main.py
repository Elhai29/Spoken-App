from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

class CreatorProfileResponse(BaseModel):
    name: str
    bio: str
    next_event: Optional[dict]
    latest_video_url: Optional[str]
    recent_text: Optional[str]

# הוספנו את הנתיב שהאייפון מחפש!
@app.get("/api/users")
async def get_test_users():
    # נתוני דמה לבדיקת החיבור הישיר לאפליקציה
    return {
        "name": "אלחי",
        "club": "מועדון פורד מוסטנג ישראל",
        "role": "מנהל מועדון ופיתוח האפליקציה",
        "next_event": {
            "location": "מתחם חניה צפוני", 
            "date": "2026-06-20"
        },
        "status": "החיבור בין האייפון לשרת הפייתון עובד בצורה מושלמת!"
    }

# שמרנו את הנתיב המקורי שלך כהכנה לחיבור מסד הנתונים
@app.get("/api/creators/{creator_id}")
async def get_creator_profile(creator_id: int):
    # כאן נוסיף בהמשך את הלוגיקה של SQLAlchemy
    return {"message": f"Looking for creator {creator_id}"}