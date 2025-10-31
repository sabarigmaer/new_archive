const page = document.querySelector("#photo-container");
const links =[]
const title = document.querySelector("h1.container").textContent;

const count = Number(title.split('-')[3].split(' ')[1])

const base= page.querySelector('img.img-fluid').src.replace('1.webp', '')

for (let i = 1; i <= count; i++ ) {
  links.push(base+ i+ '.webp')
}
fetch("http://localhost:3000/api/gallery", {
  method: "POST",
  headers: {
    "Content-Type": "application/json", // tells server we’re sending JSON
  },
  body: JSON.stringify({
    title,
    page: window.location.href,
    links,
    cover: links[0],
  }),
});
