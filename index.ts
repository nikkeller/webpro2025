// index.ts

// Prismaが自動生成したクライアントを、指定の場所からインポートする
import { PrismaClient } from "./generated/prisma/client";

// PrismaClientのインスタンスを作成する
const prisma = new PrismaClient({
  // この設定で、実行されたSQLクエリがコンソールに表示されるようになるぞ
  log: ["query"],
});

// メインの処理を記述する非同期関数
async function main() {
  console.log("Prisma Client を初期化しました。");

  // 既存の全ユーザーを取得して表示する
  let users = await prisma.user.findMany();
  console.log("Before ユーザー一覧:", users);

  // 新しいユーザーを作成する
  const newUser = await prisma.user.create({
    data: {
      name: `新しいユーザー ${new Date().toISOString()}`,
    },
  });
  console.log("新しいユーザーを追加しました:", newUser);

  // もう一度、全ユーザーを取得して表示する
  users = await prisma.user.findMany();
  console.log("After ユーザー一覧:", users);
}

// main関数を実行する
main()
  .catch((e) => {
    // エラーが発生したら、内容を表示して終了する
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // 処理が正常終了してもエラー終了しても、必ず最後にデータベースとの接続を切断する
    await prisma.$disconnect();
    console.log("Prisma Client を切断しました。");
  });
