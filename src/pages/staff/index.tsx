import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView, Input, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';

interface Staff {
  id: string;
  name: string;
  avatar: string;
  role: string;
  roleName: string;
  phone: string;
  department: string;
  status: 'active' | 'leave' | 'off';
  statusName: string;
  joinDate: string;
  workDays: number;
  salary: number;
}

const mockStaffList: Staff[] = [
  {
    id: '1',
    name: '张三',
    avatar: '👨‍🌾',
    role: 'manager',
    roleName: '茶园管理员',
    phone: '138****1234',
    department: '茶园管理部',
    status: 'active',
    statusName: '在职',
    joinDate: '2022-03-15',
    workDays: 26,
    salary: 8000
  },
  {
    id: '2',
    name: '李四',
    avatar: '👩‍🌾',
    role: 'picker',
    roleName: '采茶工',
    phone: '139****5678',
    department: '采摘部',
    status: 'active',
    statusName: '在职',
    joinDate: '2023-02-20',
    workDays: 22,
    salary: 4500
  },
  {
    id: '3',
    name: '王五',
    avatar: '👨‍🍳',
    role: 'teaMaster',
    roleName: '制茶师',
    phone: '137****9012',
    department: '加工部',
    status: 'active',
    statusName: '在职',
    joinDate: '2021-08-10',
    workDays: 24,
    salary: 12000
  },
  {
    id: '4',
    name: '赵六',
    avatar: '👩‍💼',
    role: 'sales',
    roleName: '销售员',
    phone: '136****3456',
    department: '销售部',
    status: 'active',
    statusName: '在职',
    joinDate: '2023-05-01',
    workDays: 25,
    salary: 6000
  },
  {
    id: '5',
    name: '孙七',
    avatar: '👨‍🔧',
    role: 'maintenance',
    roleName: '维修工',
    phone: '135****7890',
    department: '设备部',
    status: 'leave',
    statusName: '休假',
    joinDate: '2022-06-18',
    workDays: 18,
    salary: 5500
  },
  {
    id: '6',
    name: '周八',
    avatar: '👩‍🍵',
    role: 'picker',
    roleName: '采茶工',
    phone: '134****2345',
    department: '采摘部',
    status: 'active',
    statusName: '在职',
    joinDate: '2024-01-10',
    workDays: 20,
    salary: 4200
  },
  {
    id: '7',
    name: '吴九',
    avatar: '👨‍🏫',
    role: 'guide',
    roleName: '导游',
    phone: '133****6789',
    department: '茶旅部',
    status: 'off',
    statusName: '离职',
    joinDate: '2023-04-15',
    workDays: 0,
    salary: 5000
  }
];

