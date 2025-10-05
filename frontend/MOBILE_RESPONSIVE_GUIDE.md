# 📱 Mobile Responsive Design Guide

## ✅ Fully Responsive Architecture

Every component in Mobius Analytics is **mobile-first** and fully responsive across all devices.

---

## 🎯 Breakpoints

Material-UI breakpoints used throughout:

| Breakpoint | Size | Device |
|------------|------|--------|
| **xs** | 0px - 600px | Mobile phones |
| **sm** | 600px - 900px | Tablets (portrait) |
| **md** | 900px - 1200px | Tablets (landscape) / Small laptops |
| **lg** | 1200px - 1536px | Desktops |
| **xl** | 1536px+ | Large desktops |

---

## 📐 Responsive Components

### 1. **AppShell** (Navigation)

#### Mobile (xs, sm)
- ✅ Hamburger menu icon in top-left
- ✅ Temporary drawer (slides in from left)
- ✅ Logo in app bar
- ✅ Full-width content
- ✅ Close button in drawer

#### Desktop (md+)
- ✅ Fixed sidebar (260px width)
- ✅ No hamburger menu
- ✅ Permanent drawer
- ✅ Content offset by sidebar width

**Code:**
```typescript
<Drawer
  variant="temporary" // Mobile
  open={mobileOpen}
  sx={{ display: { xs: 'block', md: 'none' } }}
/>

<Drawer
  variant="permanent" // Desktop
  sx={{ display: { xs: 'none', md: 'block' } }}
/>
```

---

### 2. **ChartContainer** (Chart Wrapper)

#### Responsive Width
- **full**: 100% on all screens
- **half**: 
  - Mobile (xs, sm): 100%
  - Desktop (md+): 50%
- **third**:
  - Mobile (xs): 100%
  - Tablet (sm): 50%
  - Desktop (md+): 33.33%

#### Responsive Padding
- Mobile (xs): 16px
- Tablet (sm): 20px
- Desktop (md+): 24px

#### Responsive Typography
- Title: 1rem (xs) → 1.15rem (sm) → 1.25rem (md)
- Description: Hidden on mobile, visible on tablet+

**Code:**
```typescript
<Box sx={{ 
  width: { xs: '100%', sm: '100%', md: '50%' }, // half
  p: { xs: 2, sm: 2.5, md: 3 } 
}}>
```

---

### 3. **Charts** (Recharts)

#### Responsive Height
- Mobile (xs): 250px
- Tablet (sm): 300px
- Desktop (md+): 400px

#### Responsive Margins
```typescript
margin={{ 
  top: 20, 
  right: { xs: 10, sm: 20, md: 30 }, 
  left: { xs: 10, sm: 15, md: 20 }, 
  bottom: { xs: 60, sm: 70, md: 80 } 
}}
```

#### Responsive Font Sizes
- Axis labels: 10px (xs) → 11px (sm) → 12px (md)
- Tooltips: Auto-adjust position on mobile

**Code:**
```typescript
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={data}>
    <XAxis tick={{ fontSize: { xs: 10, sm: 11, md: 12 } }} />
  </LineChart>
</ResponsiveContainer>
```

---

### 4. **Grid Layout** (Page Layout)

#### Responsive Spacing
```typescript
<Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
  <Grid item xs={12} md={6}> {/* Full on mobile, half on desktop */}
    <ChartRenderer chartId="chart-1" />
  </Grid>
</Grid>
```

#### Common Patterns
```typescript
// Full width on all screens
<Grid item xs={12}>

// Full on mobile, half on desktop
<Grid item xs={12} md={6}>

// Full on mobile, half on tablet, third on desktop
<Grid item xs={12} sm={6} md={4}>

// Half on mobile, third on tablet, quarter on desktop
<Grid item xs={6} sm={4} md={3}>
```

---

## 🎨 Responsive Typography

### Page Titles
```typescript
<Typography 
  variant="h4"
  sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
>
```

### Body Text
```typescript
<Typography 
  variant="body1"
  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
>
```

### Chart Titles
```typescript
<Typography 
  variant="h6"
  sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
>
```

---

## 📏 Responsive Spacing

### Container Padding
```typescript
<Container
  sx={{
    py: { xs: 2, sm: 3, md: 4 }, // Vertical
    px: { xs: 2, sm: 3, md: 4 }, // Horizontal
  }}
>
```

### Component Margins
```typescript
<Box sx={{ 
  mb: { xs: 1.5, sm: 2 }, // Margin bottom
  mt: { xs: 2, sm: 3, md: 4 }, // Margin top
}}>
```

---

## 🖼️ Responsive Images & Icons

### Icons
```typescript
<TrendingUp sx={{ 
  fontSize: { xs: 24, sm: 28, md: 32 } 
}} />
```

