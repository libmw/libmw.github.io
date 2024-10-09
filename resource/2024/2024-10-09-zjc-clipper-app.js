document.addEventListener("DOMContentLoaded", () => {
  const inputImage = document.getElementById("inputImage");
  const image = document.getElementById("image");
  const cropper = document.getElementById("cropper");
  const exportBtn = document.getElementById("exportBtn");

  let cropperInstance;

  inputImage.addEventListener("change", (e) => {
    const files = e.target.files;
    const done = (url) => {
      inputImage.value = "";
      image.src = url;
      image.style.display = "block";

      if (cropperInstance) {
        cropperInstance.destroy();
      }

      cropperInstance = new Cropper(image, {
        aspectRatio: 3 / 4,
        viewMode: 1,
        dragMode: "move",
      });
    };

    const reader = new FileReader();
    reader.onload = (e) => done(reader.result);
    reader.readAsDataURL(files[0]);
  });

  exportBtn.addEventListener("click", () => {
    const canvas = cropperInstance.getCroppedCanvas({
      width: 150,
      height: 200,
    });

    canvas.toBlob(
      (blob) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imgData = e.target.result;

          // Compress image using pica library
          const targetCanvas = document.createElement("canvas");
          targetCanvas.width = 150;
          targetCanvas.height = 200;

          const picaImg = pica();
          const unsharpAmount =
            +document.getElementById("unsharpAmount")?.value || 0;
          const unsharpThreshold =
            +document.getElementById("unsharpThreshold")?.value || 0;
          console.log(unsharpAmount, unsharpThreshold);
          picaImg
            .resize(canvas, targetCanvas, {
              unsharpAmount: unsharpAmount,
              unsharpThreshold: unsharpThreshold,
            })
            .then((result) => {
              const compressedBlob = dataURLtoBlob(
                targetCanvas.toDataURL("image/jpeg"),
                "image/jpeg"
              );

              // Ensure size is below 64KB
              if (compressedBlob.size <= 64 * 1024) {
                // Create a download link
                const link = document.createElement("a");
                link.href = URL.createObjectURL(compressedBlob);
                link.download = "cropped-image.jpg";
                link.click();
              } else {
                alert(
                  "Compressed image size is still above 64KB. Please try again."
                );
              }
            })
            .catch((err) => console.error(err));
        };
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      0.9
    ); // Adjust quality here, 0.7 is 70% quality
  });

  function dataURLtoBlob(dataUrl, mimeType) {
    const byteString = atob(dataUrl.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  }
});
