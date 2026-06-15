import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqList: FAQ[] = [
  {
    id: '1',
    question: '如何添加茶园地块？',
    answer: '进入"农事"页面，点击地块列表右上角的"+"按钮，填写地块名称、面积、品种等信息即可添加新的茶园地块。',
    category: '茶园管理'
  },
  {
    id: '2',
    question: '农事记录怎么添加？',
    answer: '在"农事"页面切换到"农事记录"标签，点击右下角的"+"按钮，选择地块、农事类型、日期等信息，填写完成后保存即可。',
    category: '农事管理'
  },
  {
    id: '3',
    question: '采摘批次如何登记？',
    answer: '在首页点击"采摘记录"，或在农事页切换到"采摘记录"标签，点击"新增登记"，填写采摘批次的地块、类型、重量、人员等信息。',
    category: '采摘管理'
  },
  {
    id: '4',
    question: '怎么查看加工工序进度？',
    answer: '进入"加工"页面，可以看到所有加工批次列表，点击具体批次可以查看详细的工序流程和每道工序的参数。',
    category: '加工管理'
  },
  {
    id: '5',
    question: '茶叶溯源码是什么？',
    answer: '茶叶溯源码是每一批次茶叶的唯一标识码，通过扫码可以查看茶叶从种植、采摘、加工到包装的全链路信息，确保茶叶品质可追溯。',
    category: '溯源查询'
  },
  {
    id: '6',
    question: '如何查询溯源信息？',
    answer: '可以通过"溯源查询"页面，输入溯源码或点击扫码按钮，即可查看茶叶的完整溯源信息，包括茶园、采摘、加工、检测等环节。',
    category: '溯源查询'
  },
  {
    id: '7',
    question: '收支台账怎么记录？',
    answer: '进入"收支台账"页面，点击底部的"新增记录"按钮，选择收入或支出类型，填写分类、金额、日期等信息即可保存。',
    category: '财务管理'
  },
  {
    id: '8',
    question: '茶旅体验如何预约？',
    answer: '在首页或我的页面进入"茶旅体验"，选择心仪的产品，点击"立即预约"，填写联系人和预约信息即可完成预约。',
    category: '茶旅体验'
  }
];

const helpCategories = [
  { key: 'all', label: '全部', icon: '📚' },
  { key: '茶园管理', label: '茶园管理', icon: '🌿' },
  { key: '农事管理', label: '农事管理', icon: '👨‍🌾' },
  { key: '采摘管理', label: '采摘管理', icon: '🍃' },
  { key: '加工管理', label: '加工管理', icon: '🍵' },
  { key: '溯源查询', label: '溯源查询', icon: '🔍' },
  { key: '财务管理', label: '财务管理', icon: '💰' },
  { key: '茶旅体验', label: '茶旅体验', icon: '🏞️' }
];

const HelpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const filteredFaqs = activeCategory === 'all'
    ? faqList
    : faqList.filter(faq => faq.category === activeCategory);

  const toggleFaq = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSubmitFeedback = () => {
    if (!feedbackType || !feedbackContent) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    Taro.showToast({ title: '反馈已提交', icon: 'success' });
    setFeedbackType('');
    setFeedbackContent('');
    setContactInfo('');
  };

  const feedbackTypes = [
    { key: 'bug', label: '功能异常', icon: '🐛' },
    { key: 'suggest', label: '功能建议', icon: '💡' },
    { key: 'experience', label: '体验问题', icon: '👍' },
    { key: 'other', label: '其他问题', icon: '❓' }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.tabHeader}>
        <View
          className={classnames(styles.tabItem, activeTab === 'faq' && styles.active)}
          onClick={() => setActiveTab('faq')}
        >
          帮助中心
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'feedback' && styles.active)}
          onClick={() => setActiveTab('feedback')}
        >
          意见反馈
        </View>
      </View>

      {activeTab === 'faq' && (
        <View className={styles.faqSection}>
          <ScrollView scrollX className={styles.categoryScroll}>
            {helpCategories.map((cat) => (
              <View
                key={cat.key}
                className={classnames(styles.categoryItem, activeCategory === cat.key && styles.active)}
                onClick={() => setActiveCategory(cat.key)}
              >
                <Text className={styles.categoryIcon}>{cat.icon}</Text>
                <Text className={styles.categoryLabel}>{cat.label}</Text>
              </View>
            ))}
          </ScrollView>

          <ScrollView scrollY className={styles.faqList}>
            {filteredFaqs.map((faq) => (
              <View key={faq.id} className={styles.faqItem}>
                <View
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <View className={styles.questionInfo}>
                    <Text className={styles.questionIcon}>❓</Text>
                    <Text className={styles.questionText}>{faq.question}</Text>
                  </View>
                  <Text className={classnames(styles.expandIcon, expandedId === faq.id && styles.expanded)}>
                    ▼
                  </Text>
                </View>
                {expandedId === faq.id && (
                  <View className={styles.faqAnswer}>
                    <Text className={styles.answerText}>{faq.answer}</Text>
                    <View className={styles.answerTag}>
                      <Text>{faq.category}</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {filteredFaqs.length === 0 && (
              <View className={styles.empty}>
                <Text className={styles.emptyIcon}>📖</Text>
                <Text className={styles.emptyText}>暂无相关问题</Text>
              </View>
            )}
          </ScrollView>

          <View className={styles.contactSection}>
            <Text className={styles.contactTitle}>需要更多帮助？</Text>
            <View className={styles.contactOptions}>
              <View className={styles.contactOption}>
                <Text className={styles.contactIcon}>📞</Text>
                <Text className={styles.contactLabel}>客服电话</Text>
                <Text className={styles.contactValue}>400-888-8888</Text>
              </View>
              <View className={styles.contactOption}>
                <Text className={styles.contactIcon}>✉️</Text>
                <Text className={styles.contactLabel}>邮箱</Text>
                <Text className={styles.contactValue}>service@tea.com</Text>
              </View>
              <View className={styles.contactOption}>
                <Text className={styles.contactIcon}>💬</Text>
                <Text className={styles.contactLabel}>在线客服</Text>
                <Text className={styles.contactValue}>9:00-18:00</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'feedback' && (
        <ScrollView scrollY className={styles.feedbackSection}>
          <View className={styles.feedbackForm}>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>反馈类型 <Text style={{ color: '#F44336' }}>*</Text></Text>
              <View className={styles.typeGrid}>
                {feedbackTypes.map((type) => (
                  <View
                    key={type.key}
                    className={classnames(styles.typeItem, feedbackType === type.key && styles.selected)}
                    onClick={() => setFeedbackType(type.key)}
                  >
                    <Text className={styles.typeIcon}>{type.icon}</Text>
                    <Text className={styles.typeLabel}>{type.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>反馈内容 <Text style={{ color: '#F44336' }}>*</Text></Text>
              <Textarea
                className={styles.textarea}
                placeholder="请详细描述您遇到的问题或建议..."
                value={feedbackContent}
                onInput={(e) => setFeedbackContent(e.detail.value)}
                maxlength={500}
              />
              <Text className={styles.charCount}>{feedbackContent.length}/500</Text>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>联系方式（选填）</Text>
              <Input
                className={styles.formInput}
                placeholder="手机号或邮箱，方便我们联系您"
                value={contactInfo}
                onInput={(e) => setContactInfo(e.detail.value)}
              />
            </View>

            <Button className={styles.submitBtn} onClick={handleSubmitFeedback}>
              提交反馈
            </Button>

            <View className={styles.feedbackTips}>
              <Text className={styles.tipsTitle}>温馨提示：</Text>
              <Text className={styles.tipsText}>• 我们会在1-3个工作日内回复您的反馈</Text>
              <Text className={styles.tipsText}>• 如遇紧急问题，请拨打客服电话 400-888-8888</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default HelpPage;
