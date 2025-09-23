# 🔐 Authentication Testing Guide

## 🧪 Step-by-Step Testing Process

### 1. **Test User Registration**
1. Go to http://localhost:3000/auth/register
2. Fill out the registration form:
   - **Name**: Your full name
   - **Email**: A valid email address
   - **Password**: At least 8 characters
3. Click "Create Account"
4. **Expected Results**:
   - ✅ Should redirect to `/polls` after successful registration
   - ✅ Should show your name in the navigation
   - ✅ Should be able to create polls

### 2. **Test User Login**
1. Go to http://localhost:3000/auth/login
2. Fill out the login form:
   - **Email**: The email you used for registration
   - **Password**: The password you used for registration
3. Click "Sign In"
4. **Expected Results**:
   - ✅ Should redirect to `/polls` after successful login
   - ✅ Should show your name in the navigation
   - ✅ Should be able to create polls

### 3. **Test Authentication State Persistence**
1. After logging in, refresh the page
2. **Expected Results**:
   - ✅ Should remain logged in
   - ✅ Should still show your name in navigation
   - ✅ Should not redirect to login page

### 4. **Test Logout**
1. Click "Sign Out" in the navigation
2. **Expected Results**:
   - ✅ Should redirect to `/polls`
   - ✅ Should show "Sign In" and "Sign Up" buttons
   - ✅ Should not be able to create polls (redirected to login)

### 5. **Test Protected Routes**
1. While logged out, try to go to `/create-poll`
2. **Expected Results**:
   - ✅ Should redirect to login page
   - ✅ After logging in, should redirect back to `/create-poll`

## 🐛 Common Issues & Solutions

### Issue: "Invalid login credentials"
- **Cause**: Wrong email/password or user doesn't exist
- **Solution**: Check email/password or register first

### Issue: "Email not confirmed"
- **Cause**: Supabase requires email confirmation by default
- **Solution**: Check your email for confirmation link, or disable email confirmation in Supabase

### Issue: "User already registered"
- **Cause**: Email already exists in database
- **Solution**: Use a different email or try logging in instead

### Issue: "Name is required for registration"
- **Cause**: Name field is empty
- **Solution**: Fill in the name field

## 🔧 Debugging Steps

1. **Check Browser Console**: Look for any error messages
2. **Check Network Tab**: Look for failed API requests
3. **Check Supabase Dashboard**: Verify user was created
4. **Check Environment Variables**: Ensure they're correct

## 📊 Expected Database Changes

After successful registration, you should see:
- New user in `auth.users` table in Supabase
- User metadata with the name field
- User should be able to create polls (stored in `polls` table)

## 🎯 Success Criteria

- ✅ Can register new users
- ✅ Can login with existing users
- ✅ Authentication state persists across page refreshes
- ✅ Can logout successfully
- ✅ Protected routes redirect to login when not authenticated
- ✅ Navigation shows correct user state
- ✅ Can create polls when authenticated
