import { Order, LedgerRecord, TeaTourProduct, TraceInfo } from '@/types';

export const mockOrderList: Order[] = [
  {
    id: '1',
    orderNo: 'DD20260616001',
    type: 'e-commerce',
    typeName: '电商订单',
    customerName: '张先生',
    phone: '138****5678',
    address: '北京市朝阳区建国路88号',
    items: [
      {
        id: 'i1',
        productName: '明前茶-特级礼盒装',
        productType: '明前茶',
        quantity: 2,
        unit: '盒',
        unitPrice: 1280,
        subtotal: 2560,
        batchNo: 'B20260614001'
      }
    ],
    totalAmount: 2560,
    paidAmount: 2560,
    status: 'paid',
    statusName: '已付款',
    createTime: '2026-06-16 09:30:00',
    payTime: '2026-06-16 09:35:00',
    traceCode: 'TC202606160001'
  },
  {
    id: '2',
    orderNo: 'DD20260616002',
    type: 'wholesale',
    typeName: '批发订单',
    customerName: '福建茶业有限公司',
    phone: '139****8888',
    address: '福州市鼓楼区五四路168号',
    items: [
      {
        id: 'i1',
        productName: '明前茶-一级',
        productType: '明前茶',
        quantity: 50,
        unit: '斤',
        unitPrice: 580,
        subtotal: 29000,
        batchNo: 'B20260614001'
      },
      {
        id: 'i2',
        productName: '雨前茶-一级',
        productType: '雨前茶',
        quantity: 30,
        unit: '斤',
        unitPrice: 420,
        subtotal: 12600,
        batchNo: 'B20260610001'
      }
    ],
    totalAmount: 41600,
    paidAmount: 20000,
    status: 'pending',
    statusName: '待发货',
    createTime: '2026-06-16 08:15:00',
    remark: '老客户，优先安排发货'
  },
  {
    id: '3',
    orderNo: 'DD20260615001',
    type: 'retail',
    typeName: '零售订单',
    customerName: '李女士',
    phone: '137****1234',
    items: [
      {
        id: 'i1',
        productName: '明前茶-特级品鉴装',
        productType: '明前茶',
        quantity: 5,
        unit: '罐',
        unitPrice: 168,
        subtotal: 840,
        batchNo: 'B20260613001'
      }
    ],
    totalAmount: 840,
    paidAmount: 840,
    status: 'shipping',
    statusName: '配送中',
    createTime: '2026-06-15 14:20:00',
    payTime: '2026-06-15 14:25:00',
    shipTime: '2026-06-15 16:00:00',
    traceCode: 'TC202606150001'
  },
  {
    id: '4',
    orderNo: 'DD20260615002',
    type: 'tour',
    typeName: '茶旅订单',
    customerName: '王先生',
    phone: '136****9999',
    items: [
      {
        id: 'i1',
        productName: '茶园深度体验一日游',
        productType: '茶旅体验',
        quantity: 4,
        unit: '人',
        unitPrice: 298,
        subtotal: 1192
      }
    ],
    totalAmount: 1192,
    paidAmount: 1192,
    status: 'pending',
    statusName: '待预约',
    createTime: '2026-06-15 10:00:00',
    payTime: '2026-06-15 10:05:00',
    remark: '预约6月20日体验'
  },
  {
    id: '5',
    orderNo: 'DD20260614001',
    type: 'e-commerce',
    typeName: '电商订单',
    customerName: '陈先生',
    phone: '135****6666',
    address: '上海市浦东新区陆家嘴环路1000号',
    items: [
      {
        id: 'i1',
        productName: '明前茶-特级礼盒装',
        productType: '明前茶',
        quantity: 1,
        unit: '盒',
        unitPrice: 1280,
        subtotal: 1280,
        batchNo: 'B20260613001'
      },
      {
        id: 'i2',
        productName: '雨前茶-一级礼盒装',
        productType: '雨前茶',
        quantity: 1,
        unit: '盒',
        unitPrice: 680,
        subtotal: 680,
        batchNo: 'B20260610001'
      }
    ],
    totalAmount: 1960,
    paidAmount: 1960,
    status: 'completed',
    statusName: '已完成',
    createTime: '2026-06-14 11:30:00',
    payTime: '2026-06-14 11:35:00',
    shipTime: '2026-06-14 15:00:00',
    completeTime: '2026-06-16 10:30:00',
    traceCode: 'TC202606140001'
  },
  {
    id: '6',
    orderNo: 'DD20260613001',
    type: 'wholesale',
    typeName: '批发订单',
    customerName: '广州茶文化公司',
    phone: '133****7777',
    address: '广州市荔湾区芳村茶叶城',
    items: [
      {
        id: 'i1',
        productName: '秋茶-一级',
        productType: '秋茶',
        quantity: 100,
        unit: '斤',
        unitPrice: 320,
        subtotal: 32000,
        batchNo: 'B20250915001'
      }
    ],
    totalAmount: 32000,
    paidAmount: 32000,
    status: 'completed',
    statusName: '已完成',
    createTime: '2026-06-13 09:00:00',
    payTime: '2026-06-13 09:30:00',
    shipTime: '2026-06-13 14:00:00',
    completeTime: '2026-06-15 16:00:00'
  }
];

