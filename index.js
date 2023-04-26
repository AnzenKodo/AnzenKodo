import commentMark from "https://esm.sh/comment-mark@1.1.1";
import { parseFeed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import qrcode from "https://deno.land/x/qrcode_terminal@v1.1.1/mod.js";

const repos = ["pen", "dotfiles", "punk", "mizlink"];
const md = Deno.readTextFileSync("README.md");

const data = await fetch("https://anzenkodo.github.io/api/ak.json")
  .then((res) => res.json());
const pinboard = await fetch(data.api.pinboard)
  .then((res) => res.json());
const db = await fetch(data.api.db)
  .then((res) => res.json());

data.banner =
  `<a href="${data.website}"><img width="100%" src="${data.banner}" loading="lazy"></a>`;

data.nav = Object.entries(data.site).map((val) =>
  `<a href="${val[1]}">${val[0].charAt(0).toUpperCase() + val[0].slice(1)}</a>`
).join(" | ");

data.logo =
  `<img alt="Logo of ${data.name}" src="${data.mascot}.png" align="right" width="30%" loading="lazy">`;

data.favcolor =
  `<img src="https://img.shields.io/badge/%20-0?style=for-the-badge&color=${data.color}" width="11em" loading="lazy"> #${data.color}`;

data.languages = data.languages.join(" / ")
  .replace(/\w+/g, "[$&](https://github.com/topics/$&)");

data.email = `<a href="mailto:${data.email}">Email</a>`;
data.social = Object.entries(data.socials).map((val) =>
  `<a href="${val[1]}">${val[0]}</a>`
).join(" / ");

data.working = "- " + data.todo.working
  .join("\n- ") +
  `\n- See More on [AK#Todo](${data.website}todo)`;

data.projects =
  repos.map((repo) =>
    `[![Banner of ${repo} project](https://github-readme-stats.vercel.app/api/pin/` +
    `?border_radius=0&bg_color=000&text_color=fff&icon_color=fff&border_color=fff` +
    `&repo=${repo}&username=${data.username}` +
    `&title_color=${data.color})](https://github.com/AnzenKodo/${repo})`
  ).join("\n") +
  `\n\n See More on [GitHub](https://github.com/${data.username}?tab=repositories)`;

data.pinboard = pinboard.Read.slice(0, 3)
  .map((val) => `- [${Object.keys(val)}](${Object.values(val)})`).join("\n") +
  `\n- See More on [AK#Pinboard](${data.website}pinboard)`;

function getDb(items) {
  return "\n" + items
    .slice(0, 3)
    .map((item) => {
      let creator = "";

      if (item.creator_url) {
        creator = ` by [${item.creator}](${item.creator_url || "#"})`;
      }
      if (item.creator) {
        creator = ` by ${item.creator}`;
      }

      return `- [${item.name}](${item.url || "#"})${creator}`;
    })
    .join("\n");
}
data.watching = getDb(db.shows.general.watching);
data.reading = getDb(db.books.general.reading);
data.manga = getDb(db.comic.manga.reading);
data.anime = getDb(db.shows.anime.watching);
data.ona = getDb(db.shows.ona.watching);
data.audiobook = getDb(db.sound.audiobooks.listening);
data.music = getDb(db.sound.music.listens);
data.db = `\n### See More on [AK#Db](${data.website}db)`;

data.devmore =
  `- **Website and Project Links:** [AK#Awesome](${data.website}awesome)
- **API's:** [AK#Apis](${data.website}api/ak.json)`;

data.support = Object.entries(data.support).map((val) => {
  let code = "";
  if (!val[1].match("https://")) {
    qrcode.generate(
      data.support[val[0]],
      { small: true },
      (qrcode) => code = `<pre align="center">\n${qrcode}</pr>`,
    );
  }

  return `<details><summary>${val[0].toUpperCase()}</summary><pre>${
    val[1]
  }</pre>${code}</details>`;
}).join("");

const modifyMd = commentMark(md, data);
Deno.writeTextFileSync("README.md", modifyMd);
