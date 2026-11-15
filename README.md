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
