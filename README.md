# Delete all Tweets
A browser script to automatically delete all your tweets, retweets, and likes on X (ex-Twitter). Easily clean up your profile. Use AYOR!

# 🐦 X (formerly Twitter) Tweet Deleter

Automatically delete tweets, retweets, and likes from your Twitter/X account using this simple browser script.

---

## 📌 Features

- Deletes tweets, retweets, and likes automatically.
- Handles Twitter/X rate limits (auto-pauses when needed).
- Works directly in your browser’s console (no third-party apps).

---

## ⚠️ Disclaimer

Use this script at your own risk!  
Deleted tweets cannot be recovered. Ensure you backup important tweets beforehand. The author is not responsible for any misuse or data loss.

---

## 🚩 How to Use

1. Log into [Twitter/X](https://twitter.com) and visit your profile page (`https://twitter.com/your_username`).
2. Press F12 (or `Ctrl+Shift+I`) to open your browser’s Developer Console.
3. Paste the script into the console and hit Enter.
4. The script runs automatically. Monitor the console for progress updates.

---

## ⚙️ Customizing

Adjust these constants at the top of the script if Twitter/X changes rate limits:

```js
const MAX_ACTIONS = 50; // actions before pausing
const RATE_LIMIT_PAUSE = 15 * 60 * 1000; // pause duration (milliseconds)
