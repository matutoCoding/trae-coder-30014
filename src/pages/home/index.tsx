import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockDashboardStats, mockTodoList, mockWeather, mockHomeFunctions, mockPickingSchedule } from '@/data/mockHome';
import { TodoItem, FunctionItem } from '@/types';

const HomePage: React.FC = () => {
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [stats] = useState(mockDashboardStats);
  const [weather] = useState(mockWeather);
  const [todos] = useState<TodoItem[]>(mockTodoList.filter(t => t.status === 'pending'));
  const [functions] = useState<FunctionItem[]>(mockHomeFunctions);
  const [schedules] = useState(mockPickingSchedule);

  useEffect(() => {
    const hour = new Date().getHours();
    let greet = '';
    if (hour < 6) greet = '凌晨好';
    else if (hour < 12) greet = '早上好';
    else if (hour < 14) greet = '中午好';
    else if (hour < 18) greet = '下午好';
    else greet = '晚上好';
    setGreeting(greet);

    const now = new Date();
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${days[now.getDay()]}`;
    setCurrentDate(dateStr);
  }, []);

  useDidShow(() => {
    console.log('[HomePage] 页面显示');
  });

  const getWeatherIcon = (weather: string) => {
    if (weather.includes('晴')) return '☀️';
    if (weather.includes('云')) return '⛅';
    if (weather.includes('雨')) return '🌧️';
    if (weather.includes('阴')) return '☁️';
    return '🌤️';
  };

  const getStatIcon = (index: number) => {
    const icons = ['🌿', '📍', '🍃', '📦', '🛒', '💰'];
    return icons[index] || '📊';
  };

  const getStatBgColor = (index: number) => {
    const colors = [
      'rgba(46, 125, 50, 0.1)',
      'rgba(141, 110, 99, 0.1)',
      'rgba(102, 187, 106, 0.1)',
      'rgba(93, 64, 55, 0.1)',
      'rgba(255, 152, 0, 0.1)',
      'rgba(76, 175, 80, 0.1)'
    ];
    return colors[index] || 'rgba(46, 125, 50, 0.1)';
  };

  const getPriorityClass = (priority: string) => {
    if (priority === 'high') return styles.high;
    if (priority === 'medium') return styles.medium;
    return styles.low;
  };

  const getTeaTypeClass = (type: string) => {
    if (type === '明前茶') return styles.earlySpring;
    if (type === '雨前茶') return styles.beforeRain;
    return styles.autumn;
  };

  const handleFunctionClick = (func: FunctionItem) => {
    console.log('[HomePage] 点击功能:', func.name, '页面:', func.page);
    Taro.navigateTo({ url: func.page }).catch((err) => {
      console.error('[HomePage] 跳转失败:', err);
    });
  };

  const handleTodoClick = (todo: TodoItem) => {
    console.log('[HomePage] 处理待办:', todo.title);
    Taro.showToast({ title: '已处理', icon: 'success' });
  };

  const handleRefresh = () => {
    console.log('[HomePage] 下拉刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  const statsData = [
    { value: stats.totalArea, label: '茶园总面积', unit: '亩', trend: '+2.5%', trendUp: true },
    { value: stats.totalPlots, label: '地块数量', unit: '块', trend: '+1', trendUp: true },
    { value: stats.todayPicking, label: '今日采摘', unit: 'kg', trend: '+12%', trendUp: true },
    { value: stats.processingBatches, label: '加工批次', unit: '批', trend: '0', trendUp: true },
    { value: stats.pendingOrders, label: '待发订单', unit: '单', trend: '+3', trendUp: true },
    { value: (stats.monthSales / 10000).toFixed(1), label: '本月销售', unit: '万', trend: '+8.6%', trendUp: true }
  ];

  return (
    <View className={styles.page}>
      {/* 顶部Header */}
      <View className={styles.header}>
        <Text className={styles.greeting}>{greeting}，茶农朋友</Text>
        <Text className={styles.date}>{currentDate}</Text>
        <View className={styles.weatherCard}>
          <View className={styles.weatherMain}>
            <Text className={styles.weatherIcon}>{getWeatherIcon(weather.weather)}</Text>
            <View className={styles.weatherInfo}>
              <Text className={styles.temp}>{weather.temperature}</Text>
              <Text className={styles.weatherDesc}>{weather.weather}</Text>
            </View>
          </View>
          <View className={styles.weatherExtra}>
            <Text>湿度 {weather.humidity}{'\n'}</Text>
            <Text>{weather.wind}</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        {/* 数据统计 */}
        <View className={styles.statsSection}>
          <Text className={styles.sectionTitle}>数据概览</Text>
          <ScrollView className={styles.statsScroll} scrollX enableFlex>
            {statsData.map((stat, index) => (
            <View className={styles.statCard} key={index}>
              <View className={styles.statHeader}>
                <View
                  className={styles.statIcon}
                  style={{ backgroundColor: getStatBgColor(index) }}>
                  <Text>{getStatIcon(index)}</Text>
                </View>
                <View className={classnames(styles.statTrend, stat.trendUp ? styles.up : styles.down)}>
                  {stat.trend}
                </View>
              </View>
              <Text className={styles.statValue}>{stat.value}<Text style={{ fontSize: '24rpx', fontWeight: '400', marginLeft: '4rpx' }}>{stat.unit}</Text></Text>
              <Text className={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
          </ScrollView>
        </View>

        {/* 功能入口 */}
        <View className={styles.functionSection}>
          <Text className={styles.sectionTitle}>功能中心</Text>
          <View className={styles.functionGrid}>
            {functions.map((func) => (
              <View
                className={styles.functionItem}
                key={func.id}
                onClick={() => handleFunctionClick(func)}
              >
                <View
                  className={styles.functionIcon}
                  style={{ backgroundColor: `${func.color}15` }}
                >
                  <Text>{func.icon}</Text>
                </View>
                <Text className={styles.functionName}>{func.name}</Text>
                {func.badge && <View className={styles.badge}>{func.badge}</View>}
              </View>
            ))}
          </View>
        </View>

        {/* 待办事项 */}
        <View className={styles.todoSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>今日待办</Text>
            <Text className={styles.moreLink}>全部 ({todos.length})</Text>
          </View>
          <View className={styles.todoList}>
            {todos.slice(0, 4).map((todo) => (
              <View className={styles.todoItem} key={todo.id}>
                <View className={classnames(styles.priorityDot, getPriorityClass(todo.priority))} />
                <View className={styles.todoContent}>
                  <Text className={styles.todoTitle}>{todo.title}</Text>
                  <View className={styles.todoMeta}>
                    <Text>截止：{todo.deadline}</Text>
                    {todo.relatedPlot && <Text>{todo.relatedPlot}</Text>}
                  </View>
                </View>
                <Button
                  className={styles.todoAction}
                  onClick={() => handleTodoClick(todo)}
                >
                  处理
                </Button>
              </View>
            ))}
          </View>
        </View>

        {/* 采摘排期 */}
        <View className={styles.scheduleSection}>
          <Text className={styles.sectionTitle}>采摘排期</Text>
          {schedules.map((schedule) => (
            <View className={styles.scheduleCard} key={schedule.id}>
              <View className={styles.scheduleHeader}>
                <Text className={styles.plotName}>{schedule.plotName}</Text>
                <View className={classnames('tag', getTeaTypeClass(schedule.type))}>
                  {schedule.typeName}
                </View>
              </View>
              <View className={styles.scheduleInfo}>
                <View className={styles.infoItem}>
                  <Text className={styles.label}>采摘期：</Text>
                  <Text>{schedule.startDate} ~ {schedule.endDate}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.label}>预计产量：</Text>
                  <Text>{schedule.expectedYield}kg</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default HomePage;
