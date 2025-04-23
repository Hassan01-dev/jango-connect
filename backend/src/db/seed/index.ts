import mongoose from 'mongoose'
import dotenv from 'dotenv'

import User from '../../models/User'
import Friend from '../../models/Friend'
import Post from '../../models/Post'
import Comment from '../../models/Comment'
import Group from '../../models/Group'
import GroupMember from '../../models/GroupMember'
import Message from '../../models/Message'

dotenv.config()
const connectionString = process.env.ATLAS_URI || ''

const run = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(connectionString);
    console.log('MongoDB Connected');

    console.log('Deleting Exisitng Data...');
    await Promise.all([
      User.deleteMany({}),
      Friend.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Group.deleteMany({}),
      GroupMember.deleteMany({}),
      Message.deleteMany({})
    ]);

    console.log('Seeding Users...');
    const userData = [
      {
        username: 'jango',
        firstName: 'jango',
        lastName: 'dev',
        email: 'jango@dev.com',
        password: 'Jango123',
        bio: 'Jango dev'
      },
      {
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
        bio: 'Backend dev'
      },
      {
        username: 'jane_doe',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'Password123',
        bio: 'Frontend guru'
      },
      {
        username: 'sam_smith',
        firstName: 'Sam',
        lastName: 'Smith',
        email: 'sam@example.com',
        password: 'Password123',
        bio: 'Fullstack'
      },
      {
        username: 'alice_w',
        firstName: 'Alice',
        lastName: 'Wonder',
        email: 'alice@example.com',
        password: 'Password123',
        bio: 'UI/UX designer'
      },
      {
        username: 'bob_m',
        firstName: 'Bob',
        lastName: 'Marley',
        email: 'bob@example.com',
        password: 'Password123',
        bio: 'DevOps engineer'
      }
    ];
    const users = await Promise.all(userData.map(user => User.create(user)));

    console.log('Seeding Friends...');
    await Friend.insertMany([
      { user_1: users[0]._id, user_2: users[1]._id, status: 'accepted' },
      { user_1: users[0]._id, user_2: users[2]._id, status: 'pending' },
      { user_1: users[3]._id, user_2: users[0]._id, status: 'pending' },
      { user_1: users[4]._id, user_2: users[0]._id, status: 'pending' },
    ]);

    console.log('Seeding Posts...');
    const posts = await Post.insertMany([
      {
        user_id: users[0]._id,
        content: 'Just deployed my first backend API!',
        media: []
      },
      {
        user_id: users[1]._id,
        content: 'Check out this cool animation!',
        media: ['https://example.com/fun.gif']
      },
      {
        user_id: users[2]._id,
        content: 'Learning MongoDB today 🔥',
        media: []
      }
    ]);

    console.log('Seeding Comments...');
    await Comment.insertMany([
      {
        user_id: users[1]._id,
        post_id: posts[0]._id,
        content: 'Nice! Keep going!'
      },
      {
        user_id: users[0]._id,
        post_id: posts[1]._id,
        content: 'That animation is 🔥'
      }
    ]);

    console.log('Seeding Groups...');
    const group1 = await Group.create({
      name: 'JS Enthusiasts',
      description: 'Everything JavaScript!',
      createdBy: users[0]._id
    });

    const group2 = await Group.create({
      name: 'MongoDB Wizards',
      description: 'Talk NoSQL stuff',
      createdBy: users[2]._id
    });

    await GroupMember.insertMany([
      { group: group1._id, user: users[0]._id, role: 'admin' },
      { group: group1._id, user: users[1]._id },
      { group: group1._id, user: users[2]._id },

      { group: group2._id, user: users[2]._id, role: 'admin' },
      { group: group2._id, user: users[0]._id },
      { group: group2._id, user: users[3]._id },
      { group: group2._id, user: users[4]._id }
    ]);

    await Message.insertMany([
      {
        group: group1._id,
        user: users[1]._id,
        text: 'Hey team! What’s your favorite JS framework?',
        likes: [users[2]._id]
      },
      {
        group: group2._id,
        user: users[4]._id,
        text: 'I just discovered aggregation pipelines 😍'
      }
    ]);

    console.log('✅ Seed complete!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

run();
