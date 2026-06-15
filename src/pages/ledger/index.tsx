import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Button, ScrollView, Input, Picker } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockLedgerRecords } from '@/data/mockSales';
import { LedgerRecord } from '@/types';

const LedgerPage: React.FC = () => {
  const router = useRouter();
  const [records, setRecords] = useState<LedgerRecord[]>([]);
  const [activeType, setActiveType] = useState('all');
  const [activeTab, setActiveTab] = useState('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [newRecord, setNewRecord] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    categoryName: '',
    amount: '',
    date: '',
    operator: '',
    remark: '',
    paymentMethod: '微信支付'
  });

  useEffect(() => {
    setRecords(mockLedgerRecords);
    const tab = router.params.tab;
    if (tab === 'report') {
      setActiveTab('report');
    }
  }, [router.params.tab]);

  const filteredRecords = useMemo(() => {
    let result = records;
    if (activeType !== 'all') {
      result = result.filter(r => r.type === activeType);
    }
    if (searchText) {
      result = result.filter(r =>
        r.categoryName.includes(searchText) ||
        r.remark.includes(searchText) ||
        r.relatedOrder?.includes(searchText)
      );
    }
    return result;
  }, [records, activeType, searchText]);

  const stats = useMemo(() => {
    const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
    return {
      totalIncome,
      totalExpense,
      netIncome: totalIncome - totalExpense
    };
  }, [records]);

  const incomeCategories = [
    { key: 'sales-ecommerce', name: '电商销售收入' },
    { key: 'sales-wholesale', name: '批发收入' },
    { key: 'sales-retail', name: '零售收入' },
    { key: 'tour-income', name: '茶旅收入' }
  ];

  const expenseCategories = [
    { key: 'fertilizer', name: '肥料采购' },
    { key: 'pesticide', name: '农药采购' },
    { key: 'labor', name: '人工工资' },
    { key: 'logistics', name: '物流费用' }
  ];

  const paymentMethods = ['微信支付', '支付宝', '银行转账', '现金'];

  const handleAddRecord = () => {
    if (!newRecord.amount || !newRecord.category) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    const record: LedgerRecord = {
      id: String(Date.now()),
      date: newRecord.date || new Date().toISOString().split('T')[0],
      type: newRecord.type,
      category: newRecord.category,
      categoryName: newRecord.categoryName,
      amount: parseFloat(newRecord.amount),
      operator: newRecord.operator || '张三',
      remark: newRecord.remark,
      paymentMethod: newRecord.paymentMethod
    };
    setRecords([record, ...records]);
    setShowAddModal(false);
    setNewRecord({
      type: 'income',
      category: '',
      categoryName: '',
      amount: '',
      date: '',
      operator: '',
      remark: '',
      paymentMethod: '微信支付'
    });
    Taro.showToast({ title: '添加成功', icon: 'success' });
  };

  const getTypeIcon = (type: string) => {
    if (type === 'income') return '📈';
    return '📉';
  };

  const renderListTab = () => (
    <View className={styles.listSection}>
      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statLabel}>总收入</Text>
          <Text className={classnames(styles.statValue, styles.income)}>¥{stats.totalIncome.toFixed(2)}</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statLabel}>总支出</Text>
          <Text className={classnames(styles.statValue, styles.expense)}>¥{stats.totalExpense.toFixed(2)}</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statLabel}>净收入</Text>
          <Text className={classnames(styles.statValue, styles.net)}>
            ¥{stats.netIncome.toFixed(2)}
          </Text>
        </View>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.typeTabs}>
          <View
            className={classnames(styles.typeTab, activeType === 'all' && styles.active)}
            onClick={() => setActiveType('all')}
          >
            全部
          </View>
          <View
            className={classnames(styles.typeTab, activeType === 'income' && styles.activeIncome)}
            onClick={() => setActiveType('income')}
          >
            收入
          </View>
          <View
            className={classnames(styles.typeTab, activeType === 'expense' && styles.activeExpense)}
            onClick={() => setActiveType('expense')}
          >
            支出
          </View>
        </View>

        <View className={styles.searchBox}>
          <Input
            className={styles.searchInput}
            placeholder="搜索分类或备注"
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>
      </View>

      <ScrollView scrollY className={styles.recordList}>
        {filteredRecords.map((record) => (
          <View className={styles.recordCard} key={record.id}>
            <View className={styles.recordIcon}>
              <Text>{getTypeIcon(record.type)}</Text>
            </View>
            <View className={styles.recordInfo}>
              <View className={styles.recordHeader}>
                <Text className={styles.categoryName}>{record.categoryName}</Text>
                <Text className={classnames(styles.amount, record.type === 'income' ? styles.income : styles.expense)}>
                  {record.type === 'income' ? '+' : '-'}¥{record.amount.toFixed(2)}
                </Text>
              </View>
              <View className={styles.recordMeta}>
                <Text>{record.date}</Text>
                <Text>·</Text>
                <Text>{record.operator}</Text>
                <Text>·</Text>
                <Text>{record.paymentMethod}</Text>
              </View>
              {record.remark && (
                <Text className={styles.remark}>{record.remark}</Text>
              )}
              {record.relatedOrder && (
                <Text className={styles.relatedOrder}>关联订单：{record.relatedOrder}</Text>
              )}
            </View>
          </View>
        ))}
        {filteredRecords.length === 0 && (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无记录</Text>
          </View>
        )}
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
          + 新增记录
        </Button>
      </View>

      {showAddModal && (
        <View className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>新增记录</Text>
              <Text className={styles.modalClose} onClick={() => setShowAddModal(false)}>✕</Text>
            </View>

            <ScrollView scrollY className={styles.modalBody}>
              <View className={styles.formRow}>
                <Text className={styles.formLabel}>类型</Text>
                <View className={styles.typeSelector}>
                  <View
                    className={classnames(styles.typeOption, newRecord.type === 'income' && styles.selectedIncome)}
                    onClick={() => setNewRecord({ ...newRecord, type: 'income', category: '', categoryName: '' })}
                  >
                    收入
                  </View>
                  <View
                    className={classnames(styles.typeOption, newRecord.type === 'expense' && styles.selectedExpense)}
                    onClick={() => setNewRecord({ ...newRecord, type: 'expense', category: '', categoryName: '' })}
                  >
                    支出
                  </View>
                </View>
              </View>

              <View className={styles.formRow}>
                <Text className={styles.formLabel}>分类</Text>
                <View className={styles.categoryGrid}>
                  {(newRecord.type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                    <View
                      key={cat.key}
                      className={classnames(styles.categoryItem, newRecord.category === cat.key && styles.selected)}
                      onClick={() => setNewRecord({ ...newRecord, category: cat.key, categoryName: cat.name })}
                    >
                      {cat.name}
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formRow}>
                <Text className={styles.formLabel}>金额</Text>
                <Input
                  className={styles.formInput}
                  type="digit"
                  placeholder="请输入金额"
                  value={newRecord.amount}
                  onInput={(e) => setNewRecord({ ...newRecord, amount: e.detail.value })}
                />
              </View>

              <View className={styles.formRow}>
                <Text className={styles.formLabel}>日期</Text>
                <Input
                  className={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={newRecord.date}
                  onInput={(e) => setNewRecord({ ...newRecord, date: e.detail.value })}
                />
              </View>

              <View className={styles.formRow}>
                <Text className={styles.formLabel}>支付方式</Text>
                <View className={styles.paymentGrid}>
                  {paymentMethods.map((method) => (
                    <View
                      key={method}
                      className={classnames(styles.paymentItem, newRecord.paymentMethod === method && styles.selected)}
                      onClick={() => setNewRecord({ ...newRecord, paymentMethod: method })}
                    >
                      {method}
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formRow}>
                <Text className={styles.formLabel}>操作人</Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入操作人"
                  value={newRecord.operator}
                  onInput={(e) => setNewRecord({ ...newRecord, operator: e.detail.value })}
                />
              </View>

              <View className={styles.formRow}>
                <Text className={styles.formLabel}>备注</Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入备注"
                  value={newRecord.remark}
                  onInput={(e) => setNewRecord({ ...newRecord, remark: e.detail.value })}
                />
              </View>
            </ScrollView>

            <View className={styles.modalFooter}>
              <Button className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>取消</Button>
              <Button className={styles.confirmBtn} onClick={handleAddRecord}>确定</Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderReportTab = () => {
    const monthlyData = [
      { month: '1月', income: 85000, expense: 32000 },
      { month: '2月', income: 72000, expense: 28000 },
      { month: '3月', income: 96000, expense: 35000 },
      { month: '4月', income: 128000, expense: 42000 },
      { month: '5月', income: 256000, expense: 68000 },
      { month: '6月', income: 285600, expense: 75000 }
    ];

    const categoryIncomeData = [
      { name: '电商销售', amount: 185000, percent: 32 },
      { name: '批发', amount: 256000, percent: 45 },
      { name: '零售', amount: 86000, percent: 15 },
      { name: '茶旅', amount: 45000, percent: 8 }
    ];

    const categoryExpenseData = [
      { name: '人工工资', amount: 108000, percent: 45 },
      { name: '肥料农药', amount: 65000, percent: 27 },
      { name: '物流费用', amount: 38000, percent: 16 },
      { name: '其他', amount: 29000, percent: 12 }
    ];

    return (
      <ScrollView scrollY className={styles.reportSection}>
        <View className={styles.reportHeader}>
          <Text className={styles.reportTitle}>2026年经营报表</Text>
          <Text className={styles.reportSubtitle}>数据更新至 6月16日</Text>
        </View>

        <View className={styles.summaryCards}>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryLabel}>总收入</Text>
            <Text className={classnames(styles.summaryValue, styles.incomeText)}>¥{(stats.totalIncome / 10000).toFixed(2)}万</Text>
          </View>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryLabel}>总支出</Text>
            <Text className={classnames(styles.summaryValue, styles.expenseText)}>¥{(stats.totalExpense / 10000).toFixed(2)}万</Text>
          </View>
        </View>

        <View className={styles.chartSection}>
          <Text className={styles.sectionTitle}>月度收支趋势</Text>
          <View className={styles.barChart}>
            {monthlyData.map((item, index) => {
              const maxValue = 300000;
              const incomeHeight = (item.income / maxValue) * 200;
              const expenseHeight = (item.expense / maxValue) * 200;
              return (
                <View key={index} className={styles.barGroup}>
                  <View className={styles.bars}>
                    <View
                      className={classnames(styles.bar, styles.incomeBar)}
                      style={{ height: `${incomeHeight}rpx` }}
                    />
                    <View
                      className={classnames(styles.bar, styles.expenseBar)}
                      style={{ height: `${expenseHeight}rpx` }}
                    />
                  </View>
                  <Text className={styles.barLabel}>{item.month}</Text>
                </View>
              );
            })}
          </View>
          <View className={styles.chartLegend}>
            <View className={styles.legendItem}>
              <View className={classnames(styles.legendDot, styles.incomeDot)} />
              <Text>收入</Text>
            </View>
            <View className={styles.legendItem}>
              <View className={classnames(styles.legendDot, styles.expenseDot)} />
              <Text>支出</Text>
            </View>
          </View>
        </View>

        <View className={styles.categorySection}>
          <Text className={styles.sectionTitle}>收入构成</Text>
          <View className={styles.categoryList}>
            {categoryIncomeData.map((item, index) => (
              <View key={index} className={styles.categoryRow}>
                <View className={styles.categoryInfo}>
                  <Text className={styles.categoryName}>{item.name}</Text>
                  <Text className={styles.categoryAmount}>¥{item.amount.toLocaleString()}</Text>
                </View>
                <View className={styles.progressBar}>
                  <View
                    className={classnames(styles.progressFill, styles.incomeFill)}
                    style={{ width: `${item.percent}%` }}
                  />
                </View>
                <Text className={styles.categoryPercent}>{item.percent}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.categorySection}>
          <Text className={styles.sectionTitle}>支出构成</Text>
          <View className={styles.categoryList}>
            {categoryExpenseData.map((item, index) => (
              <View key={index} className={styles.categoryRow}>
                <View className={styles.categoryInfo}>
                  <Text className={styles.categoryName}>{item.name}</Text>
                  <Text className={styles.categoryAmount}>¥{item.amount.toLocaleString()}</Text>
                </View>
                <View className={styles.progressBar}>
                  <View
                    className={classnames(styles.progressFill, styles.expenseFill)}
                    style={{ width: `${item.percent}%` }}
                  />
                </View>
                <Text className={styles.categoryPercent}>{item.percent}%</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabHeader}>
        <View
          className={classnames(styles.tabItem, activeTab === 'list' && styles.active)}
          onClick={() => setActiveTab('list')}
        >
          收支明细
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'report' && styles.active)}
          onClick={() => setActiveTab('report')}
        >
          经营报表
        </View>
      </View>

      {activeTab === 'list' ? renderListTab() : renderReportTab()}
    </View>
  );
};

export default LedgerPage;
