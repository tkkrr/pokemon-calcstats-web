import path from 'path'
import dns from 'dns'
import fs from "fs"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

dns.setDefaultResultOrder('verbatim')

const envDirPath = path.resolve( new URL(import.meta.url).pathname, "../envs" )
const indexHtmlPath = path.resolve(new URL(import.meta.url).pathname , '../src', 'index.html')
const distPath = path.resolve( new URL(import.meta.url).pathname, "../dist" )

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {

  const envs = loadEnv(mode, envDirPath, "")

  // ローカルにてSSL/TLSを使用するための設定
  const HttpsSetting = envs.TLS_SERVER ? {
    host: 'localhost.ticktuck.tech',
    https: {
      key: fs.readFileSync(envs.TLS_KEY_FILE_PATH),
      cert: fs.readFileSync(envs.TLS_CERT_FILE_PATH),
    }
  } : {}

  return {
    plugins: [react(), htmlPlugin(envs)],
    root: "src",
    envDir: envDirPath,
    build: {
      outDir: distPath,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: indexHtmlPath,
        }
      }
    },
    server: {
      host: true,
      port: 3000,
      hot: true,
      ...HttpsSetting
    }
  }
})

// index.htmlに環境変数を埋込むために使用する
function htmlPlugin(env: ReturnType<typeof loadEnv>) {
  return {
    name: "html-transform",
    transformIndexHtml: {
      enforce: "pre" as const,
      transform: (html: string): string =>
        html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match),
    },
  };
}