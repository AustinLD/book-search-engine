const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id }).populate('books');
        }
        throw new AuthenticationError('You need to be logged in!');
    },
    Book: async (parent, { _id }) => {
      const params = _id ? { _id } : {};
      return Book.find(params);
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
    },
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('No user found with this email address');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);
  
        return { token, user };
    },
    saveBook: async (parent, { bookId, image, title, authors, description }) => {
        return User.findOneAndUpdate(
          { _id: userId },
          {
            $addToSet: { savedBooks: book._id },
          },
          {
            new: true,
            runValidators: true,
          }
        );
    },
    deleteBook: async (parent, { _id }, context) => {
          await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { books: book._id } }
          );
        }
  },
};

module.exports = resolvers;