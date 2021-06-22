const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  //the person that made the post
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

module.exports = model('post', postSchema);
