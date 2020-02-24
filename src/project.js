import Swal from 'sweetalert2'
import { verfiy } from './auth'

verfiy()
loadPorject()

$('form.newproject').submit(function(e) {
  e.preventDefault()
  const reqData = $('form')
    .serializeArray()
    .reduce((a, x) => ({ ...a, [x.name]: x.value }), {})
  $.ajax({
    method: 'POST',
    data: reqData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('es_token')}`,
    },
    url: `${process.env.API_HOST}/project`,
    success: function(response) {
      if (response.statusCode === 403) {
        Swal.fire({
          title: '权限错误',
          text: response.message,
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: '取消',
          confirmButtonColor: '#fff',
          confirmButtonText: `<a href="login.html?next=${location.href}">跳转登录</a>`,
        })
      }
      if (response.statusCode === 200) {
        $('#newModal').modal('hide')
        loadPorject()
      } else {
        Swal.fire({
          title: '添加错误',
          text: response.message,
          icon: 'error',
        })
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
})

function loadPorject() {
  $.ajax({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('es_token')}`,
    },
    url: `${process.env.API_HOST}/project`,
    success: function(response) {
      if (response.statusCode === 403) {
      }

      if (response.statusCode === 200) {
        render(response.data)
      } else {
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

function render(data) {
  var elements = $()
  for (let i = 0; i < data.length; i++) {
    elements = elements.add(`
        <div class="col-sm-3 mt-3">
            <div class="card">
            <div class="card-body">
                <h5 class="card-title">${data[i].name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${data[i].create_user}</h6>
                <h6 class="card-subtitle mb-2 text-muted">${data[i].create_at}</h6>
                <p class="card-text">${data[i].description}</p>
                <a href="event.html?projectId=${data[i].id}" class="btn btn-warning">事件</a>
                <a href="calendar.html?projectId=${data[i].id}" class="btn btn-info">日历</a>
            </div>
            </div>
        </div>
        `)
  }
  $('#projectList')
    .empty()
    .append(elements)
}
