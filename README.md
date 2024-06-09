TECHNOLOGIES
---------------
Frontend -> React

Backend -> Node.js, Express.js, bcrpyt, cookie-parser

Database -> MongoDB

FEATURES
--------------------
Users can sign up and log in to their accounts(passwords are encrypted). 
Once authenticated, they can post new tweets, like existing tweets, delete their own tweets, and comment on tweets. 
All tweets are displayed in a feed on the homepage, allowing users to see the latest posts from all users.

NPM PACKAGES
-----------------
You must paste these texts on the 'server' folder's terminal for starting this project:

1)
npm install
bcrypt
cookie-parser
cors
express
helmet
jsonwebtoken
mongoose
nodemon

2)
npm install dotenv --save-dev

.env
----------------
.env file connects app to the database. So create a .env file in the 'server' folder and add the id in below into the .env file.

id:

MONGO = mongodb+srv://BurakEmreBaha:um2Y3AJnsOcRXAOT@twitter-cluster.s4img8f.mongodb.net/?retryWrites=true&w=majority&appName=twitter-cluster


