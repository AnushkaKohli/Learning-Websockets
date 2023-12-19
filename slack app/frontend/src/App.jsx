function App() {

  return (
    <>
      <div className="grid grid-cols-12 divide-x divide-gray-300">
        <aside className="col-span-4 h-screen overflow-y-auto">
          { 
            Array(50).fill(0).map((_, i) => {
              return (
                <div className= "p-2 hover:bg-gray-100 cursor-pointer" key= {i}>
                  Room #{i + 1}
                </div>
            )
            })
          }
        </aside>

        <main className="col-span-8 px-8 h-screen overflow-y-auto flex flex-col">
        <div className="flex-grow"></div>
        <div className="mb-8 flex justify-center items-center gap-2">
        <textarea id="about" name="about" rows="2" class="block w-full rounded-md mb-8 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 flex-grow"></textarea>
        <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex-shrink-0"
                >
                Send Message
        </button>
        </div>
        </main>
      </div>
    </>
  )
}

export default App
