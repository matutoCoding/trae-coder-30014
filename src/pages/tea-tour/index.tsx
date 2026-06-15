import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const TeaTourPage: React.FC = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.icon}>🏞️</Text>
      <Text className={styles.title}>茶旅体验</Text>
      <Text className={styles.desc}>
        功能正在开发中...{'\n'}
        即将支持茶园观光、采茶体验、制茶体验、茶文化研学等茶旅产品的展示和预约
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

export default TeaTourPage;
