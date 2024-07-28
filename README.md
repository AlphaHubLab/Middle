This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

Clone:

```bash
git clone -b boilerplate --single-branch https://github.com/AlphaHubLab/Middle.git
```

Install dependencies:

```bash
npm i
# or
pnpm i
```

Then, run the development server:

```bash
npm run dev
# or
pnpm dev
```

Use this [Tutorial](https://docs.plasmo.com/framework#loading-the-extension-in-chrome/) to load the under-dev extension into the browser. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## How to contribute

After some modification:

```bash
git add .
git commit -m "commit name"
# create/switch to a new branch to preserve the boilerplate and the main branch.
git checkout -b your-branch-name
git remote add origin https://github.com/AlphaHubLab/Middle.git
git push -u origin your-branch-name
```

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!
