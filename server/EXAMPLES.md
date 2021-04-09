## Pogs

**GET GLOBAL POGS:**
`curl -X GET http://localhost:3000/pogs`

- Optional parameters: ?since=1614088800000&until=1614096000000
- Default parameters: since=1 month ago

```
{
    "totals": {
        "pogu": 1,
        "pog": 3,
        "pogchamp": 2
    },
    "timeseries": {
        "2021-02-23": {
            "pogu": 1,
            "pog": 3,
            "pogchamp": 2
        }
    }
}
```

**GET POGS FOR A CHANNEL:**
`curl -X GET http://localhost:3000/pogs/:channel`

- Same as previous, but restricted to a specific channel

`curl -X GET http://localhost:3000/pogs/:channel/list`

- Optional parameters: ?since=1614088800000&until=1614096000000&limit=2&skip=1
- Default parameters: limit=20, skip=0, since=1 month ago

```
{
    "count": 5,
    "items": [
        {
            "id": "603519864c493e9807bc94a9",
            "channel": "xyz",
            "createdAt": "2021-02-23T15:04:38.434Z",
            "type": "pogu"
        },
        {
            "id": "603519884c493e9807bc94aa",
            "channel": "xyz",
            "createdAt": "2021-02-23T15:04:40.602Z",
            "type": "pogchamp"
        }
    ]
}
```

## Channels

**CREATE CHANNEL (AS ADMIN):**
`curl -X POST "localhost:3000/channels/" -H "Content-Type: application/json" -H "Authorization: Bearer {TOKEN}" -d "{\"name\": \"xyz\", \"active\": true}"`

```
{"id":"6058e0385844536d24675088","uri":"/channels/6058e0385844536d24675088"}
```

**UPDATE CHANNEL (AS CHANNEL OWNER):**
`curl -X PUT "localhost:3000/channels/" -H "Content-Type: application/json" -H "Authorization: Bearer {TOKEN}" -d "{\"name\": \"ninja\", \"login\": \"ninja\", \"active\": false, \"broadcasterId\": 123}"`

```
{"message":"Updated"}
```

**JOIN CHANNEL (AS CHANNEL OWNER):**
`curl -X POST localhost:3000/channels/mine/join -H "Authorization: Bearer {TOKEN}"`

**PART CHANNEL (AS CHANNEL OWNER):**
`curl -X POST localhost:3000/channels/mine/part -H "Authorization: Bearer {TOKEN}"`

**GET ACTIVE CHANNELS:**
`curl localhost:3000/channels/active`

```
{"count":3,"items":["xyz","abc","def"]}
```

**GET ALL CHANNELS (as objects):**
`curl localhost:3000/channels/`

```
{"count":4,"items":[{"_id":"6058de2817b5714adc7d01b3","name":"asd","active":true,"createdAt":"2021-03-22T18:12:56.114Z","__v":0,"uri":"/channels/6058de2817b5714adc7d01b3","id":"6058de2817b5714adc7d01b3"},{"_id":"6058e0115844536d24675085","name":"asd","active":false,"createdAt":"2021-03-22T18:21:05.344Z","__v":0,"uri":"/channels/6058e0115844536d24675085","id":"6058e0115844536d24675085"},{"_id":"6058e0a65844536d24675089","name":"asd","active":true,"createdAt":"2021-03-22T18:23:34.788Z","__v":0,"uri":"/channels/6058e0a65844536d24675089","id":"6058e0a65844536d24675089"},{"_id":"6058e0ab5844536d2467508a","name":"asd","active":true,"createdAt":"2021-03-22T18:23:39.832Z","__v":0,"uri":"/channels/6058e0ab5844536d2467508a","id":"6058e0ab5844536d2467508a"}]}
```

**GET CHANNEL BY NAME:**
`curl localhost:3000/channels/xyz`

```
{"_id":"6058de2817b5714adc7d01b3","name":"xyz","active":true,"createdAt":"2021-03-22T18:12:56.114Z","__v":0,"uri":"/channels/6058de2817b5714adc7d01b3","id":"6058de2817b5714adc7d01b3"}
```

**DELETE CHANNEL BY NAME:**
`curl -X DELETE localhost:3000/channels/xyz`

## Authentication

**STORE AUTH TOKEN (/auth CALLED BY callback.html):**
`curl -X POST "localhost:3000/auth" -H "Content-Type: application/json" -d '{"access_token": "o2083v995q", "scope": "user:read:email", "state": "c3abfaa609xAc1e793a29g361f00r471", "token_type": "bearer"}'`