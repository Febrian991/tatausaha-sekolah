import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Plus,
  Printer,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Filter,
  X,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { InventoryItem } from '../types/index.ts';

export const InventoryView: React.FC = () => {
  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    openPrintModal,
    schoolProfile,
    globalSearchQuery,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCondition, setSelectedCondition] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    kodeBarang: '',
    namaBarang: '',
    kategori: 'Elektronik & Komputer' as InventoryItem['kategori'],
    lokasiRuang: 'Laboratorium Komputer 1',
    jumlah: 1,
    satuan: 'Unit',
    kondisi: 'Baik' as InventoryItem['kondisi'],
    tahunPerolehan: '2024',
    sumberDana: 'BOS Reguler' as InventoryItem['sumberDana'],
    penanggungJawab: '',
  });

  const activeSearch = globalSearchQuery || search;

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.namaBarang.toLowerCase().includes(activeSearch.toLowerCase()) ||
      item.kodeBarang.toLowerCase().includes(activeSearch.toLowerCase()) ||
      item.lokasiRuang.toLowerCase().includes(activeSearch.toLowerCase()) ||
      item.penanggungJawab.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.kategori === selectedCategory;
    const matchesCondition = selectedCondition === 'ALL' || item.kondisi === selectedCondition;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const damagedCount = inventory.filter((i) => i.kondisi !== 'Baik').length;
  const goodCount = inventory.filter((i) => i.kondisi === 'Baik').length;

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      kodeBarang: `INV/${Math.floor(100 + Math.random() * 899)}/2026`,
      namaBarang: '',
      kategori: 'Elektronik & Komputer',
      lokasiRuang: 'Laboratorium Komputer 1',
      jumlah: 1,
      satuan: 'Unit',
      kondisi: 'Baik',
      tahunPerolehan: '2026',
      sumberDana: 'BOS Reguler',
      penanggungJawab: schoolProfile.kepalaTU,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      kodeBarang: item.kodeBarang,
      namaBarang: item.namaBarang,
      kategori: item.kategori,
      lokasiRuang: item.lokasiRuang,
      jumlah: item.jumlah,
      satuan: item.satuan,
      kondisi: item.kondisi,
      tahunPerolehan: item.tahunPerolehan,
      sumberDana: item.sumberDana,
      penanggungJawab: item.penanggungJawab,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaBarang || !formData.kodeBarang) return;

    if (editingItem) {
      updateInventoryItem(editingItem.id, formData);
    } else {
      addInventoryItem(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Overview Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Total Aset & Barang Terdaftar</div>
          <div className="text-2xl font-bold font-mono text-slate-900">{inventory.length} Pos Barang</div>
          <div className="text-[11px] text-slate-400 mt-1">Tercatat dalam buku inventaris sekolah</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Kondisi Baik & Siap Pakai</div>
          <div className="text-2xl font-bold font-mono text-emerald-600">{goodCount} Pos</div>
          <div className="text-[11px] text-slate-400 mt-1">Dapat digunakan dalam KBM harian</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Perlu Pemeliharaan / Perbaikan</div>
          <div className="text-2xl font-bold font-mono text-amber-600">{damagedCount} Pos</div>
          <div className="text-[11px] text-slate-400 mt-1">Rusak Ringan / Rusak Berat</div>
        </div>
      </div>

      {/* Action Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode barang, nama barang, ruang..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Elektronik & Komputer">Elektronik & Komputer</option>
            <option value="Mebel & Perlengkapan">Mebel & Perlengkapan</option>
            <option value="Media Pembelajaran">Media Pembelajaran</option>
            <option value="Buku & Pustaka">Buku & Pustaka</option>
            <option value="Peralatan Lab">Peralatan Lab</option>
          </select>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="ALL">Semua Kondisi</option>
            <option value="Baik">Kondisi Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Aset Sarpras</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-semibold text-slate-800">{filteredInventory.length}</span> barang inventaris
          </div>
          <div className="text-[11px] text-slate-400">
            Pencatatan sarpras sesuai standar pedoman barang milik daerah/sekolah
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 select-none">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Kode Barang & Thn</th>
                <th className="py-2.5 px-4 font-semibold">Nama Barang / Aset</th>
                <th className="py-2.5 px-4 font-semibold">Lokasi Ruangan</th>
                <th className="py-2.5 px-4 font-semibold">Jumlah</th>
                <th className="py-2.5 px-4 font-semibold">Kondisi</th>
                <th className="py-2.5 px-4 font-semibold">Sumber Dana & PJ</th>
                <th className="py-2.5 px-4 font-semibold text-right">Aksi Sarpras</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div className="font-bold text-slate-900">{item.kodeBarang}</div>
                    <div className="text-slate-400 text-[10px]">Tahun {item.tahunPerolehan}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.namaBarang}</div>
                    <div className="text-slate-500 text-[11px]">{item.kategori}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.lokasiRuang}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {item.jumlah} <span className="font-normal text-xs text-slate-500">{item.satuan}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.kondisi === 'Baik'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.kondisi === 'Rusak Ringan'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {item.kondisi}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    <div>{item.sumberDana}</div>
                    <div className="text-slate-400 text-[10px]">PJ: {item.penanggungJawab}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                        title="Edit Barang"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus barang inventaris ${item.namaBarang}?`)) {
                            deleteInventoryItem(item.id);
                          }
                        }}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Hapus Barang"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Inventory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900">
                {editingItem ? 'Edit Data Barang Inventaris (Sarpras)' : 'Registrasi Barang Inventaris Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kode Barang / Register*</label>
                  <input
                    type="text"
                    required
                    value={formData.kodeBarang}
                    onChange={(e) => setFormData({ ...formData, kodeBarang: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kategori Barang</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="Elektronik & Komputer">Elektronik & Komputer</option>
                    <option value="Mebel & Perlengkapan">Mebel & Perlengkapan</option>
                    <option value="Media Pembelajaran">Media Pembelajaran</option>
                    <option value="Buku & Pustaka">Buku & Pustaka</option>
                    <option value="Peralatan Lab">Peralatan Lab</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Nama Barang Lengkap / Spesifikasi*</label>
                <input
                  type="text"
                  required
                  value={formData.namaBarang}
                  onChange={(e) => setFormData({ ...formData, namaBarang: e.target.value })}
                  placeholder="Contoh: PC Desktop Core i7 16GB RAM"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Lokasi Ruangan Penempatan</label>
                  <input
                    type="text"
                    required
                    value={formData.lokasiRuang}
                    onChange={(e) => setFormData({ ...formData, lokasiRuang: e.target.value })}
                    placeholder="Contoh: Lab Komputer 1 / Ruang Kelas XI RPL"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jumlah & Satuan</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.jumlah}
                      onChange={(e) => setFormData({ ...formData, jumlah: Number(e.target.value) })}
                      className="w-16 px-2 py-1.5 border border-slate-300 rounded font-mono"
                    />
                    <input
                      type="text"
                      value={formData.satuan}
                      onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kondisi</label>
                  <select
                    value={formData.kondisi}
                    onChange={(e) => setFormData({ ...formData, kondisi: e.target.value as any })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tahun Pengadaan</label>
                  <input
                    type="text"
                    value={formData.tahunPerolehan}
                    onChange={(e) => setFormData({ ...formData, tahunPerolehan: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Sumber Dana</label>
                  <select
                    value={formData.sumberDana}
                    onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value as any })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="BOS Reguler">BOS Reguler</option>
                    <option value="BOS Kinerja">BOS Kinerja</option>
                    <option value="Komite Sekolah">Komite Sekolah</option>
                    <option value="Bantuan Pemerintah (DAK)">Bantuan Pemerintah (DAK)</option>
                    <option value="Yayasan">Yayasan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Penanggung Jawab / Pengelola Ruangan</label>
                <input
                  type="text"
                  value={formData.penanggungJawab}
                  onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
                >
                  Simpan Barang Inventaris
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
