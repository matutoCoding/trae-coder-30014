import Taro from '@tarojs/taro';

const STORAGE_KEYS = {
  FARM_RECORDS: 'tea_farm_records',
  PICKING_RECORDS: 'tea_picking_records',
  WAREHOUSE_ITEMS: 'tea_warehouse_items',
  WAREHOUSE_MODIFIED: 'tea_warehouse_modified',
  WAREHOUSE_DELETED: 'tea_warehouse_deleted',
  FARM_MODIFIED: 'tea_farm_modified',
  FARM_DELETED: 'tea_farm_deleted',
  PICKING_MODIFIED: 'tea_picking_modified',
  PICKING_DELETED: 'tea_picking_deleted',
  LEDGER_RECORDS: 'tea_ledger_records',
  TRACE_INFO: 'tea_trace_info'
};

const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = Taro.getStorageSync(key);
    return data !== '' && data !== undefined && data !== null ? data : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorage = <T>(key: string, data: T): void => {
  try {
    Taro.setStorageSync(key, data);
  } catch (e) {
    console.error(`保存${key}失败:`, e);
  }
};

const mergeDataWithMock = <T extends { id: string }>(
  mockData: T[],
  newItemsKey: string,
  modifiedKey: string,
  deletedKey: string
): T[] => {
  const newItems: T[] = getStorage(newItemsKey, []);
  const modified: Record<string, T> = getStorage(modifiedKey, {});
  const deleted: string[] = getStorage(deletedKey, []);
  const deletedSet = new Set(deleted);

  const merged: T[] = [];
  
  for (const item of mockData) {
    if (deletedSet.has(item.id)) continue;
    if (modified[item.id]) {
      merged.push({ ...item, ...modified[item.id] });
    } else {
      merged.push(item);
    }
  }

  for (const item of newItems) {
    if (!deletedSet.has(item.id)) {
      if (modified[item.id]) {
        merged.push({ ...item, ...modified[item.id] });
      } else {
        merged.push(item);
      }
    }
  }

  return merged;
};

const addItem = <T extends { id: string }>(
  item: T,
  mockData: T[],
  newItemsKey: string,
  modifiedKey: string,
  deletedKey: string
): T[] => {
  const newItems: T[] = getStorage(newItemsKey, []);
  newItems.unshift(item);
  setStorage(newItemsKey, newItems);
  return mergeDataWithMock(mockData, newItemsKey, modifiedKey, deletedKey);
};

const updateItem = <T extends { id: string }>(
  itemId: string,
  updates: Partial<T>,
  mockData: T[],
  newItemsKey: string,
  modifiedKey: string,
  deletedKey: string
): T[] => {
  const modified: Record<string, T> = getStorage(modifiedKey, {});
  const existing = modified[itemId] || {} as T;
  modified[itemId] = { ...existing, ...updates, id: itemId } as T;
  setStorage(modifiedKey, modified);
  return mergeDataWithMock(mockData, newItemsKey, modifiedKey, deletedKey);
};

const deleteItem = <T extends { id: string }>(
  itemId: string,
  mockData: T[],
  newItemsKey: string,
  modifiedKey: string,
  deletedKey: string
): T[] => {
  const deleted: string[] = getStorage(deletedKey, []);
  if (!deleted.includes(itemId)) {
    deleted.push(itemId);
    setStorage(deletedKey, deleted);
  }
  return mergeDataWithMock(mockData, newItemsKey, modifiedKey, deletedKey);
};