const StaffPage: React.FC = () => {
  const [staffList] = useState<Staff[]>(mockStaffList);
  const [activeDepartment, setActiveDepartment] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const departments = [
    { key: 'all', label: '全部' },
    { key: '茶园管理部', label: '茶园管理' },
    { key: '采摘部', label: '采摘部' },
    { key: '加工部', label: '加工部' },
    { key: '销售部', label: '销售部' },
    { key: '茶旅部', label: '茶旅部' }
  ];

  const stats = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter(s => s.status === 'active').length;
    const leave = staffList.filter(s => s.status === 'leave').length;
    const avgSalary = staffList.filter(s => s.status !== 'off').reduce((sum, s) => sum + s.salary, 0) / (total - staffList.filter(s => s.status === 'off').length);
    return { total, active, leave, avgSalary: Math.round(avgSalary) };
  }, [staffList]);

  const filteredStaff = useMemo(() => {
    let result = staffList;
    if (activeDepartment !== 'all') {
      result = result.filter(s => s.department === activeDepartment);
    }
    if (searchText) {
      result = result.filter(s =>
        s.name.includes(searchText) ||
        s.roleName.includes(searchText) ||
        s.phone.includes(searchText)
      );
    }
    return result;
  }, [staffList, activeDepartment, searchText]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'active';
      case 'leave':
        return 'leave';
      case 'off':
        return 'off';
      default:
        return '';
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>员工管理</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.total}</Text>
            <Text className={styles.statLabel}>总人数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={classnames(styles.statValue, styles.green)}>{stats.active}</Text>
            <Text className={styles.statLabel}>在职</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={classnames(styles.statValue, styles.orange)}>{stats.leave}</Text>
            <Text className={styles.statLabel}>休假</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>¥{stats.avgSalary}</Text>
            <Text className={styles.statLabel}>平均薪资</Text>
          </View>
        </View>
      </View>

      <View className={styles.searchBar}>
        <Input
          className={styles.searchInput}
          placeholder="搜索员工姓名/岗位"
          value={searchText}
          onInput={(e) => setSearchText(e.detail.value)}
        />
        <Button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
          + 添加
        </Button>
      </View>

      <ScrollView scrollX className={styles.departmentBar}>
        {departments.map((dept) => (
          <View
            key={dept.key}
            className={classnames(styles.deptItem, activeDepartment === dept.key && styles.active)}
            onClick={() => setActiveDepartment(dept.key)}
          >
            {dept.label}
          </View>
        ))}
      </ScrollView>

      <ScrollView scrollY className={styles.staffList}>
        {filteredStaff.map((staff) => (
          <View
            key={staff.id}
            className={styles.staffCard}
            onClick={() => setSelectedStaff(staff)}
          >
            <View className={styles.avatar}>
              <Text>{staff.avatar}</Text>
            </View>
            <View className={styles.staffInfo}>
              <View className={styles.staffHeader}>
                <Text className={styles.staffName}>{staff.name}</Text>
                <View className={classnames(styles.statusTag, styles[getStatusClass(staff.status)])}>
                  {staff.statusName}
                </View>
              </View>
              <Text className={styles.staffRole}>{staff.roleName} · {staff.department}</Text>
              <View className={styles.staffMeta}>
                <Text className={styles.phone}>{staff.phone}</Text>
                <Text className={styles.salary}>¥{staff.salary}/月</Text>
              </View>
            </View>
            <Text className={styles.arrow}>›</Text>
          </View>
        ))}

        {filteredStaff.length === 0 && (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>👥</Text>
            <Text className={styles.emptyText}>暂无员工信息</Text>
          </View>
        )}
      </ScrollView>

      {selectedStaff && (
        <View className={styles.detailModal} onClick={() => setSelectedStaff(null)}>
          <View className={styles.detailContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.detailHeader}>
              <View className={styles.detailAvatar}>
                <Text>{selectedStaff.avatar}</Text>
              </View>
              <View className={styles.detailInfo}>
                <Text className={styles.detailName}>{selectedStaff.name}</Text>
                <Text className={styles.detailRole}>{selectedStaff.roleName}</Text>
                <View className={classnames(styles.detailStatus, styles[getStatusClass(selectedStaff.status)])}>
                  {selectedStaff.statusName}
                </View>
              </View>
            </View>

            <ScrollView scrollY className={styles.detailBody}>
              <View className={styles.detailSection}>
                <Text className={styles.sectionTitle}>基本信息</Text>
                <View className={styles.infoList}>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>部门</Text>
                    <Text className={styles.infoValue}>{selectedStaff.department}</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>联系电话</Text>
                    <Text className={styles.infoValue}>{selectedStaff.phone}</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>入职日期</Text>
                    <Text className={styles.infoValue}>{selectedStaff.joinDate}</Text>
                  </View>
                </View>
              </View>

              <View className={styles.detailSection}>
                <Text className={styles.sectionTitle}>工作信息</Text>
                <View className={styles.infoList}>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>本月出勤</Text>
                    <Text className={styles.infoValue}>{selectedStaff.workDays}天</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>岗位工资</Text>
                    <Text className={styles.infoValue}>¥{selectedStaff.salary}/月</Text>
                  </View>
                </View>
              </View>

              <View className={styles.detailSection}>
                <Text className={styles.sectionTitle}>操作</Text>
                <View className={styles.actionList}>
                  <View className={styles.actionItem}>
                    <Text className={styles.actionIcon}>📞</Text>
                    <Text className={styles.actionText}>拨打电话</Text>
                  </View>
                  <View className={styles.actionItem}>
                    <Text className={styles.actionIcon}>📝</Text>
                    <Text className={styles.actionText}>编辑信息</Text>
                  </View>
                  <View className={styles.actionItem}>
                    <Text className={styles.actionIcon}>📊</Text>
                    <Text className={styles.actionText}>考勤记录</Text>
                  </View>
                  <View className={styles.actionItem}>
                    <Text className={styles.actionIcon}>💰</Text>
                    <Text className={styles.actionText}>薪资明细</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className={styles.detailFooter}>
              <Button className={styles.closeDetailBtn} onClick={() => setSelectedStaff(null)}>
                关闭
              </Button>
            </View>

            <View className={styles.closeBtn} onClick={() => setSelectedStaff(null)}>
              <Text>✕</Text>
            </View>
          </View>
        </View>
      )}

      {showAddModal && (
        <View className={styles.addModal} onClick={() => setShowAddModal(false)}>
          <View className={styles.addContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.addHeader}>
              <Text className={styles.addTitle}>添加员工</Text>
              <Text className={styles.addClose} onClick={() => setShowAddModal(false)}>✕</Text>
            </View>
            <ScrollView scrollY className={styles.addBody}>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>姓名</Text>
                <Input className={styles.formInput} placeholder="请输入姓名" />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>手机号</Text>
                <Input className={styles.formInput} type="number" placeholder="请输入手机号" />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>岗位</Text>
                <Input className={styles.formInput} placeholder="请输入岗位" />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>部门</Text>
                <Input className={styles.formInput} placeholder="请输入部门" />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>薪资</Text>
                <Input className={styles.formInput} type="digit" placeholder="请输入薪资" />
              </View>
            </ScrollView>
            <View className={styles.addFooter}>
              <Button className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>取消</Button>
              <Button className={styles.confirmBtn} onClick={() => {
                Taro.showToast({ title: '添加成功', icon: 'success' });
                setShowAddModal(false);
              }}>确定添加</Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default StaffPage;
