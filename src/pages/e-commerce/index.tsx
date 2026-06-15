import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';

interface Product {
  id: string;
  name: string;
  type: string;
  typeName: string;
  grade: string;
  price: number;
  originalPrice: number;
  stock: number;
  sold: number;
  image: string;
  description: string;
  specs: string[];
  batchNo: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: '明前茶-特级礼盒装',
    type: 'early-spring',
    typeName: '明前茶',
    grade: '特级',
    price: 1280,
    originalPrice: 1580,
    stock: 128,
    sold: 256,
    image: 'https://picsum.photos/id/1039/400/400',
    description: '精选清明前采摘的一芽一叶，芽叶细嫩，香气清高，滋味鲜爽',
    specs: ['250g/盒', '礼盒装'],
    batchNo: 'B20260614001'
  },
  {
    id: '2',
    name: '明前茶-一级罐装',
    type: 'early-spring',
    typeName: '明前茶',
    grade: '一级',
    price: 580,
    originalPrice: 680,
    stock: 256,
    sold: 189,
    image: 'https://picsum.photos/id/1018/400/400',
    description: '明前采摘的一芽二叶，滋味醇厚，回甘持久',
    specs: ['200g/罐'],
    batchNo: 'B20260614002'
  },
  {
    id: '3',
    name: '雨前茶-特级礼盒装',
    type: 'before-rain',
    typeName: '雨前茶',
    grade: '特级',
    price: 680,
    originalPrice: 880,
    stock: 86,
    sold: 342,
    image: 'https://picsum.photos/id/1044/400/400',
    description: '谷雨前采摘，茶叶饱满，香气浓郁，性价比高',
    specs: ['250g/盒', '礼盒装'],
    batchNo: 'B20260610001'
  },
  {
    id: '4',
    name: '雨前茶-一级',
    type: 'before-rain',
    typeName: '雨前茶',
    grade: '一级',
    price: 420,
    originalPrice: 520,
    stock: 520,
    sold: 678,
    image: 'https://picsum.photos/id/1036/400/400',
    description: '雨前一级茶叶，口感醇厚，适合日常饮用',
    specs: ['500g/袋'],
    batchNo: 'B20260610002'
  },
  {
    id: '5',
    name: '秋茶-特级',
    type: 'autumn',
    typeName: '秋茶',
    grade: '特级',
    price: 380,
    originalPrice: 480,
    stock: 320,
    sold: 156,
    image: 'https://picsum.photos/id/1025/400/400',
    description: '秋季采摘，香气高扬，滋味甘醇，耐泡度高',
    specs: ['250g/袋'],
    batchNo: 'B20250915001'
  },
  {
    id: '6',
    name: '明前茶-品鉴装',
    type: 'early-spring',
    typeName: '明前茶',
    grade: '特级',
    price: 168,
    originalPrice: 198,
    stock: 500,
    sold: 892,
    image: 'https://picsum.photos/id/1060/400/400',
    description: '特级明前茶品鉴装，50g小包装，尝鲜首选',
    specs: ['50g/罐'],
    batchNo: 'B20260613001'
  }
];

