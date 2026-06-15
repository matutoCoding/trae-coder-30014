import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Switch } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [cacheSize, setCacheSize] = useState('12.5MB');

  const handleClearCache = () => {
    Taro.showModal({
      title: '清除缓存',
      content: `确定要清除 ${cacheSize} 缓存吗？`,
      success: (res) => {
        if (res.confirm) {
          setCacheSize('0KB');
          Taro.showToast({ title: '缓存已清除', icon: 'success' });
        }
      }
    });
  };

  const handleAbout = () => {
    Taro.showModal({
      title: '关于我们',
      content: '山地茶园智慧管理系统 v1.0.0\n\n致力于为茶农提供智能化、便捷化的茶园管理解决方案。',
      showCancel: false
    });
  };

  const handleFeedback = () => {
    Taro.navigateTo({ url: '/pages/help/index' });
  };

  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  };

  const settingGroups = [
    {
      title: '通知设置',
      items: [
        {
          name: '消息通知',
          desc: '接收订单、农事等消息提醒',
          type: 'switch',
          value: notifications,
          onChange: setNotifications
        },
        {
          name: '声音提醒',
          desc: '接收通知时播放提示音',
          type: 'switch',
          value: sound,
          onChange: setSound
        }
      ]
    },
    {
      title: '显示设置',
      items: [
        {
          name: '深色模式',
          desc: '切换深色/浅色主题',
          type: 'switch',
          value: darkMode,
          onChange: setDarkMode
        }
      ]
    },
    {
      title: '数据设置',
      items: [
        {
          name: '自动备份',
          desc: '每日自动备份数据到云端',
          type: 'switch',
          value: autoBackup,
          onChange: setAutoBackup
        },
        {
          name: '清除缓存',
          desc: `当前缓存 ${cacheSize}`,
          type: 'action',
          action: handleClearCache
        }
      ]
    },
    {
      title: '关于',
      items: [
        {
          name: '关于我们',
          desc: '版本信息、服务条款',
          type: 'action',
          action: handleAbout
        },
        {
          name: '帮助与反馈',
          desc: '使用指南、问题反馈',
          type: 'action',
          action: handleFeedback
        }
      ]
    }
  ];

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.content}>
        {settingGroups.map((group, groupIndex) => (
          <View className={styles.group} key={groupIndex}>
            <Text className={styles.groupTitle}>{group.title}</Text>
            <View className={styles.groupContent}>
              {group.items.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  className={classnames(styles.settingItem, item.type === 'action' && styles.clickable)}
                  onClick={() => item.type === 'action' && item.action && item.action()}
                >
                  <View className={styles.settingInfo}>
                    <Text className={styles.settingName}>{item.name}</Text>
                    <Text className={styles.settingDesc}>{item.desc}</Text>
                  </View>
                  {item.type === 'switch' && (
                    <Switch
                      checked={item.value}
                      onChange={(e) => item.onChange && item.onChange(e.detail.value)}
                      color="#2E7D32"
                    />
                  )}
                  {item.type === 'action' && (
                    <Text className={styles.arrow}>›</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View className={styles.logoutSection}>
          <Button className={styles.logoutBtn} onClick={handleLogout}>
            退出登录
          </Button>
        </View>

        <View className={styles.versionSection}>
          <Text className={styles.versionText}>山地茶园智慧管理 v1.0.0</Text>
          <Text className={styles.copyrightText}>© 2026 云雾山生态茶园</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsPage;
