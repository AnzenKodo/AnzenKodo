import lume from "lume/mod.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import minify from "https://raw.githubusercontent.com/lumeland/experimental-plugins/main/minify/minify.ts";

import footnote from "https://jspm.dev/markdown-it-footnote";
import anchor from "https://jspm.dev/markdown-it-anchor";
import checkbox from "https://jspm.dev/markdown-it-checkbox";
import table from "https://jspm.dev/markdown-it-multimd-table";

const site = lume(
  {
    location: new URL("https://anzenkodo.github.io/AnzenKodo"),
    src: ".",
    dest: "_site",
    prettyUrls: true,
    server: {
      page404: "/",
    },
  },
  {
    markdown: {
      plugins: [anchor, footnote, checkbox, table],
    },
  }
);

site
  .loadAssets([".css"])
  .copy("img")
  .copy("fonts")
  .use(codeHighlight())
  .use(resolveUrls())
  .use(
    minify({
      extensions: [".css", ".html"],
      htmlOptions: {
        minifyCSS: true,
      },
    })
  );

export default site;
