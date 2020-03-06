export default class Likes {
  constructor() {
    this.likes = [];
  }
  addLike(id, title, author, img) {
    if (this.likes.findIndex(el => el.id === id) === -1) {
      const like = { id, title, author, img };

      this.likes.push(like);
      this.persistData();
      return like;
      // persist like data in local storage
    }
  }
  deleteLike(id) {
    const start = this.likes.findIndex(el => el.id === id);
    this.likes.splice(start, 1);
  }

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }
  getNumLikes() {
    return this.likes.length;
  }
  persistData() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }
  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));
    // set our likes to the ikes from storage
    if (storage) this.likes = storage;
  }
}
