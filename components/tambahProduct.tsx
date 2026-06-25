import { addProduct } from "@/actions"

export default function AddProductPage() {
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="min-h-screen bg-[#f9f9fb] pb-10">
      {/* Navbar Simple */}
      <header className="bg-white border-b border-gray-100 py-4 mb-8">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#d187c5] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">HP</div>
            <div>
              <h1 className="text-[#d187c5] font-bold leading-none">Hijab Paradise</h1>
              <p className="text-[10px] text-gray-400">Pakaian Muslim Modern</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        <button className="text-[#d187c5] text-sm mb-6 flex items-center gap-2">
          <span>←</span> Kembali ke Toko
        </button>

        <h2 className="text-2xl font-bold text-[#2d2a4a] mb-6">Tambah Item Baru</h2>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50">
          <form action={addProduct} className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
            
            {/* Sisi Kiri: Upload Foto */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Foto Produk</label>
              <div className="aspect-[3/4] bg-gray-100 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition">
                <span className="text-2xl">+</span>
                <span className="text-xs mt-2">Unggah Foto</span>
              </div>
            </div>

            {/* Sisi Kanan: Input Detail */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2d2a4a]">Nama Produk</label>
                <input 
                  name="name"
                  type="text" 
                  placeholder="Contoh: Hijab Voile Premium"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#d187c5] transition"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2d2a4a]">Harga (Rp)</label>
                <input 
                  name="price"
                  type="number" 
                  placeholder="89000"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#d187c5] transition"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2d2a4a]">Pilih Ukuran:</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <label key={size} className="cursor-pointer">
                      <input type="checkbox" name="sizes" value={size} className="hidden peer" />
                      <div className="px-4 py-2 border border-gray-200 rounded-lg text-sm peer-checked:border-[#d187c5] peer-checked:text-[#d187c5] peer-checked:font-bold transition">
                        {size}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2d2a4a]">Deskripsi</label>
                <textarea 
                  name="description"
                  rows={4}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#d187c5] transition"
                  placeholder="Jelaskan detail bahan..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#d187c5] hover:bg-[#c076b4] text-white font-bold rounded-xl shadow-md shadow-pink-100 transition duration-200"
              >
                Simpan Produk Baru
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}