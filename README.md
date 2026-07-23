# Portfolio de Alexander Montilla

## Integración con Spotify

La aplicación muestra la reproducción actual únicamente cuando Spotify informa
que hay contenido reproduciéndose. El navegador consulta el endpoint interno cada
30 segundos; cuando no hay reproducción o Spotify no está disponible, el bloque
permanece oculto.

Variables requeridas:

```env
SPOTIFY_CLIENT_ID=""
SPOTIFY_CLIENT_SECRET=""
SPOTIFY_AUTHORIZATION=""
SPOTIFY_REFRESH_TOKEN_ISSUED_AT=""
```

En Spotify Dashboard registra exactamente esta Redirect URI:

```text
http://127.0.0.1:4321/callback
```

Para autorizar o renovar el refresh token:

```sh
npm run spotify:auth
```

El comando abre Spotify, recibe el callback local y actualiza
`SPOTIFY_AUTHORIZATION` y `SPOTIFY_REFRESH_TOKEN_ISSUED_AT` en `.env` sin
mostrar el token en la terminal.

Para verificar el token y consultar cuánto tiempo aproximado le queda:

```sh
npm run spotify:check
```

Spotify limita los refresh tokens de aplicaciones en Development Mode a 180 días,
por lo que la reautorización semestral no puede eliminarse. Este flujo reduce la
renovación a un solo comando.

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
