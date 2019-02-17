import XEAjaxMock from 'xe-ajax-mock'

// mock defaults
XEAjaxMock.setup({
  template: true,
  pathVariable: 'auto',
  timeout: '200-1000',
  error: true,
  log: true
})

XEAjaxMock.template.mixin({
  getPageId ({ currentPage, pageSize }, $index) {
    return (currentPage * pageSize) + $index + 1
  },
  getPageList ({ currentPage, pageSize }, totalResult) {
    return (currentPage * pageSize) > totalResult ? (totalResult + pageSize - currentPage * pageSize) : pageSize
  }
})
