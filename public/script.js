
const form = document.querySelector("#qr-form");
const input = document.querySelector("#url");
const message = document.querySelector("#message");
const result = document.querySelector("#result");
const image = document.querySelector("#qr-image");
const download = document.querySelector("#download");

let previousImageUrl;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  result.hidden = true;
  message.textContent = "Generating QR code...";

  const button = form.querySelector("button");
  button.disabled = true;

  try {
    const response = await fetch("/api/qr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: input.value.trim()
      })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Something went wrong.");
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    if (previousImageUrl) {
      URL.revokeObjectURL(previousImageUrl);
    }

    previousImageUrl = imageUrl;
    image.src = imageUrl;
    download.href = imageUrl;

    result.hidden = false;
    message.textContent = "QR code generated successfully!";
  } catch (error) {
    message.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});
