const postResolvers = require('./post');
const usersResolvers = require('./users');
const commentsResolvers = require('./comment');

module.exports = {
  //this is an awesome way to get like count and comment count
  Post: {
    likeCount(parent) {
      return parent.likes.length;
    },
    //we can use arrow functions too
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  Subscription: {
    ...postResolvers.Subscription,
  },
};
