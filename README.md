Hello all! Thanks for visiting this repo.

First step is to check the .env.example file to create a .env file with all the required fields.

Second step, make sure Docker is installed and running on you machine, if you do not wish to run Docker see Other Start Up Option.

Step Three, run `npm run dev` and Docker will start building the image, download the MySQL image, configure the database, and then start the server.

Step Four, potentially, sometimes the database takes a bit longer to actually start up and the server will try to connect before its ready. To resolve this just run `docker ps` then grab the ID of the api and then run `docker restart <id>`.

Other Start Up Option: Change the database URL to any other MySQL datebase you would like to use then run `npm run local:dev`. Then to set up the database,  in a second terminal window, run `npx prisma migrate deploy && npx prisma generate`. Then run `npx prisma studio`.

From there you will be able to access the site on `localhost:3000` and the Prisma Studio tool on `localhost:5555` to access the database.

To see the live version of the site visit [the-blogg.vercel.app](https://the-blogg.vercel.app/)

Again thanks for visiting!
