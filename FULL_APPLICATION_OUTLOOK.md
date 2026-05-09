
# 🌊 WASCO Water Bill Management System - Complete Application Outlook

## 📱 Full Anticipated User Interface & Functionality

---

## 🏠 **1. PUBLIC HOMEPAGE** (http://localhost:3000)

```
╔════════════════════════════════════════════════════════════════╗
║  🌊 WASCO - Water and Sewerage Company                         ║
║  Lesotho's Premier Water Service Provider                      ║
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  [Home] [Services] [About] [Contact]    [Login] [Register]    ║
║                                                                 ║
║  ┌─────────────────────────────────────────────────────────┐  ║
║  │  💧 Welcome to WASCO Online Portal                      │  ║
║  │                                                          │  ║
║  │  Manage your water bills, track usage, and pay online  │  ║
║  │                                                          │  ║
║  │  [Get Started] [View Services]                          │  ║
║  └─────────────────────────────────────────────────────────┘  ║
║                                                                 ║
║  📊 Our Services:                                              ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         ║
║  │ 💰 Pay Bills │ │ 📈 Track     │ │ 🔧 Report    │         ║
║  │    Online    │ │    Usage     │ │   Leakages   │         ║
║  └──────────────┘ └──────────────┘ └──────────────┘         ║
║                                                                 ║
║  🗺️ Serving All 10 Districts of Lesotho:                      ║
║  Maseru • Berea • Leribe • Mafeteng • Mohale's Hoek           ║
║  Quthing • Qacha's Nek • Mokhotlong • Thaba-Tseka • Butha-Buthe║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
```

---

## 🔐 **2. LOGIN PAGE** (http://localhost:3000/login)

```
╔════════════════════════════════════════════════════════════════╗
║  🌊 WASCO Login                                                ║
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║         ┌─────────────────────────────────────┐               ║
║         │  👤 Login to Your Account           │               ║
║         │                                      │               ║
║         │  Email:                              │               ║
║         │  [____________________________]      │               ║
║         │                                      │               ║
║         │  Password:                           │               ║
║         │  [____________________________] 👁️   │               ║
║         │                                      │               ║
║         │  [ ] Remember me                     │               ║
║         │                                      │               ║
║         │  [        Login        ]             │               ║
║         │                                      │               ║
║         │  Forgot password? | Register         │               ║
║         └─────────────────────────────────────┘               ║
║                                                                 ║
║  🔒 Secure Login with JWT Authentication                       ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
```

