import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockWarehouseList } from '@/data/mockProcessing';
import { WarehouseItem } from '@/types';

const WarehousePage: React.FC = () => {
  const [activeType, setActiveType] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);

  useDidShow(() => {
    setItems(mockWarehouseList);
  });

  const typeTabs = [
    { key: 'all', label: '全部' },
    { key: 'raw', label: '毛茶' },
    { key: 'refined', label: '精制茶' },
    { key: 'finished', label: '成品茶' }
  ];

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
    return { totalWeight, totalValue, rawCount, refinedCount, finishedCount, lowStockCount };
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
    Taro.showToast({ title: '入库功能开发中', icon: 'none' });
  };

  const handleOutbound = () => {
    Taro.showToast({ title: '出库功能开发中', icon: 'none' });
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
            <Text className={styles.categoryValue} style={{ color: '#FF9800' }}>{stats.lowStockCount}</Text>
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
        <Button className={styles.outboundBtn} onClick={handleOutbound}>
          出库
        </Button>
        <Button className={styles.inboundBtn} onClick={handleInbound}>
          入库
        </Button>
      </View>

      {/* 详情弹窗 */}
      {selectedItem && (
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
              <Button className={styles.modalActionBtn} onClick={handleOutbound}>
                出库
              </Button>
              <Button className={styles.modalActionBtn} onClick={handleInbound}>
                入库
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default WarehousePage;
