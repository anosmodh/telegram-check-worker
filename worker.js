// worker.js for Cloudflare Workers
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname
  
  // Telegram Bot Token - احتفظ به سراً
  const BOT_TOKEN = '6510172067:AAF_JICJ4SKhjNMUifBV-Zl8Pir8Ia5X8UA'
  const CHANNEL_USERNAME = 'Dr_ag_on1' // بدون @
  
  // التحقق من CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }
  
  // معالجة طلبات OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  // مسار التحقق
  if (path === '/check' || path === '/') {
    try {
      const params = url.searchParams
      const userId = params.get('user_id') || 
                    params.get('device_id') || 
                    'unknown'
      
      // هنا يجب إضافة منطق الحصول على telegram_id للمستخدم
      // يمكنك استخدام KV storage لتخزين روابط userId مع telegram_id
      
      // افتراضياً، سنرجع false ونطلب الاشتراك
      // في الإصدار الحقيقي، استخدم Telegram API للتحقق
      
      const response = {
        success: true,
        subscribed: false, // غيّر هذا لـ true بعد تنفيذ التحقق الحقيقي
        message: "يرجى الاشتراك في القناة @Dr_ag_on1 أولاً",
        timestamp: new Date().toISOString(),
        user_id: userId,
        channel: "@Dr_ag_on1"
      }
      
      return new Response(JSON.stringify(response), {
        headers: corsHeaders,
        status: 200
      })
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        subscribed: false,
        message: "خطأ في السيرفر: " + error.message,
        timestamp: new Date().toISOString()
      }), {
        headers: corsHeaders,
        status: 500
      })
    }
  }
  
  // مسار التحقق عبر Telegram API (محمي)
  if (path === '/verify' && request.method === 'POST') {
    try {
      const data = await request.json()
      const { telegram_id } = data
      
      if (!telegram_id) {
        return new Response(JSON.stringify({
          success: false,
          message: "معرف التليجرام مطلوب"
        }), {
          headers: corsHeaders,
          status: 400
        })
      }
      
      // استخدام Telegram Bot API للتحقق
      const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember`
      
      const formData = new FormData()
      formData.append('chat_id', `@${CHANNEL_USERNAME}`)
      formData.append('user_id', telegram_id)
      
      const telegramResponse = await fetch(telegramUrl, {
        method: 'POST',
        body: formData
      })
      
      const telegramData = await telegramResponse.json()
      
      if (telegramData.ok) {
        const status = telegramData.result.status
        const isMember = ['member', 'administrator', 'creator'].includes(status)
        
        return new Response(JSON.stringify({
          success: true,
          subscribed: isMember,
          message: isMember ? "مشترك" : "غير مشترك",
          status: status,
          username: telegramData.result.user.username || '',
          timestamp: new Date().toISOString()
        }), {
          headers: corsHeaders,
          status: 200
        })
      } else {
        return new Response(JSON.stringify({
          success: false,
          subscribed: false,
          message: telegramData.description || "فشل التحقق",
          timestamp: new Date().toISOString()
        }), {
          headers: corsHeaders,
          status: 200
        })
      }
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        subscribed: false,
        message: "خطأ: " + error.message,
        timestamp: new Date().toISOString()
      }), {
        headers: corsHeaders,
        status: 500
      })
    }
  }
  
  // الصفحة الرئيسية
  return new Response(JSON.stringify({
    service: "Telegram Subscription Checker",
    version: "1.0",
    endpoints: {
      check: "GET /check?user_id=YOUR_ID",
      verify: "POST /verify {telegram_id: NUMBER}"
    },
    channel: "@Dr_ag_on1"
  }), {
    headers: corsHeaders
  })
}
