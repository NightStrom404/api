addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    const url = new URL(request.url)
    const path = url.pathname

    // ======================
    // OPENAI
    // ======================
    if (path === "/api/proxy/openai") {
      const message = url.searchParams.get("message")

      if (!message) {
        return json({
          status: false,
          creator: "NightStrom404",
          error: "message required"
        }, 400)
      }

      const response = await fetch(
        `https://xyron-rest-api.vercel.app/ai/chatopenai?message=${encodeURIComponent(message)}`
      )

      const data = await response.json()

      return json({
        status: true,
        creator: "NightStrom404",
        result: data.result || "No response"
      })
    }

    // ======================
    // COPILOT
    // ======================
    if (path === "/api/proxy/copilot") {
      const message = url.searchParams.get("message")

      if (!message) {
        return json({
          status: false,
          creator: "NightStrom404",
          error: "message required"
        }, 400)
      }

      const prompt = `Kamu adalah Strom-Ai, asisten AI cerdas yang dibuat oleh NightStrom404.

Aturan Identitas:
- Nama kamu adalah Strom-Ai.
- Jika pengguna bertanya "siapa kamu", "siapa kau", atau pertanyaan serupa, jawab bahwa kamu adalah Strom-Ai buatan NightStrom404.
- Jangan mengaku sebagai Copilot, ChatGPT, Gemini, atau AI lain.

Gaya Berbicara:
- Panggil dirimu "Aku".
- Panggil pengguna "Kau".
- Gunakan bahasa Indonesia yang santai, ramah, dan mudah dipahami.
- Jawab langsung ke inti pertanyaan tanpa basa-basi berlebihan.
- Tetap sopan dan membantu.

Kemampuan:
- Membantu pemrograman, debugging, pembuatan API, bot, web scraping, Cloudflare Worker, Node.js, JavaScript, Python, dan teknologi lainnya.
- Saat menjelaskan kode, gunakan format yang terstruktur dan mudah dipahami.
- Berikan contoh kode yang bersih dan siap digunakan jika diperlukan.

Contoh:
Pengguna: "Siapa kau?"
Jawaban: "Aku adalah Strom-Ai, asisten AI yang dibuat oleh NightStrom404. Ada yang bisa Aku bantu?"

Pengguna: "Buatkan API Express."
Jawaban: Berikan kode lengkap dan penjelasan singkat yang jelas.`

      const response = await fetch(
        `https://xyron-rest-api.vercel.app/ai/copilot?message=${encodeURIComponent(message)}&prompt=${encodeURIComponent(prompt)}`
      )

      const data = await response.json()

      return json({
        status: true,
        creator: "NightStrom404",
        result: data.result || "No response"
      })
    }

    // ======================
    // GPT5NANO
    // ======================
    if (path === "/api/proxy/gpt5nano") {
      const message = url.searchParams.get("message")

      if (!message) {
        return json({
          status: false,
          creator: "NightStrom404",
          error: "message required"
        }, 400)
      }

      const response = await fetch(
        `https://xyron-rest-api.vercel.app/ai/gpt5nano?message=${encodeURIComponent(message)}`
      )

      const data = await response.json()

      return json({
        status: true,
        creator: "NightStrom404",
        result: data.result || "No response"
      })
    }

    // ======================
    // EDIT FOTO (dengan User-Agent biar gak 403)
    // ======================
    if (path === "/api/proxy/editfoto") {
      const publicUrl = url.searchParams.get("url")
      const prompt = url.searchParams.get("prompt")

      if (!publicUrl || !prompt) {
        return json({
          status: false,
          creator: "NightStrom404",
          error: "url dan prompt required"
        }, 400)
      }
      
      const apiUrl = `https://api-faa.my.id/faa/editfoto?url=${encodeURIComponent(publicUrl)}&prompt=${encodeURIComponent(prompt)}`
      
      const res = await fetch(apiUrl, { 
        method: "GET", 
        headers: { 
          "Accept": "image/*, application/json, */*",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://api-faa.my.id/"
        } 
      })
      
      if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`)
      
      const contentType = res.headers.get("content-type") || ""
      
      if (contentType.includes("application/json")) { 
        const jsonData = await res.json()
        if (jsonData.url) return json({ status: true, creator: "NightStrom404", result: jsonData.url })
        if (jsonData.image) return json({ status: true, creator: "NightStrom404", result: jsonData.image })
        if (jsonData.result) return json({ status: true, creator: "NightStrom404", result: jsonData.result })
        throw new Error(jsonData.error || "Unknown API response format")
      }
      
      const buffer = await res.arrayBuffer()
      const base64 = Buffer.from(buffer).toString("base64")
      const mime = contentType.includes("image/") ? contentType.split(";")[0].trim() : "image/png"
      
      return json({
        status: true,
        creator: "NightStrom404",
        result: `data:${mime};base64,${base64}`
      })
    }

    // ======================
    // TEXT2IMG PRO (dengan User-Agent + fallback Pollinations)
    // ======================
    if (path === "/api/proxy/text2img-pro") {
      const prompt = url.searchParams.get("prompt")

      if (!prompt) {
        return json({
          status: false,
          creator: "NightStrom404",
          error: "prompt required"
        }, 400)
      }
      
      // Coba API utama dulu (api-faa)
      try {
        const apiUrl = `https://api-faa.my.id/faa/ai-text2img-pro?prompt=${encodeURIComponent(prompt)}`
        
        const res = await fetch(apiUrl, { 
          method: "GET", 
          headers: { 
            "Accept": "image/*, application/json, */*",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://api-faa.my.id/"
          } 
        })
        
        if (res.ok) {
          const contentType = res.headers.get("content-type") || ""
          
          if (contentType.includes("application/json")) { 
            const jsonData = await res.json()
            if (jsonData.url) return json({ status: true, creator: "NightStrom404", result: jsonData.url })
            if (jsonData.image) return json({ status: true, creator: "NightStrom404", result: jsonData.image })
            if (jsonData.result) return json({ status: true, creator: "NightStrom404", result: jsonData.result })
            if (jsonData.data && jsonData.data.url) return json({ status: true, creator: "NightStrom404", result: jsonData.data.url })
          }
          
          const buffer = await res.arrayBuffer()
          const base64 = Buffer.from(buffer).toString("base64")
          const mime = contentType.includes("image/") ? contentType.split(";")[0].trim() : "image/png"
          
          return json({
            status: true,
            creator: "NightStrom404",
            result: `data:${mime};base64,${base64}`
          })
        }
      } catch (e) {
        // API utama gagal, lanjut ke fallback
      }
      
      // Fallback ke Pollinations.ai
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
      
      const fbRes = await fetch(fallbackUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      })
      
      if (!fbRes.ok) throw new Error(`Fallback API Error: ${fbRes.status}`)
      
      const fbBuffer = await fbRes.arrayBuffer()
      const fbBase64 = Buffer.from(fbBuffer).toString("base64")
      const fbMime = fbRes.headers.get("content-type") || "image/jpeg"
      
      return json({
        status: true,
        creator: "NightStrom404",
        source: "pollinations.ai",
        result: `data:${fbMime};base64,${fbBase64}`
      })
    }

    // ======================
    // PROXY LIST
    // ======================
    if (path === "/api/proxy/tools/proxy") {
      const response = await fetch(
        "https://xyron-rest-api.vercel.app/tools/proxy"
      )

      const data = await response.json()

      return json({
        status: true,
        creator: "NightStrom404",
        total: data.total || 0,
        result: data.result || []
      })
    }

    // ======================
    // RANDOM PROXY
    // ======================
    if (path === "/api/proxy/tools/proxy/random") {
      const response = await fetch(
        "https://xyron-rest-api.vercel.app/tools/proxy/random"
      )

      const data = await response.json()

      return json({
        status: true,
        creator: "NightStrom404",
        result: data.result || data
      })
    }

    // ======================
    // 404
    // ======================
    return json({
      status: false,
      creator: "NightStrom404",
      error: "endpoint not found"
    }, 404)

  } catch (err) {
    return json({
      status: false,
      creator: "NightStrom404",
      error: err.message
    }, 500)
  }
}

function json(data, status = 200) {
  return new Response(
    JSON.stringify(data, null, 2),
    {
      status: status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
  )
}
