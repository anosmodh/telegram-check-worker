export default {
  async fetch(request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user_id");

    if (!userId) {
      return new Response(JSON.stringify({ error: "missing user_id" }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }

    const BOT_TOKEN = "PUT_BOT_TOKEN_HERE"; // ضع توكن البوت هنا
    const CHANNEL = "@Dr_ag_on1";

    const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${CHANNEL}&user_id=${userId}`;

    const tgRes = await fetch(tgUrl);
    const tgJson = await tgRes.json();

    let subscribed = false;

    if (tgJson.ok) {
      const status = tgJson.result.status;
      if (["member", "administrator", "creator"].includes(status)) {
        subscribed = true;
      }
    }

    return new Response(JSON.stringify({ is_subscribed: subscribed }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
