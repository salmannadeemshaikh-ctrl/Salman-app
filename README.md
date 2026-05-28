# Pro-Trade Terminal - Advanced Options Trading Platform

A professional, fully responsive web-based options trading simulator built with HTML, CSS, and JavaScript. Perfect for learning options trading, backtesting strategies, and practicing paper trading without real money risk.

## 🚀 Features

### Landing Page (`index.html`)
- **Modern Dark Theme** - Professional premium UI design
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Feature Showcase** - Detailed feature descriptions
- **How It Works Section** - Step-by-step guide
- **Pricing Plans** - Free and Pro tier options
- **Call-to-Action** - Easy navigation to trading app

### Trading Terminal (`app.html`)
- **Live Option Chain** - Real-time NIFTY 50 option chain simulation
- **Virtual Wallet** - ₹10 lakhs paper trading capital
- **One-Click Trading** - Buy Call (CE) and Put (PE) options
- **Real-time P&L** - Track profits/losses instantly
- **Portfolio Management** - Manage active positions
- **Trade History** - Keep track of all trades
- **Auto-Refresh** - Live market data updates every second

## 📋 Project Structure

```
Salman-app/
├── index.html          # Landing page
├── app.html            # Trading terminal
├── style.css           # Global styling
├── script.js           # Interactive features
└── README.md           # Documentation
```

## 🎯 Quick Start

### Option 1: Local Development
1. Clone the repository
```bash
git clone https://github.com/salmannadeemshaikh-ctrl/Salman-app.git
cd Salman-app
```

2. Open in browser
```bash
# Using Python 3
python -m http.server 8000

# Or using Python 2
python -m SimpleHTTPServer 8000

# Or simply open index.html in your browser
open index.html
```

3. Visit `http://localhost:8000` in your browser

### Option 2: Deploy Online
- **GitHub Pages** (Free)
  ```bash
  git push origin main
  # Enable GitHub Pages in repository settings
  # Your site will be live at: https://username.github.io/Salman-app
  ```

- **Netlify** (Free with enhancements)
  - Connect your GitHub repo
  - Auto-deploy on push

- **Vercel** (Free)
  - Import from GitHub
  - One-click deployment

## 🎮 How to Use

### Trading Terminal
1. **View Market Data**
   - Check live NIFTY 50 spot price
   - Monitor available margin

2. **Execute Trades**
   - Click any Call (CE) price to BUY calls
   - Click any Put (PE) price to BUY puts
   - Each click buys 1 lot (50 quantity)

3. **Monitor Positions**
   - See all active positions in real-time
   - Track entry price vs current LTP
   - Monitor P&L for each position

4. **Exit Trades**
   - Click EXIT button on any position
   - Position settles at current market price
   - Profit/loss is calculated automatically

5. **Check History**
   - View all executed trades
   - Track your trading activity

## 💡 Features Explained

### Option Chain
The option chain shows:
- **STRIKE**: The exercise price of the option
- **CALL (CE)**: Call option prices (right to buy)
- **PUT (PE)**: Put option prices (right to sell)

Each row represents a different strike price centered around the spot price.

### P&L Calculation
```
P&L = (Current LTP - Entry Price) × Quantity
```
- **Green P&L**: Profitable positions
- **Red P&L**: Losing positions

### Virtual Wallet
- Starting capital: ₹10 lakhs
- Each trade deducts margin from wallet
- Exiting position returns proceeds to wallet
- Unlimited practice without real money

## 🎨 Customization

### Change Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --primary-color: #00ff88;      /* Green */
    --secondary-color: #ff4d4d;    /* Red */
    --dark-bg: #0e1117;            /* Dark background */
    --card-bg: #161a25;            /* Card background */
}
```

### Modify Starting Capital
In `app.html`, change:
```javascript
wallet: 1000000  // Change this value
```

### Update Strike Range
In the `generateOptionChain()` function:
```javascript
for (let i = -5; i <= 5; i++)  // Change range here
```

## 📊 API Integration (Future Enhancement)

To connect real market data:
1. Use NSE API or similar service
2. Replace simulated prices with real data
3. Connect to actual broker API for live trading

## 🔒 Disclaimer

- **Educational Purpose Only**: This platform is for learning and practice
- **No Real Money**: Uses virtual capital for paper trading
- **Not Investment Advice**: Consult professionals before real trading
- **Market Simulation**: Prices are simulated, not real market data

## 📱 Browser Compatibility

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers

## 🚀 Performance

- **Load Time**: < 1 second
- **Updates**: Every 1 second
- **Responsive**: Mobile-optimized
- **Lightweight**: No external dependencies

## 📞 Support & Feedback

- Report issues on GitHub
- Suggest features via discussions
- Join trading community for tips

## 📈 Learning Resources

Included learning materials for:
- Options basics
- Trading strategies
- Risk management
- Technical analysis

## 🔄 Version History

**v1.0** (Current)
- Landing page with features
- Full trading terminal
- Portfolio management
- Trade history

**Upcoming**
- Real market data integration
- Advanced charting
- Strategy backtester
- Mobile app

## 📄 License

MIT License - Feel free to use, modify, and distribute

## 👨‍💻 Creator

**Salman Nadeem Shaikh**
- GitHub: [@salmannadeemshaikh-ctrl](https://github.com/salmannadeemshaikh-ctrl)
- Project: Pro-Trade Terminal

---

**Happy Trading! 📈🚀**

Remember: Start small, practice often, learn continuously.

*This is a paper trading platform for educational purposes only.*
