import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Input, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '张三',
    role: '茶园主 · 管理员',
    farm: '云雾山生态茶园',
    phone: '138****1234',
    email: 'zhangsan@tea.com',
    address: '福建省福州市鼓楼区五四路168号',
    joinDate: '2021-03-15',
    avatar: '👨‍🌾'
  });

  const handleSave = () => {
    setIsEditing(false);
    Taro.showToast({ title: '保存成功', icon: 'success' });
  };

  const handleChangeAvatar = () => {
    Taro.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success: () => {
        Taro.showToast({ title: '头像更新成功', icon: 'success' });
      }
    });
  };

  const infoItems = [
    { label: '姓名', key: 'name', editable: true },
    { label: '职位', key: 'role', editable: false },
    { label: '所属茶园', key: 'farm', editable: false },
    { label: '手机号', key: 'phone', editable: true },
    { label: '邮箱', key: 'email', editable: true },
    { label: '地址', key: 'address', editable: true },
    { label: '入职时间', key: 'joinDate', editable: false }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.avatarSection}>
          <View className={styles.avatar} onClick={handleChangeAvatar}>
            <Text className={styles.avatarText}>{profile.avatar}</Text>
          </View>
          <Text className={styles.changeAvatarText}>点击更换头像</Text>
        </View>
        <View className={styles.userInfo}>
          <Text className={styles.userName}>{profile.name}</Text>
          <Text className={styles.userRole}>{profile.role}</Text>
        </View>
      </View>

      <ScrollView scrollY className={styles.content}>
        <View className={styles.infoSection}>
          <Text className={styles.sectionTitle}>基本信息</Text>
          <View className={styles.infoList}>
            {infoItems.map((item) => (
              <View key={item.key} className={styles.infoRow}>
                <Text className={styles.infoLabel}>{item.label}</Text>
                {isEditing && item.editable ? (
                  <Input
                    className={styles.infoInput}
                    value={profile[item.key as keyof typeof profile]}
                    onInput={(e) => setProfile({ ...profile, [item.key]: e.detail.value })}
                  />
                ) : (
                  <Text className={styles.infoValue}>{profile[item.key as keyof typeof profile]}</Text>
                )}
                {item.editable && !isEditing && (
                  <Text className={styles.infoArrow}>›</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.securitySection}>
          <Text className={styles.sectionTitle}>账号安全</Text>
          <View className={styles.infoList}>
            <View className={styles.infoRow} onClick={() => Taro.showToast({ title: '修改密码功能开发中', icon: 'none' })}>
              <Text className={styles.infoLabel}>修改密码</Text>
              <Text className={styles.infoArrow}>›</Text>
            </View>
            <View className={styles.infoRow} onClick={() => Taro.showToast({ title: '绑定手机功能开发中', icon: 'none' })}>
              <Text className={styles.infoLabel}>绑定手机</Text>
              <View className={styles.infoRight}>
                <Text className={styles.infoValue}>已绑定</Text>
                <Text className={styles.infoArrow}>›</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.statsSection}>
          <Text className={styles.sectionTitle}>工作数据</Text>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>12</Text>
              <Text className={styles.statLabel}>管理地块</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>328</Text>
              <Text className={styles.statLabel}>农事记录</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>156</Text>
              <Text className={styles.statLabel}>采摘批次</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>89</Text>
              <Text className={styles.statLabel}>加工批次</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        {isEditing ? (
          <View className={styles.btnGroup}>
            <Button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
              取消
            </Button>
            <Button className={styles.saveBtn} onClick={handleSave}>
              保存
            </Button>
          </View>
        ) : (
          <Button className={styles.editBtn} onClick={() => setIsEditing(true)}>
            编辑资料
          </Button>
        )}
      </View>
    </View>
  );
};

export default ProfilePage;
