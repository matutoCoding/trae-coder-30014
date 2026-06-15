import React, { useState, useEffect } from 'react';
import { View, Text, Button, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockTraceInfo, mockOrderList } from '@/data/mockSales';
import { TraceInfo } from '@/types';

const TracePage: React.FC = () => {
  const router = useRouter();
  const [traceCode, setTraceCode] = useState('');
  const [traceInfo, setTraceInfo] = useState<TraceInfo | null>(null);
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('query');

  useEffect(() => {
    const code = router.params.code;
    const tab = router.params.tab;
    if (tab === 'manage') {
      setActiveTab('manage');
    }
    if (code) {
      setTraceCode(code);
      handleSearch(code);
    }
  }, [router.params.code, router.params.tab]);

  const handleSearch = (code?: string) => {
    const searchCode = code || traceCode;
    if (!searchCode) {
      Taro.showToast({ title: '请输入溯源码', icon: 'none' });
      return;
    }
    setSearched(true);
    if (searchCode === mockTraceInfo.traceCode) {
      setTraceInfo(mockTraceInfo);
    } else {
      setTraceInfo(null);
    }
  };

  const handleScan = () => {
    console.log('[TracePage] 扫码查询');
    Taro.showToast({ title: '扫码功能模拟', icon: 'none' });
    setTimeout(() => {
      setTraceCode('TC202606140001');
      handleSearch('TC202606140001');
    }, 500);
  };

  const getStepStatus = (index: number) => {
    if (!traceInfo) return 'pending';
    if (index < traceInfo.processing.steps.length - 1) return 'completed';
    if (index === traceInfo.processing.steps.length - 1) return 'completed';
    return 'pending';
  };

  const renderQueryTab = () => (
    <View className={styles.querySection}>
      <View className={styles.searchBox}>
        <Input
          className={styles.searchInput}
          placeholder="请输入溯源码"
          value={traceCode}
          onInput={(e) => setTraceCode(e.detail.value)}
        />
        <Button className={styles.searchBtn} onClick={() => handleSearch()}>
          查询
        </Button>
      </View>
      <View className={styles.scanBtn} onClick={handleScan}>
        <Text className={styles.scanIcon}>📷</Text>
        <Text className={styles.scanText}>扫码查询</Text>
      </View>

      {searched && !traceInfo && (
        <View className={styles.notFound}>
          <Text className={styles.notFoundIcon}>🔍</Text>
          <Text className={styles.notFoundText}>未找到溯源信息</Text>
          <Text className={styles.notFoundDesc}>请检查溯源码是否正确</Text>
        </View>
      )}

      {traceInfo && (
        <ScrollView scrollY className={styles.traceResult}>
          <View className={styles.productHeader}>
            <View className={styles.productInfo}>
              <Text className={styles.productName}>{traceInfo.productName}</Text>
              <Text className={styles.traceCode}>溯源码：{traceInfo.traceCode}</Text>
              <Text className={styles.batchNo}>批次号：{traceInfo.batchNo}</Text>
            </View>
            <View className={styles.qualityBadge}>
              <Text>✓</Text>
              <Text>品质合格</Text>
            </View>
          </View>

          <View className={styles.timeline}>
            <View className={styles.timelineItem}>
              <View className={classnames(styles.timelineDot, styles.completed)}>
                <Text>🌿</Text>
              </View>
              <View className={styles.timelineContent}>
                <View className={styles.timelineHeader}>
                  <Text className={styles.timelineTitle}>茶园种植</Text>
                  <Text className={styles.timelineDate}>{traceInfo.picking.date}</Text>
                </View>
                <View className={styles.timelineDetail}>
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>茶园名称</Text>
                    <Text className={styles.detailValue}>{traceInfo.teaPlot.name}</Text>
                  </View>
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>茶园面积</Text>
                    <Text className={styles.detailValue}>{traceInfo.teaPlot.area}亩</Text>
                  </View>
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>茶叶品种</Text>
                    <Text className={styles.detailValue}>{traceInfo.teaPlot.variety}</Text>
                  </View>
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>海拔高度</Text>
                    <Text className={styles.detailValue}>{traceInfo.teaPlot.altitude}m</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className={styles.timelineItem}>
              <View className={classnames(styles.timelineDot, styles.completed)}>
                <Text>🍃</Text>
              </View>
              <View className={styles.timelineContent}>
                <View className={styles.timelineHeader}>
                  <Text className={styles.timelineTitle}>采摘</Text>
                  <Text className={styles.timelineDate}>{traceInfo.picking.date}</Text>
                </View>
                <View className={styles.timelineDetail}>
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>茶叶类型</Text>
                    <Text className={styles.detailValue}>{traceInfo.picking.type}</Text>
                  </View>
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>采摘重量</Text>
                    <Text className={styles.detailValue}>{traceInfo.picking.weight}kg</Text>
                  </View>
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>采摘人员</Text>
                    <Text className={styles.detailValue}>{traceInfo.picking.pickers.join('、')}</Text>
                  </View>
                </View>
              </View>
            </View>

            {traceInfo.processing.steps.map((step, index) => (
              <View className={styles.timelineItem} key={index}>
                <View className={classnames(styles.timelineDot, getStepStatus(index) === 'completed' && styles.completed)}>
                  <Text>{index === 0 ? '☀️' : index === 1 ? '🔥' : index === 2 ? '🔄' : index === 3 ? '💨' : '📦'}</Text>
                </View>
                <View className={styles.timelineContent}>
                  <View className={styles.timelineHeader}>
                    <Text className={styles.timelineTitle}>{step.name}</Text>
                    <Text className={styles.timelineDate}>{step.startTime}</Text>
                  </View>
                  <View className={styles.timelineDetail}>
                    {step.parameters.map((param, pIndex) => (
                      <View className={styles.detailRow} key={pIndex}>
                        <Text className={styles.detailLabel}>{param.name}</Text>
                        <Text className={styles.detailValue}>{param.value}{param.unit}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}

            <View className={styles.timelineItem}>
              <View className={classnames(styles.timelineDot, styles.completed)}>
                <Text>🧪</Text>
              </View>
              <View className={styles.timelineContent}>
                <View className={styles.timelineHeader}>
                  <Text className={styles.timelineTitle}>质量检测</Text>
                  <Text className={styles.timelineDate}>{traceInfo.testing.date}</Text>
                </View>
                <View className={styles.timelineDetail}>
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>检测机构</Text>
                    <Text className={styles.detailValue}>{traceInfo.testing.agency}</Text>
                  </View>
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>检测结果</Text>
                    <Text className={classnames(styles.detailValue, styles.pass)}>
                      {traceInfo.testing.result === 'pass' ? '合格 ✓' : '不合格 ✗'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className={styles.timelineItem}>
              <View className={classnames(styles.timelineDot, styles.completed)}>
                <Text>📦</Text>
              </View>
              <View className={styles.timelineContent}>
                <View className={styles.timelineHeader}>
                  <Text className={styles.timelineTitle}>包装出厂</Text>
                  <Text className={styles.timelineDate}>{traceInfo.packaging.date}</Text>
                </View>
                <View className={styles.timelineDetail}>
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>包装规格</Text>
                    <Text className={styles.detailValue}>{traceInfo.packaging.spec}</Text>
                  </View>
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>包装数量</Text>
                    <Text className={styles.detailValue}>{traceInfo.packaging.quantity}盒</Text>
                  </View>
                </View>
              </View>
            </View>

            {traceInfo.logistics && (
              <View className={styles.timelineItem}>
                <View className={classnames(styles.timelineDot, styles.completed)}>
                  <Text>🚚</Text>
                </View>
                <View className={styles.timelineContent}>
                  <View className={styles.timelineHeader}>
                    <Text className={styles.timelineTitle}>物流配送</Text>
                    <Text className={styles.timelineDate}>{traceInfo.logistics.updateTime}</Text>
                  </View>
                  <View className={styles.timelineDetail}>
                    <View className={styles.detailRow}>
                      <Text className={styles.detailLabel}>物流公司</Text>
                      <Text className={styles.detailValue}>{traceInfo.logistics.company}</Text>
                    </View>
                    <View className={styles.detailRow}>
                      <Text className={styles.detailLabel}>运单号</Text>
                      <Text className={styles.detailValue}>{traceInfo.logistics.trackingNo}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );

  const renderManageTab = () => (
    <View className={styles.manageSection}>
      <View className={styles.manageHeader}>
        <Text className={styles.manageTitle}>溯源码管理</Text>
        <Button className={styles.generateBtn}>生成溯源码</Button>
      </View>

      <View className={styles.manageStats}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>1280</Text>
          <Text className={styles.statLabel}>总生成数</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>856</Text>
          <Text className={styles.statLabel}>已使用</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>424</Text>
          <Text className={styles.statLabel}>未使用</Text>
        </View>
      </View>

      <View className={styles.batchList}>
        <Text className={styles.listTitle}>最近批次</Text>
        {mockOrderList.filter(o => o.traceCode).slice(0, 4).map((order) => (
          <View 
            className={styles.batchItem} 
            key={order.id}
            onClick={() => {
              setActiveTab('query');
              setTraceCode(order.traceCode!);
              handleSearch(order.traceCode);
            }}
          >
            <View className={styles.batchInfo}>
              <Text className={styles.batchCode}>{order.traceCode}</Text>
              <Text className={styles.batchOrder}>关联订单：{order.orderNo}</Text>
            </View>
            <View className={styles.batchStatus}>
              <Text className={classnames(styles.statusTag, styles.used)}>已使用</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View className={styles.page}>
      <View className={styles.tabHeader}>
        <View
          className={classnames(styles.tabItem, activeTab === 'query' && styles.active)}
          onClick={() => setActiveTab('query')}
        >
          溯源查询
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'manage' && styles.active)}
          onClick={() => setActiveTab('manage')}
        >
          溯源码管理
        </View>
      </View>

      {activeTab === 'query' ? renderQueryTab() : renderManageTab()}
    </View>
  );
};

export default TracePage;
