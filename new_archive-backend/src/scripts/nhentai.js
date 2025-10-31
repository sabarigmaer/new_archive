let title;
let list;
let count;
let coverUrl;
if (window.location.href.includes(".xxx")) {
    coverUrl = document.querySelector(".cover").querySelector("img").src;

    title = document.querySelector(".info").querySelector("h1").textContent;
  list = document.querySelector(".info").querySelectorAll("li");
  count = Number(list[list.length - 2].querySelector(".tag_btn").textContent);
} else {
    coverUrl = document.querySelector("#cover").querySelector("img").src;

        title = document.querySelector("#info").querySelector("h1").textContent;

  list = document.querySelector("#tags").querySelectorAll(".name");
  count = Number(list[list.length - 1].textContent);
}

let base = coverUrl.replace("cover.jpg", "");
base = base.replace("https://t", "https://i")

console.log(base)

let links = [];

for (let i = 1; i <= count; i++) {
//   if (window.location.href.includes(".xxx")) {
//     links.push(base + i + ".webp");
//   } else {
    links.push(base + i + ".jpg");
//   }
}
console.log(links);

fetch("http://localhost:3000/api/gallery", {
  method: "POST",
  headers: {
    "Content-Type": "application/json", // tells server we’re sending JSON
  },
  body: JSON.stringify({
    title,
    page: window.location.href,
    links,
    cover: coverUrl,
  }),
});
