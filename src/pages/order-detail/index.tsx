import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockOrderList } from '@/data/mockSales';
import { Order } from '@/types';

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orderId = router.params.id;
    if (orderId) {
      const foundOrder = mockOrderList.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        Taro.showToast({ title: '订单不存在', icon: 'none' });
      }
    }
  }, [router.params.id]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'paid':
        return 'paid';
      case 'shipping':
        return 'shipping';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return '';
    }
  };

  const handleBack = () => {
    Taro.navigateBack().catch(() => {});
  };

  const handleShip = () => {
    console.log('[OrderDetailPage] 订单发货');
    Taro.showToast({ title: '已标记发货', icon: 'success' });
  };

  const handleLogistics = () => {
    console.log('[OrderDetailPage] 查看物流');
    Taro.showToast({ title: '物流信息查看中...', icon: 'none' });
  };

  const handleTrace = () => {
    if (order?.traceCode) {
      Taro.navigateTo({
        url: `/pages/trace/index?code=${order.traceCode}`
      }).catch((err) => {
        console.error('[OrderDetailPage] 跳转溯源页失败:', err);
      });
    }
  };

  const calculateSubtotal = () => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateDiscount = () => {
    if (!order) return 0;
    const subtotal = calculateSubtotal();
    return subtotal - order.totalAmount;
  };

  if (!order) {
    return (
      <View className={styles.page}>
        <View className={styles.loading}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollContainer}>
        {/* 订单状态头部 */}
        <View className={styles.statusHeader}>
          <View className={classnames(styles.statusBadge, styles[getStatusClass(order.status)])}>
            {order.statusName}
          </View>
          <View className={styles.orderNo}>订单号：{order.orderNo}</View>
          <View className={styles.orderTime}>下单时间：{order.createTime}</View>
        </View>

        {/* 收货信息 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>�</Text>
            <Text className={styles.sectionTitle}>收货信息</Text>
          </View>
          <View className={styles.receiverInfo}>
            <View className={styles.receiverRow}>
              <Text className={styles.receiverName}>{order.customerName}</Text>
              <Text className={styles.receiverPhone}>{order.phone}</Text>
            </View>
            {order.address && (
              <View className={styles.receiverAddress}>
                <Text>{order.address}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 商品列表 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>🍵</Text>
            <Text className={styles.sectionTitle}>商品信息</Text>
          </View>
          <View className={styles.productList}>
            {order.items.map((item) => (
              <View key={item.id} className={styles.productItem}>
                <View className={styles.productInfo}>
                  <Text className={styles.productName}>{item.productName}</Text>
                  <Text className={styles.productType}>{item.productType}</Text>
                </View>
                <View className={styles.productPrice}>
                  <Text className={styles.unitPrice}>¥{item.unitPrice}</Text>
                  <Text className={styles.quantity}>×{item.quantity}{item.unit}</Text>
                </View>
                <View className={styles.subtotal}>
                  <Text className={styles.subtotalLabel}>小计</Text>
                  <Text className={styles.subtotalValue}>¥{item.subtotal.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 金额汇总 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>💰</Text>
            <Text className={styles.sectionTitle}>金额明细</Text>
          </View>
          <View className={styles.amountSummary}>
            <View className={styles.amountRow}>
              <Text className={styles.amountLabel}>商品金额</Text>
              <Text className={styles.amountValue}>¥{calculateSubtotal().toFixed(2)}</Text>
            </View>
            <View className={styles.amountRow}>
              <Text className={styles.amountLabel}>运费</Text>
              <Text className={styles.amountValue}>¥0.00</Text>
            </View>
            {calculateDiscount() > 0 && (
              <View className={styles.amountRow}>
                <Text className={styles.amountLabel}>优惠</Text>
                <Text className={classnames(styles.amountValue, styles.discount)}>-¥{calculateDiscount().toFixed(2)}</Text>
              </View>
            )}
            <View className={styles.amountDivider} />
            <View className={styles.amountRow}>
              <Text className={styles.totalLabel}>实付金额</Text>
              <Text className={styles.totalValue}>¥{order.paidAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* 订单信息 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>📋</Text>
            <Text className={styles.sectionTitle}>订单信息</Text>
          </View>
          <View className={styles.orderInfo}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>订单类型</Text>
              <Text className={styles.infoValue}>{order.typeName}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>支付方式</Text>
              <Text className={styles.infoValue}>{order.status === 'pending' ? '待支付' : '在线支付'}</Text>
            </View>
            {order.payTime && (
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>支付时间</Text>
                <Text className={styles.infoValue}>{order.payTime}</Text>
              </View>
            )}
            {order.shipTime && (
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>发货时间</Text>
                <Text className={styles.infoValue}>{order.shipTime}</Text>
              </View>
            )}
            {order.completeTime && (
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>完成时间</Text>
                <Text className={styles.infoValue}>{order.completeTime}</Text>
              </View>
            )}
            {order.remark && (
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>备注</Text>
                <Text className={styles.infoValue}>{order.remark}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.bottomBar}>
        {(order.status === 'pending' || order.status === 'paid') && (
          <Button
            className={classnames(styles.actionBtn, styles.primaryBtn)}
            onClick={handleShip}
          >
            发货
          </Button>
        )}
        {(order.status === 'shipping' || order.status === 'completed') && (
          <Button
            className={classnames(styles.actionBtn, styles.secondaryBtn)}
            onClick={handleLogistics}
          >
            查看物流
          </Button>
        )}
        {order.traceCode && (
          <Button
            className={classnames(styles.actionBtn, order.status === 'shipping' || order.status === 'completed' ? styles.secondaryBtn : styles.primaryBtn)}
            onClick={handleTrace}
          >
            查看溯源
          </Button>
        )}
      </View>
    </View>
  );
};

export default OrderDetailPage;
