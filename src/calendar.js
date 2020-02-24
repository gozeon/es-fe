import { verfiy } from './auth'
verfiy()
import qs from 'query-string'
import html2canvas from 'html2canvas'
import Swal from 'sweetalert2'
import { Calendar } from '@fullcalendar/core'
import zhcnLocale from '@fullcalendar/core/locales/zh-cn'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { format } from 'date-fns'

const { projectId } = qs.parse(location.search)

$(document).ready(function() {
  var calendarEl = document.getElementById('projectList')

  var calendar = new Calendar(calendarEl, {
    // height: $(document).height() - 120,
    themeSystem: 'bootstrap4',
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    defaultDate: format(new Date(), 'yyyy-MM-dd'),
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    locale: zhcnLocale,
    events: [],
  })

  calendar.render()

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
        calendar.removeAllEvents()
        calendar.addEventSource(formatEvent(response.data))
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

  function formatEvent(data) {
    for (let i = 0; i < data.length; i++) {
      switch (+data[i].status) {
        case 1:
          data[i].backgroundColor = '#007bff'
          break
        case 2:
          data[i].backgroundColor = '#ffc107'
          break
        case 3:
          data[i].backgroundColor = '#28a745'
          break
      }
      data[i].textColor = '#fff'
    }
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

  $('#screenshot').click(function() {
    html2canvas($('#projectList')[0])
      .then(function(canvas) {
        downloadCanvas(canvas)
      })
      .catch(function(error) {
        Swal.fire({
          title: '截图失败',
          text: error.message,
          icon: 'error',
        })
      })
  })

  function downloadCanvas(canvas) {
    var a = document.createElement('a')
    a.href = canvas
      .toDataURL('image/jpeg')
      .replace('image/jpeg', 'image/octet-stream')
    a.download = `EventS-screenshot-${new Date()}.jpg`
    a.click()
  }
})
