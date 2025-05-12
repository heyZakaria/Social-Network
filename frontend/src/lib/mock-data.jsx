// Mock database for our social network
// In a real application, this would be replaced with actual database calls

// Users collection
const users = [
  {
    id: 1,
    email: "john@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-05-15",
    nickname: "JD",
    aboutMe: "Software developer and hiking enthusiast",
    avatar: "https://i.pravatar.cc/150?u=100",
    isPublic: true,
    followers: [2, 3],
    following: [2],
    createdAt: "2023-01-15T08:30:00Z",
  },
  {
    id: 2,
    email: "jane@example.com",
    password: "password123",
    firstName: "Jane",
    lastName: "Smith",
    dateOfBirth: "1992-08-22",
    nickname: "JSmith",
    aboutMe: "Photographer and travel lover",
    avatar: "https://i.pravatar.cc/150?u=100",
    isPublic: true,
    followers: [1, 3],
    following: [1, 3],
    createdAt: "2023-01-20T10:15:00Z",
  },
  {
    id: 3,
    email: "mike@example.com",
    password: "password123",
    firstName: "Mike",
    lastName: "Johnson",
    dateOfBirth: "1988-11-07",
    nickname: "MJ",
    aboutMe: "Music producer and coffee addict",
    avatar: "https://i.pravatar.cc/150?u=100",
    isPublic: false,
    followers: [2],
    following: [1, 2],
    createdAt: "2023-02-05T14:45:00Z",
  },
  {
    id: 4,
    email: "sarah@example.com",
    password: "password123",
    firstName: "Sarah",
    lastName: "Williams",
    dateOfBirth: "1995-03-18",
    nickname: "SarahW",
    aboutMe: "Graphic designer and plant mom",
    avatar: "https://i.pravatar.cc/150?u=100",
    isPublic: true,
    followers: [],
    following: [],
    createdAt: "2023-02-10T09:20:00Z",
  },
  {
    id: 5,
    email: "alex@example.com",
    password: "password123",
    firstName: "Alex",
    lastName: "Brown",
    dateOfBirth: "1991-07-29",
    nickname: "AlexB",
    aboutMe: "Fitness trainer and nutrition expert",
    avatar: "https://i.pravatar.cc/150?u=100",
    isPublic: false,
    followers: [],
    following: [],
    createdAt: "2023-02-15T16:10:00Z",
  },
];

// Posts collection
const posts = [
  {
    id: 1,
    userId: 1,
    content:
      "Just finished a 10-mile hike in the mountains. The views were breathtaking! 🏔️",
    image:
      "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
    privacy: "public",
    likes: [2, 3],
    createdAt: "2023-03-10T11:30:00Z",
  },
  {
    id: 2,
    userId: 2,
    content:
      "Check out this amazing sunset I captured yesterday evening. #photography #sunset",
    image:
      "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
    privacy: "public",
    likes: [1, 3],
    createdAt: "2023-03-12T18:45:00Z",
  },
  {
    id: 3,
    userId: 3,
    content: "Just released a new track! Link in bio. #music #newrelease",
    image:
      "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
    privacy: "followers",
    likes: [2],
    createdAt: "2023-03-15T20:15:00Z",
  },
  {
    id: 4,
    userId: 1,
    content: "Working on a new project. Can't wait to share it with you all!",
    image: null,
    privacy: "public",
    likes: [2],
    createdAt: "2023-03-18T09:20:00Z",
  },
  {
    id: 5,
    userId: 2,
    content: "Exploring the city today. Found this hidden gem of a café.",
    image:
      "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
    privacy: "followers",
    likes: [1],
    createdAt: "2023-03-20T14:10:00Z",
  },
];

