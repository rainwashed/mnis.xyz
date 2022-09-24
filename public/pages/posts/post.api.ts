console.log("Hello World!");

("use strict");

let openedPost = false;

function sleep(ms: number): Promise<void> {
    return new Promise((res, _) => setTimeout(res, ms));
}

interface ManifestEntry {
    title: string;
    desc: string;
    timestamp: number;
    thumbnail: string;
    src: string;
    uid: string;
}

interface ManifestInterface {
    postMetadata: object[];
    postCount: number;
}

let manifest: ManifestInterface;

function checkManifestEntry(uid: string) {
    let returnValue: any[] = [false, undefined];

    manifest?.postMetadata.forEach((entry: any) => {
        // fix this line to use the manifest entry interface
        if (entry?.uid === uid) returnValue = [true, entry];
    });

    return returnValue;
}

function handleHashChange(e: Event): void {
    let hash: string = window?.location?.hash?.slice(1);
    console.log("new hash=", hash);

    if (checkManifestEntry(hash)[0] === false) return;
    if (openedPost) return;

    let entry: ManifestEntry = checkManifestEntry(hash)[1];

    const postLoadIFrame: HTMLIFrameElement = document.getElementById(
        "post-load"
    )! as HTMLIFrameElement;

    console.log(postLoadIFrame);
    postLoadIFrame.src =
        window?.location?.origin +
        "/public/pages/posts/postload.iframe.html?" +
        entry.src;
    postLoadIFrame.classList.add("iframe-visible");

    openedPost = true;
}
window.addEventListener("hashchange", handleHashChange);

async function handleDOMLoaded(e: Event): Promise<void> {
    // this will be if the browser loads with a uid already loaded, show said uid
    let hash: string = window?.location?.hash?.slice(1);
    console.log("loaded hash=", hash);

    const resolveRoot: string =
        window?.location?.origin + "/public/pages/posts/manifest.json";
    manifest = await (await fetch(resolveRoot)).json();

    if (
        hash === "" ||
        hash === undefined ||
        hash === "#" ||
        typeof hash === "undefined"
    )
        return;
    if (checkManifestEntry(hash)[0] === false) return;
    if (openedPost) return;

    let entry: ManifestEntry = checkManifestEntry(hash)[1];

    const postLoadIFrame: HTMLIFrameElement = document.getElementById(
        "post-load"
    )! as HTMLIFrameElement;

    console.log(postLoadIFrame);
    postLoadIFrame.src =
        window?.location?.origin +
        "/public/pages/posts/postload.iframe.html?" +
        entry.src;
    postLoadIFrame.classList.add("iframe-visible");

    openedPost = true;
}
document.addEventListener("DOMContentLoaded", handleDOMLoaded);

function handlePostClick(e: Event): void {
    let target: any = e.target!;
    let uid: string = target.getAttribute("data-manifest-id");

    if (uid === undefined || uid === null || typeof uid === "undefined") return;

    console.log("clicked on uid=", uid);

    window.location.hash = "#" + uid;
}

async function run(): Promise<void> {
    const resolveRoot: string =
        window?.location?.origin + "/public/pages/posts/manifest.json";
    manifest = await (await fetch(resolveRoot)).json();

    let postGrid: HTMLElement = document.getElementById("post-grid")!;
    Array.from(manifest["postMetadata"]).forEach((entry: any) => {
        let newArticle: HTMLElement = document.createElement("article");
        let newTitle: HTMLElement = document.createElement("p");
        let formattedTime: Date | string = new Date(Number(entry["timestamp"]));
        formattedTime = [
            formattedTime.getDate(),
            formattedTime.getMonth() + 1,
            formattedTime.getFullYear(),
        ].join("/");

        newArticle.title = entry["title"];
        newArticle.style.setProperty("--timestamp", `'${formattedTime}'`);
        newArticle.style.setProperty(
            "--bg-url",
            `url('${entry["thumbnail"]}')`
        );
        newArticle.setAttribute("data-manifest-id", entry["uid"]);
        newTitle.innerText = entry["title"];
        newArticle.append(newTitle);

        newArticle.addEventListener("click", handlePostClick);

        postGrid.appendChild(newArticle);
    });
}

run();

window.addEventListener("message", async (e: MessageEvent) => {
    let message: string = e.data;
    const postLoadIFrame: HTMLIFrameElement = document.getElementById(
        "post-load"
    )! as HTMLIFrameElement;

    if (message === "close-iframe") {
        postLoadIFrame?.classList.remove("iframe-visible");
        await sleep(500);
        postLoadIFrame.src = "";

        window.location.hash = "";
        openedPost = false;
    }
});
