# INTRA OUJDA MODULE: Social Network Project

## Project Overview

This project involves building a Facebook-like social network application using a combination of frontend (JavaScript) and backend (Go) technologies.  The application will feature core social networking functionalities, including user profiles, posts, groups, messaging, and notifications, all while incorporating best practices in software development, such as database migrations and Docker containerization. This README provides a comprehensive guide for understanding and contributing to the project.

## Project Purpose

The primary purpose of this project is to provide a hands-on learning experience in full-stack web development. Students will gain practical skills in:

* Frontend development using JavaScript frameworks (Next.js, Vue.js, Svelte, or Mithril are suggested).
* Backend development using Go, including server setup, database interaction, and API design.
* Database management using SQLite, including schema design and migrations.
* Containerization using Docker.
* Implementing authentication and authorization mechanisms using sessions and cookies.
* Real-time communication using WebSockets.

## Key Features and Implementation Details

This social network will include the following features:

**1. User Accounts & Authentication:**

*   Registration and login forms requiring email, password, first name, last name, and optional fields (date of birth, avatar, nickname, about me).
*   Session management using cookies to maintain user login status.
*   Password hashing using bcrypt for security.

**2. User Profiles:**

*   Public and private profile options, controlled by the user.
*   Display of user information (excluding password), activity, posts, followers, and following.

**3. Posts:**

*   Post creation with optional image/GIF uploads.
*   Three privacy levels: public, almost private (visible to followers), and private (visible to selected followers).
*   Commenting functionality.

**4. Groups:**

*   Group creation with title and description.
*   User invitation and request mechanisms.
*   Group-specific posts and comments.
*   Event creation within groups, allowing users to RSVP.

**5. Chat:**

*   Private messaging between users who are following each other or where the recipient has a public profile.  Real-time updates using WebSockets.
*   Emoji support.
*   Group chat functionality.

**6. Notifications:**

*   Notifications for following requests (private profiles), group invitations, group join requests, and group events.  Notifications will be displayed persistently across all pages.

**7. Followers:**

*   Follow/unfollow functionality.
*   Follow requests for private profiles.

**8. Technology Stack:**

*   **Frontend:** JavaScript (with a chosen framework: Next.js, Vue.js, Svelte, or Mithril). HTML, CSS.
*   **Backend:** Go.  Caddy (suggested) or custom web server.
*   **Database:** SQLite.
*   **Real-time Communication:** Gorilla WebSocket.
*   **Migrations:** golang-migrate (or similar).
*   **UUIDs:** gofrs/uuid or google/uuid.
*   **Image Handling:** Support for JPEG, PNG, and GIF.

**9. Dockerization:**

*   Separate Docker images for the frontend and backend.
*   Proper port exposure for communication between containers.

**10. Database Migrations:**

*   A structured migration system to manage database schema changes.


## Project Structure (Example)

