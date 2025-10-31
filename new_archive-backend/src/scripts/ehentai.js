const title = document.querySelector('#gn').textContent;
const coverImage = document.querySelector('#gd1').firstChild.style.backgroundImage.split('"')[1];
fetch("http://localhost:3000/api/gallery", {
  method: "POST",
  headers: {
    "Content-Type": "application/json", // tells server we’re sending JSON
  },
  body: JSON.stringify({
    title,
    page: window.location.href,
    type: 'ehentai',
    cover: coverImage
  }),
});