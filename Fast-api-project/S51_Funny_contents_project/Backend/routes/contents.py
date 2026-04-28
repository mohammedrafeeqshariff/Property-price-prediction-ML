from fastapi import APIRouter, HTTPException
from schemas import contents
from DB import contents_collections
from bson import ObjectId

router = APIRouter()
                        
@router.post("/posts")
def create_post(post: contents):
    post_dict = post.dict()
    contents_collections.insert_one(post_dict)
    return {"message": "contents created", "post": post_dict}

@router.get("/posts")
def get_posts():
    all_posts = list(contents_collections.find())
    for post in all_posts:
        post["_id"] = str(post["_id"])
    return all_posts

@router.patch("/posts/{post_id}")
def update_post(post_id: str, post: contents):
    updated = contents_collections.find_one_and_update(
        {"_id": ObjectId(post_id)}, {"$set": post.dict()}, return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Post not found")
    updated["_id"] = str(updated["_id"])
    return {"message": "Post updated", "post": updated}

@router.delete("/posts/{post_id}")
def delete_post(post_id: str):
    deleted = contents_collections.find_one_and_delete({"_id": ObjectId(post_id)})
    if not deleted:
        raise HTTPException(status_code=404, detail="Post not found")
    deleted["_id"] = str(deleted["_id"])
    return {"message": "Post deleted", "post": deleted}
