const express = require("express");
//const rbx = require("noblox.js");
//const { Webhook } = require("discord-webhook-node");
const axios = require("axios");
const app = express();
var groupId = 33568849;
var cookie = process.env["cookie"];
app.use(express.json());

async function startApp() {

}

const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

app.get("/ranker", async (req, res) => {
  var User = req.query.userid;
  var Rank = req.query.rank;

  try {
    await axios.patch()
    res.send("Ranked!");
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to rank user");
  }
});

app.get("/riitag", (req, res) => {
  var id = req.query.game.substring(0, 4);
  var KEY = req.query.key;

  console.log("hi");

  if (KEY != process.env.RIITAG_KEY) {
    console.log("Keys don't match!");
    res.status(401).send("Keys don't match!");
  }

  console.log("Playing Game ID", id, "Unshortened: ", req.query.game);
  axios
    .get(`https://tag.rc24.xyz/wii?game=${id}&key=${process.env.RIITAG_KEY}`)
    .then(function (response_data) {
      console.log(response_data.status);

      if (response_data.status === 200) {
        console.log("Update success!");
      }

      res.status(response_data.status).send(response_data.data);
    })
    .catch(function (err) {
      let output = `${err.code} ${err.response.status} (${JSON.stringify(
        err.response.data
      )}`;
      console.log(output);
      res.status(err.response.status).send(output);
    });
});

app.get("/", (req, res) => {
  console.log("root got");

  res.send("ok");
});

app.get("/danibot/:key/:action", (req, res) => {
  let key = req.params.key;
  let action = req.params.action;

  if (key != process.env["DANIBOT_KEY"]) {
    res.status(401).send("401 Unuthorized");
    return;
  }

  switch (action) {
    case "downloadSecrets":
      console.log(process.env["DANIBOT_SECRETS"]);

      res.send();

      return;

    case "downloadConfig":
      return;
  }

  res.status(500).send("No action found!");
  return;
});

app.get("/redir", (req, res) => {
  let placeId = req.query.placeId;
  let jobId = req.query.jobId;

  if (placeId && jobId) {
    res.redirect(
      301,
      `roblox://experiences/start?placeId=${placeId}&gameInstanceId=${jobId}`
    );
  } else {
    res.send("no redir query provided");
  }
});

app.get("/", (req, res) => {
  res.send("hi");
});

app.post("/ProxyGet", function (Request, Res) {
  console.log("got proxy request");

  if (!Request.body.url) {
    Res.send("No url provided");

    return;
  }

  var URL = Request.body.url;
  console.log(URL);
  var json;
  if (isValidJSON(URL)) {
    json = JSON.parse(URL);
    console.log(json);
  } else {
    json = {
      url: URL,
    };
  }

  axios
    .get(json.url)
    .then((result) => {
      console.log(result.data);
      Res.send(result.data);
      console.log("returned data to roblox");
    })
    .catch((err) => {
      console.log(err.message);
      Res.send(err.message);
    });
});

app.post("/ProxyPost", function (Request, Res) {
  console.log("got proxy request");

  if (!Request.body.url) {
    Res.send("No url provided");

    return;
  }

  var URL = Request.body.url;
  var postData = Request.body.data;
  console.log(URL, postData);
  var json;
  if (isValidJSON(URL)) {
    json = JSON.parse(URL);
    console.log(json);
  } else {
    json = {
      url: URL,
    };
  }

  axios
    .post(json.url, json.data)
    .then((result) => {
      console.log(result.data);
      Res.send(result.data);
      console.log("returned data to roblox");
    })
    .catch((err) => {
      console.log(err.message);
      Res.send(err.message);
    });
});