// Comments collection
const comments = [
  {
    id: 1,
    postId: 1,
    userId: 2,
    content: "Wow, that looks amazing! Which trail was this?",
    createdAt: "2023-03-10T12:15:00Z",
  },
  {
    id: 2,
    postId: 1,
    userId: 3,
    content: "Incredible views! I need to go hiking more often.",
    createdAt: "2023-03-10T13:30:00Z",
  },
  {
    id: 3,
    postId: 2,
    userId: 1,
    content: "Beautiful capture! What camera do you use?",
    createdAt: "2023-03-12T19:20:00Z",
  },
  {
    id: 4,
    postId: 3,
    userId: 2,
    content: "Just listened to it. Absolute fire! 🔥",
    createdAt: "2023-03-15T21:05:00Z",
  },
];

// Groups collection
const groups = [
  {
    id: 1,
    name: "Photography Enthusiasts",
    description:
      "A group for sharing photography tips, tricks, and amazing shots!",
    image:
      "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
    creatorId: 2,
    members: [1, 2, 3],
    createdAt: "2023-02-25T10:00:00Z",
  },
  {
    id: 2,
    name: "Hiking Adventures",
    description: "For those who love exploring trails and mountains.",
    image:
      "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
    creatorId: 1,
    members: [1, 2],
    createdAt: "2023-03-01T15:30:00Z",
  },
  {
    id: 3,
    name: "Music Producers",
    description: "Share your tracks, get feedback, and collaborate!",
    image:
      "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
    creatorId: 3,
    members: [3],
    createdAt: "2023-03-05T18:45:00Z",
  },
];

// Group posts
const groupPosts = [
  {
    id: 1,
    groupId: 1,
    userId: 2,
    content:
      "Here's a composition technique I've been experimenting with lately. Thoughts?",
    image:
      "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
    likes: [1, 3],
    createdAt: "2023-03-08T14:20:00Z",
  },
  {
    id: 2,
    groupId: 2,
    userId: 1,
    content: "Planning a group hike next weekend. Who's interested?",
    image: null,
    likes: [2],
    createdAt: "2023-03-15T09:10:00Z",
  },
];

// Group events
const events = [
  {
    id: 1,
    groupId: 1,
    creatorId: 2,
    title: "Photography Workshop",
    description: "Learn advanced composition techniques and editing skills.",
    dateTime: "2023-04-15T14:00:00Z",
    location: "Central Park",
    attendees: {
      going: [1, 3],
      notGoing: [2],
    },
    createdAt: "2023-03-20T11:30:00Z",
  },
  {
    id: 2,
    groupId: 2,
    creatorId: 1,
    title: "Weekend Hike",
    description: "Moderate difficulty, 8-mile trail with beautiful views.",
    dateTime: "2023-04-22T09:00:00Z",
    location: "Mountain Ridge Trail",
    attendees: {
      going: [2],
      notGoing: [],
    },
    createdAt: "2023-03-25T16:45:00Z",
  },
];

// Follow requests
const followRequests = [
  {
    id: 1,
    fromUserId: 4,
    toUserId: 3,
    status: "pending", // pending, accepted, declined
    createdAt: "2023-03-22T10:15:00Z",
  },
  {
    id: 2,
    fromUserId: 5,
    toUserId: 3,
    status: "pending",
    createdAt: "2023-03-23T14:30:00Z",
  },
];

// Group invitations and requests
const groupInvitations = [
  {
    id: 1,
    groupId: 1,
    fromUserId: 2,
    toUserId: 4,
    type: "invitation", // invitation, request
    status: "pending", // pending, accepted, declined
    createdAt: "2023-03-24T09:45:00Z",
  },
  {
    id: 2,
    groupId: 3,
    fromUserId: 5,
    toUserId: 3,
    type: "request",
    status: "pending",
    createdAt: "2023-03-25T11:20:00Z",
  },
];

// Messages
const messages = [
  {
    id: 1,
    fromUserId: 1,
    toUserId: 2,
    content: "Hey Jane, how's your photography project coming along?",
    read: true,
    createdAt: "2023-03-26T10:30:00Z",
  },
  {
    id: 2,
    fromUserId: 2,
    toUserId: 1,
    content: "It's going great! I'll share some previews with you soon.",
    read: true,
    createdAt: "2023-03-26T10:35:00Z",
  },
  {
    id: 3,
    fromUserId: 3,
    toUserId: 2,
    content: "Jane, could you give me feedback on my latest track?",
    read: false,
    createdAt: "2023-03-26T15:20:00Z",
  },
];

