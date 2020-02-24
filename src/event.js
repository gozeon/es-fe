import Swal from 'sweetalert2'
import qs from 'query-string'
import { verfiy } from './auth'
const { projectId } = qs.parse(location.search)
import './laydate/laydate'

verfiy()
load()

if (projectId) {
  $('#newBtn').removeClass('d-none')
  $('#calendarBtn')
    .removeClass('d-none')
    .attr('href', `calendar.html?projectId=${projectId}`)
}

laydate.render({
  elem: '#time',
  type: 'datetime',
  range: '-',
  format: 'yyyy-MM-dd HH:mm:ss',
})

$('form.newproject').submit(function(e) {
  e.preventDefault()
  const reqData = $('form')
    .serializeArray()
    .reduce((a, x) => ({ ...a, [x.name]: x.value }), {})

  $.ajax({
    method: 'POST',
    data: formatReqData(reqData),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('es_token')}`,
    },
    url: `${process.env.API_HOST}/event`,
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
        load()
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

function load() {
  $.ajax({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('es_token')}`,
    },
    url: `${process.env.API_HOST}/event?projectId=${projectId ? projectId : 0}`,
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
        <tr>
            <th scope="row">${data[i].id}</th>
            <td>${data[i].title}</td>
            <td>${data[i].start}</td>
            <td>${data[i].end}</td>
            <td>${data[i].create_user}</td>
            <td><span class="badge badge-${
              formatStatus(data[i].status).theme
            } badge-pill">${formatStatus(data[i].status).text}</span></td>
        </tr>
        `)
  }
  $('#eventList')
    .empty()
    .append(elements)
}

function formatStatus(status) {
  switch (+status) {
    case 1:
      return {
        theme: 'primary',
        text: 'Todo',
      }
    case 2:
      return {
        theme: 'warning',
        text: 'Doing',
      }
    case 3:
      return {
        theme: 'success',
        text: 'Done',
      }
    default:
      return {
        theme: 'primary',
        text: 'none',
      }
  }
}

function formatReqData(data) {
  data.status = +data.status
  data.start = data.time.split(' - ')[0]
  data.end = data.time.split(' - ')[1]
  data.project_id = projectId
  delete data.time
  return data
}

configSearch()
function configSearch() {
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
        renderSearch(response.data)
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

function renderSearch(data) {
  var elements = $()
  elements = elements.add(`
    <option value="" disabled selected>请选择</option>
  `)
  for (let i = 0; i < data.length; i++) {
    elements = elements.add(`
    <option value="${data[i].id}">${data[i].name}</option>
        `)
  }
  $('#projectSelect')
    .empty()
    .append(elements)

  if (projectId) {
    $('#projectSelect').val(projectId)
  }
}
