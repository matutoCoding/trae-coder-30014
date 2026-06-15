import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockTeaTourProducts } from '@/data/mockSales';
import { TeaTourProduct } from '@/types';

const TeaTourPage: React.FC = () => {
  const [products, setProducts] = useState<TeaTourProduct[]>([]);
  const [activeType, setActiveType] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<TeaTourProduct | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    people: '1',
    date: '',
    remark: ''
  });

  useEffect(() => {
    setProducts(mockTeaTourProducts);
  }, []);

  const types = [
    { key: 'all', label: '全部' },
    { key: 'tour', label: '观光游' },
    { key: 'experience', label: '体验游' },
    { key: 'workshop', label: '工坊课' }
  ];

  const filteredProducts = activeType === 'all'
    ? products
    : products.filter(p => p.type === activeType);

  const handleBook = (product: TeaTourProduct) => {
    setSelectedProduct(product);
    setShowBookingModal(true);
  };

  const handleSubmitBooking = () => {
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.date) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    Taro.showToast({ title: '预约成功', icon: 'success' });
    setShowBookingModal(false);
    setBookingForm({
      name: '',
      phone: '',
      people: '1',
      date: '',
      remark: ''
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'available';
      case 'sold-out':
        return 'soldOut';
      case 'closed':
        return 'closed';
      default:
        return '';
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerContent}>
          <Text className={styles.title}>茶旅体验</Text>
          <Text className={styles.subtitle}>探索茶园风光，体验茶文化</Text>
        </View>
        <Image
          className={styles.headerBg}
          src="https://picsum.photos/id/1039/750/400"
          mode="aspectFill"
        />
      </View>

      <View className={styles.filterBar}>
        {types.map((type) => (
          <View
            key={type.key}
            className={classnames(styles.filterItem, activeType === type.key && styles.active)}
            onClick={() => setActiveType(type.key)}
          >
            {type.label}
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.productList}>
        {filteredProducts.map((product) => (
          <View className={styles.productCard} key={product.id}>
            <Image
              className={styles.productImage}
              src={product.image}
              mode="aspectFill"
            />
            <View className={styles.productInfo}>
              <View className={styles.productHeader}>
                <Text className={styles.productName}>{product.name}</Text>
                <View className={classnames(styles.statusTag, styles[getStatusClass(product.status)])}>
                  {product.status === 'available' ? '可预约' : product.status === 'sold-out' ? '已售罄' : '已结束'}
                </View>
              </View>
              <View className={styles.productMeta}>
                <Text className={styles.typeTag}>{product.typeName}</Text>
                <Text className={styles.duration}>⏱ {product.duration}</Text>
              </View>
              <Text className={styles.description}>{product.description}</Text>
              <View className={styles.features}>
                {product.features.slice(0, 3).map((feature, index) => (
                  <Text key={index} className={styles.featureTag}>✓ {feature}</Text>
                ))}
              </View>
              <View className={styles.productFooter}>
                <View className={styles.priceInfo}>
                  <Text className={styles.price}>¥{product.price}</Text>
                  <Text className={styles.priceUnit}>/人</Text>
                </View>
                <View className={styles.bookInfo}>
                  <Text className={styles.booked}>已预约 {product.bookedCount}/{product.maxPeople} 人</Text>
                  <Button
                    className={classnames(styles.bookBtn, product.status !== 'available' && styles.disabled)}
                    onClick={() => handleBook(product)}
                    disabled={product.status !== 'available'}
                  >
                    立即预约
                  </Button>
                </View>
              </View>
            </View>
          </View>
        ))}

        {filteredProducts.length === 0 && (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>🏞️</Text>
            <Text className={styles.emptyText}>暂无相关产品</Text>
          </View>
        )}
      </ScrollView>

      {selectedProduct && (
        <View className={styles.detailModal} onClick={() => setSelectedProduct(null)}>
          <View className={styles.detailContent} onClick={(e) => e.stopPropagation()}>
            <ScrollView scrollY className={styles.detailScroll}>
              <Image
                className={styles.detailImage}
                src={selectedProduct.image}
                mode="aspectFill"
              />
              <View className={styles.detailBody}>
                <View className={styles.detailHeader}>
                  <Text className={styles.detailName}>{selectedProduct.name}</Text>
                  <View className={classnames(styles.statusTag, styles[getStatusClass(selectedProduct.status)])}>
                    {selectedProduct.status === 'available' ? '可预约' : selectedProduct.status === 'sold-out' ? '已售罄' : '已结束'}
                  </View>
                </View>

                <View className={styles.detailMeta}>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>类型</Text>
                    <Text className={styles.metaValue}>{selectedProduct.typeName}</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>时长</Text>
                    <Text className={styles.metaValue}>{selectedProduct.duration}</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>成团人数</Text>
                    <Text className={styles.metaValue}>{selectedProduct.maxPeople}人</Text>
                  </View>
                </View>

                <View className={styles.detailSection}>
                  <Text className={styles.sectionTitle}>费用说明</Text>
                  <View className={styles.priceDetail}>
                    <Text className={styles.detailPrice}>¥{selectedProduct.price}</Text>
                    <Text className={styles.detailPriceUnit}>/人</Text>
                  </View>
                </View>

                <View className={styles.detailSection}>
                  <Text className={styles.sectionTitle}>行程特色</Text>
                  <View className={styles.featureList}>
                    {selectedProduct.features.map((feature, index) => (
                      <View key={index} className={styles.featureItem}>
                        <Text className={styles.featureIcon}>✓</Text>
                        <Text className={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View className={styles.detailSection}>
                  <Text className={styles.sectionTitle}>行程介绍</Text>
                  <Text className={styles.detailDesc}>{selectedProduct.description}</Text>
                  <Text className={styles.detailDesc}>
                    {'\n'}行程安排：
                    {'\n'}1. 茶园集合，专业导游带队
                    {'\n'}2. 参观茶园，了解茶叶种植知识
                    {'\n'}3. 体验采茶/制茶（根据产品类型）
                    {'\n'}4. 品鉴好茶，交流茶文化
                    {'\n'}5. 活动结束，领取伴手礼
                  </Text>
                </View>

                <View className={styles.detailSection}>
                  <Text className={styles.sectionTitle}>预约情况</Text>
                  <View className={styles.bookingProgress}>
                    <View className={styles.progressBar}>
                      <View
                        className={styles.progressFill}
                        style={{ width: `${(selectedProduct.bookedCount / selectedProduct.maxPeople) * 100}%` }}
                      />
                    </View>
                    <Text className={styles.progressText}>
                      已预约 {selectedProduct.bookedCount}/{selectedProduct.maxPeople} 人
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className={styles.detailFooter}>
              <View className={styles.footerPrice}>
                <Text className={styles.footerPriceValue}>¥{selectedProduct.price}</Text>
                <Text className={styles.footerPriceUnit}>/人</Text>
              </View>
              <Button
                className={classnames(styles.footerBookBtn, selectedProduct.status !== 'available' && styles.disabled)}
                onClick={() => {
                  setSelectedProduct(null);
                  handleBook(selectedProduct);
                }}
                disabled={selectedProduct.status !== 'available'}
              >
                立即预约
              </Button>
            </View>

            <View className={styles.closeBtn} onClick={() => setSelectedProduct(null)}>
              <Text>✕</Text>
            </View>
          </View>
        </View>
      )}

      {showBookingModal && selectedProduct && (
        <View className={styles.bookingModal} onClick={() => setShowBookingModal(false)}>
          <View className={styles.bookingContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.bookingHeader}>
              <Text className={styles.bookingTitle}>预约登记</Text>
              <Text className={styles.bookingClose} onClick={() => setShowBookingModal(false)}>✕</Text>
            </View>

            <ScrollView scrollY className={styles.bookingBody}>
              <View className={styles.bookingProduct}>
                <Text className={styles.bookingProductName}>{selectedProduct.name}</Text>
                <Text className={styles.bookingProductPrice}>¥{selectedProduct.price}/人</Text>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>联系人姓名 <Text style={{ color: '#F44336' }}>*</Text></Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入姓名"
                  value={bookingForm.name}
                  onInput={(e) => setBookingForm({ ...bookingForm, name: e.detail.value })}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>联系电话 <Text style={{ color: '#F44336' }}>*</Text></Text>
                <Input
                  className={styles.formInput}
                  type="number"
                  placeholder="请输入手机号"
                  value={bookingForm.phone}
                  onInput={(e) => setBookingForm({ ...bookingForm, phone: e.detail.value })}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>预约日期 <Text style={{ color: '#F44336' }}>*</Text></Text>
                <Input
                  className={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={bookingForm.date}
                  onInput={(e) => setBookingForm({ ...bookingForm, date: e.detail.value })}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>预约人数</Text>
                <View className={styles.peopleSelector}>
                  <View
                    className={styles.peopleBtn}
                    onClick={() => {
                      const num = Math.max(1, parseInt(bookingForm.people) - 1);
                      setBookingForm({ ...bookingForm, people: String(num) });
                    }}
                  >
                    -
                  </View>
                  <Text className={styles.peopleNum}>{bookingForm.people}</Text>
                  <View
                    className={styles.peopleBtn}
                    onClick={() => {
                      const num = Math.min(selectedProduct.maxPeople - selectedProduct.bookedCount, parseInt(bookingForm.people) + 1);
                      setBookingForm({ ...bookingForm, people: String(num) });
                    }}
                  >
                    +
                  </View>
                  <Text className={styles.peopleTip}>剩余 {selectedProduct.maxPeople - selectedProduct.bookedCount} 个名额</Text>
                </View>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>备注</Text>
                <Input
                  className={styles.formInput}
                  placeholder="如有特殊需求请备注"
                  value={bookingForm.remark}
                  onInput={(e) => setBookingForm({ ...bookingForm, remark: e.detail.value })}
                />
              </View>

              <View className={styles.totalSection}>
                <Text className={styles.totalLabel}>预估总价</Text>
                <Text className={styles.totalPrice}>¥{(selectedProduct.price * parseInt(bookingForm.people)).toFixed(2)}</Text>
              </View>
            </ScrollView>

            <View className={styles.bookingFooter}>
              <Button className={styles.cancelBtn} onClick={() => setShowBookingModal(false)}>取消</Button>
              <Button className={styles.confirmBtn} onClick={handleSubmitBooking}>提交预约</Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default TeaTourPage;
