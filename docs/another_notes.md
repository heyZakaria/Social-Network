# socialNetwork
Social Network

### **1. Project Setup (0.5 day)**  
- Install and set up Next.js.  
- Understand folder structure (`pages`, `app`, `components`).  

### **2. Routing & Navigation (0.5 day)**  
- Learn **pages-based routing** (`app/page.js`, `app/user/page.js`).  
- Understand **dynamic routing** (`app/user/[id]/page.js`).  
- Implement **Link and useRouter** for navigation.  

### **3. Authentication UI (1 day)**  
- Build **login & register pages**.  
- Handle **form validation & API calls**.  
- Store **session state** in local storage or cookies.  

### **4. Fetching & Managing Data (1 day)**  
- Use `fetch()` or `useEffect()` for API calls.  
- Learn **Server-side rendering (SSR)** vs **Client-side rendering (CSR)**.  
- Implement **data fetching inside components**.  

### **5. User Profiles & Posts (1.5 days)**  
- Create **profile page** (`/user/[id]`).  
- Display **user info & posts**.  
- Implement **edit profile & post actions**.  

### **6. Groups & Follow System (1.5 days)**  
- Create **groups page** (`/groups`).  
- Implement **follow/unfollow buttons**.  
- Display **group members & invite system**.  

### **7. Real-time Chat & Notifications (2 days)**  
- Learn **WebSockets** with Next.js for live chat.  
- Implement **group chat & direct messaging** UI.  
- Create **notification logic**.  

### **8. Final Optimizations & Deployment (1 day)**  
- Optimize images with `next/image`.  
- Improve SEO with metadata.  
- Deploy on **Vercel**.

  ---------------------------------------------------------------------------

## **1. Project Setup (Day 1)**  
- Set up **Go modules** and folder structure (`handlers/`, `models/`, `routes/`, `middlewares/`).  
- Initialize database (PostgreSQL or MongoDB).  
- Connect backend to the database.  

---

## **2. Authentication & User Management (Day 2-3)**  
### **Endpoints**  
✅ **POST /register** → Create new user.  
✅ **POST /login** → Authenticate user and issue JWT.  
✅ **POST /logout** → Invalidate session.  
✅ **GET /profile/{id}** → Fetch user profile.  
✅ **PUT /profile/{id}** → Update profile details.  
✅ **PUT /profile/privacy** → Toggle public/private profile.  

### **Middlewares**  
🔹 **Auth Middleware** → Protect private routes (verify JWT).  
🔹 **Rate Limiter** → Prevent brute-force login attempts.  

---

## **3. Follow System (Day 4)**  
### **Endpoints**  
✅ **POST /follow/{id}** → Send follow request.  
✅ **POST /follow/{id}/accept** → Accept follow request.  
✅ **POST /follow/{id}/decline** → Decline follow request.  
✅ **DELETE /unfollow/{id}** → Unfollow a user.  
✅ **GET /followers/{id}** → Get list of followers.  
✅ **GET /following/{id}** → Get list of followed users.  

### **Middlewares**  
🔹 **Auth Middleware** → Only logged-in users can follow/unfollow.  

---

## **4. Posts & Comments (Day 5-6)**  
### **Endpoints**  
✅ **POST /posts** → Create a new post.  
✅ **GET /posts/{id}** → Fetch a specific post.  
✅ **GET /posts?user={id}** → Fetch posts by a user.  
✅ **GET /posts/feed** → Fetch posts from followed users.  
✅ **DELETE /posts/{id}** → Delete post (only owner).  
✅ **POST /posts/{id}/like** → Like a post.  
✅ **DELETE /posts/{id}/like** → Unlike a post.  
✅ **POST /posts/{id}/comment** → Comment on a post.  
✅ **DELETE /comments/{id}** → Delete comment (only owner).  

### **Middlewares**  
🔹 **Auth Middleware** → Only logged-in users can post/comment.  
🔹 **Permission Middleware** → Only post owners can edit/delete.  

---

## **5. Groups & Events (Day 7-8)**  
### **Endpoints**  
✅ **POST /groups** → Create a new group.  
✅ **GET /groups** → Fetch all groups.  
✅ **GET /groups/{id}** → Fetch group details.  
✅ **POST /groups/{id}/join** → Request to join a group.  
✅ **POST /groups/{id}/invite/{user_id}** → Invite user.  
✅ **POST /groups/{id}/accept/{user_id}** → Accept group request.  
✅ **DELETE /groups/{id}/leave** → Leave group.  
✅ **POST /groups/{id}/event** → Create an event.  
✅ **GET /groups/{id}/events** → Fetch group events.  
✅ **POST /groups/{id}/event/{event_id}/response** → RSVP to event.  

### **Middlewares**  
🔹 **Auth Middleware** → Only logged-in users can join groups.  
🔹 **Permission Middleware** → Only group owners can invite/kick members.  

---

## **6. WebSockets (Real-time Chat) (Day 9-10)**  
### **When to Implement WebSockets?**  
- After authentication and user system are working.  
- After the basic follow system is in place.  

### **Endpoints & WebSocket Events**  
✅ **WS /chat** → Connect to private messaging WebSocket.  
✅ **WS /groups/{id}/chat** → Connect to group chat WebSocket.  

**WebSocket Events:**  
📌 **"message"** → Send a message.  
📌 **"message_received"** → Broadcast received message.  
📌 **"user_typing"** → Notify when someone is typing.  
📌 **"new_notification"** → Send real-time notifications.  

---

## **7. Notifications System (Day 11-12)**  
### **Endpoints**  
✅ **GET /notifications** → Fetch user notifications.  
✅ **POST /notifications/mark-read** → Mark notifications as read.  

🔹 WebSockets will also push notifications (new messages, follow requests, event invites).  

### **Middlewares**  
🔹 **Auth Middleware** → Only authenticated users can access notifications.  

---

## **8. Final Optimization & Deployment (Day 13-14)**  
- Optimize database queries.  
- Add caching for frequently accessed data.  
- Deploy backend (VPS, DigitalOcean, AWS, or Fly.io).  
- Set up monitoring/logging.  