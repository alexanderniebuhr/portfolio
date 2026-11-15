## commands

Install all dev tools

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
