## commands

Install all dev tools

```shell
mise i
```

Install all deps if not done by `mise`

```shell
aube i
```

Update browserlist

```shell
aube update browserslist
```

Generate Cloudflare types (written to `.cloudflare/types/`)

```shell
aubr types
```

Deploy to cloudflare (sign in once with `aube exec -- cf auth login`)

```zsh
aubr deploy
```
