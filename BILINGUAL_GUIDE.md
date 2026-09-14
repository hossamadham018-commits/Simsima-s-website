# 🌐 Bilingual Support Guide

## English & Arabic (العربية)

Your Simsima's Kitchen website now supports both English and Arabic with automatic RTL (Right-to-Left) layout switching!

## 🎯 Features

### Language Switcher
- **Location**: Top navigation bar
- **Button**: 🌐 العربية / 🌐 English
- **One-click switching** between languages
- **Persistent**: Language preference is saved in browser

### RTL Support
When Arabic is selected:
- ✅ All text flows right-to-left
- ✅ Layout automatically mirrors
- ✅ Navigation aligns correctly
- ✅ Forms and inputs adapt
- ✅ Cards and badges position properly

### Translated Pages

**All pages support both languages:**

1. **Home Page** (الصفحة الرئيسية)
   - Welcome message
   - Tagline
   - Features section
   - Call-to-action buttons

2. **Menu** (القائمة)
   - Page title
   - Category labels
   - Add to cart button
   - Price labels

3. **Shopping Cart** (سلة التسوق)
   - Cart items
   - Quantity controls
   - Checkout process
   - Delivery address

4. **Orders** (الطلبات)
   - Order history
   - Status badges
   - Order details
   - Date formatting

5. **Login** (تسجيل الدخول)
   - Form labels
   - Buttons
   - Error messages

6. **Register** (التسجيل)
   - Form fields
   - Instructions
   - Submit button

### Navigation
- Home (الرئيسية)
- Menu (القائمة)
- Cart (السلة)
- My Orders (طلباتي)
- Login (تسجيل الدخول)
- Logout (تسجيل الخروج)

## 🔧 Technical Implementation

### Language Context
```javascript
// Usage in any component
import { useLanguage } from '../context/LanguageContext';

const { language, t, toggleLanguage } = useLanguage();

// Translate text
<h1>{t('welcome')}</h1>

// Check current language
{language === 'ar' ? 'Arabic content' : 'English content'}

// Toggle language
<button onClick={toggleLanguage}>Switch Language</button>
```

### Available Translation Keys

**Navigation:**
- home, menu, cart, myOrders, login, logout

**Home Page:**
- welcome, tagline, subtitle, orderNow, whyChoose
- freshIngredients, freshDesc
- expertChefs, expertDesc
- fastDelivery, fastDesc

**Menu:**
- ourMenu, menuSubtitle, price, addToCart
- main, appetizer, beverage, dessert

**Cart:**
- shoppingCart, yourCartEmpty, addItems, browseMenu
- remove, total, deliveryAddress, deliveryPlaceholder, placeOrder

**Orders:**
- myOrdersTitle, noOrders, startOrdering
- order, totalAmount, orderDate, orderItems
- pending, processing, completed, cancelled

**Authentication:**
- welcomeBack, loginSubtitle, loginButton
- noAccount, registerNow
- joinUs, registerSubtitle, createAccount
- haveAccount, loginHere
- email, password, fullName, phoneNumber

## 💡 Default Language

The system defaults to **Arabic (العربية)** on first visit. Users can switch to English anytime using the language toggle button.

## 🎨 Design Considerations

### Arabic Text
- Uses proper RTL text direction
- Larger line height for better readability
- Supports Arabic numerals (١٢٣) but displays Western numerals for prices

### Currency Display
- English: "Rp 25,000"
- Arabic: "25,000 ر.س"

### Date Formatting
- English: "January 1, 2026"
- Arabic: "١ يناير ٢٠٢٦"

## 📱 Mobile Support

Both languages work perfectly on mobile devices with responsive layouts that adapt to:
- Screen sizes
- Touch targets
- Text overflow
- RTL/LTR switching

## 🔄 Adding New Translations

To add new text that needs translation:

1. Open `frontend/src/context/LanguageContext.jsx`
2. Add your key to both `en` and `ar` objects:

```javascript
const translations = {
  en: {
    myNewKey: 'English text'
  },
  ar: {
    myNewKey: 'النص العربي'
  }
};
```

3. Use in your component:
```javascript
const { t } = useLanguage();
<p>{t('myNewKey')}</p>
```

## ✅ Browser Compatibility

Tested and working on:
- Chrome / Edge
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 User Experience

**Language switching is instant:**
- No page reload required
- Smooth transition
- Preference persists across sessions
- Works offline (after first load)

---

## Tips for Content Creators

When adding menu items or content:
- Keep descriptions concise for both languages
- Test how text looks in both RTL and LTR
- Use emojis - they work great in both languages! 🍛🥗🥤🍰

---

Built with ❤️ for Simsima's Kitchen
مطبخ سمسمة - جودة طعام طازج
