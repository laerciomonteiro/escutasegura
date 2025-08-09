export default defineNuxtRouteMiddleware((to) => {
  // Headers de segurança para anonimização
  if (process.server) {
    const event = useRequestEvent()
    
    // Remove headers que podem identificar o usuário
    if (event?.node.req.headers) {
      delete event.node.req.headers['x-forwarded-for']
      delete event.node.req.headers['x-real-ip']
      delete event.node.req.headers['cf-connecting-ip']
      delete event.node.req.headers['user-agent']
    }
  }
})