export const storage = {
  getFarmRecords: (): any[] => getStorage(STORAGE_KEYS.FARM_RECORDS, []),
  saveFarmRecords: (records: any[]) => setStorage(STORAGE_KEYS.FARM_RECORDS, records),
  
  addFarmRecord: (record: any, mockRecords: any[]) => {
    return addItem(record, mockRecords, STORAGE_KEYS.FARM_RECORDS, STORAGE_KEYS.FARM_MODIFIED, STORAGE_KEYS.FARM_DELETED);
  },

  updateFarmRecord: (recordId: string, updates: any, mockRecords: any[]) => {
    return updateItem(recordId, updates, mockRecords, STORAGE_KEYS.FARM_RECORDS, STORAGE_KEYS.FARM_MODIFIED, STORAGE_KEYS.FARM_DELETED);
  },

  deleteFarmRecord: (recordId: string, mockRecords: any[]) => {
    return deleteItem(recordId, mockRecords, STORAGE_KEYS.FARM_RECORDS, STORAGE_KEYS.FARM_MODIFIED, STORAGE_KEYS.FARM_DELETED);
  },

  getAllFarmRecords: (mockRecords: any[]) => {
    return mergeDataWithMock(mockRecords, STORAGE_KEYS.FARM_RECORDS, STORAGE_KEYS.FARM_MODIFIED, STORAGE_KEYS.FARM_DELETED);
  },

  getPickingRecords: (): any[] => getStorage(STORAGE_KEYS.PICKING_RECORDS, []),
  savePickingRecords: (records: any[]) => setStorage(STORAGE_KEYS.PICKING_RECORDS, records),

  addPickingRecord: (record: any, mockRecords: any[]) => {
    return addItem(record, mockRecords, STORAGE_KEYS.PICKING_RECORDS, STORAGE_KEYS.PICKING_MODIFIED, STORAGE_KEYS.PICKING_DELETED);
  },

  updatePickingRecord: (recordId: string, updates: any, mockRecords: any[]) => {
    return updateItem(recordId, updates, mockRecords, STORAGE_KEYS.PICKING_RECORDS, STORAGE_KEYS.PICKING_MODIFIED, STORAGE_KEYS.PICKING_DELETED);
  },

  deletePickingRecord: (recordId: string, mockRecords: any[]) => {
    return deleteItem(recordId, mockRecords, STORAGE_KEYS.PICKING_RECORDS, STORAGE_KEYS.PICKING_MODIFIED, STORAGE_KEYS.PICKING_DELETED);
  },

  getAllPickingRecords: (mockRecords: any[]) => {
    return mergeDataWithMock(mockRecords, STORAGE_KEYS.PICKING_RECORDS, STORAGE_KEYS.PICKING_MODIFIED, STORAGE_KEYS.PICKING_DELETED);
  },

  getWarehouseItems: (): any[] => getStorage(STORAGE_KEYS.WAREHOUSE_ITEMS, []),
  saveWarehouseItems: (items: any[]) => setStorage(STORAGE_KEYS.WAREHOUSE_ITEMS, items),

  addWarehouseItem: (item: any, mockItems: any[]) => {
    return addItem(item, mockItems, STORAGE_KEYS.WAREHOUSE_ITEMS, STORAGE_KEYS.WAREHOUSE_MODIFIED, STORAGE_KEYS.WAREHOUSE_DELETED);
  },

  updateWarehouseItem: (itemId: string, updates: any, mockItems: any[]) => {
    return updateItem(itemId, updates, mockItems, STORAGE_KEYS.WAREHOUSE_ITEMS, STORAGE_KEYS.WAREHOUSE_MODIFIED, STORAGE_KEYS.WAREHOUSE_DELETED);
  },

  deleteWarehouseItem: (itemId: string, mockItems: any[]) => {
    return deleteItem(itemId, mockItems, STORAGE_KEYS.WAREHOUSE_ITEMS, STORAGE_KEYS.WAREHOUSE_MODIFIED, STORAGE_KEYS.WAREHOUSE_DELETED);
  },

  getAllWarehouseItems: (mockItems: any[]) => {
    return mergeDataWithMock(mockItems, STORAGE_KEYS.WAREHOUSE_ITEMS, STORAGE_KEYS.WAREHOUSE_MODIFIED, STORAGE_KEYS.WAREHOUSE_DELETED);
  },

  getLedgerRecords: (): any[] => getStorage(STORAGE_KEYS.LEDGER_RECORDS, []),
  saveLedgerRecords: (records: any[]) => setStorage(STORAGE_KEYS.LEDGER_RECORDS, records),

  addLedgerRecord: (record: any, mockRecords: any[]) => {
    const stored = storage.getLedgerRecords();
    stored.unshift(record);
    storage.saveLedgerRecords(stored);
    return [...mockRecords, ...stored];
  },

  getAllLedgerRecords: (mockRecords: any[]) => {
    const stored = storage.getLedgerRecords();
    return [...mockRecords, ...stored];
  },

  saveTraceInfo: (traceCode: string, info: any) => {
    try {
      const all = getStorage<Record<string, any>>(STORAGE_KEYS.TRACE_INFO, {});
      all[traceCode] = info;
      setStorage(STORAGE_KEYS.TRACE_INFO, all);
    } catch (e) {
      console.error('保存溯源信息失败:', e);
    }
  },

  getTraceInfo: (traceCode: string) => {
    try {
      const all = getStorage<Record<string, any>>(STORAGE_KEYS.TRACE_INFO, {});
      return all[traceCode] || null;
    } catch {
      return null;
    }
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      try { Taro.removeStorageSync(key); } catch {}
    });
  }
};

export default storage;
