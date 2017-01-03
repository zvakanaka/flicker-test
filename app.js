const base58 = require('base58')
const API_key = require('./API_key.js')

/**
Get an array of photos
@param {String} url - URL complete with an API_key
@param {String} [pageNum]
@returns {Promise} - Full list of images
**/
function getPhotos(url, pageNum) {
  return new Promise((resolve, reject) => {
    let http = new XMLHttpRequest();
    http.open("GET", `${url}&page=${pageNum || 1}`, true)
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
      	let data = (http.responseText);
      	if (data.error !== undefined) {
          reject(data.error)
      	} else { // all is well
          let images = []
          data = JSON.parse(data)
          // console.log(data);
          console.log(`${pageNum || 'no page'}/${data.photos.pages}`);
          data.photos.photo.forEach(photo => {
            images.push(photo);
          })
          resolve(images)
      	}
      }
    };
    http.send(null);
  })
}

function buildResults(images) {
  images.forEach(img => {
    let thumb = `http://farm${img.farm}.static.flickr.com/${img.server}/${img.id}_${img.secret}_t.jpg`
    let url = `https://flic.kr/p/${base58.encode(img.id)}`

    let linkEl = document.createElement('a')
    linkEl.setAttribute('href', url)
    var imgEl = document.createElement('img')
    imgEl.setAttribute('src', thumb)
    linkEl.appendChild(imgEl)
    document.body.appendChild(linkEl)
  })
}

let text = 'inspirationisinspiring'
let url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_key}&media=photos&text=${text}&license="9,9,9"&safe_search=1&format=json&nojsoncallback=1`
getPhotos(url).then(imgs => buildResults(imgs))

let pageNum = 1
let nextPageBtn = document.createElement('input')
nextPageBtn.setAttribute('type', 'button')
nextPageBtn.setAttribute('value', 'Next')
document.body.appendChild(nextPageBtn)

nextPageBtn.addEventListener('click', (e) => {
  getPhotos(url, pageNum++).then(imgs => buildResults(imgs))
});
window.onscroll = function(e) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      getPhotos(url, pageNum++).then(imgs => buildResults(imgs))
    }
}