// Group messages
const groupMessages = [
  {
    id: 1,
    groupId: 1,
    userId: 2,
    content: "Welcome everyone to the Photography Enthusiasts group!",
    createdAt: "2023-02-25T10:15:00Z",
  },
  {
    id: 2,
    groupId: 1,
    userId: 1,
    content:
      "Thanks for creating this group, Jane! Looking forward to learning from everyone.",
    createdAt: "2023-02-25T10:20:00Z",
  },
  {
    id: 3,
    groupId: 2,
    userId: 1,
    content: "Hey hikers! Let's plan our first group adventure.",
    createdAt: "2023-03-01T15:45:00Z",
  },
];

// Notifications
const notifications = [
  {
    id: 1,
    userId: 3,
    type: "follow_request",
    content: "Sarah Williams sent you a follow request",
    relatedId: 1, // ID of the follow request
    read: false,
    createdAt: "2023-03-22T10:15:00Z",
  },
  {
    id: 2,
    userId: 3,
    type: "follow_request",
    content: "Alex Brown sent you a follow request",
    relatedId: 2,
    read: false,
    createdAt: "2023-03-23T14:30:00Z",
  },
  {
    id: 3,
    userId: 4,
    type: "group_invitation",
    content: "Jane Smith invited you to join Photography Enthusiasts",
    relatedId: 1,
    read: false,
    createdAt: "2023-03-24T09:45:00Z",
  },
  {
    id: 4,
    userId: 3,
    type: "group_request",
    content: "Alex Brown requested to join Music Producers",
    relatedId: 2,
    read: false,
    createdAt: "2023-03-25T11:20:00Z",
  },
  {
    id: 5,
    userId: 1,
    type: "group_event",
    content: "New event in Hiking Adventures: Weekend Hike",
    relatedId: 2,
    read: false,
    createdAt: "2023-03-25T16:45:00Z",
  },
  {
    id: 6,
    userId: 3,
    type: "group_event",
    content: "New event in Photography Enthusiasts: Photography Workshop",
    relatedId: 1,
    read: false,
    createdAt: "2023-03-20T11:30:00Z",
  },
];

// Sessions (for authentication)
const sessions = {};

