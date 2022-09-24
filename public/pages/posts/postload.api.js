const documentQuery = document?.location?.search?.slice(1);
const markdownRenderCanvas = document.getElementById("markdown-render");

console.log(documentQuery);
(async () => {
    let markdownFile = await (await fetch(window?.location?.origin + "/public/pages/posts/md/" + documentQuery)).text();
    markdownRenderCanvas.innerHTML = marked.parse(markdownFile);
})()

document.getElementById("close-btn").addEventListener("click", (e) => {
    window.parent.postMessage("close-iframe");
});