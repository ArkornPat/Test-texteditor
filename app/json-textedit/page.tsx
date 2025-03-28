import TextEditor from "./_components/textedit";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center">Json Text Editor</h1>
          <p className="text-center text-base-content/70 mt-2">
            Edit your content with rich text formatting
          </p>
        </header>
        <main className="flex justify-center">
          <TextEditor
            section={{
              menuId: "1",
              title: "Test",
              content: "Test",
            }}
          />
        </main>
      </div>
    </div>
  );
}
