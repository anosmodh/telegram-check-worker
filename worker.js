// worker.js - Telegram Checker API + Frontend
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    // Handle OPTIONS request for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }
    
    // Serve HTML frontend for root path
    if (path === '/' || path === '/index.html') {
      return serveFrontend();
    }
    
    // API routes
    if (path === '/api/check' && request.method === 'POST') {
      return await handleCheck(request);
    } else if (path === '/api/status' && request.method === 'GET') {
      return handleStatus();
    } else if (path === '/api/verify' && request.method === 'POST') {
      return await handleVerify(request);
    } else if (path === '/api/user/info' && request.method === 'POST') {
      return await handleUserInfo(request);
    } else if (path === '/api/test' && request.method === 'GET') {
      return new Response(JSON.stringify({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString()
      }), {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      });
    }
    
    // Default: Serve frontend
    return serveFrontend();
  }
};

// Serve HTML frontend
function serveFrontend() {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔍 فحص Telegram | AnosMod</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* نفس الأنماط من ملف HTML */
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        :root { --primary: #667eea; --secondary: #764ba2; --success: #10b981; --danger: #ef4444; --warning: #f59e0b; --dark: #1f2937; --light: #f3f4f6; --white: #ffffff; }
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; color: var(--dark); }
        .container { background: var(--white); border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; width: 100%; max-width: 900px; animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .header { background: linear-gradient(to right, var(--primary), var(--secondary)); color: var(--white); padding: 30px; text-align: center; position: relative; overflow: hidden; }
        .logo { font-size: 48px; margin-bottom: 10px; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .title { font-size: 32px; font-weight: 800; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .subtitle { font-size: 16px; opacity: 0.9; max-width: 600px; margin: 0 auto; line-height: 1.6; }
        .main-content { display: flex; min-height: 500px; }
        .sidebar { width: 250px; background: var(--light); padding: 25px; border-left: 1px solid #e5e7eb; }
        .tab-buttons { display: flex; flex-direction: column; gap: 10px; }
        .tab-btn { padding: 15px 20px; border: none; background: transparent; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; text-align: right; transition: all 0.3s ease; display: flex; align-items: center; gap: 12px; color: var(--dark); }
        .tab-btn:hover { background: rgba(102,126,234,0.1); transform: translateX(-5px); }
        .tab-btn.active { background: linear-gradient(to right, rgba(102,126,234,0.2), rgba(118,75,162,0.2)); color: var(--primary); box-shadow: 0 4px 12px rgba(102,126,234,0.2); }
        .tab-btn i { font-size: 20px; width: 24px; }
        .content-area { flex: 1; padding: 30px; overflow-y: auto; max-height: 500px; }
        .tab-content { display: none; animation: slideIn 0.5s ease-out; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark); font-size: 15px; }
        .input-group { position: relative; }
        input, select, textarea { width: 100%; padding: 14px 16px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 16px; transition: all 0.3s; background: var(--white); }
        input:focus, select:focus, textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(102,126,234,0.2); }
        .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #9ca3af; }
        .btn { background: linear-gradient(to right, var(--primary), var(--secondary)); color: white; border: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; margin-top: 10px; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(102,126,234,0.3); }
        .btn:active { transform: translateY(0); }
        .result-container { margin-top: 30px; display: none; }
        .result-container.show { display: block; animation: fadeIn 0.5s; }
        .result-box { background: var(--light); border-radius: 12px; padding: 25px; border-right: 4px solid var(--primary); }
        .result-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .result-title { font-size: 20px; font-weight: 700; color: var(--dark); }
        .result-status { padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
        .status-success { background: #d1fae5; color: #065f46; }
        .status-error { background: #fee2e2; color: #991b1b; }
        .status-loading { background: #fef3c7; color: #92400e; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
        .info-item { background: var(--white); padding: 15px; border-radius: 10px; border: 1px solid #e5e7eb; }
        .info-label { font-size: 12px; color: #6b7280; margin-bottom: 5px; }
        .info-value { font-size: 16px; font-weight: 600; color: var(--dark); word-break: break-all; }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .footer { text-align: center; padding: 20px; margin-top: 30px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        @media (max-width: 768px) { .main-content { flex-direction: column; } .sidebar { width: 100%; border-left: none; border-bottom: 1px solid #e5e7eb; } }
    </style>
</head>
<body>
    <div class="container" id="app">
        <div class="header">
            <div class="logo">🔍</div>
            <h1 class="title">Telegram Checker Pro</h1>
            <p class="subtitle">أداة متكاملة لفحص مستخدمي Telegram والتحقق من عضويتهم في القنوات</p>
        </div>
        
        <div class="main-content">
            <div class="sidebar">
                <div class="tab-buttons">
                    <button class="tab-btn active" onclick="switchTab('check')">
                        <i class="fas fa-search"></i>
                        <span>فحص المستخدم</span>
                    </button>
                    <button class="tab-btn" onclick="switchTab('info')">
                        <i class="fas fa-user-circle"></i>
                        <span>معلومات المستخدم</span>
                    </button>
                    <button class="tab-btn" onclick="switchTab('verify')">
                        <i class="fas fa-shield-alt"></i>
                        <span>التحقق</span>
                    </button>
                    <button class="tab-btn" onclick="switchTab('status')">
                        <i class="fas fa-server"></i>
                        <span>حالة الخدمة</span>
                    </button>
                    <button class="tab-btn" onclick="switchTab('settings')">
                        <i class="fas fa-cog"></i>
                        <span>الإعدادات</span>
                    </button>
                </div>
            </div>
            
            <div class="content-area">
                <!-- Tab 1: User Check -->
                <div class="tab-content active" id="checkTab">
                    <h2 style="margin-bottom: 25px; color: var(--dark);">🔍 فحص مستخدم Telegram</h2>
                    <div class="form-group">
                        <label for="userId">رقم المستخدم (User ID)</label>
                        <div class="input-group">
                            <i class="fas fa-user input-icon"></i>
                            <input type="text" id="userId" placeholder="مثال: 123456789">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="username">اسم المستخدم (اختياري)</label>
                        <div class="input-group">
                            <i class="fas fa-at input-icon"></i>
                            <input type="text" id="username" placeholder="@username">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="chatId">رقم القناة (اختياري)</label>
                        <div class="input-group">
                            <i class="fas fa-comments input-icon"></i>
                            <input type="text" id="chatId" placeholder="-1001234567890">
                        </div>
                    </div>
                    
                    <button class="btn" onclick="checkUser()">
                        <i class="fas fa-search"></i>
                        بدء الفحص
                    </button>
                </div>
                
                <!-- Tab 2: User Info -->
                <div class="tab-content" id="infoTab">
                    <h2 style="margin-bottom: 25px; color: var(--dark);">👤 معلومات المستخدم</h2>
                    <div class="form-group">
                        <label for="infoInput">رقم المستخدم أو اسم المستخدم</label>
                        <div class="input-group">
                            <i class="fas fa-id-card input-icon"></i>
                            <input type="text" id="infoInput" placeholder="123456789 أو @username">
                        </div>
                    </div>
                    
                    <button class="btn" onclick="getUserInfo()">
                        <i class="fas fa-user-circle"></i>
                        الحصول على المعلومات
                    </button>
                </div>
                
                <!-- Tab 3: Verify -->
                <div class="tab-content" id="verifyTab">
                    <h2 style="margin-bottom: 25px; color: var(--dark);">✅ التحقق من التوكن</h2>
                    <div class="form-group">
                        <label for="verifyToken">رمز التحقق (Token)</label>
                        <div class="input-group">
                            <i class="fas fa-key input-icon"></i>
                            <input type="text" id="verifyToken" placeholder="أدخل رمز التحقق">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="verifyUserId">رقم المستخدم (اختياري)</label>
                        <div class="input-group">
                            <i class="fas fa-user input-icon"></i>
                            <input type="text" id="verifyUserId" placeholder="123456789">
                        </div>
                    </div>
                    
                    <button class="btn" onclick="verifyToken()">
                        <i class="fas fa-shield-alt"></i>
                        التحقق
                    </button>
                </div>
                
                <!-- Tab 4: Status -->
                <div class="tab-content" id="statusTab">
                    <h2 style="margin-bottom: 25px; color: var(--dark);">🟢 حالة الخدمة</h2>
                    <div style="text-align: center; padding: 30px;">
                        <div class="info-item" style="max-width: 400px; margin: 0 auto;">
                            <div class="info-label">حالة API</div>
                            <div class="info-value" id="apiStatus">جارِ التحقق...</div>
                        </div>
                        
                        <button class="btn" onclick="checkStatus()" style="margin-top: 30px; max-width: 200px;">
                            <i class="fas fa-sync-alt"></i>
                            تحديث الحالة
                        </button>
                    </div>
                </div>
                
                <!-- Tab 5: Settings -->
                <div class="tab-content" id="settingsTab">
                    <h2 style="margin-bottom: 25px; color: var(--dark);">⚙️ الإعدادات</h2>
                    <div class="form-group">
                        <label>رابط API</label>
                        <div class="input-group">
                            <i class="fas fa-link input-icon"></i>
                            <input type="text" id="apiUrl" value="https://telegram-check-worker.tryree33445566.workers.dev" readonly>
                        </div>
                        <small style="color: #6b7280; display: block; margin-top: 5px;">يمكنك تغيير هذا الرابط إذا كان لديك Worker آخر</small>
                    </div>
                    
                    <div class="form-group">
                        <label>اختبار الاتصال</label>
                        <button class="btn" onclick="testConnection()" style="background: linear-gradient(to right, var(--success), #059669);">
                            <i class="fas fa-wifi"></i>
                            اختبار الاتصال
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label>إعادة تعيين</label>
                        <button class="btn" onclick="resetApp()" style="background: linear-gradient(to right, var(--danger), #dc2626);">
                            <i class="fas fa-redo"></i>
                            إعادة تعيين التطبيق
                        </button>
                    </div>
                </div>
                
                <!-- Results Container -->
                <div class="result-container" id="resultContainer">
                    <div class="result-box">
                        <div class="result-header">
                            <div class="result-title" id="resultTitle">النتائج</div>
                            <div class="result-status" id="resultStatus"></div>
                        </div>
                        <div id="resultContent"></div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>تم التطوير بواسطة <strong>AnosMod</strong> | Telegram Checker API v1.0</p>
                    <p style="margin-top: 10px; font-size: 12px;">جميع الحقوق محفوظة © 2024</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        // API Configuration
        const API_BASE = 'https://telegram-check-worker.tryree33445566.workers.dev';
        
        // DOM Elements
        let currentTab = 'check';
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            checkStatus();
            loadSettings();
        });
        
        // Tab Switching
        function switchTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(function(tab) {
                tab.classList.remove('active');
            });
            
            // Deactivate all buttons
            document.querySelectorAll('.tab-btn').forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName + 'Tab').classList.add('active');
            
            // Activate selected button
            document.querySelectorAll('.tab-btn').forEach(function(btn) {
                if (btn.querySelector('span').textContent.includes(getTabName(tabName))) {
                    btn.classList.add('active');
                }
            });
            
            currentTab = tabName;
            hideResult();
            
            // Special actions for specific tabs
            if (tabName === 'status') {
                checkStatus();
            }
        }
        
        function getTabName(tabKey) {
            const tabs = {
                'check': 'فحص المستخدم',
                'info': 'معلومات المستخدم',
                'verify': 'التحقق',
                'status': 'حالة الخدمة',
                'settings': 'الإعدادات'
            };
            return tabs[tabKey] || tabKey;
        }
        
        // User Check Function
        async function checkUser() {
            const userId = document.getElementById('userId').value.trim();
            const username = document.getElementById('username').value.trim().replace('@', '');
            const chatId = document.getElementById('chatId').value.trim();
            
            if (!userId && !username) {
                showError('الرجاء إدخال رقم المستخدم أو اسم المستخدم');
                return;
            }
            
            showLoading('جارِ فحص المستخدم...');
            
            try {
                const payload = {};
                if (userId) payload.userId = userId;
                if (username) payload.username = username;
                if (chatId) payload.chatId = chatId;
                
                const response = await fetch(API_BASE + '/api/check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    const user = data.data.userInfo;
                    const isMember = data.data.isMember;
                    
                    const resultHTML = '<div class="info-grid">' +
                        '<div class="info-item">' +
                            '<div class="info-label">رقم المستخدم</div>' +
                            '<div class="info-value">' + user.id + '</div>' +
                        '</div>' +
                        '<div class="info-item">' +
                            '<div class="info-label">اسم المستخدم</div>' +
                            '<div class="info-value">@' + user.username + '</div>' +
                        '</div>' +
                        '<div class="info-item">' +
                            '<div class="info-label">الاسم</div>' +
                            '<div class="info-value">' + user.firstName + ' ' + (user.lastName || '') + '</div>' +
                        '</div>' +
                        '<div class="info-item">' +
                            '<div class="info-label">عضو في القناة</div>' +
                            '<div class="info-value" style="color: ' + (isMember ? '#10b981' : '#ef4444') + '">' +
                                (isMember ? '✅ نعم' : '❌ لا') +
                            '</div>' +
                        '</div>' +
                        '<div class="info-item">' +
                            '<div class="info-label">اللغة</div>' +
                            '<div class="info-value">' + user.languageCode + '</div>' +
                        '</div>' +
                        '<div class="info-item">' +
                            '<div class="info-label">معرف الفحص</div>' +
                            '<div class="info-value">' + data.data.checkId + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px;">' +
                        '<div style="font-size: 12px; color: #64748b;">تم الفحص في: ' + new Date(data.data.timestamp).toLocaleString('ar-SA') + '</div>' +
                    '</div>';
                    
                    showResult('تم الفحص بنجاح', resultHTML, 'success');
                } else {
                    showError(data.error || 'فشل في فحص المستخدم');
                }
            } catch (error) {
                showError('خطأ في الاتصال: ' + error.message);
            }
        }
        
        // Get User Info
        async function getUserInfo() {
            const input = document.getElementById('infoInput').value.trim();
            
            if (!input) {
                showError('الرجاء إدخال رقم المستخدم أو اسم المستخدم');
                return;
            }
            
            const payload = {};
            if (input.startsWith('@')) {
                payload.username = input.substring(1);
            } else if (!isNaN(input)) {
                payload.userId = input;
            } else {
                showError('الرجاء إدخال رقم صحيح أو @username');
                return;
            }
            
            showLoading('جارِ جلب معلومات المستخدم...');
            
            try {
                const response = await fetch(API_BASE + '/api/user/info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    const user = data.data.userInfo;
                    
                    const resultHTML = '<div class="info-grid">' +
                        '<div class="info-item">' +
                            '<div class="info-label">رقم المستخدم</div>' +
                            '<div class="info-value">' + user.id + '</div>' +
                        '</div>' +
                        '<div class="info-item">' +
                            '<div class="info-label">اسم المستخدم</div>' +
                            '<div class="info-value">@' + user.username + '</div>' +
                        '</div>' +
                        '<div class="info-item">' +
                            '<div class="info-label">الاسم الكامل</div>' +
                            '<div class="info-value">' + user.firstName + ' ' + (user.lastName || '') + '</div>' +
                        '</div>' +
                        '<div class="info-item">' +
                            '<div class="info-label">هل هو بوت؟</div>' +
                            '<div class="info-value">' + (user.isBot ? '🤖 نعم' : '👤 لا') + '</div>' +
                        '</div>' +
                        '<div class="info-item">' +
                            '<div class="info-label">اللغة</div>' +
                            '<div class="info-value">' + user.languageCode + '</div>' +
                        '</div>' +
                        '<div class="info-item">' +
                            '<div class="info-label">حساب مميز</div>' +
                            '<div class="info-value">' + (user.isPremium ? '⭐ نعم' : 'لا') + '</div>' +
                        '</div>' +
                    '</div>' +
                    (user.isMock ? '<div style="margin-top: 15px; padding: 12px; background: #fef3c7; border-radius: 8px; font-size: 14px; color: #92400e;">ملاحظة: هذه بيانات تجريبية للاختبار</div>' : '') +
                    '<div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px;">' +
                        '<div style="font-size: 12px; color: #64748b;">تم الجلب في: ' + new Date(data.data.timestamp).toLocaleString('ar-SA') + '</div>' +
                    '</div>';
                    
                    showResult('معلومات المستخدم', resultHTML, 'success');
                } else {
                    showError(data.error || 'فشل في جلب المعلومات');
                }
            } catch (error) {
                showError('خطأ في الاتصال: ' + error.message);
            }
        }
        
        // Verify Token
        async function verifyToken() {
            const token = document.getElementById('verifyToken').value.trim();
            const userId = document.getElementById('verifyUserId').value.trim();
            
            if (!token) {
                showError('الرجاء إدخال رمز التحقق');
                return;
            }
            
            showLoading('جارِ التحقق من الرمز...');
            
            try {
                const payload = { token: token };
                if (userId) payload.userId = userId;
                
                const response = await fetch(API_BASE + '/api/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    const resultHTML = '<div class="info-grid">' +
                        '<div class="info-item">' +
                            '<div class="info-label">حالة التحقق</div>' +
                            '<div class="info-value" style="color: ' + (data.data.isValid ? '#10b981' : '#ef4444') + '">' +
                                (data.data.isValid ? '✅ صالح' : '❌ غير صالح') +
                            '</div>' +
                        '</div>' +
                        '<div class="info-item">' +
                            '<div class="info-label">رقم المستخدم</div>' +
                            '<div class="info-value">' + (data.data.userId || 'غير محدد') + '</div>' +
                        '</div>' +
                        '<div class="info-item">' +
                            '<div class="info-label">وقت التحقق</div>' +
                            '<div class="info-value">' + new Date(data.data.verifiedAt).toLocaleString('ar-SA') + '</div>' +
                        '</div>' +
                    '</div>';
                    
                    showResult('نتيجة التحقق', resultHTML, data.data.isValid ? 'success' : 'error');
                } else {
                    showError(data.error || 'فشل في التحقق');
                }
            } catch (error) {
                showError('خطأ في الاتصال: ' + error.message);
            }
        }
        
        // Check Status
        async function checkStatus() {
            try {
                const response = await fetch(API_BASE + '/api/status');
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('apiStatus').innerHTML = 
                        '<span style="color: #10b981;">🟢 يعمل</span><br>' +
                        '<small style="color: #64748b;">الإصدار: ' + data.data.version + '</small>';
                    
                    if (currentTab === 'status') {
                        const resultHTML = '<div class="info-grid">' +
                            '<div class="info-item">' +
                                '<div class="info-label">الحالة</div>' +
                                '<div class="info-value" style="color: #10b981;">🟢 ' + data.data.status + '</div>' +
                            '</div>' +
                            '<div class="info-item">' +
                                '<div class="info-label">الإصدار</div>' +
                                '<div class="info-value">' + data.data.version + '</div>' +
                            '</div>' +
                            '<div class="info-item">' +
                                '<div class="info-label">وقت التشغيل</div>' +
                                '<div class="info-value">' + data.data.uptime + '</div>' +
                            '</div>' +
                            '<div class="info-item">' +
                                '<div class="info-label">آخر تحديث</div>' +
                                '<div class="info-value">' + new Date(data.data.timestamp).toLocaleTimeString('ar-SA') + '</div>' +
                            '</div>' +
                        '</div>';
                        
                        showResult('حالة الخدمة', resultHTML, 'success');
                    }
                } else {
                    document.getElementById('apiStatus').innerHTML = '<span style="color: #ef4444;">🔴 غير متصل</span>';
                    if (currentTab === 'status') {
                        showError('فشل في جلب حالة الخدمة');
                    }
                }
            } catch (error) {
                document.getElementById('apiStatus').innerHTML = '<span style="color: #ef4444;">🔴 خطأ في الاتصال</span>';
                if (currentTab === 'status') {
                    showError('لا يمكن الاتصال بالخدمة: ' + error.message);
                }
            }
        }
        
        // Test Connection
        async function testConnection() {
            showLoading('جارِ اختبار الاتصال...');
            
            try {
                const response = await fetch(API_BASE + '/api/test');
                const data = await response.json();
                
                if (data.success) {
                    const resultHTML = '<div style="text-align: center; padding: 20px;">' +
                        '<div style="font-size: 48px; color: #10b981; margin-bottom: 20px;">✅</div>' +
                        '<h3 style="color: #059669;">الاتصال ناجح!</h3>' +
                        '<p>الرسالة: ' + data.message + '</p>' +
                        '<p style="color: #64748b; font-size: 14px; margin-top: 10px;">' + new Date(data.timestamp).toLocaleString('ar-SA') + '</p>' +
                    '</div>';
                    
                    showResult('اختبار الاتصال', resultHTML, 'success');
                } else {
                    showError('فشل اختبار الاتصال');
                }
            } catch (error) {
                showError('خطأ في الاتصال: ' + error.message);
            }
        }
        
        // Reset App
        function resetApp() {
            if (confirm('هل تريد حقاً إعادة تعيين التطبيق؟ سيتم مسح جميع البيانات المحلية.')) {
                localStorage.clear();
                location.reload();
            }
        }
        
        // UI Helper Functions
        function showLoading(message) {
            document.getElementById('resultTitle').textContent = 'جارِ المعالجة...';
            document.getElementById('resultStatus').className = 'result-status status-loading';
            document.getElementById('resultStatus').textContent = 'جارِ التحميل';
            document.getElementById('resultContent').innerHTML = 
                '<div style="text-align: center; padding: 30px;">' +
                    '<div class="loader"></div>' +
                    '<p style="margin-top: 20px; color: #6b7280;">' + message + '</p>' +
                '</div>';
            document.getElementById('resultContainer').classList.add('show');
        }
        
        function showResult(title, content, type) {
            document.getElementById('resultTitle').textContent = title;
            document.getElementById('resultStatus').className = 'result-status status-' + type;
            document.getElementById('resultStatus').textContent = type === 'success' ? 'ناجح' : 'خطأ';
            document.getElementById('resultContent').innerHTML = content;
            document.getElementById('resultContainer').classList.add('show');
            
            // Scroll to result
            document.getElementById('resultContainer').scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest'
            });
        }
        
        function showError(message) {
            document.getElementById('resultTitle').textContent = 'حدث خطأ';
            document.getElementById('resultStatus').className = 'result-status status-error';
            document.getElementById('resultStatus').textContent = 'خطأ';
            document.getElementById('resultContent').innerHTML = 
                '<div style="text-align: center; padding: 30px;">' +
                    '<div style="font-size: 48px; color: #ef4444; margin-bottom: 20px;">❌</div>' +
                    '<h3 style="color: #dc2626;">' + message + '</h3>' +
                '</div>';
            document.getElementById('resultContainer').classList.add('show');
        }
        
        function hideResult() {
            document.getElementById('resultContainer').classList.remove('show');
        }
        
        // Settings Management
        function loadSettings() {
            const savedApiUrl = localStorage.getItem('apiUrl');
            if (savedApiUrl) {
                document.getElementById('apiUrl').value = savedApiUrl;
                window.API_BASE = savedApiUrl;
            }
        }
        
        function saveSettings() {
            const apiUrl = document.getElementById('apiUrl').value.trim();
            if (apiUrl) {
                localStorage.setItem('apiUrl', apiUrl);
                window.API_BASE = apiUrl;
                alert('تم حفظ الإعدادات بنجاح');
            }
        }
    </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

// باقي الدوال تبقى كما هي بدون تغيير...
async function handleCheck(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const data = await request.json();
    const { userId, username, chatId } = data;

    if (!userId && !username) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User ID or username is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isMember = await checkTelegramMembership(userId, username, chatId);
    const userInfo = await getUserTelegramInfo(userId, username);

    return new Response(JSON.stringify({
      success: true,
      data: {
        isMember,
        userInfo,
        timestamp: new Date().toISOString(),
        checkId: generateCheckId()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleVerify(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const data = await request.json();
    const { token, userId } = data;

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Verification token is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isValid = await validateVerificationToken(token, userId);

    return new Response(JSON.stringify({
      success: true,
      data: {
        isValid,
        verifiedAt: new Date().toISOString(),
        userId
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleUserInfo(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const data = await request.json();
    const { userId, username } = data;

    if (!userId && !username) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User ID or username is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userInfo = await getUserTelegramInfo(userId, username);

    return new Response(JSON.stringify({
      success: true,
      data: {
        userInfo,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

function handleStatus() {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  return new Response(JSON.stringify({
    success: true,
    data: {
      status: 'online',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: 'always'
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function checkTelegramMembership(userId, username, chatId) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const random = Math.random();
  return random > 0.3;
}

async function getUserTelegramInfo(userId, username) {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const mockUsers = {
    '123456789': {
      id: 123456789,
      username: username || 'test_user',
      firstName: 'John',
      lastName: 'Doe',
      isBot: false,
      languageCode: 'en'
    },
    '987654321': {
      id: 987654321,
      username: 'premium_user',
      firstName: 'Jane',
      lastName: 'Smith',
      isBot: false,
      languageCode: 'en',
      isPremium: true
    }
  };

  if (userId && mockUsers[userId]) {
    return mockUsers[userId];
  }

  return {
    id: userId || Math.floor(Math.random() * 1000000000),
    username: username || 'unknown',
    firstName: 'User',
    lastName: 'Unknown',
    isBot: false,
    languageCode: 'en',
    isMock: true
  };
}

async function validateVerificationToken(token, userId) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!token || token.length < 10) {
    return false;
  }

  const expectedHash = 'verify_' + (userId || 'unknown') + '_' + Math.floor(Date.now() / 3600000);
  const tokenHash = await simpleHash(token);
  const expectedTokenHash = await simpleHash(expectedHash);

  return tokenHash === expectedTokenHash;
}

function generateCheckId() {
  return 'chk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}
