import commentMark from "https://esm.sh/comment-mark@1.1.1";
import { parseFeed } from "https://deno.land/x/rss@0.5.6/mod.ts";
import qrcode from "https://deno.land/x/qrcode_terminal@v1.1.1/mod.js";

const repos = ["dblog", "punk", "mizlink", "rss-atom-parser"];
const nav = ["notes", "blogroll", "db", "pinboard", "pen", "todo", "awesome"];
const md = Deno.readTextFileSync("README.md");

const data = await fetch("https://anzenkodo.github.io/api/ak.json")
  .then((res) => res.json());
const pinboard = await fetch("https://anzenkodo.github.io/api/pinboard.json")
  .then((res) => res.json());
const db = await fetch("https://anzenkodo.github.io/api/db.json")
  .then((res) => res.json());

data.banner =
  `<a href="${data.website}"><img width="100%" src="${data.banner}" loading="lazy"></a>`;

data.nav = nav.map((val) =>
  `<a href="${data.website}${val}">${
    val.charAt(0).toUpperCase() + val.slice(1)
  }</a>`
).join(" | ");

data.logo =
  `<img alt="Logo of ${data.name}" src="${data.mascot}.png" align="right" width="30%" loading="lazy">`;

data.favcolor =
  `<img src="https://img.shields.io/badge/%20-0?style=for-the-badge&color=${data.color}" width="11em" loading="lazy"> #${data.color}`;

data.languages = data.languages.join(" / ")
  .replace(/\w+/g, "[$&](https://github.com/topics/$&)");

data.email = `<a href="mailto:${data.email}">Email</a>`;
data.social = Object.entries(data.socials).map((val) =>
  `<a href="${val[1]}">${val[0].charAt(0).toUpperCase() + val[0].slice(1)}</a>`
).join(" / ");

data.blog = await fetch(data.api.blog)
  .then((res) => res.json())
  .then((res) => res.items.map((item) => `- [${item.title}](${item.url})`))
  .then((res) => res.slice(0, 5).join("\n")) +
  `\n- See More on [AK#Notes](${data.website}notes)`;

data.microblog = await fetch("https://nitter.cz/AnzenKodo/rss")
  .then((res) => res.text())
  .then((res) => parseFeed(res))
  .then((res) => res.entries)
  .then((res) =>
    res.map((re) =>
      re.title.value
        .replace(/<[^>]*>/g, "")
        .replace(
          /$/g,
          `\n\n<a href="${
            re.links[0].href.replace("https://nitter.cz", "https://twitter.com")
          }">Full Context</a> | See More on <a href="https://twitter.com/${data.username}">Twitter</a>`,
        )
        .replace(/^/gm, "> ")
    ).slice(0, 1).join("\n\n")
  );

data.working = data.todo.working
  .join("\n").replace(/(?<=^(\s+|))\w/gm, "- $&") +
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

data.devmore = `- **Micro Projects:** [AK#Pen](${data.website}pen)
- **Website and Project Links:** [AK#Awesome](${data.website}awesome)
- **System Configuration:** [AK#Dotfiles](${data.website}dotfiles)
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
