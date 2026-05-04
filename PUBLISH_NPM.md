# Publish to npm

1. Check package name in `package.json`.
2. Login:

```bash
npm login
```

3. Version:

```bash
npm version patch
```

4. Publish:

```bash
npm publish --access public
```

Install globally:

```bash
npm install -g tg-foundation-cli
tgf --help
```
