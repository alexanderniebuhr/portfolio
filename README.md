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
