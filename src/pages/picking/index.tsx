import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockPickingRecords, mockTeaPlots } from '@/data/mockFarming';
import { PickingRecord } from '@/types';

const PickingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('records');
  const [activeType, setActiveType] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [records, setRecords] = useState<PickingRecord[]>([]);
  
  const [formData, setFormData] = useState({
    plotId: '',
    plotName: '',
    type: 'early-spring',
    typeName: '明前茶',
    date: new Date().toISOString().split('T')[0],
    time: '06:30',
    weight: '',
    pickers: [] as string[],
    leafGrade: '一芽一叶',
    quality: 'good'
  });

  useDidShow(() => {
    setRecords(mockPickingRecords);
  });

  const tabs = [
    { key: 'records', label: '采摘记录' },
    { key: 'add', label: '新增登记' }
  ];

  const typeFilters = [
    { key: 'all', label: '全部' },
    { key: 'early-spring', label: '明前茶' },
    { key: 'before-rain', label: '雨前茶' },
    { key: 'after-rain', label: '雨后茶' },
    { key: 'autumn', label: '秋茶' }
  ];

  const teaTypes = [
    { key: 'early-spring', label: '明前茶', color: '#FFD700' },
    { key: 'before-rain', label: '雨前茶', color: '#9C27B0' },
    { key: 'after-rain', label: '雨后茶', color: '#2196F3' },
    { key: 'autumn', label: '秋茶', color: '#FF9800' }
  ];

  const leafGrades = ['一芽一叶', '一芽一叶初展', '一芽二叶', '一芽二叶初展', '一芽三叶'];
  
  const qualityOptions = [
    { key: 'excellent', label: '特级' },
    { key: 'good', label: '优良' },
    { key: 'normal', label: '普通' }
  ];

  const allPickers = ['张三', '李四', '王五', '赵六', '孙七', '周八'];

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      if (activeType !== 'all' && record.type !== activeType) return false;
      if (searchText && !record.batchNo.includes(searchText) && !record.plotName.includes(searchText)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time).getTime();
      const dateB = new Date(b.date + ' ' + b.time).getTime();
      return dateB - dateA;
    });
  }, [records, activeType, searchText]);

  const todayRecords = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return records.filter(r => r.date === today);
  }, [records]);

  const todayWeight = todayRecords.reduce((sum, r) => sum + r.weight, 0);

  const getTeaTypeClass = (type: string) => {
    if (type === 'early-spring') return styles.earlySpring;
    if (type === 'before-rain') return styles.beforeRain;
    if (type === 'autumn') return styles.autumn;
    return '';
  };

  const getQualityClass = (quality: string) => {
    if (quality === 'excellent') return styles.excellent;
    if (quality === 'good') return styles.good;
    return styles.normal;
  };

  const getQualityText = (quality: string) => {
    if (quality === 'excellent') return '特级';
    if (quality === 'good') return '优良';
    return '普通';
  };

  const handlePickerToggle = (picker: string) => {
    setFormData(prev => ({
      ...prev,
      pickers: prev.pickers.includes(picker)
        ? prev.pickers.filter(p => p !== picker)
        : [...prev.pickers, picker]
    }));
  };

  const handleTypeSelect = (key: string, label: string) => {
    setFormData(prev => ({ ...prev, type: key, typeName: label }));
  };

  const handlePlotSelect = (plot: any) => {
    setFormData(prev => ({ ...prev, plotId: plot.id, plotName: plot.name }));
  };

  const handleSubmit = () => {
    if (!formData.plotId) {
      Taro.showToast({ title: '请选择地块', icon: 'none' });
      return;
    }
    if (!formData.weight) {
      Taro.showToast({ title: '请输入采摘重量', icon: 'none' });
      return;
    }
    if (formData.pickers.length === 0) {
      Taro.showToast({ title: '请选择采摘人员', icon: 'none' });
      return;
    }

    const batchNo = 'B' + formData.date.replace(/-/g, '') + 
      String(records.filter(r => r.date === formData.date).length + 1).padStart(3, '0');

    const newRecord: PickingRecord = {
      id: Date.now().toString(),
      batchNo,
      plotId: formData.plotId,
      plotName: formData.plotName,
      date: formData.date,
      time: formData.time,
      type: formData.type as any,
      typeName: formData.typeName,
      weight: parseFloat(formData.weight),
      unit: 'kg',
      leafGrade: formData.leafGrade,
      pickers: formData.pickers,
      temperature: 20,
      weather: '晴',
      quality: formData.quality as any
    };

    setRecords(prev => [newRecord, ...prev]);
    setActiveTab('records');
    Taro.showToast({ title: '登记成功', icon: 'success' });
    
    setFormData({
      plotId: '',
      plotName: '',
      type: 'early-spring',
      typeName: '明前茶',
      date: new Date().toISOString().split('T')[0],
      time: '06:30',
      weight: '',
      pickers: [],
      leafGrade: '一芽一叶',
      quality: 'good'
    });
  };

  return (
    <View className={styles.page}>
      {/* Tab切换 */}
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </View>
        ))}
      </View>

      {activeTab === 'records' ? (
        <View className={styles.content}>
          {/* 搜索和筛选 */}
          <View className={styles.filterSection}>
            <View className={styles.searchBar}>
              <Text className={styles.searchIcon}>🔍</Text>
              <Input
                className={styles.searchInput}
                placeholder="搜索批次号或地块"
                value={searchText}
                onInput={(e) => setSearchText(e.detail.value)}
              />
            </View>
            <ScrollView className={styles.typeScroll} scrollX enableFlex>
              {typeFilters.map(filter => (
                <View
                  key={filter.key}
                  className={classnames(styles.typeTag, activeType === filter.key && styles.typeActive)}
                  onClick={() => setActiveType(filter.key)}
                >
                  {filter.label}
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 今日统计 */}
          <View className={styles.statsRow}>
            <View className={styles.statCard}>
              <Text className={styles.statValue}>{todayWeight.toFixed(1)}kg</Text>
              <Text className={styles.statLabel}>今日采摘</Text>
            </View>
            <View className={styles.statCard}>
              <Text className={styles.statValue}>{todayRecords.length}批</Text>
              <Text className={styles.statLabel}>今日批次</Text>
            </View>
          </View>

          {/* 列表 */}
          <ScrollView className={styles.listScroll} scrollY>
            <View className={styles.listHeader}>
              <Text>共 {filteredRecords.length} 条记录</Text>
            </View>

            {filteredRecords.map(record => (
              <View key={record.id} className={styles.recordCard}>
                <View className={styles.recordHeader}>
                  <View className={styles.batchNo}>批次：{record.batchNo}</View>
                  <View className={classnames('tag', getTeaTypeClass(record.type))}>
                    {record.typeName}
                  </View>
                </View>
                <View className={styles.recordInfo}>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>地块</Text>
                    <Text className={styles.infoValue}>{record.plotName}</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>时间</Text>
                    <Text className={styles.infoValue}>{record.date} {record.time}</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>重量</Text>
                    <Text className={styles.infoValueHighlight}>{record.weight}{record.unit}</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>叶级</Text>
                    <Text className={styles.infoValue}>{record.leafGrade}</Text>
                  </View>
                </View>
                <View className={styles.recordFooter}>
                  <View className={styles.pickers}>
                    <Text className={styles.pickerLabel}>采摘人员：</Text>
                    <Text className={styles.pickerNames}>{record.pickers.join('、')}</Text>
                  </View>
                  <View className={classnames('tag', getQualityClass(record.quality))}>
                    {getQualityText(record.quality)}
                  </View>
                </View>
              </View>
            ))}

            {filteredRecords.length === 0 && (
              <View className={styles.empty}>
                <Text className={styles.emptyIcon}>🍃</Text>
                <Text className={styles.emptyText}>暂无采摘记录</Text>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      ) : (
        <ScrollView className={styles.formPage} scrollY>
          <View className={styles.formCard}>
            <Text className={styles.formTitle}>采摘登记表</Text>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>选择地块 <Text className={styles.required}>*</Text></Text>
              <ScrollView className={styles.plotScroll} scrollX enableFlex>
                {mockTeaPlots.map(plot => (
                  <View
                    key={plot.id}
                    className={classnames(styles.plotOption, formData.plotId === plot.id && styles.plotSelected)}
                    onClick={() => handlePlotSelect(plot)}
                  >
                    {plot.name}
                  </View>
                ))}
              </ScrollView>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>茶叶类型 <Text className={styles.required}>*</Text></Text>
              <View className={styles.teaTypeGrid}>
                {teaTypes.map(item => (
                  <View
                    key={item.key}
                    className={classnames(styles.teaTypeOption, formData.type === item.key && styles.teaTypeSelected)}
                    style={{ borderColor: formData.type === item.key ? item.color : 'transparent' }}
                    onClick={() => handleTypeSelect(item.key, item.label)}
                  >
                    <View className={styles.teaTypeDot} style={{ backgroundColor: item.color }} />
                    <Text>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formRow}>
              <View className={styles.formItemHalf}>
                <Text className={styles.formLabel}>日期 <Text className={styles.required}>*</Text></Text>
                <Input
                  className={styles.formInput}
                  value={formData.date}
                  onInput={(e) => setFormData(prev => ({ ...prev, date: e.detail.value }))}
                  placeholder="选择日期"
                />
              </View>
              <View className={styles.formItemHalf}>
                <Text className={styles.formLabel}>时间 <Text className={styles.required}>*</Text></Text>
                <Input
                  className={styles.formInput}
                  value={formData.time}
                  onInput={(e) => setFormData(prev => ({ ...prev, time: e.detail.value }))}
                  placeholder="选择时间"
                />
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>采摘重量 (kg) <Text className={styles.required}>*</Text></Text>
              <Input
                className={styles.formInput}
                type="digit"
                value={formData.weight}
                onInput={(e) => setFormData(prev => ({ ...prev, weight: e.detail.value }))}
                placeholder="请输入采摘重量"
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>采摘人员 <Text className={styles.required}>*</Text></Text>
              <View className={styles.pickerGrid}>
                {allPickers.map(picker => (
                  <View
                    key={picker}
                    className={classnames(styles.pickerOption, formData.pickers.includes(picker) && styles.pickerSelected)}
                    onClick={() => handlePickerToggle(picker)}
                  >
                    <Text>{picker}</Text>
                    {formData.pickers.includes(picker) && <Text className={styles.checkMark}>✓</Text>}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>叶级</Text>
              <ScrollView className={styles.gradeScroll} scrollX enableFlex>
                {leafGrades.map(grade => (
                  <View
                    key={grade}
                    className={classnames(styles.gradeOption, formData.leafGrade === grade && styles.gradeSelected)}
                    onClick={() => setFormData(prev => ({ ...prev, leafGrade: grade }))}
                  >
                    {grade}
                  </View>
                ))}
              </ScrollView>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>品质评定</Text>
              <View className={styles.qualityRow}>
                {qualityOptions.map(option => (
                  <View
                    key={option.key}
                    className={classnames(styles.qualityOption, formData.quality === option.key && getQualityClass(option.key))}
                    onClick={() => setFormData(prev => ({ ...prev, quality: option.key }))}
                  >
                    {option.label}
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View className={styles.submitSection}>
            <Button className={styles.submitBtn} onClick={handleSubmit}>
              提交登记
            </Button>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      )}
    </View>
  );
};

export default PickingPage;
