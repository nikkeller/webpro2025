// index.ts

import express from "express";
// 生成した Prisma Client をインポート
import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient({
  // クエリが実行されたときに実際に実行したクエリをログに表示する設定
  log: ["query"],
});
const app = express();

// 環境変数が設定されていれば、そこからポート番号を取得する。なければ 8888 を使用する。
const PORT = process.env.PORT || 8888;

// EJS をテンプレートエンジンとして設定する
app.set("view engine", "ejs");
app.set("views", "./views"); // EJSのテンプレートファイルが置かれているフォルダを指定

// form のデータを受け取れるように設定
app.use(express.urlencoded({ extended: true }));

// ルートパス("/")にGETリクエストが来たときの処理
app.get("/", async (req, res) => {
  // データベースから全ユーザーを取得する
  const users = await prisma.user.findMany();
  // 'index.ejs' を使ってHTMLを生成し、'users' という名前でユーザー一覧データを渡す
  res.render("index", { users });
});

// "/users"にPOSTリクエストが来たときの処理 (ユーザー追加)
app.post("/users", async (req, res) => {
  // フォームから送信された 'name' を取得
  const name = req.body.name;
  if (name) {
    // データベースに新しいユーザーを作成する
    await prisma.user.create({
      data: { name },
    });
    console.log("新しいユーザーを追加しました:", name);
  }
  // ユーザー追加後、一覧ページにリダイレクトする
  res.redirect("/");
});

// サーバーを起動する
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
