const data = await fetch(
  "https://AnzenKodo.github.io/api/info.json"
).then((res) => res.json());

Object.assign(data, {
	title: `[AK](${data.website})(${data.username})`,

	banner: `\n![${data.username} Banner Image](${data.banner}.jpg)`,
	
	logo: `<img alt="Logo of ${data.name}" src="${data.mascot}.png" align="right" width="30%" loading="lazy">`,

	email: `<a href="mailto:${data.email}">${data.email}</a>`,

	sites: Object.entries(data.sites)
		.map((val) => `- [**${val[0]}**](${val[1]})`)
		.join("\n"),
	
	socials: Object.entries(data.socials)
		.map((val) => `- [**${val[0]}**](${val[1]})`)
		.join("\n"),
	
	support: Object.entries(data.support)
		.map((val) => `- **${val[0]}:** [\`${val[1]}\`](${val[1]})`).join("\n"),

	license: `\n[LICENSE](${data.license})`
});

import commentMark from "https://esm.sh/comment-mark@1.1.1";
const filename = "README.md";
Deno.writeTextFileSync(
  filename,
  commentMark(Deno.readTextFileSync(filename), data),
);
