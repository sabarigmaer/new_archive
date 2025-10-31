const title = document.querySelector(".wp-block-heading").textContent;
while (
  document.body.contains(
    document.querySelector(".pgcsimplygalleryblock-masonry-load-more")
  )
) {
  document.querySelector(".pgcsimplygalleryblock-masonry-load-more").click();
}
const links = [];
setTimeout(() => {
  const imgs = document
    .querySelector(".pgcsimplygalleryblock-masonry-content")
    .querySelectorAll("img");

  imgs.forEach((e) => links.push(e.src));
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
  }),
});
}, 2000);
