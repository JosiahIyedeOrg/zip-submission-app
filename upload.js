async function uploadVideo() {
  const file = document.getElementById("videoFile").files[0];
  const progressBar = document.getElementById("progressBar");
  const statusText = document.getElementById("statusText");
  const videoPreview = document.getElementById("videoPreview");

  if (!file) {
    statusText.textContent = "Please select a file.";
    return;
  }

 const allowedTypes = [
  // Videos
  "video/mp4",
  "video/avi",
  "video/quicktime",

  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Archives
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.rar",
  "application/x-rar-compressed",

  // Images
  "image/jpeg",
  "image/png"
];



  if (!allowedTypes.includes(file.type)) {
    statusText.textContent =
  "Allowed formats: .mp4, .avi, .zip, .rar, .mov, .pdf, .doc, .docx";
    return;
  }

  if (file.size > 500 * 1024 * 1024) {
    statusText.textContent = "Max file size is 500MB.";
    return;
  }

  // Your container SAS token from Azure
  const sasToken =
    "sp=racwdli&st=2026-06-22T13:41:04Z&se=2027-05-31T21:56:04Z&spr=https&sv=2026-02-06&sr=c&sig=Gj6p5IFz%2Bdkjth6mYaIkWyIntYBcI0CDVKN9K4%2B4XZg%3D";

  // Storage details
  const accountName = "graphicsdesign";
  const containerName = "github";
  const blobName = encodeURIComponent(file.name);

  // Build the full blob URL
  const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
  const blobUrl = `https://graphicsdesign.blob.core.windows.net/github?sp=racwdli&st=2026-06-22T13:41:04Z&se=2027-05-31T21:56:04Z&spr=https&sv=2026-02-06&sr=c&sig=Gj6p5IFz%2Bdkjth6mYaIkWyIntYBcI0CDVKN9K4%2B4XZg%3D`;

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", uploadUrl, true);
  xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      progressBar.style.width = percent.toFixed(2) + "%";
    }
  };

  xhr.onload = () => {
  if (xhr.status === 201) {
    statusText.textContent = "✅ Upload successful!";

    const fileUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;

    if (file.type.startsWith("video/")) {
      videoPreview.src = fileUrl;
      videoPreview.style.display = "block";
    } else {
      videoPreview.style.display = "none";
      statusText.innerHTML += `<br>
        <a href="${fileUrl}" target="_blank">📄 View / Download file</a>`;
    }
  } else {
    statusText.textContent =
      `❌ Upload failed (Status ${xhr.status}). Check your SAS token.`;
  }
};


  xhr.onerror = () => {
    statusText.textContent = "❌ Network or server error during upload.";
  };

  statusText.textContent = "⏳ Uploading...";
  xhr.send(file);
}
