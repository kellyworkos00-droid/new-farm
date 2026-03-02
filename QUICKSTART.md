# Poultry Farm Management App - Quick Start Guide

## 👋 Welcome!

Your **single-user** poultry farm management application is ready to use! This app is designed specifically for one farmer to manage their entire poultry farm operation.

## 📂 Project Location

Your project is located at:
```
C:\Users\zachn\OneDrive\Desktop\poultry-farm-app
```

## 🚀 Getting Started

### Step 1: Access the Application

The development server should be running. Open your browser and go to:
```
http://localhost:3000
```

If it's not running, start it with:
```bash
cd "C:\Users\zachn\OneDrive\Desktop\poultry-farm-app"
npm run dev
```

### Step 2: Create Your Account (First Time Only)

1. Click **"Register"** on the login page
2. Enter your details:
   - **Name**: Your full name
   - **Email**: Your email address (e.g., farmer@myemail.com)
   - **Password**: Choose a secure password

3. Click **"Register"** button

You'll be automatically logged in and redirected to the dashboard!

### Step 3: Set Up Your Farm Profile

After registering, you'll see a yellow box asking you to set up your farm:

1. Enter your **Farm Name** (e.g., "Green Valley Poultry Farm")
2. Enter your **Location** (e.g., "Springfield County")
3. Click **"Create Farm"**

Now you're ready to start tracking everything!

## 📋 What You Can Track

### 1. **Profile** Tab
View your user details:
- Your name and email
- User ID
- Account information

### 2. **Coops/Houses** Tab
- Add multiple coops or houses
- Set capacity for each coop
- Track which birds are in which coop

### 3. **Egg Production** Tab
Log daily egg collection:
- Select coop
- Enter date and quantity
- Specify egg grade (Large, Medium, Small, Jumbo)
- Add notes

### 4. **Health Records** Tab
Track bird health:
- Mortality records
- Illness reports
- Vaccinations
- Treatments
- Number of birds affected

### 5. **Feed Management** Tab
Monitor feed usage:
- Feed type (e.g., Layer Pellets, Grains)
- Quantity in kg
- Cost per batch
- Supplier information

### 6. **Medications** Tab
Record all medications and vaccines:
- Vaccination records
- Medicine administration
- Supplements
- Dosage information
- Costs

### 7. **Financial Records** Tab
Track your farm finances:
- **Income**: Egg sales, etc.
- **Expenses**: Feed, medicine, labor, etc.
- View total income, expenses, and net profit
- Detailed transaction history

## 🔐 Your Login Details

After you register, **save your login details**:
- Email: (the email you used to register)
- Password: (the password you chose)

Use these details to log in every time you access the app.

### View Your Details Anytime:
Click the **"Profile"** tab in the dashboard to see your user information.

## 💡 Daily Workflow Example

### Morning Routine:
1. Log in to the app
2. Go to **Egg Production** tab
3. Click **"+ Add Record"**
4. Select the coop, enter today's date and egg count
5. Click **"Add Record"**

### When Feeding Birds:
1. Go to **Feed Management** tab
2. Click **"+ Add Record"**
3. Enter feed details and quantity used
4. Click **"Add Record"**

### When Health Issues Occur:
1. Go to **Health Records** tab
2. Click **"+ Add Record"**
3. Select type (illness/mortality/treatment)
4. Add details
5. Click **"Add Record"**

### When Selling Eggs or Buying Supplies:
1. Go to **Financial Records** tab
2. Click **"+ Add Record"**
3. Select Income or Expense
4. Enter details and amount
5. Click **"Add Record"**

## 📊 Viewing Your Records

All records are displayed in tables on their respective tabs. You can see:
- Complete history of all entries
- Summary statistics (especially in Financial Records)
- Color-coded information for easy reading

## 🛠️ If You Need to Restart the Server

If you close your terminal or the server stops:

1. Open PowerShell
2. Navigate to the project:
   ```bash
   cd "C:\Users\zachn\OneDrive\Desktop\poultry-farm-app"
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
4. Access at: http://localhost:3000

## 🔧 Your Login Credentials

**Important**: This is a single-user application. Your account is the only account that will access this system.

Your login details are:
- **Email**: (the email you registered with)
- **Password**: (the password you created)

💡 **Tip**: Store these details securely. If you forget your password, you'll need to reset the database or contact support.

## 🐛 Troubleshooting

### Can't Log In?
- Double-check your email and password
- Make sure you completed registration
- Check the browser console (F12) for errors

### Server Not Running?
```bash
cd "C:\Users\zachn\OneDrive\Desktop\poultry-farm-app"
npm run dev
```

### Need to Reset Everything?
```bash
npx prisma migrate reset
```
**Warning**: This deletes all data!

## 📞 Key Files

- **Database**: `dev.db` (your SQLite database with all records)
- **Environment**: `.env` (contains your database URL and secret key)
- **Login Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard

## 🎉 You're All Set!

Your single-user poultry farm management system is ready. Create your account, set up your farm, and start managing your poultry operation efficiently!

---
**Happy Farming! 🐔**
