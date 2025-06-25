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

// index.ts の app.post('/users', ... ) の中身

app.post("/users", async (req, res) => {
  const name = req.body.name; // フォームから送信された名前を取得
  const ageString = req.body.age; // フォームから送信された年齢を文字列として取得

  // 年齢が入力されている場合のみ、数値に変換する
  const age = ageString ? Number(ageString) : null;

  // もし年齢が入力されていて、かつそれが数値でない場合はエラーとする
  if (age !== null && isNaN(age)) {
    console.error("年齢は数値でなければなりません。");
    res.status(400).send("年齢は数値でなければなりません。");
    return;
  }

  if (name) {
    await prisma.user.create({
      data: { name, age }, // 名前と年齢を保存
    });
    console.log("新しいユーザーを追加しました:", { name, age });
  }
  res.redirect("/"); // ユーザー追加後、一覧ページにリダイレクト
});

// サーバーを起動する
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
