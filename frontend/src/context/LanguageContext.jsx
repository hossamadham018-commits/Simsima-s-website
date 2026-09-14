import { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    home: 'Home',
    menu: 'Menu',
    cart: 'Cart',
    myOrders: 'My Orders',
    login: 'Login',
    logout: 'Logout',
    dealOfTheDay: 'Deal of the Day',
    
    // Home Page
    welcome: "Welcome to Simsima's Kitchen",
    tagline: 'Fresh Food Quality',
    subtitle: 'Delicious homemade meals delivered to your door. Experience the taste of authentic home cooking!',
    orderNow: 'Order Now',
    whyChoose: 'Why Choose Us?',
    freshIngredients: 'Fresh Ingredients',
    freshDesc: 'We use only the freshest ingredients for every dish',
    expertChefs: 'Expert Chefs',
    expertDesc: 'Cooked by experienced home chefs with love',
    fastDelivery: 'Fast Delivery',
    fastDesc: 'Hot and fresh meals delivered to your doorstep',
    
    // Menu Page
    ourMenu: 'Our Delicious Menu',
    menuSubtitle: 'Freshly prepared with love, just for you',
    price: 'Price',
    addToCart: 'Add to Cart',
    main: 'Main',
    appetizer: 'Appetizer',
    beverage: 'Beverage',
    dessert: 'Dessert',
    
    // Cart Page
    shoppingCart: 'Shopping Cart',
    yourCartEmpty: 'Your cart is empty',
    addItems: 'Add some delicious items to get started!',
    browseMenu: 'Browse Menu',
    remove: 'Remove',
    total: 'Total',
    deliveryAddress: 'Delivery Address',
    deliveryPlaceholder: 'Enter your delivery address here...',
    placeOrder: 'Place Order',
    
    // Orders Page
    myOrdersTitle: 'My Orders',
    noOrders: 'No orders yet',
    startOrdering: 'Start ordering delicious meals!',
    order: 'Order',
    totalAmount: 'Total Amount',
    orderDate: 'Order Date',
    orderItems: 'Order Items',
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Login Page
    welcomeBack: 'Welcome Back!',
    loginSubtitle: 'Login to order delicious meals',
    email: 'Email',
    password: 'Password',
    loginButton: 'Login',
    noAccount: "Don't have an account?",
    registerNow: 'Register Now',
    
    // Register Page
    joinUs: 'Join Us!',
    registerSubtitle: 'Create an account to start ordering',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    createAccount: 'Create Account',
    haveAccount: 'Already have an account?',
    loginHere: 'Login Here',
    
    // Deals Page
    dealsTitle: 'Today\'s Special Deals',
    dealsSubtitle: 'Limited time offers - Order now and save!',
    discount: 'OFF',
    originalPrice: 'Original Price',
    dealPrice: 'Deal Price',
    youSave: 'You Save',
    limitedTime: 'Limited Time Only',
    offerEndsIn: 'Offer ends in',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    todaysDeal: 'Today\'s Deal',
    noDeals: 'No deals available today',
    checkBackLater: 'Check back later for amazing offers!',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  },
  ar: {
    // Navbar
    home: 'الرئيسية',
    menu: 'القائمة',
    cart: 'السلة',
    myOrders: 'طلباتي',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    dealOfTheDay: 'عرض اليوم',
    
    // Home Page
    welcome: 'مرحباً بكم في مطبخ سمسمة',
    tagline: 'جودة طعام طازج',
    subtitle: 'وجبات منزلية لذيذة تصلك إلى باب منزلك. استمتع بطعم الطبخ المنزلي الأصيل!',
    orderNow: 'اطلب الآن',
    whyChoose: 'لماذا تختارنا؟',
    freshIngredients: 'مكونات طازجة',
    freshDesc: 'نستخدم فقط أطازج المكونات في كل طبق',
    expertChefs: 'طهاة محترفون',
    expertDesc: 'مطبوخ بواسطة طهاة منزليين ذوي خبرة بكل حب',
    fastDelivery: 'توصيل سريع',
    fastDesc: 'وجبات ساخنة وطازجة توصل إلى باب منزلك',
    
    // Menu Page
    ourMenu: 'قائمتنا اللذيذة',
    menuSubtitle: 'محضرة طازجة بحب، خصيصاً لك',
    price: 'السعر',
    addToCart: 'أضف للسلة',
    main: 'رئيسي',
    appetizer: 'مقبلات',
    beverage: 'مشروبات',
    dessert: 'حلويات',
    
    // Cart Page
    shoppingCart: 'سلة التسوق',
    yourCartEmpty: 'سلتك فارغة',
    addItems: 'أضف بعض الأطباق اللذيذة للبدء!',
    browseMenu: 'تصفح القائمة',
    remove: 'إزالة',
    total: 'المجموع',
    deliveryAddress: 'عنوان التوصيل',
    deliveryPlaceholder: 'أدخل عنوان التوصيل هنا...',
    placeOrder: 'إتمام الطلب',
    
    // Orders Page
    myOrdersTitle: 'طلباتي',
    noOrders: 'لا توجد طلبات بعد',
    startOrdering: 'ابدأ بطلب وجبات لذيذة!',
    order: 'الطلب',
    totalAmount: 'المبلغ الإجمالي',
    orderDate: 'تاريخ الطلب',
    orderItems: 'أصناف الطلب',
    pending: 'قيد الانتظار',
    processing: 'قيد التحضير',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    
    // Login Page
    welcomeBack: 'مرحباً بعودتك!',
    loginSubtitle: 'سجل دخولك لطلب وجبات لذيذة',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginButton: 'تسجيل الدخول',
    noAccount: 'ليس لديك حساب؟',
    registerNow: 'سجل الآن',
    
    // Register Page
    joinUs: 'انضم إلينا!',
    registerSubtitle: 'أنشئ حساباً لتبدأ الطلب',
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    createAccount: 'إنشاء حساب',
    haveAccount: 'لديك حساب بالفعل؟',
    loginHere: 'سجل دخولك هنا',
    
    // Deals Page
    dealsTitle: 'عروض اليوم الخاصة',
    dealsSubtitle: 'عروض لفترة محدودة - اطلب الآن ووفر!',
    discount: 'خصم',
    originalPrice: 'السعر الأصلي',
    dealPrice: 'سعر العرض',
    youSave: 'توفر',
    limitedTime: 'لفترة محدودة فقط',
    offerEndsIn: 'ينتهي العرض في',
    hours: 'ساعات',
    minutes: 'دقائق',
    seconds: 'ثواني',
    todaysDeal: 'عرض اليوم',
    noDeals: 'لا توجد عروض اليوم',
    checkBackLater: 'تحقق لاحقاً للحصول على عروض مذهلة!',
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
    saturday: 'السبت',
    sunday: 'الأحد'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ar');

  useEffect(() => {
    localStorage.setItem('language', language);
    document.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => translations[language][key] || key;

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
