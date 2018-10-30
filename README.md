# mp-relay

Relay Google Analytics Measurement Protocol hits via Cloud Functions

![diagram](mp-relay.png)

## Purpose

Often it can be useful to use [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/) to submit events to Google Analytics from your own network, for example, when importing offline conversions.

However, if views are defined in GA containing filters to exclude your network, these events will not appear.

One solution is to use Cloud Functions to relay the submission using Measurement Protocol, such that the source of each request is no longer within your network.

## Setup

1.  Create a [new Cloud Project](https://console.cloud.google.com/projectcreate)

1.  Navigate to [Cloud Functions](https://console.cloud.google.com/functions). Note that to use Cloud Functions, billing must be set up, however, there is a free tier, and if using the relay for offline conversions, it is likely that the cost will fall well within that. See [Cloud Functions Pricing](https://cloud.google.com/functions/pricing).

1.  Click **Create Function**

1.  Call the function **mpRelay**

1.  Leave the other options as they are, ensuring the **runtime** is set to *Node.js 6*.

1.  Paste in `mpRelay.js` and `package.json` from this repository into `index.js` and `package.json` respectively.

1.  In `index.js` choose a secret key, and paste the value into the `KEY` variable. This is to avoid your relay being used by others.

1.  Set the **function to execute** to `mpRelay`.

1.  Click **Save**.

## Invoking the function

1.  Once the Cloud Function is set up, the UI will show an endpoint address similar to: 

    ```
    https://us-central1-my-project-218412.cloudfunctions.net/mpRelay
    ```

1.  To send an event to GA, send a `POST` request to the above endpoint with a `Content-Type` of `application/json` and a body structured as follows:

    ```json
    {
      "hits": [
        {
          "v": 1,
          "t": "pageview",
          "tid": "UA-XXXXXXX-X",
          "cid": "123456",
          "dp": "%2FpageA"
          // etc ....
        }
      ],
      "key": "YOUR_KEY_AS_PER_INDEX.JS"
    };
    
    ```
    
 1.  Note that :
 
     *   The `key` property needs to match the key specified in your `index.js` in your Cloud Function.
     *   The `hits` property is a list, so either single hits can be supplied, or multiple, which will use [Measurement Protocol Batch Mode](https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide#batch).
