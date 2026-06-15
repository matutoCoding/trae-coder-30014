import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const PlotDetailPage: React.FC = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.icon}>📍</Text>
      <Text className={styles.title}>地块详情</Text>
      <Text className={styles.desc}>
        功能正在开发中...{'\n'}
        即将展示茶园地块的详细信息、环境数据、农事历史记录等
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

export default PlotDetailPage;
