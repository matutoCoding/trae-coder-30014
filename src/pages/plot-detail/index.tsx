import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockTeaPlots, mockFarmRecords } from '@/data/mockFarming';
import { TeaPlot, FarmRecord } from '@/types';

const PlotDetailPage: React.FC = () => {
  const router = useRouter();
  const plotId = router.params.id || '1';
  
  const [plot, setPlot] = useState<TeaPlot | null>(null);
  const [farmRecords, setFarmRecords] = useState<FarmRecord[]>([]);

  useDidShow(() => {
    const foundPlot = mockTeaPlots.find(p => p.id === plotId) || mockTeaPlots[0];
    setPlot(foundPlot);
    
    const records = mockFarmRecords
      .filter(r => r.plotId === plotId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setFarmRecords(records);
  });

  const getStatusClass = (status: string) => {
    if (status === 'healthy') return styles.healthy;
    if (status === 'warning') return styles.warning;
    return styles.danger;
  };

  const getStatusText = (status: string) => {
    if (status === 'healthy') return '生长良好';
    if (status === 'warning') return '需关注';
    return '异常';
  };

  const getFarmTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      fertilize: '🌱',
      weed: '🪓',
      pest: '🐛',
      irrigate: '💧',
      prune: '✂️'
    };
    return icons[type] || '📋';
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleViewFarmRecord = (record: FarmRecord) => {
    Taro.navigateTo({ url: `/pages/farm-record/index?id=${record.id}` });
  };

  if (!plot) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      {/* 顶部大图 */}
      <View className={styles.heroSection}>
        <Image className={styles.heroImage} src={plot.image} mode="aspectFill" />
        <View className={styles.heroOverlay}>
          <View className={styles.backBtn} onClick={handleBack}>
            <Text style={{ fontSize: 36 }}>‹</Text>
          </View>
          <View className={styles.heroInfo}>
            <Text className={styles.plotName}>{plot.name}</Text>
            <View className={classnames('tag', styles.statusTag, getStatusClass(plot.status))}>
              {getStatusText(plot.status)}
            </View>
          </View>
        </View>
      </View>

      <ScrollView className={styles.content} scrollY>
        {/* 基本信息 */}
        <View className={styles.card}>
          <Text className={styles.cardTitle}>基本信息</Text>
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>面积</Text>
              <Text className={styles.infoValue}>{plot.area}{plot.unit}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>品种</Text>
              <Text className={styles.infoValue}>{plot.variety}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>树龄</Text>
              <Text className={styles.infoValue}>{plot.age}年</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>海拔</Text>
              <Text className={styles.infoValue}>{plot.altitude}m</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>土壤类型</Text>
              <Text className={styles.infoValue}>{plot.soilType}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>预计产量</Text>
              <Text className={styles.infoValue}>{plot.expectedYield}kg</Text>
            </View>
          </View>
        </View>

        {/* 环境数据 */}
        <View className={styles.card}>
          <Text className={styles.cardTitle}>农事概览</Text>
          <View className={styles.envRow}>
            <View className={styles.envItem}>
              <Text className={styles.envIcon}>🌱</Text>
              <View className={styles.envInfo}>
                <Text className={styles.envValue}>{plot.lastFertilize}</Text>
                <Text className={styles.envLabel}>上次施肥</Text>
              </View>
            </View>
            <View className={styles.envItem}>
              <Text className={styles.envIcon}>🪓</Text>
              <View className={styles.envInfo}>
                <Text className={styles.envValue}>{plot.lastWeed}</Text>
                <Text className={styles.envLabel}>上次除草</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 农事历史 */}
        <View className={styles.card}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>最近农事</Text>
            <Text 
              className={styles.moreLink}
              onClick={() => Taro.navigateTo({ url: `/pages/farm-record/index?plotId=${plot.id}` })}
            >
              全部 ›
            </Text>
          </View>
          <View className={styles.farmList}>
            {farmRecords.map((record) => (
              <View 
                key={record.id} 
                className={styles.farmItem}
                onClick={() => handleViewFarmRecord(record)}
              >
                <View className={styles.farmIcon}>{getFarmTypeIcon(record.type)}</View>
                <View className={styles.farmContent}>
                  <View className={styles.farmHeader}>
                    <Text className={styles.farmType}>{record.typeName}</Text>
                    <Text className={styles.farmDate}>{record.date}</Text>
                  </View>
                  <Text className={styles.farmDesc}>{record.description}</Text>
                  <View className={styles.farmMeta}>
                    <Text>操作人：{record.operator}</Text>
                    {record.quantity && <Text>用量：{record.quantity}{record.unit}</Text>}
                  </View>
                </View>
              </View>
            ))}
            {farmRecords.length === 0 && (
              <View className={styles.empty}>
                <Text>暂无农事记录</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default PlotDetailPage;
