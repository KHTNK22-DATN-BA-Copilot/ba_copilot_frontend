## 🎯 Overview
This is Front-end repo for BA Copilot. A web-base application that focus on BA in their bussiness.   

## ✨ Getting Started
### 1. If you are using npm
First, install packages:


```bash
npm i
```

Second, run the development server:

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

### 2. If you want to use docker
- clone this repo
- change directory
    ```bash
    cd ba-copilot
    ```
- run docker
    ```bash
    docker compose up --build -d
    ```
### ⚠️ Important:
- Please ensure that you change the back-end domain in `.env` file. If you are using:
    - npm: set domain to `http://localhost:8010`
    - docker: set domain to `http://host.docker.internal:8010`
        

## 📁 About this repo
- This repo is built on Nextjs's architecture. We mainly work on these folders (There will be an update if there are any changes)

- Next's architecture allows you to create a new route as well as a new page based on folder structure. For example
```
ba-copilot
├── app
|   ├── dashboard
|       ├── page.tsx
```
- This structure will create a new route [`http://localhost:3000/dashboard`]()

- View another Next's features here: https://nextjs.org/

```
ba-copilot
├── app
|   ├── (auth)           // Auth feature
|   ├── api              // local api
|   ├── dashboard        // dashboard page
|   ├── favicon.ico
|   ├── global.css       // global css
|   ├── layout.tsx       // wrap layout
|   ├── page.tsx         // main page
├── component
|   ├── ui               // components from Shadcn
├── docs                 // documents
├── lib 
|   ├── utils.ts         // util functions
├── public
├── .pretierrc           // format code
├── components.json  
├── eslint.config.mjs
├── middleware.ts
├── next.config.ts
├── package-log.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
```

### What will you do
If you aren't in FE team, I suggest that you should modify the following repos.

### 1. app
- This folder contains the main program

### 2. components
- This folder contains components which are downloaded from Shadcn UI, and our custom components
- Every component should be named in PascalCase. For example: SignInButton, SideBar,...
- There is a ui folder where the Shadcn components are downloaded. Therefore, if you want to create your own components, you should create them outside this folder

### 3. lib
- Including functions, constant variables, etc. that are relevant to the program. This can be anything. For example: getList(), getUser(),... anything you want that help you implement features.

### 4. public
- Including static files, such as images, logos, videos, etc.

### 5. docs
- Holding documents about feature's workflows, testing documents, screens that the feature needs. This folder will be updated often.


These folders above are the main folders that you can modify if you aren't in FE team. Other files are configed for our program to run precisely. 

## 📋 Shadcn UI
- View all components here:
https://ui.shadcn.com/docs/components

- Install a component:
```
npx shadcn@latest add accordion
```

This is the initial phase of the project, this repo seems basic. We will update this file whenever new features, documents, or other information become available.    




