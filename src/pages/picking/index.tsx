import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const PickingPage: React.FC = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.icon}>🍃</Text>
      <Text className={styles.title}>采摘登记</Text>
      <Text className={styles.desc}>
        功能正在开发中...{'\n'}
        即将支持采摘批次登记、明前雨前分类、采摘人员管理、品质评定等功能
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

export default PickingPage;
