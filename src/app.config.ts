export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/farming/index',
    'pages/processing/index',
    'pages/sales/index',
    'pages/mine/index',
    'pages/plot-detail/index',
    'pages/farm-record/index',
    'pages/picking/index',
    'pages/process-detail/index',
    'pages/warehouse/index',
    'pages/order-detail/index',
    'pages/trace/index',
    'pages/ledger/index',
    'pages/tea-tour/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2E7D32',
    navigationBarTitleText: '山地茶园智慧管理',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F1F8E9'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#2E7D32',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/farming/index',
        text: '农事'
      },
      {
        pagePath: 'pages/processing/index',
        text: '加工'
      },
      {
        pagePath: 'pages/sales/index',
        text: '销售'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
