import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input, Button, Picker } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockWarehouseList } from '@/data/mockProcessing';
import { WarehouseItem } from '@/types';
import { storage } from '@/utils/storage';
import { generateId, formatDate, generateBatchNo } from '@/utils/index';

const WarehousePage: React.FC = () => {
  const [activeType, setActiveType] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
  const [showInboundModal, setShowInboundModal] = useState(false);
  const [showOutboundModal, setShowOutboundModal] = useState(false);
  const [inboundForm, setInboundForm] = useState({
    name: '',
    type: 'finished',
    typeName: '成品茶',
    grade: '一级',
    weight: '',
    unit: 'kg',
    quantity: '',
    unitPrice: '',
    location: 'A区-01',
    inDate: formatDate(),
    expireDate: ''
  });
  const [outboundForm, setOutboundForm] = useState({
    itemId: '',
    weight: '',
    quantity: '',
    remark: ''
  });

  useDidShow(() => {
    loadData();
  });

  const loadData = () => {
    const allItems = storage.getAllWarehouseItems(mockWarehouseList);
    setItems(allItems);
  };

  const typeTabs = [
    { key: 'all', label: '全部' },
    { key: 'raw', label: '毛茶' },
    { key: 'refined', label: '精制茶' },
    { key: 'finished', label: '成品茶' }
  ];

  const typeOptions = [
    { key: 'raw', label: '毛茶' },
    { key: 'refined', label: '精制茶' },
    { key: 'finished', label: '成品茶' }
  ];

  const gradeOptions = ['特级', '一级', '二级', '三级'];
  const locationOptions = ['A区-01', 'A区-02', 'B区-01', 'B区-02', 'C区-01', 'C区-02'];

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (activeType !== 'all' && item.type !== activeType) return false;
      if (searchText && !item.name.includes(searchText) && !item.batchNo.includes(searchText)) {
        return false;
      }
      return true;
    });
  }, [items, activeType, searchText]);

  const stats = useMemo(() => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const totalValue = items.reduce((sum, item) => sum + item.weight * item.unitPrice, 0);
    const rawCount = items.filter(i => i.type === 'raw').length;
    const refinedCount = items.filter(i => i.type === 'refined').length;
    const finishedCount = items.filter(i => i.type === 'finished').length;
    const lowStockCount = items.filter(i => i.status === 'low-stock').length;
    const expiringCount = items.filter(i => i.status === 'expiring').length;
    return { totalWeight, totalValue, rawCount, refinedCount, finishedCount, lowStockCount, expiringCount };
  }, [items]);

  const getStatusClass = (status: string) => {
    if (status === 'low-stock') return styles.lowStock;
    if (status === 'expiring') return styles.expiring;
    return styles.normal;
  };

  const getStatusText = (status: string) => {
    if (status === 'low-stock') return '库存低';
    if (status === 'expiring') return '临期';
    return '正常';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      raw: '#8D6E63',
      refined: '#66BB6A',
      finished: '#2E7D32'
    };
    return colors[type] || '#2E7D32';
  };

  const handleViewDetail = (item: WarehouseItem) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  const handleInbound = () => {
    setInboundForm({
      name: '',
      type: 'finished',
      typeName: '成品茶',
      grade: '一级',
      weight: '',
      unit: 'kg',
      quantity: '',
      unitPrice: '',
      location: 'A区-01',
      inDate: formatDate(),
      expireDate: ''
    });
    setShowInboundModal(true);
  };

  const handleOutbound = (item?: WarehouseItem) => {
    if (item) {
      setOutboundForm({
        itemId: item.id,
        weight: '',
        quantity: '',
        remark: ''
      });
      setSelectedItem(item);
    } else {
      setOutboundForm({
        itemId: '',
        weight: '',
        quantity: '',
        remark: ''
      });
    }
    setShowOutboundModal(true);
    setShowInboundModal(false);
    handleCloseDetail();
  };

  const handleSubmitInbound = () => {
    if (!inboundForm.name) {
      Taro.showToast({ title: '请输入商品名称', icon: 'none' });
      return;
    }
    if (!inboundForm.weight) {
      Taro.showToast({ title: '请输入重量', icon: 'none' });
      return;
    }
    if (!inboundForm.unitPrice) {
      Taro.showToast({ title: '请输入单价', icon: 'none' });
      return;
    }

    const weight = parseFloat(inboundForm.weight);
    const quantity = parseInt(inboundForm.quantity) || 1;
    const unitPrice = parseFloat(inboundForm.unitPrice);

    let status: 'normal' | 'low-stock' | 'expiring' = 'normal';
    if (weight < 10) status = 'low-stock';

    const newItem: WarehouseItem = {
      id: generateId('WH'),
      batchNo: generateBatchNo('B'),
      name: inboundForm.name,
      type: inboundForm.type as any,
      typeName: inboundForm.typeName,
      grade: inboundForm.grade,
      weight: weight,
      unit: inboundForm.unit,
      quantity: quantity,
      unitPrice: unitPrice,
      location: inboundForm.location,
      inDate: inboundForm.inDate,
      expireDate: inboundForm.expireDate || `${new Date().getFullYear() + 2}-12-31`,
      status: status
    };

    const allItems = storage.addWarehouseItem(newItem, mockWarehouseList);
    setItems(allItems);
    setShowInboundModal(false);
    Taro.showToast({ title: '入库成功', icon: 'success' });
  };

  const handleSubmitOutbound = () => {
    const targetItem = selectedItem || items.find(i => i.id === outboundForm.itemId);
    if (!targetItem) {
      Taro.showToast({ title: '请选择库存商品', icon: 'none' });
      return;
    }
    if (!outboundForm.weight && !outboundForm.quantity) {
      Taro.showToast({ title: '请输入出库重量或数量', icon: 'none' });
      return;
    }

    const outWeight = parseFloat(outboundForm.weight) || 0;
    const outQuantity = parseInt(outboundForm.quantity) || 0;

    if (outWeight > targetItem.weight) {
      Taro.showToast({ title: '出库重量不能大于库存', icon: 'none' });
      return;
    }

    const newWeight = targetItem.weight - outWeight;
    const newQuantity = targetItem.quantity - outQuantity;

    let newStatus: 'normal' | 'low-stock' | 'expiring' = targetItem.status;
    if (newWeight < 10) newStatus = 'low-stock';
    else if (newWeight >= 10) newStatus = 'normal';

    if (newWeight <= 0) {
      const stored = storage.getWarehouseItems();
      const customItems = stored.filter(i => i.id !== targetItem.id);
      const mockItems = mockWarehouseList.filter(i => i.id !== targetItem.id);
      storage.saveWarehouseItems(customItems);
      setItems([...mockItems, ...customItems]);
    } else {
      const allItems = storage.updateWarehouseItem(
        targetItem.id,
        { weight: newWeight, quantity: newQuantity, status: newStatus },
        mockWarehouseList
      );
      setItems(allItems);
    }

    setShowOutboundModal(false);
    setSelectedItem(null);
    Taro.showToast({ title: '出库成功', icon: 'success' });
  };

  const handleTypeChange = (e: any) => {
    const index = e.detail.value;
    const selected = typeOptions[index];
    setInboundForm({
      ...inboundForm,
      type: selected.key,
      typeName: selected.label
    });
  };

  const handleGradeChange = (e: any) => {
    const index = e.detail.value;
    setInboundForm({ ...inboundForm, grade: gradeOptions[index] });
  };

  const handleLocationChange = (e: any) => {
    const index = e.detail.value;
    setInboundForm({ ...inboundForm, location: locationOptions[index] });
  };

  return (
    <View className={styles.page}>
      {/* 顶部统计 */}
      <View className={styles.header}>
        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.totalWeight.toFixed(1)}kg</Text>
            <Text className={styles.statLabel}>总库存量</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>¥{(stats.totalValue / 10000).toFixed(1)}万</Text>
            <Text className={styles.statLabel}>库存总价值</Text>
          </View>
        </View>
        
        <View className={styles.categoryRow}>
          <View className={styles.categoryItem}>
            <Text className={styles.categoryValue}>{stats.rawCount}</Text>
            <Text className={styles.categoryLabel}>毛茶</Text>
          </View>
          <View className={styles.categoryItem}>
            <Text className={styles.categoryValue}>{stats.refinedCount}</Text>
            <Text className={styles.categoryLabel}>精制茶</Text>
          </View>
          <View className={styles.categoryItem}>
            <Text className={styles.categoryValue}>{stats.finishedCount}</Text>
            <Text className={styles.categoryLabel}>成品茶</Text>
          </View>
          <View className={styles.categoryItem}>
            <Text className={styles.categoryValue} style={{ color: '#FF9800' }}>{stats.lowStockCount + stats.expiringCount}</Text>
            <Text className={styles.categoryLabel}>库存预警</Text>
          </View>
        </View>
      </View>

      {/* 搜索和分类Tab */}
      <View className={styles.filterSection}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索商品名称或批次号"
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>
        
        <View className={styles.tabRow}>
          {typeTabs.map(tab => (
            <View
              key={tab.key}
              className={classnames(styles.tabItem, activeType === tab.key && styles.tabActive)}
              onClick={() => setActiveType(tab.key)}
            >
              {tab.label}
            </View>
          ))}
        </View>
      </View>

      {/* 列表 */}
      <ScrollView className={styles.content} scrollY>
        <View className={styles.listHeader}>
          <Text>共 {filteredItems.length} 条库存记录</Text>
        </View>

        {filteredItems.map(item => (
          <View 
            key={item.id} 
            className={styles.itemCard}
            onClick={() => handleViewDetail(item)}
          >
            <View className={styles.itemHeader}>
              <View className={styles.itemInfo}>
                <Text className={styles.itemName}>{item.name}</Text>
                <View 
                  className={styles.typeTag}
                  style={{ backgroundColor: `${getTypeColor(item.type)}15`, color: getTypeColor(item.type) }}
                >
                  {item.typeName}
                </View>
              </View>
              <View className={classnames(styles.statusTag, getStatusClass(item.status))}>
                {getStatusText(item.status)}
              </View>
            </View>
            
            <View className={styles.itemBody}>
              <View className={styles.infoGrid}>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>批次号</Text>
                  <Text className={styles.infoValue}>{item.batchNo}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>等级</Text>
                  <Text className={styles.infoValue}>{item.grade}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>重量</Text>
                  <Text className={styles.infoValueHighlight}>{item.weight}{item.unit}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>数量</Text>
                  <Text className={styles.infoValue}>{item.quantity}件</Text>
                </View>
              </View>
            </View>
            
            <View className={styles.itemFooter}>
              <View className={styles.footerInfo}>
                <Text>📍 {item.location}</Text>
                <Text>📅 入库：{item.inDate}</Text>
              </View>
              <Text className={styles.price}>¥{item.unitPrice}/{item.unit}</Text>
            </View>
          </View>
        ))}

        {filteredItems.length === 0 && (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>📦</Text>
            <Text className={styles.emptyText}>暂无库存记录</Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.bottomBar}>
        <Button className={styles.outboundBtn} onClick={() => handleOutbound()}>
          出库
        </Button>
        <Button className={styles.inboundBtn} onClick={handleInbound}>
          入库
        </Button>
      </View>

      {/* 详情弹窗 */}
      {selectedItem && !showInboundModal && !showOutboundModal && (
        <View className={styles.modalOverlay} onClick={handleCloseDetail}>
          <View className={styles.detailModal} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>库存详情</Text>
              <Text className={styles.modalClose} onClick={handleCloseDetail}>✕</Text>
            </View>
            
            <ScrollView className={styles.modalContent} scrollY>
              <View className={styles.detailSection}>
                <Text className={styles.detailSectionTitle}>基本信息</Text>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>商品名称</Text>
                  <Text className={styles.detailValue}>{selectedItem.name}</Text>
                </View>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>类型</Text>
                  <Text className={styles.detailValue}>{selectedItem.typeName}</Text>
                </View>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>等级</Text>
                  <Text className={styles.detailValue}>{selectedItem.grade}</Text>
                </View>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>批次号</Text>
                  <Text className={styles.detailValue}>{selectedItem.batchNo}</Text>
                </View>
              </View>

              <View className={styles.detailSection}>
                <Text className={styles.detailSectionTitle}>库存信息</Text>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>当前库存</Text>
                  <Text className={styles.detailValueHighlight}>{selectedItem.weight}{selectedItem.unit}</Text>
                </View>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>件数</Text>
                  <Text className={styles.detailValue}>{selectedItem.quantity}件</Text>
                </View>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>单价</Text>
                  <Text className={styles.detailValue}>¥{selectedItem.unitPrice}/{selectedItem.unit}</Text>
                </View>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>库存价值</Text>
                  <Text className={styles.detailValue}>¥{(selectedItem.weight * selectedItem.unitPrice).toFixed(2)}</Text>
                </View>
              </View>

              <View className={styles.detailSection}>
                <Text className={styles.detailSectionTitle}>仓储信息</Text>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>存放位置</Text>
                  <Text className={styles.detailValue}>{selectedItem.location}</Text>
                </View>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>入库日期</Text>
                  <Text className={styles.detailValue}>{selectedItem.inDate}</Text>
                </View>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>保质期至</Text>
                  <Text className={styles.detailValue}>{selectedItem.expireDate}</Text>
                </View>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>库存状态</Text>
                  <View className={classnames(styles.statusTag, getStatusClass(selectedItem.status))}>
                    {getStatusText(selectedItem.status)}
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className={styles.modalFooter}>
              <Button className={styles.modalActionBtn} onClick={() => handleOutbound(selectedItem)}>
                出库
              </Button>
              <Button className={styles.modalActionBtn} onClick={handleInbound}>
                入库
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* 入库表单弹窗 */}
      {showInboundModal && (
        <View className={styles.modalOverlay} onClick={() => setShowInboundModal(false)}>
          <View className={styles.formModal} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>商品入库</Text>
              <Text className={styles.modalClose} onClick={() => setShowInboundModal(false)}>✕</Text>
            </View>
            
            <ScrollView className={styles.modalContent} scrollY>
              <View className={styles.formSection}>
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>商品名称 *</Text>
                  <Input
                    className={styles.formInput}
                    placeholder="请输入商品名称"
                    value={inboundForm.name}
                    onInput={(e) => setInboundForm({ ...inboundForm, name: e.detail.value })}
                  />
                </View>

                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>商品类型</Text>
                  <Picker
                    mode="selector"
                    range={typeOptions.map(t => t.label)}
                    onChange={handleTypeChange}
                  >
                    <View className={styles.formPicker}>
                      <Text>{inboundForm.typeName}</Text>
                      <Text className={styles.pickerArrow}>›</Text>
                    </View>
                  </Picker>
                </View>

                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>等级</Text>
                  <Picker
                    mode="selector"
                    range={gradeOptions}
                    onChange={handleGradeChange}
                  >
                    <View className={styles.formPicker}>
                      <Text>{inboundForm.grade}</Text>
                      <Text className={styles.pickerArrow}>›</Text>
                    </View>
                  </Picker>
                </View>

                <View className={styles.formRow}>
                  <View className={styles.formItem} style={{ flex: 1 }}>
                    <Text className={styles.formLabel}>重量(kg) *</Text>
                    <Input
                      className={styles.formInput}
                      type="digit"
                      placeholder="0.00"
                      value={inboundForm.weight}
                      onInput={(e) => setInboundForm({ ...inboundForm, weight: e.detail.value })}
                    />
                  </View>
                  <View className={styles.formItem} style={{ flex: 1, marginLeft: 16 }}>
                    <Text className={styles.formLabel}>件数</Text>
                    <Input
                      className={styles.formInput}
                      type="number"
                      placeholder="1"
                      value={inboundForm.quantity}
                      onInput={(e) => setInboundForm({ ...inboundForm, quantity: e.detail.value })}
                    />
                  </View>
                </View>

                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>单价(元/kg) *</Text>
                  <Input
                    className={styles.formInput}
                    type="digit"
                    placeholder="0.00"
                    value={inboundForm.unitPrice}
                    onInput={(e) => setInboundForm({ ...inboundForm, unitPrice: e.detail.value })}
                  />
                </View>

                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>存放位置</Text>
                  <Picker
                    mode="selector"
                    range={locationOptions}
                    onChange={handleLocationChange}
                  >
                    <View className={styles.formPicker}>
                      <Text>{inboundForm.location}</Text>
                      <Text className={styles.pickerArrow}>›</Text>
                    </View>
                  </Picker>
                </View>

                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>入库日期</Text>
                  <Input
                    className={styles.formInput}
                    placeholder="YYYY-MM-DD"
                    value={inboundForm.inDate}
                    onInput={(e) => setInboundForm({ ...inboundForm, inDate: e.detail.value })}
                  />
                </View>

                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>保质期至</Text>
                  <Input
                    className={styles.formInput}
                    placeholder="YYYY-MM-DD"
                    value={inboundForm.expireDate}
                    onInput={(e) => setInboundForm({ ...inboundForm, expireDate: e.detail.value })}
                  />
                </View>
              </View>
            </ScrollView>

            <View className={styles.modalFooter}>
              <Button className={styles.cancelBtn} onClick={() => setShowInboundModal(false)}>
                取消
              </Button>
              <Button className={styles.submitBtn} onClick={handleSubmitInbound}>
                确认入库
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* 出库表单弹窗 */}
      {showOutboundModal && (
        <View className={styles.modalOverlay} onClick={() => setShowOutboundModal(false)}>
          <View className={styles.formModal} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>商品出库</Text>
              <Text className={styles.modalClose} onClick={() => setShowOutboundModal(false)}>✕</Text>
            </View>
            
            <ScrollView className={styles.modalContent} scrollY>
              {selectedItem ? (
                <View className={styles.selectedItemInfo}>
                  <Text className={styles.selectedItemName}>{selectedItem.name}</Text>
                  <Text className={styles.selectedItemBatch}>批次：{selectedItem.batchNo}</Text>
                  <Text className={styles.selectedItemStock}>当前库存：{selectedItem.weight}{selectedItem.unit}</Text>
                </View>
              ) : (
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>选择库存商品</Text>
                  <Picker
                    mode="selector"
                    range={items.map(i => `${i.name} (${i.batchNo})`)}
                    onChange={(e) => {
                      const index = e.detail.value;
                      const item = items[index];
                      setSelectedItem(item);
                      setOutboundForm({ ...outboundForm, itemId: item.id });
                    }}
                  >
                    <View className={styles.formPicker}>
                      <Text>{selectedItem ? selectedItem.name : '请选择商品'}</Text>
                      <Text className={styles.pickerArrow}>›</Text>
                    </View>
                  </Picker>
                </View>
              )}

              <View className={styles.formSection}>
                <View className={styles.formRow}>
                  <View className={styles.formItem} style={{ flex: 1 }}>
                    <Text className={styles.formLabel}>出库重量(kg)</Text>
                    <Input
                      className={styles.formInput}
                      type="digit"
                      placeholder="0.00"
                      value={outboundForm.weight}
                      onInput={(e) => setOutboundForm({ ...outboundForm, weight: e.detail.value })}
                    />
                  </View>
                  <View className={styles.formItem} style={{ flex: 1, marginLeft: 16 }}>
                    <Text className={styles.formLabel}>出库件数</Text>
                    <Input
                      className={styles.formInput}
                      type="number"
                      placeholder="0"
                      value={outboundForm.quantity}
                      onInput={(e) => setOutboundForm({ ...outboundForm, quantity: e.detail.value })}
                    />
                  </View>
                </View>

                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>备注</Text>
                  <Input
                    className={styles.formInput}
                    placeholder="请输入备注信息"
                    value={outboundForm.remark}
                    onInput={(e) => setOutboundForm({ ...outboundForm, remark: e.detail.value })}
                  />
                </View>
              </View>
            </ScrollView>

            <View className={styles.modalFooter}>
              <Button className={styles.cancelBtn} onClick={() => { setShowOutboundModal(false); setSelectedItem(null); }}>
                取消
              </Button>
              <Button className={styles.submitBtn} onClick={handleSubmitOutbound}>
                确认出库
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default WarehousePage;
