# Is He Dead Yet?

A darkly humorous [TRMNL](https://trmnl.com) community plugin that checks public
death-status signals for selected public figures and presents the result on an
ePaper display.

<img width="150" alt="Works with TRMNL" src="https://trmnl.com/images/brand/badges/light/works-with-trmnl/trmnl-badge-works-with-light.svg" />

## What it does

- lets you choose from several well-known public figures
- reads a compact, repository-hosted cache of Wikidata date-of-death claims
- refreshes that cache hourly through GitHub Actions
- evaluates the cached record locally without additional network requests
- shows an alive, dead, or unknown result with a confidence indicator
- offers Dry, Grim, and Pitch Black tone settings
- rotates darkly humorous status lines when no death record is found
- presents the result as a mortality-department case file
- supports full-screen, half-horizontal, half-vertical, and quadrant layouts

The plugin is intentionally conservative: if public sources cannot be checked
reliably, it reports the status as unknown instead of guessing.

## Data sources and disclaimer

Status signals come from public data on
[Wikidata](https://www.wikidata.org/) and are cached in this repository by the
[`Update Wikidata cache`](.github/workflows/update-wikidata.yml) workflow. TRMNL
reads the cached JSON instead of querying Wikidata directly. If an update fails,
the last valid cache remains available. Wikidata can still be delayed, incomplete,
or incorrect. This plugin is a novelty display, not an authoritative
source for breaking news or official confirmation.

This repository is an independent community project and is not affiliated with
or endorsed by the people listed, Wikimedia, Wikidata, or TRMNL.

## TRMNL recipe

The recipe is maintained through
[TRMNL GitHub Sync](https://help.trmnl.com/en/articles/15977899-github-sync).
Its templates, serverless transform, and settings are stored in [`src/`](src/).

## Develop locally

Preview the recipe with [trmnlp](https://github.com/usetrmnl/trmnlp):

```sh
gem install trmnl_preview
trmnlp serve
```

## License

The original plugin templates, visual design, markup, and data-parsing logic are
licensed under the [Creative Commons Attribution 4.0 International License](LICENSE),
in accordance with the
[TRMNL Community Plugin License](https://trmnl.com/plugin-license).

© 2026 Michael Kurath. Third-party names, trademarks, source material, and data
remain the property of their respective rights holders and are not covered by
this license.
