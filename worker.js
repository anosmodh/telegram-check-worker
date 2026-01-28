// worker.js - Cloudflare Worker مع تحقق حقيقي من Telegram API
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// KV namespace لتخزين البيانات (اختياري)
// const TELEGRAM_LINKS = 'TELEGRAM_LINKS'

async function handleRequest(request) {
  const url = new URL(request.url)
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  // معالجة CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // المسار الرئيسي للتحقق
  if (url.pathname === '/check' || url.pathname === '/') {
    return await handleCheckRequest(request, url)
  }

  // مسار ربط حساب التليجرام
  if (url.pathname === '/link' && request.method === 'POST') {
    return await handleLinkRequest(request)
  }

  // مسار التحقق المباشر
  if (url.pathname === '/verify' && request.method === 'POST') {
    return await handleDirectVerify(request)
  }

  // صفحة المعلومات
  return new Response(JSON.stringify({
    service: "ANOS MOD Telegram Verifier",
    version: "2.0",
    endpoints: {
      check: "GET /check?user_id=DEVICE_ID&telegram_id=TELEGRAM_ID",
      link: "POST /link {device_id: '', telegram_id: ''}",
      verify: "POST /verify {telegram_id: ''}"
    },
    note: "يجب الاشتراك في @Dr_ag_on1"
  }), { headers: corsHeaders })
}

// ============ معالجة طلب التحقق ============
async function handleCheckRequest(request, url) {
  try {
    const params = url.searchParams
    const deviceId = params.get('user_id') || params.get('device_id')
    const telegramId = params.get('telegram_id')
    const debug = params.get('debug') === 'true'

    // 🔐 معلومات البوت والقناة (احتفظ بها سرية في الإنتاج)
    const BOT_TOKEN = '6510172067:AAF_JICJ4SKhjNMUifBV-Zl8Pir8Ia5X8UA'
    const CHANNEL_USERNAME = 'Dr_ag_on1' // بدون @

    // 1. إذا كان هناك telegram_id، تحقق مباشرة
    if (telegramId) {
      const verification = await verifyTelegramSubscription(telegramId, BOT_TOKEN, CHANNEL_USERNAME)
      
      if (verification.verified) {
        // ✅ مشترك
        return jsonResponse({
          success: true,
          subscribed: true,
          message: `✅ تم التحقق! أنت مشترك في @${CHANNEL_USERNAME}`,
          username: verification.username,
          telegram_id: telegramId,
          channel: `@${CHANNEL_USERNAME}`,
          timestamp: new Date().toISOString()
        })
      } else {
        // ❌ غير مشترك
        return jsonResponse({
          success: true,
          subscribed: false,
          message: `❌ أنت غير مشترك في @${CHANNEL_USERNAME}`,
          telegram_id: telegramId,
          channel: `@${CHANNEL_USERNAME}`,
          timestamp: new Date().toISOString(),
          instructions: "1. اشترك في القناة 2. أعد فتح التطبيق"
        })
      }
    }

    // 2. إذا لم يكن هناك telegram_id، نطلب ربط الحساب
    if (deviceId) {
      // هنا يمكنك البحث في KV Storage عن telegram_id مرتبط بهذا deviceId
      // const storedTelegramId = await TELEGRAM_LINKS.get(deviceId)
      
      // للمرة الأولى، نطلب ربط الحساب
      return jsonResponse({
        success: true,
        subscribed: false,
        message: "🔗 يرجى ربط حساب التليجرام أولاً",
        device_id: deviceId,
        instructions: [
          "1. افتح التطبيق وانقر على 'ربط حساب التليجرام'",
          "2. أرسل الرمز للبوت @ANOSMOD_bot",
          "3. عد للتطبيق وأعد المحاولة"
        ],
        bot_username: "@ANOSMOD_bot",
        channel: `@${CHANNEL_USERNAME}`,
        timestamp: new Date().toISOString()
      })
    }

    // 3. بدون بيانات كافية
    return jsonResponse({
      success: false,
      subscribed: false,
      message: "❌ يرجى تقديم معرف الجهاز (user_id)",
      timestamp: new Date().toISOString()
    }, 400)

  } catch (error) {
    console.error('Check error:', error)
    return jsonResponse({
      success: false,
      subscribed: false,
      message: `🚨 خطأ في السيرفر: ${error.message}`,
      timestamp: new Date().toISOString()
    }, 500)
  }
}

// ============ معالجة طلب الربط ============
async function handleLinkRequest(request) {
  try {
    const data = await request.json()
    const { device_id, telegram_id, username } = data

    if (!device_id || !telegram_id) {
      return jsonResponse({
        success: false,
        message: "❌ device_id و telegram_id مطلوبان"
      }, 400)
    }

    // 🔐 تخزين في KV (Cloudflare KV Storage)
    // await TELEGRAM_LINKS.put(device_id, JSON.stringify({
    //   telegram_id,
    //   username,
    //   linked_at: new Date().toISOString()
    // }))

    return jsonResponse({
      success: true,
      message: "✅ تم ربط الحساب بنجاح!",
      device_id,
      telegram_id,
      username,
      linked_at: new Date().toISOString(),
      note: "يمكنك الآن التحقق من الاشتراك"
    })

  } catch (error) {
    return jsonResponse({
      success: false,
      message: `❌ خطأ في الربط: ${error.message}`
    }, 500)
  }
}

// ============ تحقق مباشر ============
async function handleDirectVerify(request) {
  try {
    const data = await request.json()
    const { telegram_id } = data

    if (!telegram_id) {
      return jsonResponse({
        success: false,
        message: "❌ telegram_id مطلوب"
      }, 400)
    }

    const BOT_TOKEN = '6510172067:AAF_JICJ4SKhjNMUifBV-Zl8Pir8Ia5X8UA'
    const CHANNEL_USERNAME = 'Dr_ag_on1'

    const verification = await verifyTelegramSubscription(telegram_id, BOT_TOKEN, CHANNEL_USERNAME)

    return jsonResponse({
      success: true,
      subscribed: verification.verified,
      message: verification.verified ? 
        `✅ تم التحقق! مشترك في @${CHANNEL_USERNAME}` : 
        `❌ غير مشترك في @${CHANNEL_USERNAME}`,
      telegram_id,
      username: verification.username,
      status: verification.status,
      channel: `@${CHANNEL_USERNAME}`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return jsonResponse({
      success: false,
      message: `❌ خطأ في التحقق: ${error.message}`
    }, 500)
  }
}

// ============ دالة التحقق من Telegram API ============
async function verifyTelegramSubscription(userId, botToken, channelUsername) {
  try {
    const url = `https://api.telegram.org/bot${botToken}/getChatMember`
    
    const formData = new FormData()
    formData.append('chat_id', `@${channelUsername}`)
    formData.append('user_id', userId)

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.ok) {
      return {
        verified: false,
        username: '',
        status: 'error',
        error: data.description || 'فشل التحقق'
      }
    }

    const status = data.result.status
    const username = data.result.user.username || ''
    const firstName = data.result.user.first_name || ''

    // الحالات التي تعتبر مشتركاً
    const isMember = ['member', 'administrator', 'creator', 'restricted'].includes(status)

    return {
      verified: isMember,
      username: username || firstName,
      status: status,
      user_info: {
        id: data.result.user.id,
        is_bot: data.result.user.is_bot || false,
        language_code: data.result.user.language_code || 'ar'
      }
    }

  } catch (error) {
    console.error('Telegram verification error:', error)
    return {
      verified: false,
      username: '',
      status: 'api_error',
      error: error.message
    }
  }
}

// ============ دالة مساعدة للردود JSON ============
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
