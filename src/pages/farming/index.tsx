import React, { useState } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockTeaPlots, mockFarmRecords, mockPickingRecords } from '@/data/mockFarming';
import { TeaPlot, FarmRecord, PickingRecord } from '@/types';

const FarmingPage: React.FC = () => {
  const router = useRouter();
  const initialTab = router.params.tab || 'plots';
  
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showActionSheet, setShowActionSheet] = useState(false);

  const tabs = [
    { key: 'plots', label: '茶园地块' },
    { key: 'records', label: '农事记录' },
    { key: 'picking', label: '采摘记录' }
  ];

  const statusFilters = [
    { key: 'all', label: '全部' },
    { key: 'healthy', label: '正常' },
    { key: 'warning', label: '需关注' },
    { key: 'danger', label: '异常' }
  ];

  const [plots] = useState<TeaPlot[]>(mockTeaPlots);
  const [records] = useState<FarmRecord[]>(mockFarmRecords);
  const [pickings] = useState<PickingRecord[]>(mockPickingRecords);

  const filteredPlots = statusFilter === 'all' 
    ? plots 
    : plots.filter(p => p.status === statusFilter);

  const getStatusText = (status: string) => {
    if (status === 'healthy') return '正常';
    if (status === 'warning') return '需关注';
    return '异常';
  };

  const getFarmTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      fertilize: '🧪',
      weed: '🌾',
      pest: '🐛',
      irrigate: '💧',
      prune: '✂️'
    };
    return icons[type] || '📝';
  };

  const getFarmTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fertilize: 'rgba(76, 175, 80, 0.1)',
      weed: 'rgba(255, 152, 0, 0.1)',
      pest: 'rgba(244, 67, 54, 0.1)',
      irrigate: 'rgba(33, 150, 243, 0.1)',
      prune: 'rgba(156, 39, 176, 0.1)'
    };
    return colors[type] || 'rgba(46, 125, 50, 0.1)';
  };

  const getQualityText = (quality: string) => {
    if (quality === 'excellent') return '优质';
    if (quality === 'good') return '良好';
    return '一般';
  };

  const handlePlotClick = (plot: TeaPlot) => {
    console.log('[FarmingPage] 点击地块:', plot.name);
    Taro.navigateTo({ 
      url: `/pages/plot-detail/index?id=${plot.id}` 
    }).catch((err) => {
      console.error('[FarmingPage] 跳转地块详情失败:', err);
    });
  };

  const handleAddFarm = () => {
    console.log('[FarmingPage] 新增农事记录');
    setShowActionSheet(false);
    Taro.navigateTo({ url: '/pages/farm-record/index' }).catch((err) => {
      console.error('[FarmingPage] 跳转失败:', err);
    });
  };

  const handleAddPicking = () => {
    console.log('[FarmingPage] 新增采摘记录');
    setShowActionSheet(false);
    Taro.navigateTo({ url: '/pages/picking/index' }).catch((err) => {
      console.error('[FarmingPage] 跳转失败:', err);
    });
  };

  const handleRecordClick = (record: FarmRecord) => {
    console.log('[FarmingPage] 查看农事记录:', record.id);
    Taro.navigateTo({ 
      url: `/pages/farm-record/index?id=${record.id}` 
    }).catch((err) => {
      console.error('[FarmingPage] 跳转失败:', err);
    });
  };

  const handlePickingClick = (picking: PickingRecord) => {
    console.log('[FarmingPage] 查看采摘记录:', picking.batchNo);
    Taro.showToast({ title: '批次：' + picking.batchNo, icon: 'none' });
  };

  return (
    <View className={styles.page}>
      {/* Tab切换 */}
      <View className={styles.tabBar}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </View>
        ))}
      </View>

      {/* 筛选栏 - 仅地块页显示 */}
      {activeTab === 'plots' && (
        <ScrollView className={styles.filterBar} scrollX enableFlex>
          {statusFilters.map((filter) => (
            <Button
              key={filter.key}
              className={classnames(styles.filterItem, statusFilter === filter.key && styles.active)}
              onClick={() => setStatusFilter(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </ScrollView>
      )}

      {/* 内容区域 */}
      <View className={styles.content}>
        {/* 地块列表 */}
        {activeTab === 'plots' && (
          <View>
            {filteredPlots.map((plot) => (
              <View
                key={plot.id}
                className={styles.plotCard}
                onClick={() => handlePlotClick(plot)}
              >
                <View className={styles.plotHeader}>
                  <Text className={styles.plotName}>{plot.name}</Text>
                  <View className={classnames(styles.statusBadge, styles[plot.status])}>
                    {getStatusText(plot.status)}
                  </View>
                </View>
                <View className={styles.plotImage}>
                  <Image src={plot.image} mode="aspectFill" />
                </View>
                <View className={styles.plotInfo}>
                  <View className={styles.infoItem}>
                    <Text className={styles.infoLabel}>面积：</Text>
                    <Text>{plot.area}{plot.unit}</Text>
                  </View>
                  <View className={styles.infoItem}>
                    <Text className={styles.infoLabel}>品种：</Text>
                    <Text>{plot.variety}</Text>
                  </View>
                  <View className={styles.infoItem}>
                    <Text className={styles.infoLabel}>树龄：</Text>
                    <Text>{plot.age}年</Text>
                  </View>
                  <View className={styles.infoItem}>
                    <Text className={styles.infoLabel}>海拔：</Text>
                    <Text>{plot.altitude}m</Text>
                  </View>
                </View>
                <View className={styles.plotFooter}>
                  <Text>上次施肥：{plot.lastFertilize}</Text>
                  <Text>预计产量：{plot.expectedYield}kg</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 农事记录列表 */}
        {activeTab === 'records' && (
          <View>
            {records.map((record) => (
              <View
                key={record.id}
                className={styles.farmCard}
                onClick={() => handleRecordClick(record)}
              >
                <View className={styles.farmHeader}>
                  <View className={styles.farmType}>
                    <View
                      className={styles.typeIcon}
                      style={{ backgroundColor: getFarmTypeColor(record.type) }}
                    >
                      <Text>{getFarmTypeIcon(record.type)}</Text>
                    </View>
                    <View className={styles.typeInfo}>
                      <Text className={styles.typeName}>{record.typeName}</Text>
                      <Text className={styles.plotName}>{record.plotName}</Text>
                    </View>
                  </View>
                  <Text className={styles.farmDate}>{record.date}</Text>
                </View>
                <Text className={styles.farmDesc}>{record.description}</Text>
                <View className={styles.farmMeta}>
                  <View className={styles.metaItem}>
                    <Text>👤 {record.operator}</Text>
                  </View>
                  {record.quantity && (
                    <View className={styles.metaItem}>
                      <Text>📦 {record.quantity}{record.unit}</Text>
                    </View>
                  )}
                  <View className={styles.metaItem}>
                    <Text>🌡️ {record.temperature}°C</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text>☀️ {record.weather}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 采摘记录列表 */}
        {activeTab === 'picking' && (
          <View>
            {pickings.map((picking) => (
              <View
                key={picking.id}
                className={styles.pickingCard}
                onClick={() => handlePickingClick(picking)}
              >
                <View className={styles.pickingHeader}>
                  <Text className={styles.batchNo}>{picking.batchNo}</Text>
                  <View className={classnames('tag', styles[picking.type])}>
                    {picking.typeName}
                  </View>
                </View>
                <View className={styles.pickingInfo}>
                  <View className={styles.infoLeft}>
                    <Text className={styles.plotName}>{picking.plotName}</Text>
                    <Text className={styles.pickingTime}>{picking.date} {picking.time}</Text>
                  </View>
                  <View className={styles.infoRight}>
                    <Text className={styles.weight}>
                      {picking.weight}
                      <Text className={styles.unit}>{picking.unit}</Text>
                    </Text>
                    <Text className={styles.leafGrade}>{picking.leafGrade}</Text>
                  </View>
                </View>
                <View className={styles.pickingFooter}>
                  <Text className={styles.pickers}>
                    采摘人员：{picking.pickers.join('、')}
                  </Text>
                  <Text className={classnames(styles.quality, styles[picking.quality])}>
                    {getQualityText(picking.quality)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 悬浮操作按钮 */}
      <View className={styles.fabButton} onClick={() => setShowActionSheet(true)}>
        <Text className={styles.fabIcon}>+</Text>
      </View>

      {/* 遮罩层 */}
      <View
        className={classnames(styles.mask, showActionSheet && styles.show)}
        onClick={() => setShowActionSheet(false)}
      />

      {/* 操作菜单 */}
      <View className={classnames(styles.actionSheet, showActionSheet && styles.show)}>
        <Text className={styles.sheetTitle}>选择操作</Text>
        <View className={styles.sheetActions}>
          <View className={styles.actionItem} onClick={handleAddFarm}>
            <View
              className={styles.actionIcon}
              style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)' }}
            >
              <Text>📝</Text>
            </View>
            <Text className={styles.actionName}>农事记录</Text>
          </View>
          <View className={styles.actionItem} onClick={handleAddPicking}>
            <View
              className={styles.actionIcon}
              style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}
            >
              <Text>🍃</Text>
            </View>
            <Text className={styles.actionName}>采摘登记</Text>
          </View>
        </View>
        <Button
          className={styles.sheetCancel}
          onClick={() => setShowActionSheet(false)}
        >
          取消
        </Button>
      </View>
    </View>
  );
};

export default FarmingPage;