app.post("/ProxyPostT", function (Request, Res) {
  console.log("got proxy request");

  if (!Request.body.url) {
    Res.send("No url provided");

    return;
  }

  var URL = Request.body.url;
  var postData = Request.body.data;
  console.log(URL, postData);
  var json;
  if (isValidJSON(URL)) {
    json = JSON.parse(URL);
    console.log(json);
  } else {
    json = {
      url: URL,
    };
  }

  let tok = process.env.tok;

  if (json.useDani === true) {
    tok = process.env.danicookie;
  }
  let data = json.data;

  axios
    .post(json.url, data, {
      headers: {
        Cookie: `.ROBLOSECURITY=${tok}`,
      },
    })
    .then((result) => {
      console.log(result.data);
      Res.send(result.data);
      console.log("returned data to roblox");
    })
    .catch((err) => {
      console.log(err.message);
      Res.send(err.message);
    });
});

app.get("/robloxUserThumbnail", function (req, res) {
  let userId = req.query.userId;

  axios
    .get(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=720x720&format=Png&isCircular=true`
    )
    .then((result) => {
      console.log(result.data);
      res.send(result.data);
      console.log("returned data to roblox");
    })
    .catch((err) => {
      console.log(err.message);
      res.send(err.message);
    });
});

// app.get("/AI", function(req, res) {
//   console.log("got AI request")
//   var query = req.query.query
//   var type = req.query.type

//   console.log(query,type)

//   axios.get(`https://featherapiai.dani-lionn.repl.co/?query=${query}&type=${type}`).then((result) => {

//     res.send(result.data)
//     console.log("returned data to roblox")

//   }).catch((err) => {
//     console.log(err)
//     res.send(err)
//   })
// })

app.get("/time", function (req, res) {
  const timezone = req.query.timezone;

  if (!timezone) {
    res.status(400).send("No timezone specified.");
  }

  const date = new Date();

  var options;

  options = {
    timeZone: timezone,
  };

  let d = date.toLocaleDateString("en-US", options);
  let s1 = d.split("/");
  let t = date.toLocaleTimeString("en-US", options);
  let s2 = t.split(":");
  let AMPM = s2[2].split(" ")[1].replace(/\\s+/g, "");
  let second = s2[2].split(" ")[0];

  let data = {
    data: {
      date: {
        month: s1[0],
        day: s1[1],
        year: s1[2],
      },
      time: {
        hour: s2[0],
        minute: s2[1],
        second: second,
        AMPM: AMPM,
      },
      timeZone: timezone,
      requestFufilled: Math.floor(Date.now() / 1000),
    },
  };

  res.send(data);
});

app.post("/ProxyGetT", function (Request, Res) {
  console.log("got proxy request");

  let useDani = Request.query.daniCookie;
  console.log(useDani);

  if (!Request.body.url) {
    Res.send("No url provided");

    return;
  }

  var URL = Request.body.url;
  console.log(URL);
  var json;
  if (isValidJSON(URL)) {
    json = JSON.parse(URL);
    console.log(json);
  } else {
    json = {
      url: URL,
    };
  }

  let tok = process.env.tok;

  if (useDani === true) {
    tok = process.env.danicookie;
  }

  axios
    .get(json.url, {
      headers: {
        Cookie: `.ROBLOSECURITY=${tok}`,
      },
    })
    .then((result) => {
      Res.send(result.data);
      //console.log(result.data)
      console.log("returned data to roblox");
    })
    .catch((err) => {
      console.log(err.message);
      Res.send(err.message);
    });
});

// app.get("/GetMyGameStats", function(Request, Res) {

//   let d = request('https://games.roblox.com/v2/users/89521500/games?accessFilter=2&limit=50&sortOrder=Asc')

//   Res.json({
//     msg: 'This is CORS-enabled for all origins!',
//     data: d
//   })
//   Res.send()

// })

app.post("/SendWebhook", function (Request, Res) {
  console.log("got webhook request");

  if (!Request.body.url) {
    Res.send("No url provided");

    return;
  }

  var json = JSON.parse(Request.body.url)[0];

  console.log(json);

  var URL = json.url;
  var Message = json.content;
  console.log(URL);
  const hook = new Webhook(URL);
  hook.send(Message);

  console.log("sent webhook");
});

startApp();

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