### Avatars
```typescript
<Avatar sx={{ 
  width: { xs: 40, sm: 48, md: 56 },
  height: { xs: 40, sm: 48, md: 56 },
}} />
```

---

## 🎭 Responsive Visibility

### Hide on Mobile
```typescript
<Box sx={{ display: { xs: 'none', md: 'block' } }}>
  Desktop only content
</Box>
```

### Show Only on Mobile
```typescript
<Box sx={{ display: { xs: 'block', md: 'none' } }}>
  Mobile only content
</Box>
```

### Conditional Rendering
```typescript
const isMobile = useMediaQuery(theme.breakpoints.down('md'))

{isMobile ? <MobileComponent /> : <DesktopComponent />}
```

---

## 📊 Chart-Specific Responsive Patterns

### 1. **Line Charts**
```typescript
<LineChart 
  data={data}
  margin={{ 
    top: 20, 
    right: { xs: 10, md: 30 }, 
    left: { xs: 10, md: 20 }, 
    bottom: { xs: 60, md: 80 } 
  }}
>
  <XAxis 
    angle={-45}
    textAnchor="end"
    height={100}
    tick={{ fontSize: { xs: 10, md: 12 } }}
  />
</LineChart>
```

### 2. **Bar Charts**
```typescript
<BarChart 
  layout="horizontal" // Better for mobile
  margin={{ bottom: { xs: 80, md: 100 } }} // More space for labels
>
  <XAxis 
    angle={-45} // Angled labels for long text
    textAnchor="end"
  />
</BarChart>
```

### 3. **Pie Charts**
```typescript
<Pie
  cx="50%"
  cy="50%"
  outerRadius={{ xs: 60, sm: 80, md: 100 }} // Responsive radius
/>
```

---

## 🧪 Testing Responsive Design

### Chrome DevTools
1. Open DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Test these devices:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - iPad Pro (1024px)
   - Desktop (1920px)

### Breakpoint Testing
Test at these exact widths:
- 375px (Mobile)
- 599px (Just before sm)
- 600px (sm breakpoint)
- 899px (Just before md)
- 900px (md breakpoint)
- 1199px (Just before lg)
- 1200px (lg breakpoint)

---

## ✅ Responsive Checklist

When creating a new component:

- [ ] Uses MUI `sx` prop with breakpoint objects
- [ ] Typography scales with screen size
- [ ] Padding/margins adjust for mobile
- [ ] Charts use `ResponsiveContainer`
- [ ] Grid items have responsive `xs`, `sm`, `md` props
- [ ] Navigation works on mobile (drawer)
- [ ] Touch targets are at least 44x44px
- [ ] Text is readable without zooming (min 14px)
- [ ] No horizontal scrolling on mobile
- [ ] Images/icons scale appropriately
- [ ] Tested on actual mobile device

---

## 🚀 Best Practices

### 1. **Mobile-First Approach**
Always design for mobile first, then enhance for larger screens:
```typescript
// ✅ Good
sx={{ 
  fontSize: '0.875rem', // Mobile default
  sm: { fontSize: '1rem' }, // Tablet override
  md: { fontSize: '1.125rem' } // Desktop override
}}

// ❌ Bad
sx={{ 
  fontSize: '1.125rem', // Desktop default
  xs: { fontSize: '0.875rem' } // Mobile override
}}
```

### 2. **Use Theme Breakpoints**
```typescript
const theme = useTheme()
const isMobile = useMediaQuery(theme.breakpoints.down('md'))
```

### 3. **Avoid Fixed Widths**
```typescript
// ✅ Good
width: '100%'
width: { xs: '100%', md: '50%' }

// ❌ Bad
width: '500px'
```

### 4. **Touch-Friendly Targets**
```typescript
<IconButton 
  size="large" // Larger touch target
  sx={{ minWidth: 44, minHeight: 44 }}
/>
```

### 5. **Readable Text**
```typescript
// Minimum 14px on mobile
<Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
```

---

## 📱 Mobile Performance

### Lazy Loading
```typescript
const ChartComponent = lazy(() => import('@/charts/my-chart'))
```

### Optimize Images
- Use WebP format
- Provide multiple sizes
- Use `loading="lazy"`

### Reduce Animations on Mobile
```typescript
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1 }}
/>
```

---

## 🎉 Result

**Every component is fully responsive!**

- ✅ Works on phones (375px+)
- ✅ Works on tablets (768px+)
- ✅ Works on desktops (1200px+)
- ✅ Smooth transitions between breakpoints
- ✅ Touch-friendly on mobile
- ✅ Optimized performance

**Test it yourself:** Resize your browser or use Chrome DevTools! 📐

