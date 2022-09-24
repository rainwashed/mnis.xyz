if (Test-Path "./public/pages/posts/build/post.api.js") {
    Remove-Item "./public/pages/posts/build/post.api.js";
}

npx.cmd tsc --project "tsconfig.json"
npx.cmd jsmin -o public/pages/posts/build/post.api.js public/pages/posts/build/post.api.js 