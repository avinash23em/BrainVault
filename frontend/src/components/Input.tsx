export function Input({ ref, placeholder, error }: { ref?: React.Ref<HTMLInputElement>; placeholder: string; error?: string }) {
  return (
    <div>
      <input type="text" ref={ref} placeholder={placeholder} className={`border rounded px-4 py-2 m-2 w-full ${error ? "border-red-500" : "border-gray-300"}`} />
      {error && <p className="text-red-500 text-sm mx-2 mt-1">{error}</p>}
    </div>
  );
}
