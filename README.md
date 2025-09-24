## 🎯 Overview
This is Front-end repo for BA Copilot. A web-base application that focus on BA in their bussiness.  

## ✨ Getting Started

First, install packages:

```bash
npm i
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📋 About this repo
This repo is built on Nextjs's architecture. We mainly work on these folders (There will be update if there is anything changes)
### 1. app
- This folder contains the main program
### 2. components
- This folder contains components which are downloaded from Shadcn UI, and our's custom components
- Every component should be named in PascalCase. For example: SignInButton, SideBar,...
### 3. lib
- Including functions, constant varibles, etc. that are relevant to the program. This can be anything. For example: getList(), getUser(),... anything you want that help you implement features.
### 4. public
- Including static file, such as image, logo, video, etc.
### 5. docs
- Holding documents about feature's workflows, many screens that a feature needs. This folder will be updated often.


These folders above are the main folders that you can modify if you aren't in FE team. Other files config for our program to run precisely. 

## Shadcn UI
- View all components here:
https://ui.shadcn.com/docs/components
- Install a component:

```
npx shadcn@latest add accordion
```