const ECommercePage: React.FC = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    { key: 'all', label: '全部' },
    { key: 'early-spring', label: '明前茶' },
    { key: 'before-rain', label: '雨前茶' },
    { key: 'autumn', label: '秋茶' }
  ];

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter(p => p.type === activeCategory);
    }
    if (searchText) {
      result = result.filter(p =>
        p.name.includes(searchText) ||
        p.typeName.includes(searchText) ||
        p.grade.includes(searchText)
      );
    }
    return result;
  }, [products, activeCategory, searchText]);

  const handleAddCart = (product: Product) => {
    console.log('[ECommercePage] 加入购物车:', product.name);
    Taro.showToast({ title: '已加入购物车', icon: 'success' });
  };

  const handleBuy = (product: Product) => {
    console.log('[ECommercePage] 立即购买:', product.name);
    Taro.showToast({ title: '下单功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>电商商品</Text>
        <View className={styles.searchBox}>
          <Input
            className={styles.searchInput}
            placeholder="搜索茶叶商品"
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
          <Text className={styles.searchIcon}>🔍</Text>
        </View>
      </View>

      <View className={styles.categoryBar}>
        {categories.map((cat) => (
          <View
            key={cat.key}
            className={classnames(styles.categoryItem, activeCategory === cat.key && styles.active)}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.productGrid}>
        <View className={styles.grid}>
          {filteredProducts.map((product) => (
            <View
              key={product.id}
              className={styles.productCard}
              onClick={() => setSelectedProduct(product)}
            >
              <Image
                className={styles.productImage}
                src={product.image}
                mode="aspectFill"
              />
              <View className={styles.productInfo}>
                <Text className={styles.productName}>{product.name}</Text>
                <View className={styles.productTags}>
                  <Text className={styles.typeTag}>{product.typeName}</Text>
                  <Text className={styles.gradeTag}>{product.grade}</Text>
                </View>
                <View className={styles.priceRow}>
                  <Text className={styles.price}>¥{product.price}</Text>
                  <Text className={styles.originalPrice}>¥{product.originalPrice}</Text>
                </View>
                <View className={styles.soldInfo}>
                  <Text className={styles.sold}>已售{product.sold}</Text>
                  <Text className={styles.stock}>库存{product.stock}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>🛍️</Text>
            <Text className={styles.emptyText}>暂无相关商品</Text>
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
                  <View className={styles.detailPrice}>
                    <Text className={styles.detailPriceValue}>¥{selectedProduct.price}</Text>
                    <Text className={styles.detailOriginalPrice}>¥{selectedProduct.originalPrice}</Text>
                  </View>
                </View>

                <View className={styles.detailTags}>
                  <Text className={styles.detailTypeTag}>{selectedProduct.typeName}</Text>
                  <Text className={styles.detailGradeTag}>{selectedProduct.grade}</Text>
                  <Text className={styles.detailStockTag}>库存 {selectedProduct.stock}</Text>
                </View>

                <View className={styles.detailSection}>
                  <Text className={styles.sectionTitle}>商品描述</Text>
                  <Text className={styles.description}>{selectedProduct.description}</Text>
                </View>

                <View className={styles.detailSection}>
                  <Text className={styles.sectionTitle}>规格参数</Text>
                  <View className={styles.specList}>
                    {selectedProduct.specs.map((spec, index) => (
                      <View key={index} className={styles.specItem}>
                        <Text className={styles.specText}>{spec}</Text>
                      </View>
                    ))}
                    <View className={styles.specItem}>
                      <Text className={styles.specText}>批次号：{selectedProduct.batchNo}</Text>
                    </View>
                  </View>
                </View>

                <View className={styles.detailSection}>
                  <Text className={styles.sectionTitle}>溯源信息</Text>
                  <View className={styles.traceInfo}>
                    <Text className={styles.traceText}>本品支持溯源查询</Text>
                    <Button
                      className={styles.traceBtn}
                      onClick={() => {
                        setSelectedProduct(null);
                        Taro.navigateTo({
                          url: `/pages/trace/index?code=TC202606140001`
                        });
                      }}
                    >
                      查看溯源
                    </Button>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className={styles.detailFooter}>
              <View className={styles.footerAction}>
                <View className={styles.actionItem}>
                  <Text className={styles.actionIcon}>🛒</Text>
                  <Text className={styles.actionText}>购物车</Text>
                </View>
                <View className={styles.actionItem}>
                  <Text className={styles.actionIcon}>💬</Text>
                  <Text className={styles.actionText}>客服</Text>
                </View>
              </View>
              <View className={styles.footerBtns}>
                <Button
                  className={styles.addCartBtn}
                  onClick={() => handleAddCart(selectedProduct)}
                >
                  加入购物车
                </Button>
                <Button
                  className={styles.buyBtn}
                  onClick={() => handleBuy(selectedProduct)}
                >
                  立即购买
                </Button>
              </View>
            </View>

            <View className={styles.closeBtn} onClick={() => setSelectedProduct(null)}>
              <Text>✕</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ECommercePage;
