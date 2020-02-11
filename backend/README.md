# Server README

## Requirements

Must have `npm`, `nodejs` (or `node`... I can't remember) installed.

Install the packages in `packages.json` by running `npm install`.

If for some reason the packages do not install you can run the following commands:
```
npm install express
npm install cors
npm install mongoose
```

## SSH into the server

Assuming you have the `.pem` file, make sure that it is *read* only. 

```
chmod 400 ~/.ssh/<filename>.pem
```

Connect to the server instance. We can use either the Public DNS or the IPv4 Public IP.  
I was reading that it's *generally* better practice to use the Public DNS, but it doesn't really matter.

```
ssh -i ~/.ssh/<filename>.pem ubuntu@<PUBLIC_DNS>

OR

ssh -i ~/.ssh/<filename>.pem ubuntu@<IPv4 Public IP>
```

## Copying files to EC2 instance

We can use git to get files on the ec2 instance (i.e. `git pull`) to get the files. But sometimes we don't want all the files on the instance. `scp` has entered the chat.

Similar to `cp` we can copy specific files or directories over a network. Use the `-r` flag if you want to copy a directory.

```
scp -i ~/.ssh/<filename>.pem /directory/to/copy ubuntu@<PUBLIC_DNS>:path/to/directory
```

## Running the server

```
node server.js
```

If run locally go to `localhost:3000` browser to see the output.  
If running on the ec2 instance go to `<PUBLIC_DNS>:3000` in browser to see the output.

# Production Server

Production Server: [http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com](http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com)

## Refresh Production Build

First ssh into the server as detailed above. Then `cd /var/www/Role-Roulette` to enter the project directory.

Next, enter the command `sudo git pull` to get the latest changes that were pushed to the master branch.

Now with the latest changes run `sudo npm install` in the root, backend, and client directories to update the dependencies. 
Note: You must do each install individually, our scripts didn't seem to want to work on the EC2 instance.

In the client directory you must now run `sudo npm run build` and with that the production server will be updated with our changes from master.

The last portion is simply the running and management of the server which is done using pm2.
At this point the server should still be running, but to go check on it, go to the backend directory and enter `pm2 list` to see the status of the server.

Other helpful pm2 commands are:
```
pm2 start server.js
pm2 restart server.js
pm2 reload server.js
pm2 stop server.js
pm2 delete server.js
```

# Mongo Atlas DB information
temporary admin account:
User: admin
password: comp4350password

Connection String:
mongodb+srv://admin:<password>@cluster0-cw337.mongodb.net/test?retryWrites=true&w=majority

Full Driver Example:

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:<password>@cluster0-cw337.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

Note: Must log in to Mongo Atlas and add your IP address under Network Security, or else the connection will be denied.