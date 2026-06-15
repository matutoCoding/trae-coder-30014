import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input, Button } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockFarmRecords, mockTeaPlots } from '@/data/mockFarming';
import { FarmRecord } from '@/types';

const FarmRecordPage: React.FC = () => {
  const router = useRouter();
  const initialPlotId = router.params.plotId || '';
  const recordId = router.params.id || '';

  const [activeType, setActiveType] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [records, setRecords] = useState<FarmRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    plotId: '',
    plotName: '',
    type: 'fertilize',
    typeName: '施肥',
    date: new Date().toISOString().split('T')[0],
    operator: '',
    quantity: '',
    unit: 'kg',
    description: ''
  });

  useDidShow(() => {
    setRecords(mockFarmRecords);
    if (initialPlotId) {
      const plot = mockTeaPlots.find(p => p.id === initialPlotId);
      if (plot) {
        setFormData(prev => ({ ...prev, plotId: plot.id, plotName: plot.name }));
      }
    }
  });

  const typeFilters = [
    { key: 'all', label: '全部', icon: '📋' },
    { key: 'fertilize', label: '施肥', icon: '🌱' },
    { key: 'weed', label: '除草', icon: '🪓' },
    { key: 'pest', label: '病虫害', icon: '🐛' },
    { key: 'irrigate', label: '灌溉', icon: '💧' },
    { key: 'prune', label: '修剪', icon: '✂️' }
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      if (activeType !== 'all' && record.type !== activeType) return false;
      if (initialPlotId && record.plotId !== initialPlotId) return false;
      if (searchText && !record.plotName.includes(searchText) && !record.typeName.includes(searchText)) {
        return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records, activeType, searchText, initialPlotId]);

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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fertilize: '#4CAF50',
      weed: '#8D6E63',
      pest: '#F44336',
      irrigate: '#2196F3',
      prune: '#FF9800'
    };
    return colors[type] || '#2E7D32';
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleTypeSelect = (type: string, typeName: string) => {
    setFormData(prev => ({ ...prev, type, typeName }));
  };

  const handlePlotSelect = (plot: any) => {
    setFormData(prev => ({ ...prev, plotId: plot.id, plotName: plot.name }));
  };

  const handleSubmit = () => {
    if (!formData.plotId) {
      Taro.showToast({ title: '请选择地块', icon: 'none' });
      return;
    }
    if (!formData.operator) {
      Taro.showToast({ title: '请填写操作人', icon: 'none' });
      return;
    }
    
    const newRecord: FarmRecord = {
      id: Date.now().toString(),
      plotId: formData.plotId,
      plotName: formData.plotName,
      type: formData.type as any,
      typeName: formData.typeName,
      date: formData.date,
      operator: formData.operator,
      quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
      unit: formData.unit,
      description: formData.description || '无',
      weather: '晴',
      temperature: 25
    };
    
    setRecords(prev => [newRecord, ...prev]);
    setShowAddModal(false);
    Taro.showToast({ title: '记录已添加', icon: 'success' });
    
    setFormData({
      plotId: '',
      plotName: '',
      type: 'fertilize',
      typeName: '施肥',
      date: new Date().toISOString().split('T')[0],
      operator: '',
      quantity: '',
      unit: 'kg',
      description: ''
    });
  };

  const handleViewRecord = (record: FarmRecord) => {
    Taro.showModal({
      title: record.typeName + '详情',
      content: `地块：${record.plotName}\n日期：${record.date}\n操作人：${record.operator}\n${record.quantity ? `用量：${record.quantity}${record.unit}\n` : ''}描述：${record.description}\n天气：${record.weather} ${record.temperature}°C`,
      showCancel: false
    });
  };

  return (
    <View className={styles.page}>
      {/* 顶部搜索和筛选 */}
      <View className={styles.header}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索地块或类型"
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>
        
        <ScrollView className={styles.filterScroll} scrollX enableFlex>
          {typeFilters.map((filter) => (
            <View
              key={filter.key}
              className={classnames(styles.filterItem, activeType === filter.key && styles.active)}
              onClick={() => setActiveType(filter.key)}
            >
              <Text className={styles.filterIcon}>{filter.icon}</Text>
              <Text className={styles.filterLabel}>{filter.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 列表内容 */}
      <ScrollView className={styles.content} scrollY>
        <View className={styles.listHeader}>
          <Text>共 {filteredRecords.length} 条记录</Text>
        </View>
        
        {filteredRecords.map((record) => (
          <View 
            key={record.id} 
            className={styles.recordCard}
            onClick={() => handleViewRecord(record)}
          >
            <View 
              className={styles.recordIcon}
              style={{ backgroundColor: `${getTypeColor(record.type)}15` }}
            >
              <Text>{getFarmTypeIcon(record.type)}</Text>
            </View>
            <View className={styles.recordContent}>
              <View className={styles.recordHeader}>
                <Text className={styles.recordType}>{record.typeName}</Text>
                <Text className={styles.recordDate}>{record.date}</Text>
              </View>
              <Text className={styles.recordPlot}>📍 {record.plotName}</Text>
              <Text className={styles.recordDesc}>{record.description}</Text>
              <View className={styles.recordMeta}>
                <Text>👤 {record.operator}</Text>
                {record.quantity && <Text>📊 {record.quantity}{record.unit}</Text>}
                <Text>🌤️ {record.weather}</Text>
              </View>
            </View>
          </View>
        ))}

        {filteredRecords.length === 0 && (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无农事记录</Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* 悬浮添加按钮 */}
      <View className={styles.fab} onClick={handleAdd}>
        <Text className={styles.fabIcon}>+</Text>
      </View>

      {/* 新增表单弹窗 */}
      {showAddModal && (
        <View className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>新增农事记录</Text>
              <Text className={styles.modalClose} onClick={() => setShowAddModal(false)}>✕</Text>
            </View>
            
            <ScrollView className={styles.formScroll} scrollY>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>选择地块</Text>
                <ScrollView className={styles.plotGrid} scrollX enableFlex>
                  {mockTeaPlots.map((plot) => (
                    <View
                      key={plot.id}
                      className={classnames(styles.plotOption, formData.plotId === plot.id && styles.plotSelected)}
                      onClick={() => handlePlotSelect(plot)}
                    >
                      <Text>{plot.name}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>农事类型</Text>
                <View className={styles.typeGrid}>
                  {typeFilters.slice(1).map((item) => (
                    <View
                      key={item.key}
                      className={classnames(styles.typeOption, formData.type === item.key && styles.typeSelected)}
                      onClick={() => handleTypeSelect(item.key, item.label)}
                    >
                      <Text className={styles.typeOptionIcon}>{item.icon}</Text>
                      <Text className={styles.typeOptionLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>日期</Text>
                <Input
                  className={styles.formInput}
                  type="text"
                  value={formData.date}
                  onInput={(e) => setFormData(prev => ({ ...prev, date: e.detail.value }))}
                  placeholder="请选择日期"
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>操作人</Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入操作人姓名"
                  value={formData.operator}
                  onInput={(e) => setFormData(prev => ({ ...prev, operator: e.detail.value }))}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>用量（可选）</Text>
                <View className={styles.quantityRow}>
                  <Input
                    className={styles.formInputHalf}
                    type="digit"
                    placeholder="用量"
                    value={formData.quantity}
                    onInput={(e) => setFormData(prev => ({ ...prev, quantity: e.detail.value }))}
                  />
                  <Input
                    className={styles.formInputHalf}
                    placeholder="单位"
                    value={formData.unit}
                    onInput={(e) => setFormData(prev => ({ ...prev, unit: e.detail.value }))}
                  />
                </View>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>描述</Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入农事描述"
                  value={formData.description}
                  onInput={(e) => setFormData(prev => ({ ...prev, description: e.detail.value }))}
                />
              </View>
            </ScrollView>

            <View className={styles.modalFooter}>
              <Button className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>
                取消
              </Button>
              <Button className={styles.submitBtn} onClick={handleSubmit}>
                提交
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default FarmRecordPage;
