import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const ProcessDetailPage: React.FC = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.icon}>⚙️</Text>
      <Text className={styles.title}>工序详情</Text>
      <Text className={styles.desc}>
        功能正在开发中...{'\n'}
        即将展示萎凋、杀青、揉捻、烘干、筛选、精制等制茶工序的详细参数和进度
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

export default ProcessDetailPage;
