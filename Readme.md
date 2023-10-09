# Prisma Backend With TypeScript

## Step - 1: Init project

```sh
npm init -y
```

## Step - 2: Install typescript as devDependencies

```sh
npm i -D typescript
```

## Step - 3: Create tsconfig file

```sh
npx tsc --init
```

## Step - 4: Add ts-node and @types/node

```sh
npm i -D ts-node @types/node
```

## Step - 5: Add required scripts

```json
"scripts": {
    "server": "nodemon ./server/index.ts",
    "build": "tsc",
    "start": "node ./build",
    "studio": "prisma studio",
    "generate": "prisma generate"
 }
```

## Step - 6: Update tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./server",
    "outDir": "./build",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Step - 7: Create proper folder structure

```sh
mkdir -p server/{configs,controllers,middlewares,plugins,routes,services,types,validations}
```

## Step - 8: Create `index.ts` in all folders

```sh
cd server
echo "export {};" >> "index.ts"
for dir in *; do [ -d "$dir" ] && echo "export {};" >> "$dir/index.ts" ; done
```

## Step - 9: Install prisma

```sh
npm install prisma --save-dev
```

## Step - 10: Install prisma

```sh
npm install prisma --save-dev
```

## Step - 11: Set up Prisma with mongodb

```sh
npx prisma init --datasource-provider mongodb
```

## Step - 12: Install Prisma Client

```sh
npm install @prisma/client
```