export const mockLedgerRecords: LedgerRecord[] = [
  {
    id: '1',
    date: '2026-06-16',
    type: 'income',
    category: 'sales-ecommerce',
    categoryName: '电商销售收入',
    amount: 2560,
    relatedOrder: 'DD20260616001',
    operator: '张三',
    remark: '明前茶特级礼盒2盒',
    paymentMethod: '微信支付'
  },
  {
    id: '2',
    date: '2026-06-16',
    type: 'income',
    category: 'sales-wholesale',
    categoryName: '批发收入',
    amount: 20000,
    relatedOrder: 'DD20260616002',
    operator: '张三',
    remark: '福建茶业有限公司订金',
    paymentMethod: '银行转账'
  },
  {
    id: '3',
    date: '2026-06-15',
    type: 'income',
    category: 'sales-retail',
    categoryName: '零售收入',
    amount: 840,
    relatedOrder: 'DD20260615001',
    operator: '李四',
    remark: '明前茶品鉴装5罐',
    paymentMethod: '支付宝'
  },
  {
    id: '4',
    date: '2026-06-15',
    type: 'income',
    category: 'tour-income',
    categoryName: '茶旅收入',
    amount: 1192,
    relatedOrder: 'DD20260615002',
    operator: '李四',
    remark: '茶园体验游4人',
    paymentMethod: '微信支付'
  },
  {
    id: '5',
    date: '2026-06-15',
    type: 'expense',
    category: 'fertilizer',
    categoryName: '肥料采购',
    amount: 3500,
    operator: '王五',
    remark: '有机复合肥500kg',
    paymentMethod: '银行转账'
  },
  {
    id: '6',
    date: '2026-06-14',
    type: 'expense',
    category: 'labor',
    categoryName: '人工工资',
    amount: 18000,
    operator: '张三',
    remark: '5月份采摘工人工资',
    paymentMethod: '银行转账'
  },
  {
    id: '7',
    date: '2026-06-14',
    type: 'income',
    category: 'sales-ecommerce',
    categoryName: '电商销售收入',
    amount: 1960,
    relatedOrder: 'DD20260614001',
    operator: '李四',
    remark: '礼盒套装2盒',
    paymentMethod: '微信支付'
  },
  {
    id: '8',
    date: '2026-06-13',
    type: 'expense',
    category: 'pesticide',
    categoryName: '农药采购',
    amount: 1200,
    operator: '王五',
    remark: '生物农药20L',
    paymentMethod: '现金'
  },
  {
    id: '9',
    date: '2026-06-13',
    type: 'income',
    category: 'sales-wholesale',
    categoryName: '批发收入',
    amount: 32000,
    relatedOrder: 'DD20260613001',
    operator: '张三',
    remark: '广州茶文化公司秋茶',
    paymentMethod: '银行转账'
  },
  {
    id: '10',
    date: '2026-06-12',
    type: 'expense',
    category: 'logistics',
    categoryName: '物流费用',
    amount: 580,
    operator: '李四',
    remark: '6月份快递运费结算',
    paymentMethod: '微信支付'
  }
];

