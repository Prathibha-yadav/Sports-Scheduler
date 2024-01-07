# Sports Scheduler - Project Overview
Live Application Link: [Sports Scheduler](#) *(https://capstone-sports-scheduler.onrender.com)*
Welcome to the Sports Scheduler repository! This sports management application is designed to empower admins, players, and users to seamlessly create and manage sports sessions. Below are the detailed features and functionalities of the application:

## Admin Functionality

### 1. Create and Manage Sports

- Admins can create sports, providing a name for each sport.
- Signed-in admins can view a list of sports they have created and create new sports.

### 2. Sport Sessions

- Admins can create and join sport sessions, similar to regular players.
- During sport session creation, admins can specify details such as date, time, venue, and participating players.
- Access to reports showing the number of sessions played within a configurable time period.

## Player Functionality

### 1. Account Management

- Players can sign up by providing their name, email address, and a password.
- Existing players can sign in using their email and password.
- Players have the option to sign out.

### 2. Sport Session Participation

- Signed-in players can create a new sport session, detailing sports, team players, and session specifics.
- Players can view existing session details created by others and join these sessions.
- Session participation marks the player's name against a slot, visible to others.
- Separate display for sessions joined by the player.
- Players who create a session can cancel it, providing a reason for cancellation.

## Getting Started

To get started with the Sports Scheduler application:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Configure the necessary environment variables.
4. Run the application with `npm start`.
