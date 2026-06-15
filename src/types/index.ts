// 茶园地块类型
export interface TeaPlot {
  id: string;
  name: string;
  area: number;
  unit: string;
  variety: string;
  age: number;
  altitude: number;
  soilType: string;
  status: 'healthy' | 'warning' | 'danger';
  lastFertilize: string;
  lastWeed: string;
  expectedYield: number;
  location: {
    lat: number;
    lng: number;
  };
  image: string;
}

// 农事记录类型
export interface FarmRecord {
  id: string;
  plotId: string;
  plotName: string;
  type: 'fertilize' | 'weed' | 'pest' | 'irrigate' | 'prune';
  typeName: string;
  date: string;
  operator: string;
  quantity?: number;
  unit?: string;
  description: string;
  weather: string;
  temperature: number;
}

// 采摘记录类型
export interface PickingRecord {
  id: string;
  batchNo: string;
  plotId: string;
  plotName: string;
  date: string;
  time: string;
  type: 'early-spring' | 'before-rain' | 'after-rain' | 'autumn';
  typeName: string;
  weight: number;
  unit: string;
  leafGrade: string;
  pickers: string[];
  temperature: number;
  weather: string;
  quality: 'excellent' | 'good' | 'normal';
}

// 制茶工序类型
export interface TeaProcess {
  id: string;
  batchNo: string;
  currentStep: number;
  totalSteps: number;
  steps: ProcessStep[];
  startTime: string;
  estimatedEndTime: string;
  status: 'processing' | 'completed' | 'paused';
  inputWeight: number;
  outputWeight: number;
  operator: string;
}

export interface ProcessStep {
  id: string;
  name: string;
  type: 'withering' | 'fixation' | 'rolling' | 'drying' | 'sorting' | 'refining';
  status: 'pending' | 'processing' | 'completed';
  startTime?: string;
  endTime?: string;
  parameters: ProcessParameter[];
  operator?: string;
}

export interface ProcessParameter {
  name: string;
  value: string;
  unit: string;
}

// 仓储类型
export interface WarehouseItem {
  id: string;
  batchNo: string;
  name: string;
  type: 'raw' | 'refined' | 'finished';
  typeName: string;
  grade: string;
  weight: number;
  unit: string;
  location: string;
  inDate: string;
  expireDate: string;
  status: 'normal' | 'low-stock' | 'expiring';
  quantity: number;
  unitPrice: number;
}

// 订单类型
export interface Order {
  id: string;
  orderNo: string;
  type: 'retail' | 'wholesale' | 'e-commerce' | 'tour';
  typeName: string;
  customerName: string;
  phone: string;
  address?: string;
  items: OrderItem[];
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'paid' | 'shipping' | 'completed' | 'cancelled';
  statusName: string;
  createTime: string;
  payTime?: string;
  shipTime?: string;
  completeTime?: string;
  remark?: string;
  traceCode?: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  productType: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  batchNo?: string;
}

// 溯源信息类型
export interface TraceInfo {
  traceCode: string;
  batchNo: string;
  productName: string;
  teaPlot: {
    name: string;
    area: number;
    variety: string;
    altitude: number;
  };
  picking: {
    date: string;
    type: string;
    weight: number;
    pickers: string[];
  };
  processing: {
    steps: {
      name: string;
      startTime: string;
      endTime: string;
      parameters: ProcessParameter[];
    }[];
  };
  testing: {
    date: string;
    agency: string;
    result: 'pass' | 'fail';
    reportUrl: string;
  };
  packaging: {
    date: string;
    spec: string;
    quantity: number;
  };
  logistics?: {
    company: string;
    trackingNo: string;
    updateTime: string;
  };
}

// 收支台账类型
export interface LedgerRecord {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  categoryName: string;
  amount: number;
  relatedOrder?: string;
  operator: string;
  remark: string;
  paymentMethod: string;
}

// 统计数据类型
export interface DashboardStats {
  totalArea: number;
  totalPlots: number;
  todayPicking: number;
  monthPicking: number;
  processingBatches: number;
  stockQuantity: number;
  pendingOrders: number;
  monthSales: number;
  yearSales: number;
}

// 待办事项类型
export interface TodoItem {
  id: string;
  title: string;
  type: 'fertilize' | 'weed' | 'pick' | 'process' | 'ship';
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  status: 'pending' | 'completed';
  relatedPlot?: string;
}

// 天气信息类型
export interface WeatherInfo {
  date: string;
  temperature: string;
  humidity: string;
  weather: string;
  wind: string;
  forecast: {
    date: string;
    weather: string;
    tempRange: string;
  }[];
}

// 茶旅产品类型
export interface TeaTourProduct {
  id: string;
  name: string;
  type: 'experience' | 'tour' | 'workshop';
  typeName: string;
  description: string;
  price: number;
  duration: string;
  maxPeople: number;
  bookedCount: number;
  status: 'available' | 'sold-out' | 'closed';
  image: string;
  features: string[];
}

// 功能菜单项类型
export interface FunctionItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  page: string;
  badge?: string;
}
