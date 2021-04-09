import os, sys, requests, time, asyncio
from twitchio.ext import commands
from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration, PNReconnectionPolicy
from pubnub.pubnub_asyncio import PubNubAsyncio

# Based on https://dev.to/ninjabunny9000/let-s-make-a-twitch-bot-with-python-2nd8
# Using https://github.com/TwitchIO/TwitchIO/blob/master/twitchio/


class Bot(commands.Bot):
    def __init__(self, irc_token, client_id, nick, prefix, initial_channels):
        super().__init__(
            token=os.environ['TMI_TOKEN'],
            client_id=os.environ['CLIENT_ID'],
            nick=os.environ['BOT_NICK'],
            prefix=os.environ['BOT_PREFIX'],
            initial_channels=initial_channels
        )

    async def event_ready(self):
        print(f'Logged in as | {self.nick}')


    async def event_message(self, ctx):
        '''Runs every time a message is sent in chat'''
        if ctx.author.name.lower() in ["streamelements", "nightbot", "moobot", os.environ['BOT_NICK'].lower()]:
            return

        text = ctx.content.lower()
        if 'pog' in text:
            # Clean up text and form list of keywords
            # e.g. from "Man! That... is... POGGERSSS!!" -> ["man", "that", "is", "poggersss"]
            replace_chars = "\\`*_{}[](),>#+-.!?$"
            for c in replace_chars:
                if c in text:
                    text = text.replace(c, "")
            keywords = text.split(" ")

            # Form an ordered list of deduplicated tokens (duplicate letters get removed)
            # e.g. from ["man", "that", "is", "poggersss"] -> ["man", "tha", "is", "pogers"]
            deduped = [
                ''.join(list(dict.fromkeys(list(keyword)).keys()))
                for keyword in keywords
            ]

            # Form a list of tokens that match one of the valid keywords
            # e.g. ["man", "tha", "is", "pogers"] will match on the last one, and we return the value (poggers)
            pogs = list(
                set(
                    [VALID_POGS[k]
                        for k in deduped if k in list(VALID_POGS.keys())]
                )
            )

            # For each unique instance of a matched keyword, post them to the API
            if len(pogs) > 0:
                user = ctx.author.display_name
                print(pogs[0] + " from " + user + " in " + str(ctx.channel))
            try:
                for pog in pogs:
                    requests.post(
                        api_base + 'pogs', json={"channel": str(ctx.channel), "type": pog, "user": ctx.author.display_name})
            except Exception as ex:
                print(ex)


async def pubnub_handler():
    class message_callback(SubscribeCallback):
        def presence(self, pubnub, presence):
            pass  # handle incoming presence data

        def status(self, pubnub, status):
            if status.category == PNStatusCategory.PNUnexpectedDisconnectCategory:
                print("pubnub lost connection")
                pass

            elif status.category == PNStatusCategory.PNConnectedCategory:
                print("connected to pubnub")

            elif status.category == PNStatusCategory.PNReconnectedCategory:
                print("reconnected to pubnub")
                pass

            elif status.category == PNStatusCategory.PNDecryptionErrorCategory:
                print("pubnub decryption error")
                pass

        def message(self, pubnub, message):
            if message.message["cmd"] == "join":
                print("Joining " + message.message["value"])
                loop.create_task(bot.join_channels([message.message["value"]]))
            elif message.message["cmd"] == "part":
                print("Leaving " + message.message["value"])
                loop.create_task(bot.part_channels([message.message["value"]]))
            else:
                print("[Unknown PN Message]", message.message)

    pubnub.add_listener(message_callback())
    pubnub.subscribe().channels(pubnub_channel).execute()


# List of valid (de-duped) keywords to their correct words (e.g. poggerssss -> pogers maps to poggers)
VALID_POGS = {
    'pogcham': 'pogchamp',
    'pogu': 'pogu',
    'poger': 'poggers',
    'pogers': 'poggers',
    'pogerz': 'poggers',
    'pog': 'pog'
}


# API Configuration
api_base = os.environ['API_BASE']


# Get initial channels to join (if API call fails, use those defined in .env)
initial_channels = os.environ['TWITCH_CHANNELS'].split(',')
try:
    response = requests.get(url=api_base + 'channels/active')
except Exception as ex:
    print(ex)
else:
    if response.status_code == 200:
        initial_channels = response.json()["items"]
    else:
        print("API returned " + str(response.status_code) +
              " when trying to retrieve active channels!")
print("I will connect to these Twitch channels:", initial_channels)


# Twitch bot configuration
bot = Bot(
    irc_token=os.environ['TMI_TOKEN'],
    client_id=os.environ['CLIENT_ID'],
    nick=os.environ['BOT_NICK'],
    prefix=os.environ['BOT_PREFIX'],
    initial_channels=initial_channels
)

# PubNub Configuration
pubnub_channel = os.environ['PUBNUB_CHANNEL']
pnconfig = PNConfiguration()
pnconfig.publish_key = os.environ['PUBNUB_PUBLISH_KEY']
pnconfig.subscribe_key = os.environ['PUBNUB_SUBSCRIBE_KEY']
pnconfig.reconnect_policy = PNReconnectionPolicy.LINEAR
pnconfig.uuid = 'megapog-SUB'
pubnub = PubNubAsyncio(pnconfig)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(pubnub_handler())
    loop.run_until_complete(bot.run())
    loop.run_forever()
