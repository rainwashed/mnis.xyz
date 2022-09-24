console.log("Hello World");
console.log(window?.location?.origin + "/public/pages/posts/manifest.json");

// let manifest;

(async () => {
    manifest = await (await (await fetch(window?.location?.origin + "/public/pages/posts/manifest.json")).json());
})

function startMainProcess() {
    let postDomElements = document.querySelectorAll("div#post-grid article");

    console.log(postDomElements);

    function handlePostClick(e) {
        const t = e.target;
        let uid = t.getAttribute("data-manifest-id");

        console.log("clicked on", uid);
    }

    postDomElements.forEach((elem) => {
        elem.onclick = handlePostClick;
    });

    console.log(manifest);
}

(async function () {
    let jsonData = await (await (await fetch(window?.location?.origin + "/public/pages/posts/manifest.json")).json());

    let postGrid = document.getElementById("post-grid");
    Array.from(jsonData["postMetadata"]).forEach((entry) => {
        let newElem = document.createElement("article");
        newElem.title = entry["title"];
        let formattedTime = new Date(Number(entry["timestamp"]));
        formattedTime = [formattedTime.getDate(), formattedTime.getMonth() + 1, formattedTime.getFullYear()].join("-");
        newElem.style.setProperty("--timestamp", `'${formattedTime}'`)
        newElem.style.setProperty("--bg-url", `url('${entry["thumbnail"]}')`)
        newElem.setAttribute("data-manifest-id", entry["uid"])

        let p = document.createElement("p");
        p.innerText = entry["title"]
        newElem.append(p)

        postGrid.appendChild(newElem);
    });

    manifest = jsonData;

    startMainProcess();
})();