import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import useStore from '@/app/store';

const SelectMenu = () => {
  /* ── store data ───────────────────────── */
  const menu         = useStore(s => s.menu);
  const lunches      = useStore(s => s.lunches);
  const refetchMenu  = useStore(s => s.fetchMenu);
  const refetchLunch = useStore(s => s.fetchLunches);

  /* ── local state ──────────────────────── */
  const [loading, setLoading]         = useState(false);
  const [search,  setSearch]          = useState('');
  const [selected, setSelected]       = useState('');
  const [mainOpen, setMainOpen]       = useState(false);
  const [dropOpen, setDropOpen]       = useState(false);

  /* ── refs to <dialog> elements ────────── */
  const mainDlg = useRef(null);
  const dropDlg = useRef(null);

  /* ── react-hook-form setup ───────────── */
  const { register, handleSubmit, setValue } = useForm();

  /* ── axios instance ──────────────────── */
  const axiosPublic = useAxiosPublic();

  /* ── memoised filtered list ──────────── */
  const filtered = useMemo(
    () => menu.filter(m => m.menu.toLowerCase().includes(search.toLowerCase())),
    [menu, search]
  );

  /* ── open/close side-effects ─────────── */
  useEffect(() => {
    const dlg = mainDlg.current;
    if (!dlg) return;
    mainOpen ? dlg.showModal() : dlg.open && dlg.close();
  }, [mainOpen]);

  useEffect(() => {
    const dlg = dropDlg.current;
    if (!dlg) return;
    dropOpen ? dlg.showModal() : dlg.open && dlg.close();
  }, [dropOpen]);

  /* ── helpers ─────────────────────────── */
  const openMain  = () => { setSearch(''); setMainOpen(true);  setDropOpen(false); };
  const closeMain = () => setMainOpen(false);

  const openDrop  = () => { setSearch(''); setMainOpen(false); setDropOpen(true); };
  const closeDrop = () => { setDropOpen(false); setMainOpen(true); };

  const onSelect  = val => { setSelected(val); setValue('menu', val); closeDrop(); };

  const onDelete  = async m => {
    try {
      setLoading(true);
      await axiosPublic.delete('/menutoday', { data: { menu: m } });
      await Promise.all([refetchLunch(), refetchMenu()]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit  = async data => {
    try {
      setLoading(true);
      await axiosPublic.patch('/menutoday', data);
      refetchLunch();
    } finally {
      setLoading(false);
    }
  };

  /* ── render ──────────────────────────── */
  return (
    <>
      <button onClick={openMain} className="text-white text-3xl">🍔</button>

      {/* MAIN MODAL */}
      <dialog ref={mainDlg} className="modal modal-middle" onCancel={closeMain}>
        <div className="modal-box">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-2">
              <span className="w-12 text-gray-400">Menu:</span>

              <input
                readOnly
                value={selected}
                onClick={openDrop}
                placeholder="Select menu…"
                className="w-72 p-1 text-center rounded bg-slate-200 text-gray-600 border cursor-pointer"
              />

              <input type="hidden" {...register('menu', { required: true })} value={selected} />

              <button
                type="submit"
                disabled={loading}
                className="w-16 border bg-blue-900 text-blue-300 rounded"
              >
                {loading ? '🫘' : '✓'}
              </button>
            </div>
          </form>

          <button onClick={closeMain} className="btn btn-circle btn-ghost absolute right-2 top-2">✕</button>

          <div className="flex flex-wrap justify-center gap-1 mt-3">
            {lunches.menu?.map((m, i) => (
              <span key={i} className="flex items-center gap-1">
                <small className="border rounded px-2 text-gray-400">{m}</small>
                <span onClick={() => onDelete(m)} className="text-red-500 cursor-pointer">❌</span>
              </span>
            ))}
          </div>
        </div>
      </dialog>

      {/* DROPDOWN MODAL */}
      <dialog ref={dropDlg} className="modal modal-middle" onCancel={closeDrop}>
        <div className="modal-box w-80">
          <input
            autoFocus={dropOpen}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search menu…"
            className="w-full p-2 mb-2 mt-4 rounded bg-gray-800 text-gray-300 border placeholder-gray-500"
          />

          <div className="h-[36rem] sm:max-h-60 overflow-auto border rounded">
            {filtered.length ? (
              filtered.map((m, i) => (
                <div
                  key={i}
                  onClick={() => onSelect(m.menu)}
                  className="px-4 py-2 border cursor-pointer hover:bg-gray-700 text-gray-400 text-center"
                >
                  {i + 1}. {m.menu}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-center text-gray-500">No items found</div>
            )}
          </div>

          <button onClick={closeDrop} className="btn btn-circle btn-ghost absolute right-0 top-0">✕</button>
        </div>
      </dialog>
    </>
  );
};

export default SelectMenu;
