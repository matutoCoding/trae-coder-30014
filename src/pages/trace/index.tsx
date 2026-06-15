import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const TracePage: React.FC = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.icon}>🔍</Text>
      <Text className={styles.title}>溯源查询</Text>
      <Text className={styles.desc}>
        功能正在开发中...{'\n'}
        即将支持茶叶溯源码扫描、全链路追溯信息展示，从茶园到茶杯的全程可视化
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

export default TracePage;
