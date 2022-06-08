# handball-locater
A handball park locater for NYC


BASIC INSTALLATION AND USAGE

THE DATABASE BEING USED IS MONGO, INSTALL MONGO DB ON LOCAL SYSTEM

INSTALLATION FOR MAC

https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition

INSTALLATION FOR WINDOWS

https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/

BEFORE RUNNING APP ON A SERVER, SEED THE DATABASE FIRST WITH THE INDEX FILE IN 'seeds'
DIRECTORY

==> cd seeds
==> node index.js

MAPS WILL NOT DISPLAY WITHOUT USER TOKEN (NOT PROVIDED HERE)

SIGN UP W/MAPBOX 

https://www.mapbox.com/

CREATE A '.env' FILE IN ROOT FOLDER AND CREATE A VARIABLE W/ YOUR OWN MAPBOX TOKEN

THE VARIABLE IN '.env' SHOULD LOOK LIKE THIS: 

MAPBOX_TOKEN = 'your token here'

