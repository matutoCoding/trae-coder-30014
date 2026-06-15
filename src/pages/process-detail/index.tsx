import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockProcessingList } from '@/data/mockProcessing';
import { TeaProcess, ProcessStep } from '@/types';

const ProcessDetailPage: React.FC = () => {
  const router = useRouter();
  const processId = router.params.id || '1';
  
  const [process, setProcess] = useState<TeaProcess | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  useDidShow(() => {
    const found = mockProcessingList.find(p => p.id === processId) || mockProcessingList[0];
    setProcess(found);
    if (found) {
      const currentStep = found.steps.find(s => s.status === 'processing');
      if (currentStep) {
        setExpandedStep(currentStep.id);
      }
    }
  });

  const getStepStatusClass = (status: string) => {
    if (status === 'completed') return styles.completed;
    if (status === 'processing') return styles.processing;
    return styles.pending;
  };

  const getStepStatusText = (status: string) => {
    if (status === 'completed') return '已完成';
    if (status === 'processing') return '进行中';
    return '待开始';
  };

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleStartStep = (step: ProcessStep) => {
    if (!process) return;
    Taro.showModal({
      title: '确认开始',
      content: `确定开始「${step.name}」工序吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已开始', icon: 'success' });
        }
      }
    });
  };

  const handleCompleteStep = (step: ProcessStep) => {
    if (!process) return;
    Taro.showModal({
      title: '确认完成',
      content: `确定完成「${step.name}」工序吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已完成', icon: 'success' });
        }
      }
    });
  };

  if (!process) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const teaRate = process.outputWeight > 0 
    ? ((process.outputWeight / process.inputWeight) * 100).toFixed(1)
    : '-';

  return (
    <View className={styles.page}>
      {/* 顶部批次信息 */}
      <View className={styles.header}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text style={{ fontSize: 36 }}>‹</Text>
        </View>
        <View className={styles.headerContent}>
          <View className={styles.headerTop}>
            <Text className={styles.batchNo}>{process.batchNo}</Text>
            <View className={classnames('tag', styles.statusTag, getStepStatusClass(process.status === 'completed' ? 'completed' : 'processing'))}>
              {process.status === 'completed' ? '已完成' : process.status === 'paused' ? '已暂停' : '加工中'}
            </View>
          </View>
          <Text className={styles.operator}>制茶师：{process.operator}</Text>
        </View>
        
        {/* 数据指标 */}
        <View className={styles.metricsRow}>
          <View className={styles.metricItem}>
            <Text className={styles.metricValue}>{process.inputWeight}kg</Text>
            <Text className={styles.metricLabel}>投入鲜叶</Text>
          </View>
          <View className={styles.metricDivider} />
          <View className={styles.metricItem}>
            <Text className={styles.metricValue}>{process.outputWeight}kg</Text>
            <Text className={styles.metricLabel}>产出干茶</Text>
          </View>
          <View className={styles.metricDivider} />
          <View className={styles.metricItem}>
            <Text className={styles.metricValue}>{teaRate}%</Text>
            <Text className={styles.metricLabel}>制茶率</Text>
          </View>
        </View>
      </View>

      <ScrollView className={styles.content} scrollY>
        {/* 时间信息 */}
        <View className={styles.timeCard}>
          <View className={styles.timeItem}>
            <Text className={styles.timeLabel}>开始时间</Text>
            <Text className={styles.timeValue}>{process.startTime}</Text>
          </View>
          <View className={styles.timeItem}>
            <Text className={styles.timeLabel}>预计完成</Text>
            <Text className={styles.timeValue}>{process.estimatedEndTime}</Text>
          </View>
        </View>

        {/* 工序流程 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>加工工序</Text>
          
          <View className={styles.timeline}>
            {process.steps.map((step, index) => (
              <View key={step.id} className={styles.stepItem}>
                <View className={styles.stepLeft}>
                  <View className={classnames(styles.stepNode, getStepStatusClass(step.status))}>
                    {step.status === 'completed' ? (
                      <Text className={styles.stepCheck}>✓</Text>
                    ) : (
                      <Text className={styles.stepNumber}>{index + 1}</Text>
                    )}
                  </View>
                  {index < process.steps.length - 1 && (
                    <View className={classnames(styles.stepLine, step.status === 'completed' && styles.lineCompleted)} />
                  )}
                </View>
                
                <View className={styles.stepContent}>
                  <View 
                    className={styles.stepHeader}
                    onClick={() => toggleStep(step.id)}
                  >
                    <View className={styles.stepInfo}>
                      <Text className={styles.stepName}>{step.name}</Text>
                      <Text className={styles.stepStatus}>{getStepStatusText(step.status)}</Text>
                    </View>
                    <Text className={classnames(styles.stepArrow, expandedStep === step.id && styles.arrowUp)}>›</Text>
                  </View>
                  
                  {expandedStep === step.id && (
                    <View className={styles.stepDetail}>
                      {step.startTime && (
                        <View className={styles.detailRow}>
                          <Text className={styles.detailLabel}>开始时间</Text>
                          <Text className={styles.detailValue}>{step.startTime}</Text>
                        </View>
                      )}
                      {step.endTime && (
                        <View className={styles.detailRow}>
                          <Text className={styles.detailLabel}>结束时间</Text>
                          <Text className={styles.detailValue}>{step.endTime}</Text>
                        </View>
                      )}
                      {step.operator && (
                        <View className={styles.detailRow}>
                          <Text className={styles.detailLabel}>操作人</Text>
                          <Text className={styles.detailValue}>{step.operator}</Text>
                        </View>
                      )}
                      
                      {step.parameters && step.parameters.length > 0 && (
                        <View className={styles.paramsSection}>
                          <Text className={styles.paramsTitle}>工艺参数</Text>
                          <View className={styles.paramsGrid}>
                            {step.parameters.map((param, pIndex) => (
                              <View key={pIndex} className={styles.paramItem}>
                                <Text className={styles.paramValue}>{param.value}{param.unit}</Text>
                                <Text className={styles.paramLabel}>{param.name}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                      
                      {step.status === 'pending' && index === process.currentStep - 1 && (
                        <Button 
                          className={styles.actionBtn}
                          onClick={() => handleStartStep(step)}
                        >
                          开始{step.name}
                        </Button>
                      )}
                      
                      {step.status === 'processing' && (
                        <Button 
                          className={styles.actionBtn}
                          onClick={() => handleCompleteStep(step)}
                        >
                          完成{step.name}
                        </Button>
                      )}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 批次备注 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>批次信息</Text>
          <View className={styles.infoCard}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>批次号</Text>
              <Text className={styles.infoValue}>{process.batchNo}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>总工序</Text>
              <Text className={styles.infoValue}>{process.totalSteps}道</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>当前进度</Text>
              <Text className={styles.infoValue}>第{process.currentStep}道</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default ProcessDetailPage;
