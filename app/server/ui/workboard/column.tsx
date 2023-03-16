

export default function ColumnWorkboard({
  title,
  children,
}:
  {
    title:string
    children: React.ReactNode
  }
) {
  return (
    <div className="rounded bg-slate-300 flex-no-shrink w-64 p-2 mr-3">
    <div className="flex justify-between py-1">
      <h3 className="text-sm">{title}</h3>
      <svg className="h-4 fill-current text-grey-dark cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 10a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4z" /></svg>
    </div>
    <div className="text-sm mt-2">
      {children}

      {/* <div className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
        Remove analytics code
      </div>

      <div className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
        Whatever
      </div> */}

      <button className="mt-3 text-grey-dark">Add a card...</button>
    </div>
  </div>
  );
}