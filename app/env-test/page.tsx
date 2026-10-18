"use client";

export default function EnvTest() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Env Test</h1>
      <p>Token: {process.env.NEXT_PUBLIC_ADMIN_TOKEN}</p>
    </div>
  );
}