// https://nuxt.com/docs/api/configuration/nuxt-config
// Fallbacks: cliente Supabase exige URL/key; sem .env a home ainda sobe (Auth real após configurar o projeto).
const supabaseLocalUrl = 'http://127.0.0.1:54321'
const supabaseLocalAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  app: {
    head: {
      title: 'Projeto Ser Luz',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  supabase: {
    url:
      process.env.NUXT_PUBLIC_SUPABASE_URL
      || process.env.SUPABASE_URL
      || supabaseLocalUrl,
    key:
      process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
      || process.env.SUPABASE_ANON_KEY
      || process.env.SUPABASE_KEY
      || supabaseLocalAnonKey,
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      // Middleware global do módulo: só protege painéis e admin (home e demais rotas públicas livres)
      include: ['/painel*', '/admin*'],
    },
  },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
  },
})