export const mockTeaTourProducts: TeaTourProduct[] = [
  {
    id: '1',
    name: '茶园观光一日游',
    type: 'tour',
    typeName: '观光游',
    description: '游览千亩生态茶园，了解茶叶种植知识，体验茶园风光',
    price: 128,
    duration: '4小时',
    maxPeople: 50,
    bookedCount: 28,
    status: 'available',
    image: 'https://picsum.photos/id/1039/600/400',
    features: ['专业导游讲解', '茶园观光车', '免费品茶', '茶点小食']
  },
  {
    id: '2',
    name: '采茶体验一日游',
    type: 'experience',
    typeName: '体验游',
    description: '亲手采摘茶叶，学习采茶技巧，体验茶农生活',
    price: 298,
    duration: '8小时',
    maxPeople: 20,
    bookedCount: 15,
    status: 'available',
    image: 'https://picsum.photos/id/1018/600/400',
    features: ['采茶服提供', '专业茶农指导', '亲手采摘鲜叶', '自制茶叶纪念品', '农家午餐']
  },
  {
    id: '3',
    name: '手工制茶工坊',
    type: 'workshop',
    typeName: '工坊课',
    description: '传统手工制茶工艺学习，从萎凋到烘干全程体验',
    price: 598,
    duration: '6小时',
    maxPeople: 10,
    bookedCount: 6,
    status: 'available',
    image: 'https://picsum.photos/id/1044/600/400',
    features: ['非遗大师授课', '全程手工制茶', '自制茶叶可带走', '专业茶艺教学', '茶点品鉴']
  },
  {
    id: '4',
    name: '深度茶文化之旅',
    type: 'tour',
    typeName: '深度游',
    description: '两天一夜深度体验，了解茶叶种植、采摘、制作全流程',
    price: 1280,
    duration: '2天1夜',
    maxPeople: 12,
    bookedCount: 4,
    status: 'available',
    image: 'https://picsum.photos/id/1036/600/400',
    features: ['全程专业讲解', '住宿茶山民宿', '三餐农家菜', '采茶制茶体验', '茶艺培训', '伴手礼包']
  }
];

