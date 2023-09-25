const data = await fetch(
  "https://raw.githubusercontent.com/AnzenKodo/AnzenKodo.github.io/main/src/data/config.json",
)
  .then((res) => res.json());

Object.assign(data, {
  logo:
    `<img alt="Logo of ${data.name}" src="${data.mascot}.png" align="right" width="30%" loading="lazy">`,

  favcolor:
    `<img src="https://img.shields.io/badge/%20-0?style=for-the-badge&color=${data.color}" width="11em" loading="lazy"> #${data.color}`,

  email: `<a href="mailto:${data.email}">${data.email}</a>`,

  sites: Object.entries(data.sites)
    .map((val) => `<a href="${val[1]}">${val[0]}</a>`).join(" / "),

  support: Object.entries(data.support)
    .map((val) => {
      let url = val[1];

      if (!val[1].startsWith("https://")) {
        url = val[0].toLowerCase() + ":" + val[1];
      }

      return `<details>
<summary>${val[0]}</summary>
<p><strong>Address:</strong> <a href="${url}">${val[1]}</a></p>
<a href="${url}"><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${url}" alt="QR code for ${
        val[0]
      }"></a>
</details>`;
    })
    .join("\n"),
});

import commentMark from "https://esm.sh/comment-mark@1.1.1";
const filename = "README.md";
Deno.writeTextFileSync(
  filename,
  commentMark(Deno.readTextFileSync(filename), data),
);