// Helper functions to simulate database operations
const db = {
  // User operations
  users: {
    findByEmail: (email) => {
      return users.find((user) => user.email === email);
    },
    findById: (id) => {
      return users.find((user) => user.id === id);
    },
    create: (userData) => {
      const newUser = {
        id: users.length + 1,
        ...userData,
        followers: [],
        following: [],
        isPublic: true,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      return newUser;
    },
    update: (id, userData) => {
      const index = users.findIndex((user) => user.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...userData };
        return users[index];
      }
      return null;
    },
    getFollowers: (userId) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return [];
      return users.filter((u) => user.followers.includes(u.id));
    },
    getFollowing: (userId) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return [];
      return users.filter((u) => user.following.includes(u.id));
    },
    toggleFollow: (followerId, followingId) => {
      const follower = users.find((u) => u.id === followerId);
      const following = users.find((u) => u.id === followingId);

      if (!follower || !following) return false;

      // Check if already following
      const isFollowing = follower.following.includes(followingId);

      if (isFollowing) {
        // Unfollow
        follower.following = follower.following.filter(
          (id) => id !== followingId
        );
        following.followers = following.followers.filter(
          (id) => id !== followerId
        );
      } else {
        // Follow
        follower.following.push(followingId);
        following.followers.push(followerId);
      }

      return !isFollowing; // Return true if now following, false if unfollowed
    },
    getSuggestions: (userId) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return [];

      // Get users that the current user is not following
      return users
        .filter((u) => u.id !== userId && !user.following.includes(u.id))
        .slice(0, 5); // Limit to 5 suggestions
    },
  },

  // Post operations
  posts: {
    findById: (id) => {
      return posts.find((post) => post.id === id);
    },
    findByUserId: (userId) => {
      return posts.filter((post) => post.userId === userId);
    },
    create: (postData) => {
      const newPost = {
        id: posts.length + 1,
        ...postData,
        likes: [],
        createdAt: new Date().toISOString(),
      };
      posts.push(newPost);
      return newPost;
    },
    update: (id, postData) => {
      const index = posts.findIndex((post) => post.id === id);
      if (index !== -1) {
        posts[index] = { ...posts[index], ...postData };
        return posts[index];
      }
      return null;
    },
    delete: (id) => {
      const index = posts.findIndex((post) => post.id === id);
      if (index !== -1) {
        posts.splice(index, 1);
        return true;
      }
      return false;
    },
    getFeed: (userId) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return [];

      // Get posts from users that the current user is following and public posts
      return posts
        .filter(
          (post) =>
            // Include user's own posts
            post.userId === userId ||
            // Include public posts
            post.privacy === "public" ||
            // Include posts from users the current user is following if they're marked for followers
            (user.following.includes(post.userId) &&
              post.privacy === "followers") ||
            // Include private posts where the user is specifically included (not implemented in this mock)
            (post.privacy === "private" &&
              post.visibleTo &&
              post.visibleTo.includes(userId))
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date, newest first
    },
    toggleLike: (postId, userId) => {
      const post = posts.find((p) => p.id === postId);
      if (!post) return false;

      const isLiked = post.likes.includes(userId);

      if (isLiked) {
        post.likes = post.likes.filter((id) => id !== userId);
      } else {
        post.likes.push(userId);
      }

      return !isLiked; // Return true if now liked, false if unliked
    },
  },

  // Comment operations
  comments: {
    findByPostId: (postId) => {
      return comments.filter((comment) => comment.postId === postId);
    },
    create: (commentData) => {
      const newComment = {
        id: comments.length + 1,
        ...commentData,
        createdAt: new Date().toISOString(),
      };
      comments.push(newComment);
      return newComment;
    },
    delete: (id) => {
      const index = comments.findIndex((comment) => comment.id === id);
      if (index !== -1) {
        comments.splice(index, 1);
        return true;
      }
      return false;
    },
  },

  // Group operations
  groups: {
    findById: (id) => {
      return groups.find((group) => group.id === id);
    },
    findAll: () => {
      return groups;
    },
    findByMemberId: (userId) => {
      return groups.filter((group) => group.members.includes(userId));
    },
    create: (groupData) => {
      const newGroup = {
        id: groups.length + 1,
        ...groupData,
        members: [groupData.creatorId], // Creator is automatically a member
        createdAt: new Date().toISOString(),
      };
      groups.push(newGroup);
      return newGroup;
    },
    update: (id, groupData) => {
      const index = groups.findIndex((group) => group.id === id);
      if (index !== -1) {
        groups[index] = { ...groups[index], ...groupData };
        return groups[index];
      }
      return null;
    },
    addMember: (groupId, userId) => {
      const group = groups.find((g) => g.id === groupId);
      if (!group) return false;

      if (!group.members.includes(userId)) {
        group.members.push(userId);
        return true;
      }
      return false;
    },
    removeMember: (groupId, userId) => {
      const group = groups.find((g) => g.id === groupId);
      if (!group) return false;

      if (group.members.includes(userId)) {
        group.members = group.members.filter((id) => id !== userId);
        return true;
      }
      return false;
    },
    getSuggestions: (userId) => {
      const userGroups = groups
        .filter((g) => g.members.includes(userId))
        .map((g) => g.id);
      return groups.filter((g) => !userGroups.includes(g.id)).slice(0, 3); // Limit to 3 suggestions
    },
  },

  // Group posts
  groupPosts: {
    findByGroupId: (groupId) => {
      return groupPosts.filter((post) => post.groupId === groupId);
    },
    create: (postData) => {
      const newPost = {
        id: groupPosts.length + 1,
        ...postData,
        likes: [],
        createdAt: new Date().toISOString(),
      };
      groupPosts.push(newPost);
      return newPost;
    },
    delete: (id) => {
      const index = groupPosts.findIndex((post) => post.id === id);
      if (index !== -1) {
        groupPosts.splice(index, 1);
        return true;
      }
      return false;
    },
    toggleLike: (postId, userId) => {
      const post = groupPosts.find((p) => p.id === postId);
      if (!post) return false;

      const isLiked = post.likes.includes(userId);

      if (isLiked) {
        post.likes = post.likes.filter((id) => id !== userId);
      } else {
        post.likes.push(userId);
      }

      return !isLiked;
    },
  },

  // Events
  events: {
    findByGroupId: (groupId) => {
      return events.filter((event) => event.groupId === groupId);
    },
    create: (eventData) => {
      const newEvent = {
        id: events.length + 1,
        ...eventData,
        attendees: { going: [], notGoing: [] },
        createdAt: new Date().toISOString(),
      };
      events.push(newEvent);

      // Create notifications for all group members
      const group = groups.find((g) => g.id === eventData.groupId);
      if (group) {
        group.members.forEach((memberId) => {
          if (memberId !== eventData.creatorId) {
            // Don't notify the creator
            db.notifications.create({
              userId: memberId,
              type: "group_event",
              content: `New event in ${group.name}: ${newEvent.title}`,
              relatedId: newEvent.id,
            });
          }
        });
      }

      return newEvent;
    },
    updateAttendance: (eventId, userId, status) => {
      const event = events.find((e) => e.id === eventId);
      if (!event) return false;

      // Remove from both lists first
      event.attendees.going = event.attendees.going.filter(
        (id) => id !== userId
      );
      event.attendees.notGoing = event.attendees.notGoing.filter(
        (id) => id !== userId
      );

      // Add to the appropriate list
      if (status === "going") {
        event.attendees.going.push(userId);
      } else if (status === "notGoing") {
        event.attendees.notGoing.push(userId);
      }

      return true;
    },
  },

  // Follow requests
  followRequests: {
    findByToUserId: (userId) => {
      return followRequests.filter(
        (req) => req.toUserId === userId && req.status === "pending"
      );
    },
    create: (requestData) => {
      // Check if the target user has a public profile
      const targetUser = users.find((u) => u.id === requestData.toUserId);

      if (targetUser.isPublic) {
        // If public, automatically follow
        db.users.toggleFollow(requestData.fromUserId, requestData.toUserId);
        return { autoAccepted: true };
      }

      // Otherwise create a follow request
      const newRequest = {
        id: followRequests.length + 1,
        ...requestData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      followRequests.push(newRequest);

      // Create notification
      db.notifications.create({
        userId: requestData.toUserId,
        type: "follow_request",
        content: `${
          users.find((u) => u.id === requestData.fromUserId)?.firstName
        } ${
          users.find((u) => u.id === requestData.fromUserId)?.lastName
        } sent you a follow request`,
        relatedId: newRequest.id,
      });

      return newRequest;
    },
    updateStatus: (id, status) => {
      const index = followRequests.findIndex((req) => req.id === id);
      if (index !== -1) {
        followRequests[index].status = status;

        // If accepted, update followers/following
        if (status === "accepted") {
          const request = followRequests[index];
          db.users.toggleFollow(request.fromUserId, request.toUserId);
        }

        return followRequests[index];
      }
      return null;
    },
  },

  // Group invitations and requests
  groupInvitations: {
    findByUserId: (userId) => {
      return groupInvitations.filter(
        (inv) =>
          (inv.toUserId === userId && inv.type === "invitation") ||
          (inv.fromUserId === userId && inv.type === "request")
      );
    },
    findByGroupCreator: (userId) => {
      // Find groups where user is creator
      const creatorGroups = groups
        .filter((g) => g.creatorId === userId)
        .map((g) => g.id);

      // Find requests to join those groups
      return groupInvitations.filter(
        (inv) =>
          creatorGroups.includes(inv.groupId) &&
          inv.type === "request" &&
          inv.status === "pending"
      );
    },
    create: (invitationData) => {
      const newInvitation = {
        id: groupInvitations.length + 1,
        ...invitationData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      groupInvitations.push(newInvitation);

      // Create notification
      if (invitationData.type === "invitation") {
        const group = groups.find((g) => g.id === invitationData.groupId);
        db.notifications.create({
          userId: invitationData.toUserId,
          type: "group_invitation",
          content: `${
            users.find((u) => u.id === invitationData.fromUserId)?.firstName
          } invited you to join ${group?.name}`,
          relatedId: newInvitation.id,
        });
      } else if (invitationData.type === "request") {
        const group = groups.find((g) => g.id === invitationData.groupId);
        db.notifications.create({
          userId: group.creatorId,
          type: "group_request",
          content: `${
            users.find((u) => u.id === invitationData.fromUserId)?.firstName
          } requested to join ${group?.name}`,
          relatedId: newInvitation.id,
        });
      }

      return newInvitation;
    },
    updateStatus: (id, status) => {
      const index = groupInvitations.findIndex((inv) => inv.id === id);
      if (index !== -1) {
        groupInvitations[index].status = status;

        // If accepted, add user to group
        if (status === "accepted") {
          const invitation = groupInvitations[index];
          const userId =
            invitation.type === "invitation"
              ? invitation.toUserId
              : invitation.fromUserId;
          db.groups.addMember(invitation.groupId, userId);
        }

        return groupInvitations[index];
      }
      return null;
    },
  },

  // Messages
  messages: {
    findConversation: (user1Id, user2Id) => {
      return messages
        .filter(
          (msg) =>
            (msg.fromUserId === user1Id && msg.toUserId === user2Id) ||
            (msg.fromUserId === user2Id && msg.toUserId === user1Id)
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
    create: (messageData) => {
      const newMessage = {
        id: messages.length + 1,
        ...messageData,
        read: false,
        createdAt: new Date().toISOString(),
      };
      messages.push(newMessage);
      return newMessage;
    },
    markAsRead: (messageId) => {
      const index = messages.findIndex((msg) => msg.id === messageId);
      if (index !== -1) {
        messages[index].read = true;
        return true;
      }
      return false;
    },
    getUnreadCount: (userId) => {
      return messages.filter((msg) => msg.toUserId === userId && !msg.read)
        .length;
    },
  },

  // Group messages
  groupMessages: {
    findByGroupId: (groupId) => {
      return groupMessages
        .filter((msg) => msg.groupId === groupId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
    create: (messageData) => {
      const newMessage = {
        id: groupMessages.length + 1,
        ...messageData,
        createdAt: new Date().toISOString(),
      };
      groupMessages.push(newMessage);
      return newMessage;
    },
  },

  // Notifications
  notifications: {
    findByUserId: (userId) => {
      return notifications
        .filter((notif) => notif.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    create: (notificationData) => {
      const newNotification = {
        id: notifications.length + 1,
        ...notificationData,
        read: false,
        createdAt: new Date().toISOString(),
      };
      notifications.push(newNotification);
      return newNotification;
    },
    markAsRead: (id) => {
      const index = notifications.findIndex((notif) => notif.id === id);
      if (index !== -1) {
        notifications[index].read = true;
        return true;
      }
      return false;
    },
    markAllAsRead: (userId) => {
      notifications.forEach((notif, index) => {
        if (notif.userId === userId) {
          notifications[index].read = true;
        }
      });
      return true;
    },
    getUnreadCount: (userId) => {
      return notifications.filter(
        (notif) => notif.userId === userId && !notif.read
      ).length;
    },
  },

  // Sessions
  sessions: {
    create: (userId) => {
      const sessionId = Math.random().toString(36).substring(2, 15);
      sessions[sessionId] = {
        userId,
        createdAt: new Date().toISOString(),
      };
      return sessionId;
    },
    get: (sessionId) => {
      return sessions[sessionId];
    },
    delete: (sessionId) => {
      delete sessions[sessionId];
      return true;
    },
  },
};

export default db;
