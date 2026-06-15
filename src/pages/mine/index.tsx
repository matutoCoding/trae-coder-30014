import React, { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockDashboardStats } from '@/data/mockHome';

const MinePage: React.FC = () => {
  const [stats] = useState(mockDashboardStats);

  const handleMenuClick = (page: string, name: string) => {
    console.log('[MinePage] 点击菜单:', name, '页面:', page);
    Taro.navigateTo({ url: page }).catch((err) => {
      console.error('[MinePage] 跳转失败:', err);
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    });
  };

  const handleLogout = () => {
    console.log('[MinePage] 退出登录');
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  };

  const menuGroups = [
    {
      title: '溯源管理',
      items: [
        {
          name: '溯源查询',
          desc: '扫码查询茶叶全链路信息',
          icon: '🔍',
          color: 'rgba(33, 150, 243, 0.1)',
          page: '/pages/trace/index'
        },
        {
          name: '溯源码管理',
          desc: '生成和管理茶叶溯源码',
          icon: '🏷️',
          color: 'rgba(76, 175, 80, 0.1)',
          page: '/pages/trace/index?tab=manage'
        }
      ]
    },
    {
      title: '数据中心',
      items: [
        {
          name: '收支台账',
          desc: '查看收入支出明细和报表',
          icon: '💰',
          color: 'rgba(76, 175, 80, 0.1)',
          page: '/pages/ledger/index'
        },
        {
          name: '经营报表',
          desc: '月度年度经营数据分析',
          icon: '📊',
          color: 'rgba(255, 152, 0, 0.1)',
          page: '/pages/ledger/index?tab=report'
        },
        {
          name: '茶旅体验',
          desc: '管理茶旅产品和预约',
          icon: '🏞️',
          color: 'rgba(156, 39, 176, 0.1)',
          page: '/pages/tea-tour/index',
          badge: '新'
        }
      ]
    },
    {
      title: '系统设置',
      items: [
        {
          name: '个人信息',
          desc: '修改个人资料和密码',
          icon: '👤',
          color: 'rgba(46, 125, 50, 0.1)',
          page: '/pages/profile/index'
        },
        {
          name: '员工管理',
          desc: '管理采茶工和制茶师',
          icon: '👥',
          color: 'rgba(141, 110, 99, 0.1)',
          page: '/pages/staff/index'
        },
        {
          name: '系统设置',
          desc: '通知、隐私、关于我们',
          icon: '⚙️',
          color: 'rgba(134, 144, 156, 0.1)',
          page: '/pages/settings/index'
        },
        {
          name: '帮助与反馈',
          desc: '使用指南和问题反馈',
          icon: '❓',
          color: 'rgba(33, 150, 243, 0.1)',
          page: '/pages/help/index'
        }
      ]
    }
  ];

  return (
    <View className={styles.page}>
      {/* 顶部用户信息 */}
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Text>👨‍🌾</Text>
          </View>
          <View className={styles.info}>
            <Text className={styles.name}>张三</Text>
            <Text className={styles.role}>茶园主 · 管理员</Text>
            <Text className={styles.farm}>云雾山生态茶园</Text>
          </View>
        </View>
        
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.value}>{stats.totalPlots}</Text>
            <Text className={styles.label}>管理地块</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.value}>{(stats.yearSales / 10000).toFixed(0)}万</Text>
            <Text className={styles.label}>年销售额</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.value}>{stats.stockQuantity}</Text>
            <Text className={styles.label}>库存量</Text>
          </View>
        </View>
      </View>

      {/* 内容区域 */}
      <View className={styles.content}>
        {menuGroups.map((group, groupIndex) => (
          <View key={groupIndex} className={styles.menuGroup}>
            <Text className={styles.groupTitle}>{group.title}</Text>
            {group.items.map((item, itemIndex) => (
              <View
                key={itemIndex}
                className={styles.menuItem}
                onClick={() => handleMenuClick(item.page, item.name)}
              >
                <View
                  className={styles.menuIcon}
                  style={{ backgroundColor: item.color }}
                >
                  <Text>{item.icon}</Text>
                </View>
                <View className={styles.menuContent}>
                  <Text className={styles.menuName}>
                    {item.badge && <Text className={styles.badge}>{item.badge}</Text>}
                    {item.name}
                  </Text>
                  <Text className={styles.menuDesc}>{item.desc}</Text>
                </View>
                <Text className={styles.menuArrow}>›</Text>
              </View>
            ))}
          </View>
        ))}

        {/* 退出登录 */}
        <Button
          className={styles.logoutBtn}
          onClick={handleLogout}
        >
          退出登录
        </Button>

        {/* 版本信息 */}
        <Text className={styles.versionInfo}>
          山地茶园智慧管理 v1.0.0
        </Text>
      </View>
    </View>
  );
};

export default MinePage;
