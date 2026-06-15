import Taro from '@tarojs/taro';

const STORAGE_KEYS = {
  FARM_RECORDS: 'tea_farm_records',
  PICKING_RECORDS: 'tea_picking_records',
  WAREHOUSE_ITEMS: 'tea_warehouse_items',
  LEDGER_RECORDS: 'tea_ledger_records',
  TRACE_INFO: 'tea_trace_info'
};

const mergeWithMock = <T>(mockData: T[], storedData: T[], idKey: string = 'id'): T[] => {
  if (!storedData || storedData.length === 0) return mockData;
  const mockIds = new Set(mockData.map(item => item[idKey as keyof T]));
  const newItems = storedData.filter(item => !mockIds.has(item[idKey as keyof T]));
  return [...mockData, ...newItems];
};

export const storage = {
  getFarmRecords: () => {
    try {
      return Taro.getStorageSync(STORAGE_KEYS.FARM_RECORDS) || [];
    } catch {
      return [];
    }
  },

  saveFarmRecords: (records: any[]) => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.FARM_RECORDS, records);
    } catch (e) {
      console.error('保存农事记录失败:', e);
    }
  },

  addFarmRecord: (record: any, mockRecords: any[]) => {
    const stored = storage.getFarmRecords();
    const allRecords = mergeWithMock(mockRecords, stored);
    allRecords.unshift(record);
    const customRecords = allRecords.filter(r => !mockRecords.find(m => m.id === r.id));
    storage.saveFarmRecords(customRecords);
    return allRecords;
  },

  getPickingRecords: () => {
    try {
      return Taro.getStorageSync(STORAGE_KEYS.PICKING_RECORDS) || [];
    } catch {
      return [];
    }
  },

  savePickingRecords: (records: any[]) => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.PICKING_RECORDS, records);
    } catch (e) {
      console.error('保存采摘记录失败:', e);
    }
  },

  addPickingRecord: (record: any, mockRecords: any[]) => {
    const stored = storage.getPickingRecords();
    const allRecords = mergeWithMock(mockRecords, stored);
    allRecords.unshift(record);
    const customRecords = allRecords.filter(r => !mockRecords.find(m => m.id === r.id));
    storage.savePickingRecords(customRecords);
    return allRecords;
  },

  getWarehouseItems: () => {
    try {
      return Taro.getStorageSync(STORAGE_KEYS.WAREHOUSE_ITEMS) || [];
    } catch {
      return [];
    }
  },

  saveWarehouseItems: (items: any[]) => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.WAREHOUSE_ITEMS, items);
    } catch (e) {
      console.error('保存库存数据失败:', e);
    }
  },

  addWarehouseItem: (item: any, mockItems: any[]) => {
    const stored = storage.getWarehouseItems();
    const allItems = mergeWithMock(mockItems, stored);
    allItems.unshift(item);
    const customItems = allItems.filter(i => !mockItems.find(m => m.id === i.id));
    storage.saveWarehouseItems(customItems);
    return allItems;
  },

  updateWarehouseItem: (itemId: string, updates: any, mockItems: any[]) => {
    const stored = storage.getWarehouseItems();
    const allItems = mergeWithMock(mockItems, stored);
    const index = allItems.findIndex(i => i.id === itemId);
    if (index !== -1) {
      allItems[index] = { ...allItems[index], ...updates };
      const customItems = allItems.filter(i => !mockItems.find(m => m.id === i.id));
      storage.saveWarehouseItems(customItems);
    }
    return allItems;
  },

  getLedgerRecords: () => {
    try {
      return Taro.getStorageSync(STORAGE_KEYS.LEDGER_RECORDS) || [];
    } catch {
      return [];
    }
  },

  saveLedgerRecords: (records: any[]) => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.LEDGER_RECORDS, records);
    } catch (e) {
      console.error('保存台账记录失败:', e);
    }
  },

  addLedgerRecord: (record: any, mockRecords: any[]) => {
    const stored = storage.getLedgerRecords();
    const allRecords = mergeWithMock(mockRecords, stored);
    allRecords.unshift(record);
    const customRecords = allRecords.filter(r => !mockRecords.find(m => m.id === r.id));
    storage.saveLedgerRecords(customRecords);
    return allRecords;
  },

  getAllFarmRecords: (mockRecords: any[]) => {
    const stored = storage.getFarmRecords();
    return mergeWithMock(mockRecords, stored);
  },

  getAllPickingRecords: (mockRecords: any[]) => {
    const stored = storage.getPickingRecords();
    return mergeWithMock(mockRecords, stored);
  },

  getAllWarehouseItems: (mockItems: any[]) => {
    const stored = storage.getWarehouseItems();
    return mergeWithMock(mockItems, stored);
  },

  getAllLedgerRecords: (mockRecords: any[]) => {
    const stored = storage.getLedgerRecords();
    return mergeWithMock(mockRecords, stored);
  },

  saveTraceInfo: (traceCode: string, info: any) => {
    try {
      const all = Taro.getStorageSync(STORAGE_KEYS.TRACE_INFO) || {};
      all[traceCode] = info;
      Taro.setStorageSync(STORAGE_KEYS.TRACE_INFO, all);
    } catch (e) {
      console.error('保存溯源信息失败:', e);
    }
  },

  getTraceInfo: (traceCode: string) => {
    try {
      const all = Taro.getStorageSync(STORAGE_KEYS.TRACE_INFO) || {};
      return all[traceCode] || null;
    } catch {
      return null;
    }
  }
};

export default storage;
