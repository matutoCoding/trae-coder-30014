import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const LedgerPage: React.FC = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.icon}>💰</Text>
      <Text className={styles.title}>收支台账</Text>
      <Text className={styles.desc}>
        功能正在开发中...{'\n'}
        即将支持收入支出记录、分类统计、图表分析、月度/年度报表等财务管理功能
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

export default LedgerPage;
