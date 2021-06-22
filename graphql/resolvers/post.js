const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');
const { AuthenticationError } = require('apollo-server');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        console.log(error.message);
        throw new Error(error);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('post not found');
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  //the resolver functions usually takes 4 arguements
  //we can use underscore/underscores for the ones we do not need

  Mutation: {
    async createPost(_, { body }, context) {
      //check if the user is authenticated
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Post body cannot be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', { newPost: post });

      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError(
            'Authorization Error: Action not allowed'
          );
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  //subscriptions allows us to listen to actions or events
  //we can listen to post creation, deletion etc
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
    },
  },
};
