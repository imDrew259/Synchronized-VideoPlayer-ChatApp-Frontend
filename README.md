# Synchronized-VideoPlayer-ChatApp-Frontend
Description of the project : On this web App new users can register by creating an account. Existing users can login using their credentials. After authentication user will land on a join room page. Here he/she has to enter room id and password. If a room with that id already exists then the password will be checked. If the entered password is correct then he/she will get connected in the room else error will be shown. Else if the room with that id doesn't exists then a new room with the given id and password will be created. Users having the room credentials can join in that room. They can chat with each other, watch any video using it's URL. The video will be in sync with all the users. If anyone pauses the video ; then the video will get paused for all the users. If someone seeks the video to a particular timestamp then the video will get seeked to that timestamp for all the users. Users can logout also.

Main features : 1.) Authentication(Login/signup) 2.) chatting feature. 3.) Keeping the user logged in for a period of time using JWT and cookies. 3.) playing video in sync with all the users. 4.) every room will be secured with a password. 5.) Also incorporated emojis feature to keep the chat interesting. i.e users can create emoji in chat box using their keyboard only Like when a user will send this " :) " in chat box it will automatically get converted to a smiley emoji.

Tech stacks and concepts:
1.) React - For creating the frontend of the project.
2.) Express - Creating the server.
3.) MongoDB - creating the database for our project
4.) Nodejs - For creating the backend
5.) Json WebToken - For creating the authToken for the logged in user.
6.) Cookies - Storing the authToken in the cookies so that the user does not have to login every time he visits the website.
7.) bcrypt js - For hashing the password before storing it in the database for security reasons.
8.) websocket - For creating the socket for the users to get connected with each other in a room. They can chat and share the video url they want to watch. When any user clicks on play, pause, or seeks the video to a timestamp then these instructions will be sent via websocket to all the users present in that room so that there video will also come in that condition.
9.) React player - For playing the video using url on frontend.
10.) Material UI - for creating beautiful frontend.
11.) react-emoji library - for creating emoji using keyboard keys.

Thought behind the project : Providing a platform on which friends can join in a room and can chat with each other and most importantly they can watch any video with each other and that also in sync.
