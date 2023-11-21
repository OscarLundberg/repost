## Configuration

Configure repost by passing in environment variables

- REPOST_PRIVATE_PORT `number – default: 3000`
The private port where the control panel and configuration api is exposed

- REPOST_PUBLIC_PORT `number – default: 3001`
The public port where repost listens for incoming events

- REPOST_DB_CLIENT – `sqlite3 | better-sqlite3 | mysql | mysql2 | oracledb | pg – default: sqlite3` 

  The database client to use. See [knex configuration options](https://knexjs.org/guide/#configuration-options) for more information.

- REPOST_DB_CONNECTION `string – default: repost.db`

  The database connection configuration. See [knex configuration options](https://knexjs.org/guide/#configuration-options) for more information. 
  
  To use an object for configuration, set the environment variable to a valid json string

## Usage

Create events, actions and entries to enable repost

### event
An event is an endpoint or request configuration that repost will be able to listen for.

#### Properties
- method – `GET | POST | PUT | PATCH | DELETE`
The HTTP method to accept requests for

- path - `string`
The path to listen on

- Basic auth - `json`
A json object containing username and password which must be matched when the validation strategy is set to "basic"

- Headers - `json`
A json object containing headers which must be matched when the validation strategy is set to "basic"

- Data - `json`
A json object containing a default body which will merge with the request body and propagate on to the *action* (not supported for GET requests)

- Validation Strategy - `basic | none`
When set to basic, the basic auth and request headers will be validated against the supplied json values

### action
An action is a request transformation and resulting request, that follows an event

#### Properties

- name - `string` 
A label for the action

- Repost Target - `url`
The target URL to send the request to

- Strategy - `Static | JavaScript`
  ##### Static 
  The supplied *code* must be a static json object following the **Request Configuration** model (See below)

  ##### JavaScript 
  The supplied *code* must be valid JavaScript. The incoming event is a javascript object following the **Request Configuration** model, and can be accessed from the script using 
  `event`

  The variable `event` has been updated with the url to the *Repost Target* set in the action. The requested url is also available on `event.incomingRequestUrl`

  To transform the request, a call must be made to `repost(event)` where the event is also an object following the **Request Configuration** model.<br>
  `event` can be mutated and then reposted like so `repost(event)`

  The third-party libraries axios and lodash can be utilized in the script using `const _ = require("lodash")` and `const axios = require("axios")` respectively.

  The **Request Configuration** model is compatible with axios, so additional requests may be sent using `axios(event)`

- URL - `url`
Direct link to a script compliant with the selected strategy. The content-type must be `text/plain` or `text/html`

- Code - `string`
Plain text script compliant with the selected strategy. If a URL is specified it will take precedence

### entry
An entry is the entity that connects an event to an action. 

While an action can be reused across multiple events, each event may only trigger a single action, and should only have one entry. <br>If multiple entries use the same event, the last one will take precedence

#### Properties

- Label - `string`
A label for the entry

- Action - `number`
The ID of the chosen action 

- Event - `number`
The ID of the chosen event


### Request Configuration Model

The model that is used for incoming and outgoing requests in rePOST.

```typescript
{
  auth?: {
    username: string,
    password: string
  },
  data?: any;
  headers?: Record<string, string>;
  incomingRequestUrl?: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}
```

<br/>
<br/>
<br/>
<br/>