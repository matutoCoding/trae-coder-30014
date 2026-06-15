import { TeaProcess, ProcessStep, WarehouseItem } from '@/types';

export const mockProcessingList: TeaProcess[] = [
  {
    id: '1',
    batchNo: 'B20260615001',
    currentStep: 2,
    totalSteps: 6,
    startTime: '2026-06-15 08:00',
    estimatedEndTime: '2026-06-16 12:00',
    status: 'processing',
    inputWeight: 42.5,
    outputWeight: 0,
    operator: '李师傅',
    steps: [
      {
        id: 's1',
        name: '萎凋',
        type: 'withering',
        status: 'completed',
        startTime: '2026-06-15 08:00',
        endTime: '2026-06-15 14:00',
        operator: '李师傅',
        parameters: [
          { name: '温度', value: '25', unit: '°C' },
          { name: '湿度', value: '65', unit: '%' },
          { name: '摊叶厚度', value: '3', unit: 'cm' },
          { name: '失水率', value: '18', unit: '%' }
        ]
      },
      {
        id: 's2',
        name: '杀青',
        type: 'fixation',
        status: 'processing',
        startTime: '2026-06-15 14:30',
        operator: '李师傅',
        parameters: [
          { name: '锅温', value: '220', unit: '°C' },
          { name: '投叶量', value: '5', unit: 'kg/次' },
          { name: '杀青时间', value: '8', unit: '分钟' }
        ]
      },
      {
        id: 's3',
        name: '揉捻',
        type: 'rolling',
        status: 'pending',
        parameters: [
          { name: '揉捻时间', value: '45', unit: '分钟' },
          { name: '压力', value: '轻-重-轻', unit: '' }
        ]
      },
      {
        id: 's4',
        name: '烘干',
        type: 'drying',
        status: 'pending',
        parameters: [
          { name: '初烘温度', value: '120', unit: '°C' },
          { name: '初烘时间', value: '15', unit: '分钟' },
          { name: '复烘温度', value: '90', unit: '°C' },
          { name: '复烘时间', value: '20', unit: '分钟' }
        ]
      },
      {
        id: 's5',
        name: '筛选分级',
        type: 'sorting',
        status: 'pending',
        parameters: [
          { name: '筛网规格', value: '40目/60目', unit: '' },
          { name: '风选风速', value: '8', unit: 'm/s' }
        ]
      },
      {
        id: 's6',
        name: '精制拼配',
        type: 'refining',
        status: 'pending',
        parameters: [
          { name: '拼配比例', value: '待定', unit: '' },
          { name: '提香温度', value: '110', unit: '°C' }
        ]
      }
    ]
  },
  {
    id: '2',
    batchNo: 'B20260615002',
    currentStep: 1,
    totalSteps: 6,
    startTime: '2026-06-15 10:00',
    estimatedEndTime: '2026-06-16 14:00',
    status: 'processing',
    inputWeight: 56.8,
    outputWeight: 0,
    operator: '王师傅',
    steps: [
      {
        id: 's1',
        name: '萎凋',
        type: 'withering',
        status: 'processing',
        startTime: '2026-06-15 10:00',
        operator: '王师傅',
        parameters: [
          { name: '温度', value: '24', unit: '°C' },
          { name: '湿度', value: '68', unit: '%' },
          { name: '摊叶厚度', value: '2.5', unit: 'cm' }
        ]
      },
      {
        id: 's2',
        name: '杀青',
        type: 'fixation',
        status: 'pending',
        parameters: [
          { name: '锅温', value: '230', unit: '°C' },
          { name: '投叶量', value: '6', unit: 'kg/次' }
        ]
      },
      {
        id: 's3',
        name: '揉捻',
        type: 'rolling',
        status: 'pending',
        parameters: []
      },
      {
        id: 's4',
        name: '烘干',
        type: 'drying',
        status: 'pending',
        parameters: []
      },
      {
        id: 's5',
        name: '筛选分级',
        type: 'sorting',
        status: 'pending',
        parameters: []
      },
      {
        id: 's6',
        name: '精制拼配',
        type: 'refining',
        status: 'pending',
        parameters: []
      }
    ]
  },
  {
    id: '3',
    batchNo: 'B20260614001',
    currentStep: 6,
    totalSteps: 6,
    startTime: '2026-06-14 08:00',
    estimatedEndTime: '2026-06-15 12:00',
    status: 'completed',
    inputWeight: 38.2,
    outputWeight: 7.8,
    operator: '李师傅',
    steps: [
      {
        id: 's1',
        name: '萎凋',
        type: 'withering',
        status: 'completed',
        startTime: '2026-06-14 08:00',
        endTime: '2026-06-14 14:30',
        operator: '李师傅',
        parameters: [
          { name: '温度', value: '26', unit: '°C' },
          { name: '湿度', value: '62', unit: '%' },
          { name: '失水率', value: '19', unit: '%' }
        ]
      },
      {
        id: 's2',
        name: '杀青',
        type: 'fixation',
        status: 'completed',
        startTime: '2026-06-14 15:00',
        endTime: '2026-06-14 16:30',
        operator: '李师傅',
        parameters: [
          { name: '锅温', value: '225', unit: '°C' },
          { name: '杀青时间', value: '7', unit: '分钟' }
        ]
      },
      {
        id: 's3',
        name: '揉捻',
        type: 'rolling',
        status: 'completed',
        startTime: '2026-06-14 17:00',
        endTime: '2026-06-14 17:45',
        operator: '李师傅',
        parameters: [
          { name: '揉捻时间', value: '45', unit: '分钟' },
          { name: '细胞破碎率', value: '75', unit: '%' }
        ]
      },
      {
        id: 's4',
        name: '烘干',
        type: 'drying',
        status: 'completed',
        startTime: '2026-06-14 18:00',
        endTime: '2026-06-14 19:00',
        operator: '李师傅',
        parameters: [
          { name: '初烘温度', value: '120', unit: '°C' },
          { name: '复烘温度', value: '90', unit: '°C' },
          { name: '含水率', value: '5.5', unit: '%' }
        ]
      },
      {
        id: 's5',
        name: '筛选分级',
        type: 'sorting',
        status: 'completed',
        startTime: '2026-06-15 08:00',
        endTime: '2026-06-15 09:00',
        operator: '王师傅',
        parameters: [
          { name: '特级', value: '1.2', unit: 'kg' },
          { name: '一级', value: '3.5', unit: 'kg' },
          { name: '二级', value: '2.1', unit: 'kg' },
          { name: '碎茶', value: '1.0', unit: 'kg' }
        ]
      },
      {
        id: 's6',
        name: '精制拼配',
        type: 'refining',
        status: 'completed',
        startTime: '2026-06-15 09:30',
        endTime: '2026-06-15 11:30',
        operator: '李师傅',
        parameters: [
          { name: '拼配比例', value: '特级30%+一级70%', unit: '' },
          { name: '提香温度', value: '110', unit: '°C' },
          { name: '最终净重', value: '7.8', unit: 'kg' }
        ]
      }
    ]
  },
  {
    id: '4',
    batchNo: 'B20260613001',
    currentStep: 6,
    totalSteps: 6,
    startTime: '2026-06-13 08:00',
    estimatedEndTime: '2026-06-14 12:00',
    status: 'completed',
    inputWeight: 62.3,
    outputWeight: 12.5,
    operator: '王师傅',
    steps: [
      {
        id: 's1',
        name: '萎凋',
        type: 'withering',
        status: 'completed',
        startTime: '2026-06-13 08:00',
        endTime: '2026-06-13 14:00',
        operator: '王师傅',
        parameters: []
      },
      {
        id: 's2',
        name: '杀青',
        type: 'fixation',
        status: 'completed',
        startTime: '2026-06-13 14:30',
        endTime: '2026-06-13 16:00',
        operator: '王师傅',
        parameters: []
      },
      {
        id: 's3',
        name: '揉捻',
        type: 'rolling',
        status: 'completed',
        startTime: '2026-06-13 16:30',
        endTime: '2026-06-13 17:15',
        operator: '李师傅',
        parameters: []
      },
      {
        id: 's4',
        name: '烘干',
        type: 'drying',
        status: 'completed',
        startTime: '2026-06-13 17:30',
        endTime: '2026-06-13 18:30',
        operator: '李师傅',
        parameters: []
      },
      {
        id: 's5',
        name: '筛选分级',
        type: 'sorting',
        status: 'completed',
        startTime: '2026-06-14 08:00',
        endTime: '2026-06-14 09:00',
        operator: '王师傅',
        parameters: []
      },
      {
        id: 's6',
        name: '精制拼配',
        type: 'refining',
        status: 'completed',
        startTime: '2026-06-14 09:30',
        endTime: '2026-06-14 11:00',
        operator: '王师傅',
        parameters: []
      }
    ]
  }
];

