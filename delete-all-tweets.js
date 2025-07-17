/**
 * Delete all tweets script by k-o.pro
 */
(async function deleteAllTweets() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const MAX_ACTIONS = 50;
  const RATE_LIMIT_PAUSE = 15 * 60 * 1000; // 15 min
  let actionCount = 0;
  
  // Wait for a selector to appear (or timeout)
  async function waitFor(selector, timeout = 5000, interval = 200) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector);
      if (el) return el;
      await delay(interval);
    }
    return null;
  }

  // Pause if we've hit roughly 50 clicks
  async function handleRateLimit() {
    if (actionCount >= MAX_ACTIONS) {
      console.log(`⏸ Rate-limit threshold reached (${actionCount} actions). Pausing for 15 min…`);
      await delay(RATE_LIMIT_PAUSE);
      actionCount = 0;
      console.log('▶️ Resuming now.');
    }
  }

  // Perform all available actions on currently loaded tweets
  async function processBatch() {
    const tweets = document.querySelectorAll('[data-testid="cellInnerDiv"]');
    console.log(`Processing ${tweets.length} tweets in view…`);
    
    for (const tweet of tweets) {
      try {
        // 1) Unlike if liked
        const unlikeBtn = tweet.querySelector('[data-testid="unlike"]');
        if (unlikeBtn) {
          unlikeBtn.click();
          console.log('– Unliked');
          actionCount++; await delay(300); await handleRateLimit();
        }

        // 2) Un-retweet if retweeted
        const unrt = tweet.querySelector('[data-testid="unretweet"]');
        if (unrt) {
          unrt.click();
          await delay(300);
          // Confirmation appears as a menu item
          const confirmUnrt = await waitFor('[data-testid="confirmationSheetDialog"] [role="menuitem"]', 2000);
          if (confirmUnrt) {
            confirmUnrt.click();
            console.log('– Un-retweeted');
            actionCount++; await delay(300); await handleRateLimit();
          }
        }

        // 3) Delete original tweet
        const menuCaret = tweet.querySelector('[data-testid="caret"]');
        if (menuCaret) {
          menuCaret.click();
          await delay(300);
          const dropdown = await waitFor('[data-testid="Dropdown"]', 2000);
          if (dropdown) {
            // Find the “Delete” entry by text
            const delItem = Array.from(dropdown.querySelectorAll('[role="menuitem"] span'))
              .find(el => el.textContent === 'Delete');
            if (delItem) {
              delItem.click();
              await delay(300);
              const confirmDel = await waitFor('[data-testid="confirmationSheetConfirm"]', 2000);
              if (confirmDel) {
                confirmDel.click();
                console.log('– Deleted tweet');
                actionCount++; await delay(300); await handleRateLimit();
              }
            }
          }
        }

      } catch (err) {
        console.warn('⚠️ Error on a tweet:', err);
      }
    }
  }

  console.log('🚀 Starting cleanup…');
  let prevCount = -1;

  // Loop until no new tweets load (or you reload/stop)
  while (true) {
    await processBatch();
    window.scrollBy(0, 2000);
    await delay(1000);

    // Check if new tweets appeared
    const currCount = document.querySelectorAll('[data-testid="cellInnerDiv"]').length;
    if (currCount === prevCount) {
      console.log('✅ No more tweets detected. Cleanup complete!');
      break;
    }
    prevCount = currCount;
  }
})();