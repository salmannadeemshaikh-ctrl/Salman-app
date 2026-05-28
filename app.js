// ============ STATE MANAGEMENT ============
let state = {
    wallet: 1000000,
    positions: [],
    niftyPrice: 22450.50,
    tradeHistory: [],
    priceHistory: []
};

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Pro-Trade Terminal Initialized');
    updateMarket();
    setInterval(updateMarket, 1000);
    
    // Initial render
    renderOptionChain();
    updatePortfolio();
});

// ============ MARKET UPDATE FUNCTION ============
function updateMarket() {
    // Simulate realistic Nifty price movement with trend
    const randomChange = (Math.random() - 0.5) * 10;
    state.niftyPrice = Math.max(20000, state.niftyPrice + randomChange);
    
    // Store price history (keep last 100 prices for trend calculation)
    state.priceHistory.push(state.niftyPrice);
    if (state.priceHistory.length > 100) state.priceHistory.shift();
    
    // Calculate percentage change
    const openPrice = 22450;
    const changePercent = (((state.niftyPrice - openPrice) / openPrice) * 100).toFixed(2);
    const changeValue = (state.niftyPrice - openPrice).toFixed(2);
    
    // Update display
    document.getElementById('nifty-price').textContent = '₹' + state.niftyPrice.toFixed(2);
    
    const changeElement = document.getElementById('price-change');
    const changeText = `${changeValue > 0 ? '+' : ''}₹${changeValue} (${changePercent}%)`;
    changeElement.textContent = changeText;
    changeElement.className = changeValue > 0 ? 'info-value' : 'info-value danger';
    
    // Update UI components
    renderOptionChain();
    updatePortfolio();
}

// ============ OPTION CHAIN RENDERING ============
function renderOptionChain() {
    const tableBody = document.getElementById('chain-body');
    if (!tableBody) return;
    
    let html = '';
    let atmStrike = Math.round(state.niftyPrice / 50) * 50;

    for (let i = -5; i <= 5; i++) {
        const strike = atmStrike + (i * 50);
        
        // Price calculation based on moneyness
        const cePrice = calculateOptionPrice(state.niftyPrice, strike, 'CE');
        const pePrice = calculateOptionPrice(state.niftyPrice, strike, 'PE');

        // Highlight ATM strike
        const isAtm = i === 0 ? 'style="background-color: rgba(241, 196, 15, 0.15);"' : '';

        html += `
            <tr ${isAtm}>
                <td>
                    <button class="btn-buy" onclick="buyOption('${strike}', 'CE', ${cePrice})">
                        ₹${cePrice.toFixed(2)}
                    </button>
                </td>
                <td class="strike-price">${strike}</td>
                <td>
                    <button class="btn-buy" onclick="buyOption('${strike}', 'PE', ${pePrice})">
                        ₹${pePrice.toFixed(2)}
                    </button>
                </td>
            </tr>
        `;
    }
    
    tableBody.innerHTML = html;
}

// ============ OPTION PRICE CALCULATION ============
function calculateOptionPrice(spotPrice, strike, type) {
    const diff = spotPrice - strike;
    let intrinsicValue = 0;
    
    if (type === 'CE') {
        intrinsicValue = Math.max(0, diff);
    } else {
        intrinsicValue = Math.max(0, -diff);
    }
    
    // Time value (theta decay)
    const timeValue = Math.max(5, 120 - Math.abs(diff) / 50);
    
    // Random volatility component
    const volatilityComponent = Math.random() * 10;
    
    return intrinsicValue + timeValue + volatilityComponent;
}

