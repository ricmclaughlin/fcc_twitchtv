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

function setStatus(stream, data) {

  if (data.stream === null) {
    stream.status = "offline";
  } else if (data.stream === undefined) {
    stream.status = "closed";
  } else {
    stream.status = "online";
  }
  return stream;
}

function createArticle(channel, data) {
  console.log(data);
  if (channel.status === 'closed') {
    channel.logo = 'http://dummyimage.com/50/000/f00.jpg&text=X';
    channel.url = null;
  } else if (data.logo === null && channel.status != 'closed'){
    channel.logo = 'http://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F';
    channel.url = data.url;
  } else {
    channel.logo = data.logo;
    channel.game = data.game;
    channel.url = data.url;
  }
  channel.name = data.display_name != null ? data.display_name : channel.name;

  let article = `<div class="image">`
  article += `<img src="${channel.logo}" alt="${channel.name}"></div>`
  if (channel.status === 'online') {
    article += `<div class="name"><a href="${channel.url}">${channel.name} - ${channel.game}</a></div>`
  } else {
      article += `<div class="name"><a href="${channel.url}">${channel.name}</a> </div>`
  }
  article += `<div class="status"><a href="${channel.url}">${channel.status}</a> </div>`
  return article;
}

function styleArticle(channel, article) {
  if (channel.status !== 'online') {
    article.classList.add('inactive');
  }
  return article;
}

document.addEventListener("DOMContentLoaded", function() {
  const onlineDiv = document.getElementById('online');
  const offlineDiv = document.getElementById('offline');
  const closedDiv = document.getElementById('closed');

  streamsList.forEach(stream => {
    function ajax(url) {
      fetch(url)
        .then(data => data.json())
        .then(data => dataGen.next(data))
        .catch();
    }

    function* steps(stream) {
      let data = yield ajax(`https://api.twitch.tv/kraken/streams/${stream.name}`);
      stream = setStatus(stream, data);
      data = yield ajax(`https://api.twitch.tv/kraken/channels/${stream.name}`);
      let newArticle = document.createElement('article');
      newArticle.innerHTML = createArticle(stream, data);
      newArticle = styleArticle(stream, newArticle);
      if (stream.status === 'closed') {
        closedDiv.appendChild(newArticle);
      } else if (stream.status === 'offline') {
        offlineDiv.appendChild(newArticle);
      }
      else {
        onlineDiv.appendChild(newArticle);
      }
    }

    let dataGen = steps(stream);
    dataGen.next();
  });
});
