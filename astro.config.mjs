import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://example.com',
  output: 'server', // 关键：开启服务器模式
  adapter: cloudflare(), // 关键：连接 Cloudflare
  integrations: [mdx(), sitemap()],
});