**API Call:** `POST /api/auth/login`
```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

---

## 📝 **3. REGISTRATION PAGE** (http://localhost:3000/register)

```
╔════════════════════════════════════════════════════════════════╗
║  🌊 WASCO Registration                                         ║
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║    ┌──────────────────────────────────────────────────────┐   ║
║    │  📋 Create Your Account                              │   ║
║    │                                                       │   ║
║    │  Full Name:        [_________________________]       │   ║
║    │  Email:            [_________________________]       │   ║
║    │  Phone:            [_________________________]       │   ║
║    │  Password:         [_________________________] 👁️    │   ║
║    │  Confirm Password: [_________________________] 👁️    │   ║
║    │                                                       │   ║
║    │  Account Type:     [Residential ▼]                   │   ║
║    │                    • Residential                      │   ║
║    │                    • Commercial                       │   ║
║    │                    • Industrial                       │   ║
║    │                                                       │   ║
║    │  District:         [Maseru ▼]                        │   ║
║    │  Address:          [_________________________]       │   ║
║    │                                                       │   ║
║    │  [ ] I agree to Terms & Conditions                   │   ║
║    │                                                       │   ║
║    │  [        Register        ]                          │   ║
║    │                                                       │   ║
║    │  Already have an account? Login                      │   ║
║    └──────────────────────────────────────────────────────┘   ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
```

**API Call:** `POST /api/auth/register`

---

## 👤 **4. CUSTOMER DASHBOARD** (http://localhost:3000/customer/dashboard)

```
╔════════════════════════════════════════════════════════════════════════════╗
║  🌊 WASCO Customer Portal                    👤 John Doe | 🔔 | 🚪 Logout  ║
╠════════════════════════════════════════════════════════════════════════════╣
║  [Dashboard] [Bills] [Payments] [Usage] [Profile] [Report Leakage]        ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  📊 Account Overview                                                        ║
║  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐             ║
║  │ 💰 Current Bill │ │ 💧 This Month   │ │ 📅 Last Payment │             ║
║  │   M 450.00      │ │   12,500 L      │ │   M 380.00      │             ║
║  │   Due: 15 May   │ │   +15% vs last  │ │   Paid: 10 Apr  │             ║
║  └─────────────────┘ └─────────────────┘ └─────────────────┘             ║
║                                                                             ║
║  📋 Recent Bills                                          [View All Bills] ║
║  ┌────────────────────────────────────────────────────────────────────┐   ║
║  │ Bill ID  │ Month    │ Usage (L) │ Amount   │ Status    │ Action   │   ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ #B001    │ May 2026 │ 12,500    │ M 450.00 │ 🔴 Unpaid │ [Pay Now]│   ║
║  │ #B002    │ Apr 2026 │ 10,800    │ M 380.00 │ ✅ Paid   │ [View]   │   ║
║  │ #B003    │ Mar 2026 │ 11,200    │ M 395.00 │ ✅ Paid   │ [View]   │   ║
║  └────────────────────────────────────────────────────────────────────┘   ║
║                                                                             ║
║  📈 Water Usage Trend (Last 6 Months)                                      ║
║  ┌────────────────────────────────────────────────────────────────────┐   ║
║  │  15,000L ┤                                                          │   ║
║  │  12,500L ┤                                    ●                     │   ║
║  │  10,000L ┤              ●         ●         ●   ●                   │   ║
║  │   7,500L ┤        ●                                                 │   ║
║  │   5,000L ┤  ●                                                       │   ║
║  │          └──────────────────────────────────────────────────────   │   ║
║  │           Dec   Jan   Feb   Mar   Apr   May                         │   ║
║  └────────────────────────────────────────────────────────────────────┘   ║
║                                                                             ║
║  🔧 Quick Actions                                                           ║
║  [💰 Pay Current Bill] [📊 View Usage History] [🔧 Report Leakage]        ║
║                                                                             ║
╚════════════════════════════════════════════════════════════════════════════╝
```

**API Calls:**
- `GET /api/customers/me` - Get customer info
- `GET /api/customers/me/bills` - Get bills
- `GET /api/customers/me/usage-history` - Get usage data

---

## 💳 **5. PAYMENT PAGE** (http://localhost:3000/customer/pay-bill)

```
╔════════════════════════════════════════════════════════════════╗
║  💰 Pay Your Water Bill                                        ║
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  Bill Details:                                                  ║
║  ┌─────────────────────────────────────────────────────────┐  ║
║  │  Bill ID: #B001                                          │  ║
║  │  Billing Period: May 2026                                │  ║
║  │  Water Usage: 12,500 Liters                              │  ║
║  │  Amount Due: M 450.00                                    │  ║
║  │  Due Date: 15 May 2026                                   │  ║
║  └─────────────────────────────────────────────────────────┘  ║
║                                                                 ║
║  Payment Method:                                                ║
║  ┌─────────────────────────────────────────────────────────┐  ║
║  │  ○ Credit/Debit Card (Stripe)                           │  ║
║  │  ○ Mobile Money                                          │  ║
║  │  ○ Bank Transfer                                         │  ║
║  └─────────────────────────────────────────────────────────┘  ║
║                                                                 ║
║  Card Details:                                                  ║
║  ┌─────────────────────────────────────────────────────────┐  ║
║  │  Card Number:    [____-____-____-____]                  │  ║
║  │  Expiry:         [MM/YY]  CVV: [___]                    │  ║
║  │  Cardholder:     [_________________________]            │  ║
║  └─────────────────────────────────────────────────────────┘  ║
║                                                                 ║
║  [        Pay M 450.00        ]                                ║
║                                                                 ║
║  🔒 Secure payment powered by Stripe                           ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
```

**API Calls:**
- `POST /api/payments/create-payment-intent` - Initialize payment
- `POST /api/payments/confirm` - Confirm payment

---

## 👨‍💼 **6. ADMINISTRATOR DASHBOARD** (http://localhost:3000/admin/dashboard)

```
╔════════════════════════════════════════════════════════════════════════════╗
║  🌊 WASCO Admin Portal                      👨‍💼 Admin | 🔔 | 🚪 Logout     ║
╠════════════════════════════════════════════════════════════════════════════╣
║  [Dashboard] [Customers] [Billing Rates] [Bills] [Payments] [Reports]     ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  📊 System Overview                                                         ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    ║
║  │ 👥 Customers │ │ 💰 Revenue   │ │ 📋 Bills     │ │ 💧 Usage     │    ║
║  │   15,847     │ │  M 2.4M      │ │   12,450     │ │  1.2M Liters │    ║
║  │   +125 new   │ │  +8% MTD     │ │   85% paid   │ │  +5% vs last │    ║
║  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘    ║
║                                                                             ║
║  👥 Customer Management                              [+ Add New Customer]  ║
║  ┌────────────────────────────────────────────────────────────────────┐   ║
║  │ ID    │ Name          │ District  │ Type        │ Status  │ Action │   ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ C001  │ John Doe      │ Maseru    │ Residential │ Active  │ [Edit] │   ║
║  │ C002  │ ABC Store     │ Berea     │ Commercial  │ Active  │ [Edit] │   ║
║  │ C003  │ XYZ Factory   │ Leribe    │ Industrial  │ Active  │ [Edit] │   ║
║  └────────────────────────────────────────────────────────────────────┘   ║
║                                                                             ║
║  💰 Billing Rates Management                         [+ Add New Rate]      ║
║  ┌────────────────────────────────────────────────────────────────────┐   ║
║  │ Type        │ Tier      │ Range (L)    │ Rate/Unit │ Action        │   ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ Residential │ Tier 1    │ 0 - 10,000   │ M 0.025   │ [Edit][Delete]│   ║
