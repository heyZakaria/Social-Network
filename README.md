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


## Author Information

This project was developed as part of the Zone01Oujda intra module.  The original design and specifications were provided by the instructors. 
Made With Passion by : 
- [Omar Elhaouch](https://github.com/elhaouchomar)  
- [Zakaria Abdlali](https://github.com/heyZakaria)  
- [Houda Hdili](https://github.com/houdajeon)  
- [Mohamed Tawil](https://github.com/twlmed212)



## License
This project is licensed under a permissive free-use license. Anyone is welcome to use, modify, and distribute this code for any purpose, provided that the original authors are credited in any derivative works or distributions. Please retain attribution to the original contributors listed above.
