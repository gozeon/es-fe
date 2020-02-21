import { write } from './auth'

localStorage.removeItem('es_token')
localStorage.removeItem('es_username')

$('form').submit(function(e) {
  e.preventDefault()
  const data = $('form')
    .serializeArray()
    .reduce((a, x) => ({ ...a, [x.name]: x.value }), {})
  write(data)
})
