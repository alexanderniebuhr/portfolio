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

Required repository secret:

- `CLOUDFLARE_API_TOKEN`: an API token for the account in `cloudflare.config.ts` that can deploy the Worker to its custom domain (for example the "Edit Cloudflare Workers" template) and use Cloudflare Images. The build needs it too, because the `IMAGES` binding connects to Cloudflare remotely.

Pull requests from forks get no secrets, so they build with `CLOUDFLARE_VITE_FORCE_LOCAL=true`, which simulates the `IMAGES` binding locally.
