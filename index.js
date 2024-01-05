const data = await fetch("https://AnzenKodo.github.io/api/info.json").then((res) => res.json());

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

	license: `<p align="center"><small><a href="${data.license}">LICENSE</a></small></p>`
});


function commentMark(string, data) {
	const { hasOwnProperty } = Object.prototype;
	const createPtrn = (key,type) => new RegExp(`<!--\\s*${key}:${type}\\s*-->`, 'g');
	const multilinePtrn = /\n/;
	
	if (string) string = string.toString();
	if (!string || !data) return string;
	
	for (const key in data) {
		if (!hasOwnProperty.call(data, key)) continue;
		
		let value = data[key];
		
		if (multilinePtrn.test(value)) value = `\n${value}\n`;
		
		const startComment = createPtrn(key, 'start');
		const endComment = createPtrn(key, 'end');
		let startMatch;
		let endMatch;
		do {
			startMatch = startComment.exec(string);
			if (!startMatch) {
				continue;
			}
			endComment.lastIndex = startMatch.index;
			endMatch = endComment.exec(string);
			if (endMatch) {
				string = (
					string.slice(
						0, startMatch.index + startMatch[0].length,
					) + value + string.slice(endMatch.index)
				);
				endComment.lastIndex += value.length;
			} else {
				console.warn(`[comment-mark] No end comment found for "${key}"`);
			}
		} while (startMatch);
	}
	return string;
}

const filename = "README.md";
Deno.writeTextFileSync(
  filename,
  commentMark(Deno.readTextFileSync(filename), data),
);
