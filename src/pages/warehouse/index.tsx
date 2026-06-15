import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const WarehousePage: React.FC = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.icon}>📦</Text>
      <Text className={styles.title}>仓储管理</Text>
      <Text className={styles.desc}>
        功能正在开发中...{'\n'}
        即将支持毛茶、精制茶、成品茶的库存管理，包括入库、出库、盘点、保质期预警等功能
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

export default WarehousePage;
