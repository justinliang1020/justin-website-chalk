import fs from "fs";
import path from "path";
import Mustache from "mustache";

function build() {
  const channels = JSON.parse(fs.readFileSync("src/data.json", "utf8"));
  const base = fs.readFileSync("src/templates/base.mustache", "utf8");
  const homeTpl = fs.readFileSync("src/templates/home.mustache.html", "utf8");
  const channelTpl = fs.readFileSync("src/templates/channel.mustache", "utf8");

  fs.mkdirSync("out", { recursive: true });

  for (const asset of ["style.css", "assets", "fonts", "favicon.ico"]) {
    fs.cpSync(asset, path.join("out", asset), { recursive: true });
  }

  // Home page
  fs.writeFileSync(
    "out/index.html",
    Mustache.render(
      base,
      { pageTitle: "Justin Liang", isHome: true, channels },
      { content: homeTpl },
    ),
  );
  console.log("wrote out/index.html");

  // Channel pages
  for (const channel of channels) {
    const dir = path.join("out", channel.slug);
    fs.mkdirSync(dir, { recursive: true });

    const channelsForPage = channels.map((c) => ({
      ...c,
      isActive: c.slug === channel.slug,
    }));

    fs.writeFileSync(
      path.join(dir, "index.html"),
      Mustache.render(
        base,
        {
          pageTitle: `${channel.name} — Justin Liang`,
          channels: channelsForPage,
          embedUrl: channel.embedUrl,
        },
        { content: channelTpl },
      ),
    );
    console.log(`wrote out/${channel.slug}/index.html`);
  }
}

build();

if (process.argv.includes("--watch")) {
  console.log("watching src/ for changes…");
  let debounce;
  fs.watch("src", { recursive: true }, () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      console.log("rebuilding…");
      try {
        build();
      } catch (e) {
        console.error(e.message);
      }
    }, 50);
  });
}