export const mockWarehouseList: WarehouseItem[] = [
  {
    id: '1',
    batchNo: 'B20260614001',
    name: '明前茶-特级',
    type: 'finished',
    typeName: '成品茶',
    grade: '特级',
    weight: 2.34,
    unit: 'kg',
    location: 'A区-01架',
    inDate: '2026-06-15',
    expireDate: '2028-06-15',
    status: 'normal',
    quantity: 78,
    unitPrice: 1280
  },
  {
    id: '2',
    batchNo: 'B20260614001',
    name: '明前茶-一级',
    type: 'finished',
    typeName: '成品茶',
    grade: '一级',
    weight: 5.46,
    unit: 'kg',
    location: 'A区-01架',
    inDate: '2026-06-15',
    expireDate: '2028-06-15',
    status: 'normal',
    quantity: 182,
    unitPrice: 680
  },
  {
    id: '3',
    batchNo: 'B20260613001',
    name: '明前茶-特级',
    type: 'finished',
    typeName: '成品茶',
    grade: '特级',
    weight: 3.75,
    unit: 'kg',
    location: 'A区-02架',
    inDate: '2026-06-14',
    expireDate: '2028-06-14',
    status: 'normal',
    quantity: 125,
    unitPrice: 1280
  },
  {
    id: '4',
    batchNo: 'B20260613001',
    name: '明前茶-一级',
    type: 'finished',
    typeName: '成品茶',
    grade: '一级',
    weight: 8.75,
    unit: 'kg',
    location: 'A区-02架',
    inDate: '2026-06-14',
    expireDate: '2028-06-14',
    status: 'normal',
    quantity: 292,
    unitPrice: 680
  },
  {
    id: '5',
    batchNo: 'B20260610001',
    name: '雨前茶-一级',
    type: 'finished',
    typeName: '成品茶',
    grade: '一级',
    weight: 4.2,
    unit: 'kg',
    location: 'B区-01架',
    inDate: '2026-06-11',
    expireDate: '2028-06-11',
    status: 'normal',
    quantity: 140,
    unitPrice: 480
  },
  {
    id: '6',
    batchNo: 'M20260615001',
    name: '毛茶-待精制',
    type: 'raw',
    typeName: '毛茶',
    grade: '待分级',
    weight: 35.6,
    unit: 'kg',
    location: 'C区-01架',
    inDate: '2026-06-15',
    expireDate: '2026-12-15',
    status: 'normal',
    quantity: 1,
    unitPrice: 280
  },
  {
    id: '7',
    batchNo: 'M20260614001',
    name: '毛茶-待精制',
    type: 'raw',
    typeName: '毛茶',
    grade: '待分级',
    weight: 28.5,
    unit: 'kg',
    location: 'C区-01架',
    inDate: '2026-06-14',
    expireDate: '2026-12-14',
    status: 'normal',
    quantity: 1,
    unitPrice: 260
  },
  {
    id: '8',
    batchNo: 'B20260410001',
    name: '雨前茶-二级',
    type: 'finished',
    typeName: '成品茶',
    grade: '二级',
    weight: 0.5,
    unit: 'kg',
    location: 'B区-03架',
    inDate: '2026-04-12',
    expireDate: '2028-04-12',
    status: 'low-stock',
    quantity: 17,
    unitPrice: 320
  },
  {
    id: '9',
    batchNo: 'B20250915001',
    name: '秋茶-一级',
    type: 'finished',
    typeName: '成品茶',
    grade: '一级',
    weight: 12.8,
    unit: 'kg',
    location: 'B区-02架',
    inDate: '2025-09-18',
    expireDate: '2027-09-18',
    status: 'normal',
    quantity: 256,
    unitPrice: 380
  }
];
