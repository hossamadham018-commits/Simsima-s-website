# Simsima's Kitchen - Design Guide

## 🎨 Brand Identity

**Brand Name:** Simsima's Kitchen  
**Tagline:** Fresh Food Quality  
**Industry:** Home Catering / Food Delivery

## 🌈 Color Palette

### Primary Colors
- **Brand Green**: `#4a7c59` - Used for navbar, primary buttons, trust elements
- **Warm Orange**: `#f4a261` - Call-to-action buttons, highlights
- **Coral Red**: `#e76f51` - Hover states, urgent actions

### Status Colors
- **Pending**: `#f4a261` (Orange)
- **Processing**: `#2a9d8f` (Teal)
- **Completed**: `#4a7c59` (Green)
- **Cancelled**: `#e76f51` (Red)

### Neutral Colors
- **White**: `#ffffff` - Cards, backgrounds
- **Light Gray**: `#ecf0f1` - Page backgrounds
- **Text Gray**: `#333333` - Body text
- **Border Gray**: `#dddddd` - Borders

## 📐 Layout & Spacing

### Container
- Max width: `1200px`
- Padding: `20px` (horizontal)

### Spacing Scale
- Small: `0.5rem` (8px)
- Medium: `1rem` (16px)
- Large: `2rem` (32px)
- XLarge: `4rem` (64px)

### Border Radius
- Small: `5px` - Buttons, inputs
- Medium: `8px` - Cards
- Large: `10px` - Feature cards
- Circle: `50%` - Logo, avatars

## 🔤 Typography

### Font Family
```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

### Font Sizes
- Hero: `3rem` (48px)
- H1: `2rem` (32px)
- H2: `1.5rem` (24px)
- H3: `1.2rem` (19.2px)
- Body: `1rem` (16px)
- Small: `0.9rem` (14.4px)

### Font Weights
- Regular: `400`
- Medium: `500`
- Bold: `700`

## 🧩 Components

### Buttons

**Primary Button**
```css
background: #f4a261;
color: white;
padding: 0.75rem 1.5rem;
border-radius: 5px;
transition: background 0.3s;

/* Hover */
background: #e76f51;
```

**Secondary Button**
```css
background: #4a7c59;
color: white;
```

### Cards
```css
background: white;
border-radius: 10px;
box-shadow: 0 2px 10px rgba(0,0,0,0.1);
padding: 1.5rem;
```

### Navigation Bar
```css
background: #4a7c59;
color: white;
padding: 1rem 0;
box-shadow: 0 2px 5px rgba(0,0,0,0.1);
```

### Inputs
```css
padding: 0.75rem;
border: 1px solid #ddd;
border-radius: 5px;
font-size: 1rem;
width: 100%;
```

## 📱 Responsive Design

### Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

### Grid Layout
```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
gap: 2rem;
```

## 🎭 UI Patterns

### Menu Item Card
- Image placeholder: 200px height, green background
- Title: H3, bold
- Description: Small text, gray
- Price: Large, bold, brand green
- Add to Cart button: Full width, primary color

### Order Card
- Header: Order number + Status badge
- Content: Total, Address, Date, Items list
- Status badge: Colored pill with status color

### Cart Item
- Horizontal layout: Info left, Controls right
- Quantity controls: -/+ buttons with number display
- Remove button: Red text

## 🖼️ Imagery

### Logo
- Format: JPEG/PNG
- Display: Circular (border-radius: 50%)
- Max width: 300px on hero
- Border: 5px solid white

### Menu Item Placeholders
- Size: 200px height
- Background: Brand green (#4a7c59)
- Text: White, centered

## ✨ Interactions

### Hover Effects
```css
transition: all 0.3s ease;
```

**Button Hover:**
- Background color shift
- Slight scale: `transform: scale(1.02)`

**Card Hover:**
- Shadow lift: `box-shadow: 0 4px 15px rgba(0,0,0,0.15)`

**Link Hover:**
- Underline decoration

## 📋 Forms

### Form Layout
```css
display: flex;
flex-direction: column;
gap: 1rem;
```

### Validation States
- Error: Red border `#e74c3c`
- Success: Green border `#27ae60`
- Focus: Blue border `#3498db`

## 🎯 Accessibility

### Contrast Ratios
- Text on white: >= 4.5:1
- Large text: >= 3:1

### Interactive Elements
- Min touch target: 44x44px
- Focus indicators: Visible outline
- Alt text for images
- Semantic HTML

## 🌟 Hero Section

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
text-align: center;
padding: 4rem 2rem;
min-height: 80vh;
```

## 📦 Shadow System

- Small: `0 2px 5px rgba(0,0,0,0.1)` - Navbar, subtle elevation
- Medium: `0 2px 10px rgba(0,0,0,0.1)` - Cards, default
- Large: `0 4px 15px rgba(0,0,0,0.15)` - Hover states, modals

## 🔄 Status Flow

```
Pending (Orange) → Processing (Teal) → Completed (Green)
                ↓
           Cancelled (Red)
```

## 💡 Design Principles

1. **Clean & Simple**: Avoid clutter, focus on food
2. **Warm & Welcoming**: Use warm colors, friendly tone
3. **Trust**: Green for reliability, clear pricing
4. **Easy Navigation**: Minimal clicks to order
5. **Mobile-First**: Touch-friendly, responsive
6. **Food-Focused**: Let the food shine

## 🎨 Usage Examples

### Call-to-Action
- Use warm orange (#f4a261)
- Large, prominent placement
- Clear action verbs: "Order Now", "Add to Cart"

### Trust Signals
- Use brand green (#4a7c59)
- Icons with text: "Fresh Food Quality"
- Customer testimonials (future)

### Urgency
- Use coral red (#e76f51) sparingly
- Limited time offers
- Low stock warnings

---

This design system ensures consistency across all platforms while maintaining the warm, trustworthy feel of a home kitchen.
