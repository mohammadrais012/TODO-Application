import mongoose from 'mongoose';

/**
 * User Schema definition for MongoDB via Mongoose
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compile standard Mongoose Model
const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

// In-memory collection fallback for offline evaluation/demo when MongoDB is not connected
const memoryUsers = [];

/**
 * User data-access object supporting both connected MongoDB and offline demo fallback
 */
class UserModel {
  static isConnected() {
    return mongoose.connection && mongoose.connection.readyState === 1;
  }

  static async findOne(query) {
    if (this.isConnected()) {
      return await MongooseUser.findOne(query);
    }

    if (query.email) {
      const found = memoryUsers.find(
        (u) => u.email.toLowerCase() === query.email.toLowerCase()
      );
      return found ? { ...found } : null;
    }
    return null;
  }

  static async findById(id) {
    if (this.isConnected()) {
      return await MongooseUser.findById(id).select('-password');
    }

    const found = memoryUsers.find((u) => u._id.toString() === id.toString());
    if (!found) return null;
    const { password, ...safeUser } = found;
    return safeUser;
  }

  static async create(userData) {
    if (this.isConnected()) {
      return await MongooseUser.create(userData);
    }

    const newUser = {
      _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      createdAt: new Date(),
    };

    memoryUsers.push(newUser);
    return { ...newUser };
  }
}

export default UserModel;
