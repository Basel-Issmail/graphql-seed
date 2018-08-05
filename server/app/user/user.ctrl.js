import Users from './user.model';

const getAllUsers = () => Users.find();

const searchUsers = input => Users.find({ name: new RegExp(input.name, 'i') });

export { getAllUsers, searchUsers };
