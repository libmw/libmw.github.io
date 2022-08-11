let paraViewer;
const dropTarget = document.getElementById("panorama");
dropTarget.addEventListener("dragover", (event) => {
  // prevent default to allow drop
  event.preventDefault();
});
dropTarget.addEventListener("drop", (event) => {
  event.preventDefault();
  console.log("event: ", event);
  const file = event.dataTransfer?.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = (e) => {
      paraViewer && paraViewer.destroy()
      paraViewer = pannellum.viewer("panorama", {
        type: "equirectangular",
        panorama: e.target.result,
        autoLoad: true,
        pitch: 10,
      });
    }
    reader.readAsDataURL(file);
  }
});
