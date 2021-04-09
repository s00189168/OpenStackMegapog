# MegaPog

Keyword aggregation system for Twitch streams.

## Architecture

![MegaPog Architecture](docs/megapog.png)

## Pre-requisites

**PubNub account (publish/subscribe/secret keys)**

1. Sign up at https://dashboard.pubnub.com/signup
2. Log in and do the email verification process
3. Select "Other Messaging Use Cases" instead of "Chat App"
4. Click on Apps on the left-hand sidebar
5. Click on "Create new App" (red button on the right)
6. Enter a name and select "Other Messaging Use Cases"
7. Click on the app (might need to click twice) until you see the key set
8. Copy the publish key, subscribe AND secret into a notepad document or secret location (you'll need them later)

**Twitch account for the bot + OAuth login flow**

1. Sign up at twitch.tv
2. Log in and do the email verification process
3. Enable two-factor authentication: https://www.twitch.tv/settings/security (needed to create a Twitch Application)
4. Go to https://dev.twitch.tv/
5. Log in with your Twitch account
6. Go to https://dev.twitch.tv/console/apps/create to create an application
7. Set a name, choose http://localhost as the OAuth redirect (unless you are hosting it on a domain) + choose "Website" as the Category
8. Click on "Manage" (or click on the application name) to view the settings
9. Click on "New Secret" at the bottom (and accept)
10. Copy the client_id AND secret to notepad or a secure location (you'll need this later on for the chatbot and the OAuth mechanism)
11. Go to https://twitchapps.com/tmi/
12. Click connect and copy the TMI token (starting with `oauth:`) to the same document

## Components

- MongoDB
- Twitch chatbot
- Server (API)
- Web App (with Twitch auth and statistics)

## MongoDB

Install locally

Once you start receiving data consider adding the following indexes to improve performance:

- pogs.channel
- pogs.type

Consider using Robo 3T to explore the database locally.

## Chatbot

**Install**

- `cd chatbot`
- `sudo pip install pipenv` (or pip3) (sudo apt install python3-pip if you don't have pip)
- `pipenv --python 3.8` (or 3.6 or 3.7)
- `pipenv install`

Configuration:

- Create a copy of the .env.dist file and name it .env
- Fill in the variables based on the examples/comments in the file
- You'll need to enter the Twitch channel name + client_id + TMI mentioned in the 'Pre-requisites' section above

### Run

- `cd chatbot`
- `pipenv run python main.py`

## Server (API)

**Build**

- `cd server`
- `npm install`

**Run**

- `npm start`

## Web App

The project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

Change directory using `cd webapp` before running any of the commands below.

**Development server**

- Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
- The app will automatically reload if you change any of the source files.

**Code scaffolding**

- Run `ng generate component component-name` to generate a new component.
- You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

**Build**

- Run `npm install` to install node modules.
- Run `ng build` (or `npm run build`) to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

**Unit Tests**

- Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

**End-to-end Tests**

- Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