// ============ BUY OPTION FUNCTION ============
function buyOption(strike, type, price) {
    const cost = 50 * price; // 1 lot = 50 quantity
    
    // Validation
    if (isNaN(price) || price <= 0) {
        showNotification('Invalid price', 'error');
        return;
    }
    
    if (cost > state.wallet) {
        showNotification('❌ Insufficient Balance! Required: ₹' + cost.toLocaleString(), 'error');
        return;
    }
    
    // Deduct cost from wallet
    state.wallet -= cost;
    
    // Add position
    const position = {
        id: Date.now(),
        strike: parseInt(strike),
        type: type,
        entry: parseFloat(price),
        qty: 50,
        entryTime: new Date(),
        currentLtp: parseFloat(price)
    };
    
    state.positions.push(position);
    
    // Add to trade history
    addTradeHistory('BUY', strike, type, price, 50);
    
    // Show notification
    showNotification(`✓ Bought ${type} @ ₹${price.toFixed(2)}`, 'success');
    
    // Update UI
    updatePortfolio();
    document.getElementById('wallet-balance').textContent = '₹' + state.wallet.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

// ============ EXIT POSITION FUNCTION ============
function exitPosition(positionId) {
    const index = state.positions.findIndex(p => p.id === positionId);
    if (index === -1) return;
    
    const position = state.positions[index];
    const exitPrice = position.currentLtp;
    const revenue = position.qty * exitPrice;
    const pnl = revenue - (position.entry * position.qty);
    
    // Add revenue back to wallet
    state.wallet += revenue;
    
    // Add to trade history
    addTradeHistory('SELL', position.strike, position.type, exitPrice, position.qty);
    
    // Remove position
    state.positions.splice(index, 1);
    
    // Show notification
    const pnlText = pnl >= 0 ? `+₹${pnl.toFixed(2)}` : `-₹${Math.abs(pnl).toFixed(2)}`;
    showNotification(`✓ Position Closed | P&L: ${pnlText}`, 'success');
    
    // Update UI
    updatePortfolio();
    document.getElementById('wallet-balance').textContent = '₹' + state.wallet.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

// ============ PORTFOLIO UPDATE FUNCTION ============
function updatePortfolio() {
    const portDiv = document.getElementById('portfolio-list');
    if (!portDiv) return;
    
    if (state.positions.length === 0) {
        portDiv.innerHTML = '<div class="empty-state">No active positions</div>';
        document.getElementById('position-count').textContent = '0';
        document.getElementById('total-pnl').textContent = '₹0.00';
        return;
    }
    
    let html = '';
    let totalPnL = 0;
    
    state.positions.forEach(pos => {
        // Calculate current LTP
        pos.currentLtp = calculateOptionPrice(state.niftyPrice, pos.strike, pos.type);
        
        // Calculate P&L
        const pnl = (pos.currentLtp - pos.entry) * pos.qty;
        totalPnL += pnl;
        
        // Calculate percentage return
        const returnPercent = ((pnl / (pos.entry * pos.qty)) * 100).toFixed(2);
        
        // Format time
        const timeElapsed = getTimeElapsed(pos.entryTime);
        
        // P&L styling
        const pnlClass = pnl >= 0 ? 'positive' : 'negative';
        const pnlSign = pnl >= 0 ? '+' : '';
        
        html += `
            <div class="position-item">
                <div class="position-header">
                    <div class="position-title">
                        <span>NIFTY ${pos.strike}</span>
                        <span class="type-badge ${pos.type.toLowerCase()}">${pos.type}</span>
                    </div>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">${timeElapsed}</span>
                </div>
                
                <div class="position-details">
                    <div class="detail-row">
                        <span class="detail-label">Entry</span>
                        <span class="detail-value">₹${pos.entry.toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Current</span>
                        <span class="detail-value">₹${pos.currentLtp.toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Qty</span>
                        <span class="detail-value">${pos.qty}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Margin</span>
                        <span class="detail-value">₹${(pos.entry * pos.qty).toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="pnl-display ${pnlClass}">
                    ${pnlSign}₹${Math.abs(pnl).toFixed(2)} (${pnlSign}${returnPercent}%)
                </div>
                
                <button class="btn-exit" onclick="exitPosition(${pos.id})">
                    EXIT @ ₹${pos.currentLtp.toFixed(2)}
                </button>
            </div>
        `;
    });
    
    portDiv.innerHTML = html;
    
    // Update stats
    document.getElementById('position-count').textContent = state.positions.length;
    const totalPnLElement = document.getElementById('total-pnl');
    totalPnLElement.textContent = (totalPnL >= 0 ? '+' : '') + '₹' + totalPnL.toFixed(2);
    totalPnLElement.className = totalPnL >= 0 ? 'stat-value' : 'stat-value negative';
}

// ============ TRADE HISTORY ============
function addTradeHistory(action, strike, type, price, qty) {
    const trade = {
        action,
        strike,
        type,
        price,
        qty,
        timestamp: new Date(),
        time: new Date().toLocaleTimeString('en-IN')
    };
    
    state.tradeHistory.unshift(trade);
    if (state.tradeHistory.length > 20) state.tradeHistory.pop();
    
    updateTradeHistoryDisplay();
}

function updateTradeHistoryDisplay() {
    const historyDiv = document.getElementById('trade-history');
    
    if (state.tradeHistory.length === 0) {
        historyDiv.innerHTML = '<div class="empty-state">No trades yet</div>';
        return;
    }
    
    let html = '';
    state.tradeHistory.forEach(trade => {
        const actionClass = trade.action === 'BUY' ? 'buy' : 'sell';
        html += `
            <div class="history-item">
                <div>
                    <span class="history-type ${actionClass}">${trade.action}</span>
                    <span>${trade.type} @ ₹${trade.price.toFixed(2)}</span>
                </div>
                <span style="color: var(--text-secondary); font-size: 0.75rem;">${trade.time}</span>
            </div>
        `;
    });
    
    historyDiv.innerHTML = html;
}

// ============ NOTIFICATION SYSTEM ============
function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// ============ UTILITY FUNCTIONS ============
function getTimeElapsed(startTime) {
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000); // difference in seconds
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
}

// ============ LOGGING ============
console.log('📊 Pro-Trade Terminal Loaded Successfully');
console.log('💰 Starting Capital: ₹10,00,000');
console.log('📈 Market Update Interval: 1000ms');