export const mockTraceInfoMap: Record<string, TraceInfo> = {
  'TC202606140001': {
    traceCode: 'TC202606140001',
    batchNo: 'B20260614001',
    productName: '明前茶-特级礼盒装',
    teaPlot: {
      name: '1号茶园',
      area: 12.5,
      variety: '福鼎大白茶',
      altitude: 850
    },
    picking: {
      date: '2026-06-14',
      type: '明前茶',
      weight: 38.2,
      pickers: ['张三', '李四']
    },
    processing: {
      steps: [
        {
          name: '萎凋',
          startTime: '2026-06-14 08:00',
          endTime: '2026-06-14 14:30',
          parameters: [
            { name: '温度', value: '26', unit: '°C' },
            { name: '湿度', value: '62', unit: '%' },
            { name: '失水率', value: '19', unit: '%' }
          ]
        },
        {
          name: '杀青',
          startTime: '2026-06-14 15:00',
          endTime: '2026-06-14 16:30',
          parameters: [
            { name: '锅温', value: '225', unit: '°C' },
            { name: '杀青时间', value: '7', unit: '分钟' }
          ]
        },
        {
          name: '揉捻',
          startTime: '2026-06-14 17:00',
          endTime: '2026-06-14 17:45',
          parameters: [
            { name: '揉捻时间', value: '45', unit: '分钟' },
            { name: '细胞破碎率', value: '75', unit: '%' }
          ]
        },
        {
          name: '烘干',
          startTime: '2026-06-14 18:00',
          endTime: '2026-06-14 19:00',
          parameters: [
            { name: '初烘温度', value: '120', unit: '°C' },
            { name: '复烘温度', value: '90', unit: '°C' },
            { name: '含水率', value: '5.5', unit: '%' }
          ]
        },
        {
          name: '精制拼配',
          startTime: '2026-06-15 09:30',
          endTime: '2026-06-15 11:30',
          parameters: [
            { name: '拼配比例', value: '特级30%+一级70%', unit: '' },
            { name: '提香温度', value: '110', unit: '°C' }
          ]
        }
      ]
    },
    testing: {
      date: '2026-06-15',
      agency: '福建省茶叶质量检测中心',
      result: 'pass',
      reportUrl: ''
    },
    packaging: {
      date: '2026-06-15',
      spec: '250g/盒',
      quantity: 78
    },
    logistics: {
      company: '顺丰速运',
      trackingNo: 'SF1234567890',
      updateTime: '2026-06-16 10:30:00'
    }
  },
  'TC202606150001': {
    traceCode: 'TC202606150001',
    batchNo: 'B20260613001',
    productName: '明前茶-特级品鉴装',
    teaPlot: {
      name: '3号茶园',
      area: 8.5,
      variety: '福鼎大白茶',
      altitude: 920
    },
    picking: {
      date: '2026-06-13',
      type: '明前茶',
      weight: 25.6,
      pickers: ['王五', '赵六']
    },
    processing: {
      steps: [
        {
          name: '萎凋',
          startTime: '2026-06-13 07:30',
          endTime: '2026-06-13 14:00',
          parameters: [
            { name: '温度', value: '25', unit: '°C' },
            { name: '湿度', value: '65', unit: '%' },
            { name: '失水率', value: '18', unit: '%' }
          ]
        },
        {
          name: '杀青',
          startTime: '2026-06-13 14:30',
          endTime: '2026-06-13 16:00',
          parameters: [
            { name: '锅温', value: '230', unit: '°C' },
            { name: '杀青时间', value: '6', unit: '分钟' }
          ]
        },
        {
          name: '揉捻',
          startTime: '2026-06-13 16:30',
          endTime: '2026-06-13 17:15',
          parameters: [
            { name: '揉捻时间', value: '45', unit: '分钟' },
            { name: '细胞破碎率', value: '78', unit: '%' }
          ]
        },
        {
          name: '烘干',
          startTime: '2026-06-13 17:30',
          endTime: '2026-06-13 18:30',
          parameters: [
            { name: '初烘温度', value: '118', unit: '°C' },
            { name: '复烘温度', value: '88', unit: '°C' },
            { name: '含水率', value: '5.2', unit: '%' }
          ]
        },
        {
          name: '精制拼配',
          startTime: '2026-06-14 08:30',
          endTime: '2026-06-14 10:30',
          parameters: [
            { name: '拼配比例', value: '特级40%+一级60%', unit: '' },
            { name: '提香温度', value: '108', unit: '°C' }
          ]
        }
      ]
    },
    testing: {
      date: '2026-06-14',
      agency: '福建省茶叶质量检测中心',
      result: 'pass',
      reportUrl: ''
    },
    packaging: {
      date: '2026-06-14',
      spec: '50g/罐',
      quantity: 256
    },
    logistics: {
      company: '圆通快递',
      trackingNo: 'YT9876543210',
      updateTime: '2026-06-16 08:30:00'
    }
  },
  'TC202606160001': {
    traceCode: 'TC202606160001',
    batchNo: 'B20260614001',
    productName: '明前茶-特级礼盒装',
    teaPlot: {
      name: '2号茶园',
      area: 15.2,
      variety: '福鼎大白茶',
      altitude: 880
    },
    picking: {
      date: '2026-06-14',
      type: '明前茶',
      weight: 42.5,
      pickers: ['张三', '李四', '王五']
    },
    processing: {
      steps: [
        {
          name: '萎凋',
          startTime: '2026-06-14 08:30',
          endTime: '2026-06-14 15:00',
          parameters: [
            { name: '温度', value: '27', unit: '°C' },
            { name: '湿度', value: '60', unit: '%' },
            { name: '失水率', value: '20', unit: '%' }
          ]
        },
        {
          name: '杀青',
          startTime: '2026-06-14 15:30',
          endTime: '2026-06-14 17:00',
          parameters: [
            { name: '锅温', value: '228', unit: '°C' },
            { name: '杀青时间', value: '8', unit: '分钟' }
          ]
        },
        {
          name: '揉捻',
          startTime: '2026-06-14 17:30',
          endTime: '2026-06-14 18:15',
          parameters: [
            { name: '揉捻时间', value: '45', unit: '分钟' },
            { name: '细胞破碎率', value: '76', unit: '%' }
          ]
        },
        {
          name: '烘干',
          startTime: '2026-06-14 18:30',
          endTime: '2026-06-14 19:30',
          parameters: [
            { name: '初烘温度', value: '122', unit: '°C' },
            { name: '复烘温度', value: '92', unit: '°C' },
            { name: '含水率', value: '5.3', unit: '%' }
          ]
        },
        {
          name: '精制拼配',
          startTime: '2026-06-15 10:00',
          endTime: '2026-06-15 12:00',
          parameters: [
            { name: '拼配比例', value: '特级35%+一级65%', unit: '' },
            { name: '提香温度', value: '112', unit: '°C' }
          ]
        }
      ]
    },
    testing: {
      date: '2026-06-15',
      agency: '福建省茶叶质量检测中心',
      result: 'pass',
      reportUrl: ''
    },
    packaging: {
      date: '2026-06-15',
      spec: '250g/盒',
      quantity: 86
    }
  }
};

export const mockTraceInfo: TraceInfo = mockTraceInfoMap['TC202606140001'];
