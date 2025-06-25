// index.js

// Node.jsに標準で組み込まれているhttpとurlモジュールを読み込む
import http from "node:http";
import { URL } from "node:url";

// サーバーのポート番号を設定する。
// 環境変数 PORT があればそれを使う。なければ 8888 を使う。
const PORT = process.env.PORT || 8888;

// httpサーバーを作成する
const server = http.createServer((req, res) => {
  // アクセスされたURLをパースして、パス名やクエリパラメータを取得しやすくする
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // レスポンスのヘッダーに、文字コードがUTF-8であることを設定する
  // これをしないと日本語が文字化けしてしまうことがあるんじゃ
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  // ルートパス ("/") へのアクセスだった場合の処理
  if (pathname === "/") {
    console.log("/ へのアクセスがありました。");
    res.writeHead(200); // ステータスコード 200 (成功) を返す
    res.end("こんにちは！"); // "こんにちは！" という文字列を返す

    // "/ask" パスへのアクセスだった場合の処理
  } else if (pathname === "/ask") {
    console.log("/ask へのアクセスがありました。");
    // クエリパラメータ 'q' を取得する
    const question = parsedUrl.searchParams.get("q");
    res.writeHead(200);
    res.end(`Your question is '${question}'`);

    // それ以外のパスへのアクセスだった場合の処理
  } else {
    console.log("不明なパスへのアクセスがありました。");
    res.writeHead(404); // ステータスコード 404 (見つからない) を返す
    res.end("ページが見つかりません");
  }
});

// 指定したポートでサーバーを起動し、リクエストを待ち受ける
server.listen(PORT, () => {
  console.log(
    `サーバーがポート ${PORT} で起動しました。 http://localhost:${PORT}/ を開いて確認してください。`
  );
});
