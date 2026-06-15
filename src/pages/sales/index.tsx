import React, { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockOrderList } from '@/data/mockSales';
import { Order } from '@/types';

const SalesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders] = useState<Order[]>(mockOrderList);

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待处理' },
    { key: 'shipping', label: '配送中' },
    { key: 'completed', label: '已完成' }
  ];

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => {
        if (activeTab === 'pending') return o.status === 'pending' || o.status === 'paid';
        return o.status === activeTab;
      });

  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'paid').length;
  const totalSales = orders
    .filter(o => o.status === 'completed' || o.status === 'shipping')
    .reduce((sum, o) => sum + o.paidAmount, 0);

  const handleViewOrder = (order: Order) => {
    console.log('[SalesPage] 查看订单:', order.orderNo);
    Taro.navigateTo({ 
      url: `/pages/order-detail/index?id=${order.id}` 
    }).catch((err) => {
      console.error('[SalesPage] 跳转失败:', err);
    });
  };

  const handleShip = (order: Order) => {
    console.log('[SalesPage] 订单发货:', order.orderNo);
    Taro.showToast({ title: '已标记发货', icon: 'success' });
  };

  const handleTrace = (order: Order) => {
    console.log('[SalesPage] 查看溯源:', order.traceCode);
    if (order.traceCode) {
      Taro.navigateTo({ 
        url: `/pages/trace/index?code=${order.traceCode}` 
      }).catch((err) => {
        console.error('[SalesPage] 跳转失败:', err);
      });
    }
  };

  const handleQuickEntry = (page: string) => {
    console.log('[SalesPage] 快捷入口:', page);
    Taro.navigateTo({ url: page }).catch((err) => {
      console.error('[SalesPage] 跳转失败:', err);
    });
  };

  const quickEntries = [
    { name: '仓储管理', icon: '📦', color: 'rgba(93, 64, 55, 0.1)', page: '/pages/warehouse/index' },
    { name: '收支台账', icon: '💰', color: 'rgba(76, 175, 80, 0.1)', page: '/pages/ledger/index' },
    { name: '茶旅体验', icon: '🏞️', color: 'rgba(156, 39, 176, 0.1)', page: '/pages/tea-tour/index' },
    { name: '电商商品', icon: '🛍️', color: 'rgba(255, 152, 0, 0.1)', page: '/pages/e-commerce/index' }
  ];

  return (
    <View className={styles.page}>
      {/* 顶部数据卡片 */}
      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>¥{(totalSales / 10000).toFixed(1)}万</Text>
          <Text className={styles.statLabel}>本月销售额</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{pendingCount}</Text>
          <Text className={styles.statLabel}>待处理订单</Text>
        </View>
      </View>

      {/* 快捷入口 */}
      <View className={styles.quickEntry}>
        {quickEntries.map((entry, index) => (
          <View 
            key={index}
            className={styles.entryItem}
            onClick={() => handleQuickEntry(entry.page)}
          >
            <View 
              className={styles.entryIcon}
              style={{ backgroundColor: entry.color }}
            >
              <Text>{entry.icon}</Text>
            </View>
            <Text className={styles.entryName}>{entry.name}</Text>
          </View>
        ))}
      </View>

      {/* Tab切换 */}
      <View className={styles.tabBar}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.key === 'pending' && pendingCount > 0 && (
              <Text style={{ marginLeft: 8, fontSize: 20, color: '#F44336' }}>({pendingCount})</Text>
            )}
          </View>
        ))}
      </View>

      {/* 订单列表 */}
      <View className={styles.content}>
        {filteredOrders.map((order) => (
          <View 
            key={order.id} 
            className={styles.orderCard}
            onClick={() => handleViewOrder(order)}
          >
            <View className={styles.orderHeader}>
              <Text className={styles.orderNo}>{order.orderNo}</Text>
              <View className={classnames(styles.orderStatus, styles[order.status])}>
                {order.statusName}
              </View>
            </View>

            <View className={styles.orderType}>{order.typeName}</View>

            <View className={styles.customerInfo}>
              <View className={styles.customer}>
                <Text className={styles.name}>{order.customerName}</Text>
                <Text className={styles.phone}>{order.phone}</Text>
              </View>
              <View className={styles.amount}>
                <Text className={styles.total}>¥{order.totalAmount.toFixed(2)}</Text>
                <Text className={styles.paid}>已付 ¥{order.paidAmount.toFixed(2)}</Text>
              </View>
            </View>

            <View className={styles.orderItems}>
              {order.items.slice(0, 2).map((item) => (
                <View key={item.id} className={styles.item}>
                  <Text className={styles.itemName}>{item.productName}</Text>
                  <Text className={styles.itemInfo}>
                    {item.quantity}{item.unit} × ¥{item.unitPrice}
                  </Text>
                </View>
              ))}
              {order.items.length > 2 && (
                <View className={styles.item}>
                  <Text className={styles.itemName}>...等{order.items.length}件商品</Text>
                  <Text className={styles.itemInfo}></Text>
                </View>
              )}
            </View>

            <View className={styles.orderFooter}>
              <Text className={styles.orderTime}>{order.createTime}</Text>
              <View className={styles.actions} onClick={(e) => e.stopPropagation()}>
                {(order.status === 'pending' || order.status === 'paid') && (
                  <Button
                    className={classnames(styles.actionBtn, styles.primary)}
                    onClick={() => handleShip(order)}
                  >
                    发货
                  </Button>
                )}
                {order.traceCode && (
                  <Button
                    className={classnames(styles.actionBtn, styles.secondary)}
                    onClick={() => handleTrace(order)}
                  >
                    溯源
                  </Button>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default SalesPage;
