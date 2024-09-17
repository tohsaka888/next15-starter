import List from "./components/List";

export default function Home() {
  return (
    <main>
      {/* <StaticComponents />
      <Suspense fallback={<Loading />}>
        <DynamicComponent />
      </Suspense> */}
      <List />
    </main>
  );
}
