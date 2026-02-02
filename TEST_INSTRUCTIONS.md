# Testing Hotel Separation - Step by Step

## The Fix Applied

**Problem Identified:** The JWT token did NOT include `hotelIds`, so when the backend tried to filter rooms by hotel, it received an empty array and showed all rooms to everyone.

**Solution:** Updated the JWT payload and validation strategy to include `hotelIds`.

Files modified:
- [backend/src/auth/auth.service.ts](backend/src/auth/auth.service.ts) - Added `hotelIds` to JWT payload
- [backend/src/auth/strategies/jwt.strategy.ts](backend/src/auth/strategies/jwt.strategy.ts) - Added `hotelIds` to validated user object

## Testing Steps

### ⚠️ IMPORTANT: You must log out and log back in for the fix to take effect!

The old JWT tokens don't have `hotelIds` in them. You need to get a new token.

### Step 1: Clear All Sessions
1. Open your browser
2. Open Developer Tools (F12 or Cmd+Option+I)
3. Go to Application/Storage tab
4. Clear all localStorage data
5. Close all browser tabs for the booking app

### Step 2: Test Hotel A
1. Go to `http://localhost:3000/register`
2. Register a new hotel admin:
   ```
   Name: Hotel A Manager
   Email: hotelA@test.com
   Password: password123
   Role: Hotel Admin
   Hotel Name: Grand Hotel A
   Hotel Location: New York, NY
   ```
3. You'll be redirected to `/hotel`
4. Click on "Room Management" tab
5. Add a room:
   ```
   Room Number: 101
   Type: Deluxe Suite
   Price: 200
   Capacity: 2
   ```
6. **Verify:** You should see "Room 101" in the list
7. **Note the user:** You're logged in as hotelA@test.com
8. **Log out**

### Step 3: Test Hotel B
1. Go to `http://localhost:3000/register`
2. Register another hotel admin:
   ```
   Name: Hotel B Manager
   Email: hotelB@test.com
   Password: password123
   Role: Hotel Admin
   Hotel Name: Paradise Hotel B
   Hotel Location: Los Angeles, CA
   ```
3. You'll be redirected to `/hotel`
4. Click on "Room Management" tab
5. **Verify:** You should see "No rooms available" (NOT Room 101 from Hotel A) ✅
6. Add a room:
   ```
   Room Number: 201
   Type: Ocean View
   Price: 300
   Capacity: 4
   ```
7. **Verify:** You should see ONLY "Room 201" (NOT Room 101) ✅

### Step 4: Verify Isolation
1. Log out from Hotel B
2. Log in as Hotel A (hotelA@test.com / password123)
3. Go to Room Management
4. **Verify:** You should see ONLY "Room 101" (NOT Room 201) ✅
5. Log out
6. Log in as Hotel B (hotelB@test.com / password123)
7. Go to Room Management
8. **Verify:** You should see ONLY "Room 201" (NOT Room 101) ✅

## Expected Results

✅ **Hotel A sees ONLY Hotel A's rooms**
✅ **Hotel B sees ONLY Hotel B's rooms**
✅ **Complete isolation between hotels**
✅ **Each hotel can have rooms with the same room number (e.g., both can have Room 101)**

## Debugging Tips

### If you still see all rooms:
1. **Check you're logged in with a NEW token:**
   - Open Developer Tools → Application → Local Storage
   - Check `auth-storage` 
   - The user object should have `hotelIds` array with at least one ID
   
2. **Check the API request:**
   - Open Developer Tools → Network tab
   - Make a request to `/api/rooms`
   - Check the Authorization header has a Bearer token
   - Check the response - it should only contain rooms for your hotel

3. **Verify in database:**
   ```bash
   cd backend
   node -e "
   const { MongoClient } = require('mongodb');
   require('dotenv').config();
   const client = new MongoClient(process.env.MONGODB_URI);
   client.connect().then(() => {
     const db = client.db('hotel-booking');
     db.collection('rooms').find({}).toArray().then(rooms => {
       console.log('All Rooms:');
       rooms.forEach(r => console.log(\`Room \${r.roomNumber} -> Hotel: \${r.hotelId}\`));
       client.close();
     });
   });
   "
   ```

### If rooms don't show up at all:
1. Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)
2. Check browser console for errors
3. Verify backend is running: `http://localhost:3001/api`

## Technical Verification

You can verify the JWT token includes hotelIds:

1. Copy your token from localStorage (auth-storage → state → token)
2. Go to https://jwt.io
3. Paste the token
4. Check the payload - you should see:
   ```json
   {
     "email": "hotelA@test.com",
     "sub": "...",
     "role": "hotel_admin",
     "hotelIds": ["697f..."]
   }
   ```

## Status

✅ **Fix Applied and Deployed**
- Backend restarted automatically
- New logins will get tokens with hotelIds
- Room filtering will work correctly

**Next Step:** Test with fresh logins to verify the fix!
