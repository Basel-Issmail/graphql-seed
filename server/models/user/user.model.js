import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    required: true,
  },
});

const Users = mongoose.model('users', userSchema);

export default Users;
