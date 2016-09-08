let streamsList = [{
  name: "freecodecamp"
}, {
  name: "storbeck"
}, {
  name: "terakilobyte"
}, {
  name: "habathcx"
}, {
  name: "RobotCaleb"
}, {
  name: "thomasballinger"
}, {
  name: "noobs2ninjas"
}, {
  name: "beohoff"
}, {
  name: "brunofin"
}, {
  name: "comster404"
}, {
  name: "test_channel"
}, {
  name: "cretetion"
}, {
  name: "sheevergaming"
}, {
  name: "TR7K"
}, {
  name: "OgamingSC2"
}, {
  name: "ESL_SC2"
}];
let articles = [];

function createArticle(channel) {
  const article = `<article>
    <div class="image"><img src="${channel.logo}" alt="${channel.display_name}"></div>
    <div class="name">${channel.display_name} </div>
    <div class="status">${channel.status} </div>
  </article>`
  return article;
}

function createURL(type, name) {
  return `https://api.twitch.tv/kraken/${type}/${name}`;
}

document.addEventListener("DOMContentLoaded", function() {
  function setStatus(resJson, stream) {
    if (resJson.stream === null) {
      stream.status = "offline";
    } else if (resJson.stream === undefined) {
      stream.status = "closed";
    } else {
      stream.status = "online";
      stream.logo = resJson.stream.channel.logo;
    }
    return stream;
  }

  function getOfflineDetails(stream) {
    fetch(stream.channelURL)
      .then(response => {
        response.json()
          .then(resJson => {
            stream.logo = resJson.logo != null ? resJson.logo : "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F";
            stream.name = resJson.display_name != null ? resJson.display_name : stream.name;
          })
      })
      .catch();
    return stream;
  }

  function processStreams(streamsToProcess) {
    return new Promise(function(resolve, reject) {
      streamsToProcess.map(stream => {
        stream.url = createURL("streams", stream.name);
        stream.channelURL = createURL("channels", stream.name)
        fetch(stream.url)
          .then(response => {
            response.json()
              .then(resJson => setStatus(resJson, stream))
              .then(stream => getOfflineDetails(stream))
              .then(resolve());
          })
          .catch(err => reject(err));
      });
    })
  }

  processStreams(streamsList)
    .then(() => {
      articles = streamsList.forEach(stream => createArticle(stream));
    });
});



// $("#articles").append(liveStreams);
// $("#articles").append(offlineStreams);
// $("#articles").append(closedStreams);
//
