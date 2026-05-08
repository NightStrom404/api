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

      const response = await fetch(
        `https://xyron-rest-api.vercel.app/ai/copilot?message=${encodeURIComponent(message)}`
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
        result: data
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
        result: data
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
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
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

      const response = await fetch(
        `https://xyron-rest-api.vercel.app/ai/copilot?message=${encodeURIComponent(message)}`
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
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  })
}
