export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const { name, email, service, message } = data;

    const resendApiKey = context.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "Missing Resend API Key" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // Resend requires a verified sender domain. 'onboarding@resend.dev' works for testing if you send to the verified email.
    const resendPayload = {
      from: 'Acme <onboarding@resend.dev>',
      to: ['Isac.Johanssonmusic@gmail.com'],
      subject: `New Portfolio Inquiry from ${name}`,
      html: emailHtml,
      reply_to: email,
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendPayload)
    });

    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: "Failed to send email", details: errorData }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal Server Error", message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
