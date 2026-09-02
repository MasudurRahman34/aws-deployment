"use client";
export default function ClientTest() {
  async function testApi() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}`
    );

    const data = await response.json();

    console.log(data);
  }

  return (
    <main>
      <h1>Client API Test</h1>

      <button onClick={testApi}>
        Call Laravel API
      </button>
    </main>
  );
}