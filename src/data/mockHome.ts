import { DashboardStats, TodoItem, WeatherInfo, FunctionItem } from '@/types';

export const mockDashboardStats: DashboardStats = {
  totalArea: 128.5,
  totalPlots: 12,
  todayPicking: 128.5,
  monthPicking: 2856.3,
  processingBatches: 6,
  stockQuantity: 15680,
  pendingOrders: 18,
  monthSales: 285600,
  yearSales: 3280000
};

export const mockTodoList: TodoItem[] = [
  {
    id: '1',
    title: '1号茶园需施肥',
    type: 'fertilize',
    priority: 'high',
    deadline: '2026-06-17',
    status: 'pending',
    relatedPlot: '1号茶园'
  },
  {
    id: '2',
    title: '明前茶采摘排期',
    type: 'pick',
    priority: 'high',
    deadline: '2026-06-18',
    status: 'pending',
    relatedPlot: '2号茶园'
  },
  {
    id: '3',
    title: '3号茶园除草',
    type: 'weed',
    priority: 'medium',
    deadline: '2026-06-19',
    status: 'pending',
    relatedPlot: '3号茶园'
  },
  {
    id: '4',
    title: '批次B20260615杀青工序',
    type: 'process',
    priority: 'high',
    deadline: '2026-06-16',
    status: 'pending'
  },
  {
    id: '5',
    title: '订单DD20260615001发货',
    type: 'ship',
    priority: 'medium',
    deadline: '2026-06-17',
    status: 'pending'
  }
];

export const mockWeather: WeatherInfo = {
  date: '2026-06-16',
  temperature: '22°C ~ 30°C',
  humidity: '75%',
  weather: '多云转晴',
  wind: '东南风3级',
  forecast: [
    { date: '明天', weather: '晴', tempRange: '21°C ~ 32°C' },
    { date: '周四', weather: '阴', tempRange: '20°C ~ 28°C' },
    { date: '周五', weather: '小雨', tempRange: '19°C ~ 25°C' }
  ]
};

export const mockHomeFunctions: FunctionItem[] = [
  { id: '1', name: '茶园地块', icon: '🌿', color: '#2E7D32', page: '/pages/farming/index' },
  { id: '2', name: '农事管理', icon: '👨‍🌾', color: '#8D6E63', page: '/pages/farm-record/index' },
  { id: '3', name: '采摘记录', icon: '🍃', color: '#66BB6A', page: '/pages/picking/index' },
  { id: '4', name: '制茶工序', icon: '🍵', color: '#795548', page: '/pages/processing/index' },
  { id: '5', name: '仓储管理', icon: '📦', color: '#5D4037', page: '/pages/warehouse/index' },
  { id: '6', name: '订单销售', icon: '📋', color: '#FF9800', page: '/pages/sales/index' },
  { id: '7', name: '溯源查询', icon: '🔍', color: '#2196F3', page: '/pages/trace/index' },
  { id: '8', name: '收支台账', icon: '💰', color: '#4CAF50', page: '/pages/ledger/index' },
  { id: '9', name: '茶旅体验', icon: '🏞️', color: '#9C27B0', page: '/pages/tea-tour/index', badge: '新' }
];

export const mockPickingSchedule = [
  {
    id: '1',
    plotName: '1号茶园',
    type: '明前茶',
    typeName: '明前茶',
    startDate: '2026-06-18',
    endDate: '2026-06-22',
    expectedYield: 250,
    status: 'upcoming'
  },
  {
    id: '2',
    plotName: '2号茶园',
    type: '雨前茶',
    typeName: '雨前茶',
    startDate: '2026-06-25',
    endDate: '2026-06-30',
    expectedYield: 380,
    status: 'upcoming'
  },
  {
    id: '3',
    plotName: '5号茶园',
    type: '秋茶',
    typeName: '秋茶',
    startDate: '2026-09-10',
    endDate: '2026-09-20',
    expectedYield: 420,
    status: 'planned'
  }
];
