import Swal from 'sweetalert2'
import qs from 'query-string'

const token = localStorage.getItem('es_token')

function go() {
  const query = qs.parse(location.search)
  if (query.next) {
    location.href = query.next
  } else {
    location.href = 'index.html'
  }
}

export function write(data) {
  $.ajax({
    method: 'POST',
    url: `${process.env.API_HOST}/auth/login`,
    data: data,
    success: function(response) {
      if (response.statusCode !== 200) {
        Swal.fire({
          title: response.message,
          icon: 'error',
        })
      } else {
        localStorage.setItem('es_token', response.data.token)
        localStorage.setItem('es_username', data.username)
        go()
      }
    },
    error: function(error) {
      Swal.fire({
        title: '网络错误',
        text: error.message,
        icon: 'error',
      })
    },
  })
}

export function verfiy() {
  if (!token) {
    location.href = 'login.html'
  }

  $.ajax({
    method: 'GET',
    url: `${process.env.API_HOST}/auth/verify`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function(data) {
      const next = `login.html?next=${location.href}`

      if (data.statusCode !== 200) {
        location.href = next
      } else {
        if ($('#showUsername').length > 0) {
          $('#showUsername')
            .text(localStorage.getItem('es_username'))
            .click(function() {
              location.href = next
            })
        }
      }
    },
    error: function(error) {
      Swal.fire({
        title: '网络错误',
        text: error.message,
        icon: 'error',
      })
    },
  })
}
