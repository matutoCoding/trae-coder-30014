import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const FarmRecordPage: React.FC = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.icon}>📋</Text>
      <Text className={styles.title}>农事记录</Text>
      <Text className={styles.desc}>
        功能正在开发中...{'\n'}
        即将支持施肥、除草、病虫害防治、灌溉、修剪等农事操作的详细记录
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

export default FarmRecordPage;
