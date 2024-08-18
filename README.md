This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).


This branch contains a repo prepared with necessory permissions, manifest, storage, and works with popup and new tab actions.


## Getting Started

Clone current branch (dev branch):

```bash
git clone -b dev --single-branch https://github.com/AlphaHubLab/Middle.git
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

## Useful resources (Docs)

Using React-icons:
[React Icons](https://react-icons.github.io/react-icons/)

Styling with TailwindCSS:
[Tailwind](https://tailwindcss.com/)

Adding actions/pages to extension:
[Plasmo pages](https://docs.plasmo.com/framework/ext-pages)

How to add external assets (Images, scripts) and permissions to extension:
[Plasmo assets](https://docs.plasmo.com/framework/assets)

Content scripts to manipulate or use an open website data:
[Plasmo content scripts](https://docs.plasmo.com/framework/content-scripts)

Working with Background worker (Useful for fetching/Heavy computation):
[Plasmo Background worker](https://docs.plasmo.com/framework/background-service-worker)

to add communication between popup and other parts of extension:
[Plasmo messaging](https://docs.plasmo.com/framework/messaging)

Working with storage:
[Plasmo storage](https://docs.plasmo.com/framework/storage)

For further guidance and full documentation, [visit our Documentation](https://docs.plasmo.com/)

## How to contribute

Please use `pnpm` over `npm`

```
npm install -g pnpm
```

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
