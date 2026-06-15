import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockProcessingList } from '@/data/mockProcessing';
import { TeaProcess, ProcessStep } from '@/types';

const ProcessingPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [processList] = useState<TeaProcess[]>(mockProcessingList);
  const [selectedProcess, setSelectedProcess] = useState<TeaProcess | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'processing', label: '加工中' },
    { key: 'completed', label: '已完成' }
  ];

  const filteredList = activeFilter === 'all' 
    ? processList 
    : processList.filter(p => p.status === activeFilter);

  const getStatusText = (status: string) => {
    if (status === 'processing') return '加工中';
    if (status === 'completed') return '已完成';
    return '已暂停';
  };

  const getStepStatusText = (status: string) => {
    if (status === 'completed') return '已完成';
    if (status === 'processing') return '进行中';
    return '待开始';
  };

  const getNodeContent = (status: string, index: number) => {
    if (status === 'completed') return '✓';
    return index + 1;
  };

  const handleViewDetail = (process: TeaProcess) => {
    console.log('[ProcessingPage] 查看工序详情:', process.batchNo);
    setSelectedProcess(process);
    setShowDetail(true);
  };

  const handleStartProcess = (process: TeaProcess) => {
    console.log('[ProcessingPage] 开始工序:', process.batchNo);
    Taro.navigateTo({ 
      url: `/pages/process-detail/index?id=${process.id}` 
    }).catch((err) => {
      console.error('[ProcessingPage] 跳转失败:', err);
    });
  };

  const handleGoWarehouse = () => {
    console.log('[ProcessingPage] 跳转仓储管理');
    Taro.navigateTo({ url: '/pages/warehouse/index' }).catch((err) => {
      console.error('[ProcessingPage] 跳转失败:', err);
    });
  };

  return (
    <View className={styles.page}>
      {/* 筛选标签 */}
      <View className={styles.filterTab}>
        {filters.map((filter) => (
          <Button
            key={filter.key}
            className={classnames(styles.filterItem, activeFilter === filter.key && styles.active)}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </Button>
        ))}
      </View>

      {/* 内容区域 */}
      <View className={styles.content}>
        {filteredList.map((process) => (
          <View key={process.id} className={styles.processCard}>
            <View className={styles.cardHeader}>
              <View className={styles.batchInfo}>
                <Text className={styles.batchNo}>{process.batchNo}</Text>
                <Text className={styles.operator}>制茶师：{process.operator}</Text>
              </View>
              <View className={classnames(styles.statusBadge, styles[process.status])}>
                {getStatusText(process.status)}
              </View>
            </View>

            {/* 进度条 */}
            <View className={styles.progressSection}>
              <View className={styles.progressBar}>
                <View 
                  className={styles.progressFill} 
                  style={{ width: `${(process.currentStep / process.totalSteps) * 100}%` }}
                />
              </View>
              <View className={styles.progressText}>
                <Text>进度 {process.currentStep}/{process.totalSteps}</Text>
                <Text>预计 {process.estimatedEndTime} 完成</Text>
              </View>
            </View>

            {/* 工序流程图 */}
            <View className={styles.stepsFlow}>
              {process.steps.map((step, index) => (
                <View key={step.id} className={styles.stepNode}>
                  <View 
                    className={classnames(styles.nodeDot, styles[step.status])}
                  >
                    {getNodeContent(step.status, index)}
                  </View>
                  <Text className={styles.stepName}>{step.name}</Text>
                </View>
              ))}
            </View>

            {/* 重量信息 */}
            <View className={styles.weightInfo}>
              <View className={styles.infoItem}>
                <Text className={styles.value}>{process.inputWeight}kg</Text>
                <Text className={styles.label}>投入鲜叶</Text>
              </View>
              {process.outputWeight > 0 && (
                <View className={styles.infoItem}>
                  <Text className={styles.value}>{process.outputWeight}kg</Text>
                  <Text className={styles.label}>产出干茶</Text>
                </View>
              )}
              {process.outputWeight > 0 && (
                <View className={styles.infoItem}>
                  <Text className={styles.value}>
                    {((process.outputWeight / process.inputWeight) * 100).toFixed(1)}%
                  </Text>
                  <Text className={styles.label}>制茶率</Text>
                </View>
              )}
            </View>

            {/* 底部操作 */}
            <View className={styles.cardFooter}>
              <Text className={styles.timeInfo}>开始时间：{process.startTime}</Text>
              {process.status === 'processing' ? (
                <Button
                  className={styles.actionBtn}
                  onClick={() => handleStartProcess(process)}
                >
                  继续加工
                </Button>
              ) : process.status === 'completed' ? (
                <Button
                  className={styles.actionBtn}
                  onClick={handleGoWarehouse}
                >
                  入库
                </Button>
              ) : (
                <Button
                  className={styles.actionBtn}
                  onClick={() => handleStartProcess(process)}
                >
                  开始加工
                </Button>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* 详情弹窗 */}
      {showDetail && selectedProcess && (
        <View className={styles.detailModal} onClick={() => setShowDetail(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>
                {selectedProcess.batchNo} - 工序详情
              </Text>
              <View className={styles.closeBtn} onClick={() => setShowDetail(false)}>
                ✕
              </View>
            </View>
            
            <ScrollView className={styles.stepDetailList} scrollY>
              {selectedProcess.steps.map((step) => (
                <View key={step.id} className={styles.stepDetailItem}>
                  <View className={styles.stepHeader}>
                    <Text className={styles.stepName}>{step.name}</Text>
                    <View className={classnames(styles.stepStatus, styles[step.status])}>
                      {getStepStatusText(step.status)}
                    </View>
                  </View>
                  
                  <View className={styles.stepTime}>
                    {step.startTime && <Text>开始：{step.startTime}</Text>}
                    {step.endTime && <Text> | 结束：{step.endTime}</Text>}
                    {step.operator && <Text> | 操作人：{step.operator}</Text>}
                  </View>
                  
                  {step.parameters.length > 0 && (
                    <View className={styles.stepParams}>
                      <Text className={styles.paramTitle}>工艺参数</Text>
                      <View className={styles.paramGrid}>
                        {step.parameters.map((param, idx) => (
                          <View key={idx} className={styles.paramItem}>
                            <Text className={styles.paramValue}>
                              {param.value}<Text style={{ fontSize: '20rpx', fontWeight: '400' }}>{param.unit}</Text>
                            </Text>
                            <Text className={styles.paramName}>{param.name}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProcessingPage;
