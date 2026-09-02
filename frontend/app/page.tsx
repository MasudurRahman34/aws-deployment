type ApiResponse = {
  status: string;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

async function getBackendData(): Promise<ApiResponse> {
  const response = await fetch(`${process.env.API_INTERNAL_URL}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to connect to Laravel API");
  }

  return response.json();
}

export default async function Home() {
  const data = await getBackendData();

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold">PrintToDoor </h1>

      <div className="mt-8">
        <p>
          <strong>Status:</strong> {data.status}
        </p>

        <p>
          <strong>Message:</strong> {data.message}
        </p>

        <h2 className="mt-6 text-xl font-semibold">User</h2>

        <p>Name: {data.user.name}</p>
        <p>Email: {data.user.email}</p>
      </div>
    </main>
  );
}