```
.
├── README.md
├── backend
│   ├── Dockerfile
│   ├── LICENSE
│   ├── README.md
│   ├── auth
│   │   ├── cookies.go
│   │   ├── logic.go
│   │   ├── login.go
│   │   ├── logout.go
│   │   ├── model.go
│   │   ├── parsing.go
│   │   ├── register.go
│   │   ├── routes.go
│   │   ├── send_roken.go
│   │   ├── token.go
│   │   └── verify_token.go
│   ├── chat
│   │   ├── chat_group.go
│   │   ├── chat_personal.go
│   │   ├── get_history.go
│   │   ├── model.go
│   │   ├── queries.go
│   │   ├── routes.go
│   │   ├── web_socket.go
│   │   └── web_socket_listners.go
│   ├── cmd
│   │   └── main.go
│   ├── comments
│   │   ├── create_comment.go
│   │   ├── get_comments.go
│   │   ├── insert_comments.go
│   │   ├── models.go
│   │   └── routes.go
│   ├── db
│   │   ├── migration
│   │   │   ├── 000001_table_users.down.sql
│   │   │   ├── 000001_table_users.up.sql
│   │   │   ├── 000002_table_posts.down.sql
│   │   │   ├── 000002_table_posts.up.sql
│   │   │   ├── 000003_table_post_allowed.down.sql
│   │   │   ├── 000003_table_post_allowed.up.sql
│   │   │   ├── 000004_table_sessions.down.sql
│   │   │   ├── 000004_table_sessions.up.sql
│   │   │   ├── 000005_table_followers.down.sql
│   │   │   ├── 000005_table_followers.up.sql
│   │   │   ├── 000007_follow_requests.down.sql
│   │   │   ├── 000007_follow_requests.up.sql
│   │   │   ├── 000008_table_likes.down.sql
│   │   │   ├── 000008_table_likes.up.sql
│   │   │   ├── 000009_table_follow_relationships.down.sql
│   │   │   ├── 000009_table_follow_relationships.up.sql
│   │   │   ├── 000010_table_groups.down.sql
│   │   │   ├── 000010_table_groups.up.sql
│   │   │   ├── 000011_table_group_members.down.sql
│   │   │   ├── 000011_table_group_members.up.sql
│   │   │   ├── 000012_table_group_invites.down.sql
│   │   │   ├── 000012_table_group_invites.up.sql
│   │   │   ├── 000013_table_comments.down.sql
│   │   │   ├── 000014_table_notifications.down.sql
│   │   │   ├── 000014_table_notifications.up.sql
│   │   │   ├── 000015_table_chats.down.sql
│   │   │   ├── 000015_table_chats.up.sql
│   │   │   ├── 000016_table_group_chat.down.sql
│   │   │   ├── 000016_table_group_chat.up.sql
│   │   │   ├── 000017_follow_requests.down.sql
│   │   │   ├── 000017_follow_requests.up.sql
│   │   │   ├── 000018_table_event_presence.down.sql
│   │   │   ├── 000018_table_event_presence.up.sql
│   │   │   ├── 000019_table_events.down.sql
│   │   │   └── 000019_table_events.up.sql
│   │   └── sqlite
│   │       ├── database.db
│   │       └── sqlite.go
│   ├── events
│   │   ├── create_event.go
│   │   ├── event_presence.go
│   │   ├── get_events.go
│   │   └── model.go
│   ├── go.mod
│   ├── go.sum
│   ├── groups
│   │   ├── createGroup.go
│   │   ├── fetchGroups.go
│   │   ├── getFriendList.go
│   │   ├── getGroup.go
│   │   ├── getGroupMembers.go
│   │   ├── getInvite.go
│   │   ├── getPendingGroupInvites.go
│   │   ├── handleAdminApproveInvite.go
│   │   ├── handleInvite.go
│   │   ├── handleInviteResponse.go
│   │   ├── handleJoin.go
│   │   ├── models.go
│   │   └── routes.go
│   ├── groups_shared
│   │   ├── get_group_memebrs.go
│   │   └── model.go
│   ├── likes
│   │   ├── like_post.go
│   │   ├── model.go
│   │   └── routes.go
│   ├── logs
│   │   └── app.log
│   ├── middleware
│   │   ├── check_exist_user.go
│   │   └── enable_cors.go
│   ├── migrate
│   ├── notifications
│   │   ├── broad_cast_notification.go
│   │   ├── model.go
│   │   ├── save_notification.go
│   │   ├── send_notification.go
│   │   └── wsHandler.go
│   ├── posts
│   │   ├── create_post.go
│   │   ├── get_post.go
│   │   ├── insert_post.go
│   │   ├── model.go
│   │   ├── post_privacy.go
│   │   ├── posts_pagination.go
│   │   └── routes.go
│   ├── profile
│   │   ├── follow_requests.go
│   │   ├── follow_toggle.go
│   │   ├── friends_and_suggestions.go
│   │   ├── model.go
│   │   ├── profile_getters.go
│   │   ├── profile_status.go
│   │   ├── querys.go
│   │   └── routes.go
│   ├── profile_shared
│   │   ├── get_user_profile.go
│   │   └── model.go
│   ├── shared_packages
│   │   ├── groupValidation.go
│   │   └── set_context.go
│   ├── token
│   │   ├── get_token.go
│   │   ├── get_user_by_token.go
│   │   └── save_token_into_db.go
│   ├── uploads
│   │   ├── posts
│   │   │   ├── e586cc46-914e-49eb-af5d-39df0675d4e6.JPEG
│   │   │   ├── f76d9d10-8dd7-4162-8d2d-c7dcd3050226.JPEG
│   │   │   └── ...
│   │   └── profile_image
│   │       ├── bf0e7bf9-e5f7-4baf-ba73-a9552d6c3aaf.JPEG
│   │       ├── c346d359-26f5-4592-8fef-063c2e7ef23e.JPEG
│   │       └── ....
│   └── utils
│       ├── generate_chat_session_id.go
│       ├── handleImgUpload.go
│       ├── json_response.go
│       ├── logger.go
│       ├── rate_limit.go
│       └── upload_image.go
├── caddy
│   ├── Caddyfile
│   └── Dockerfile
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── README.md
│   ├── eslint.config.mjs
│   ├── jsconfig.json
│   ├── next.config.mjs
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── uploads
│   │   │   ├── background.webp
│   │   │   ├── comment
│   │   │   ├── groups_cover
│   │   │   ├── posts
│   │   │   ├── profile.jpeg
│   │   │   └── profile_images
│   │   ├── vercel.svg
│   │   └── window.svg
│   └── src
│       ├── app
│       │   ├── (auth)
│       │   ├── events
│       │   ├── favicon.ico
│       │   ├── friends
│       │   ├── groups
│       │   ├── layout.js
│       │   ├── not-found.jsx
│       │   ├── notifications
│       │   ├── page.js
│       │   └── profile
│       ├── components
│       │   ├── Group
│       │   ├── chat
│       │   ├── common
│       │   ├── events
│       │   ├── friends
│       │   ├── groups
│       │   ├── layout
│       │   ├── notifications
│       │   ├── posts
│       │   └── profile
│       ├── context
│       │   ├── fetchJson.jsx
│       │   ├── friends_context.jsx
│       │   ├── notifications-context.jsx
│       │   └── user_context.jsx
│       ├── hooks
│       │   ├── useFetch.js
│       │   ├── useFloatingChat.js
│       │   └── usePosts.js
│       ├── lib
│       │   ├── api
│       │   ├── mock-data.jsx
│       │   └── websocket
│       ├── middleware.jsx
│       └── styles
│           ├── GroupChat.module.css
│           ├── UpcomingEvents.module.css
│           ├── auth.module.css
│           ├── chat.module.css
│           ├── components.module.css
│           ├── emoji-picker.module.css
│           ├── events.module.css
│           ├── floating-chat.module.css
│           ├── friends.module.css
│           ├── globals.css
│           ├── groups.module.css
│           ├── home.module.css
│           ├── login.module.css
│           ├── modal.module.css
│           ├── navbar.module.css
│           ├── newEvent.module.css
│           ├── notifications.module.css
│           ├── posts.module.css
│           ├── profile.module.css
│           ├── register.module.css
│           └── sidebar.module.css
├── go.mod
└── test.text

```

## Author Information

This project was developed as part of the INTRA OUJDA module.  The original design and specifications were provided by the instructors. 
Made With Passion by : 
- [Omar Elhaouch](https://github.com/elhaouchomar)  
- [Zakaria Abdlali](https://github.com/heyZakaria)  
- [Houda Hdili](https://github.com/houdajeon)  
- [Mohamed Tawil](https://github.com/twlmed212)



## Contributing

Contributions are welcome! Please submit issues or pull requests through the appropriate channels.


## License
This project is licensed under a permissive free-use license. Anyone is welcome to use, modify, and distribute this code for any purpose, provided that the original authors are credited in any derivative works or distributions. Please retain attribution to the original contributors listed above.
