## commands

Install all dev tools (also runs `aube install` and installs the Git hooks)

```shell
mise i
```

Install all deps if not done by `mise`

```shell
aube i
```

Update the browserslist data (`caniuse-lite` and `baseline-browser-mapping`)

```shell
aube update caniuse-lite@latest baseline-browser-mapping@latest
```

Generate Cloudflare types (written to `.cloudflare/types/`)

```shell
aubr types
```

Type-check with TypeScript 7.1 (`.astro` files via `@astrojs/ts-content-mapper`)

```shell
aubr check
```

Deploy to cloudflare (sign in once with `aube exec -- cf auth login`)

```zsh
aubr deploy
```

## previews

`cloudflare.config.ts` serves production on `alexanderniebuhr.me` and Previews on subdomains of `preview.alexanderniebuhr.me`, so a Preview named `<preview-name>` is at `https://<preview-name>.preview.alexanderniebuhr.me`. Cloudflare creates the wildcard DNS record and certificate for `*.preview.alexanderniebuhr.me`; the certificate can take a while after the first Preview.

Domain settings only take effect on a production deploy (`cf deploy`); Preview uploads reuse whatever hosting the deployed Worker already has.

The `workers.dev` URLs are disabled (`workersDev: false`, `previewUrls: false`), so the Worker is only reachable on its custom domains. A Preview gets no URL at all until a production deploy has applied the `preview.alexanderniebuhr.me` domain.

`*.preview.alexanderniebuhr.me` is protected with Cloudflare Access, configured in the Zero Trust dashboard rather than in this repository. Unlike `workers.dev` Preview URLs, custom domain Preview URLs do not get an `X-Robots-Tag: noindex` header automatically.

## git hooks

[hk](https://hk.jdx.dev) runs the hooks configured in `hk.pkl`. `mise i` installs them with `hk install --mise`; run that command yourself if you installed the tools another way.

- `pre-commit`: Biome fixes the staged files and stages the fixes; gitleaks scans the staged changes for secrets
- `pre-push`: `aubr check`

Check or fix all files without committing

```shell
hk check --all
hk fix --all
```

Skip the hooks once with `HK=0`, e.g. `HK=0 git commit`

## ci

`.github/workflows/ci.yml` lints (`hk check --all`), type-checks and builds every pull request and push to `main`, then deploys pushes to `main` with `cf deploy --prebuilt`.

Pull requests from this repository also get a Preview named `pr-<number>`: CI builds it with `CLOUDFLARE_PREVIEW_BUILD=true` (`cf previews deploy --prebuilt` only accepts a Preview build), deploys it with `cf previews deploy`, and keeps one comment on the pull request up to date with its URL. Until a Preview host is live (see [previews](#previews)), the comment says the Preview has no URL yet. Closing the pull request deletes the Preview with `cf previews delete`. Only the commenting job gets `pull-requests: write`.

Required repository secret:

- `CLOUDFLARE_API_TOKEN`: an API token for the account in `cloudflare.config.ts` that can deploy the Worker and its Previews to its custom domains (for example the "Edit Cloudflare Workers" template).

Pull requests from forks get no secrets, so they skip preview deployment while still running lint, type-check, and build verification.
