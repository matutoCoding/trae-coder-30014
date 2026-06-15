import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const OrderDetailPage: React.FC = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.icon}>📄</Text>
      <Text className={styles.title}>订单详情</Text>
      <Text className={styles.desc}>
        功能正在开发中...{'\n'}
        即将展示订单的详细信息，包括客户信息、商品明细、配送信息、支付状态等
      </Text>
      <Button
        className={styles.backBtn}
        onClick={() => Taro.navigateBack()}
      >
        返回
      </Button>
    </View>
  );
};

export default OrderDetailPage;
