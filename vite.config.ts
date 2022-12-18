import path from 'path'
import dns from 'dns'
import fs from "fs"
import { defineConfig, loadEnv, PluginOption } from 'vite'
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
    plugins: [react(), htmlPlugin(envs), postBundledPlugin()],
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
const htmlPlugin = (env: ReturnType<typeof loadEnv>): PluginOption => {
  return {
    name: "html-transform",
    transformIndexHtml: {
      enforce: "pre",
      transform: html =>
        html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match),
    },
  }
}

// bundle処理後に処理を行うために使用する
const postBundledPlugin = (): PluginOption => {
  return {
    name: 'postBundled',
    apply: 'build',
    closeBundle: {
      order: 'post',
      handler() {
        const distSitemapPath = path.resolve(__dirname, "dist", "sitemap.xml")
        const content = fs.readFileSync(distSitemapPath, {encoding: "utf-8"})
        // sitemap.xmlのlastmodの値をbuild時の日付に書き換える
        fs.writeFileSync(
          distSitemapPath,
          content.replace(/%INSERTED_BUILDDATE%/g, new Date().toISOString().slice(0,10))
        )
      }
    }
  }
}