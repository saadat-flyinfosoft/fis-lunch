import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import useStore from '@/app/store';

const IDLE_BLUR_MS = 2000;      // ← 2-second inactivity timeout
const CLOSE_DELAY  = 500;       // ← 0.5 s before returning to main view

export default function SelectMenu() {
  const menu         = useStore(s => s.menu);
  const lunches      = useStore(s => s.lunches);
  const refetchMenu  = useStore(s => s.fetchMenu);
  const refetchLunch = useStore(s => s.fetchLunches);
  const axiosPublic  = useAxiosPublic();

  const [open, setOpen]             = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState('');

  const dlgRef   = useRef(null);
  const inputRef = useRef(null);
  const idle     = useRef(null);

  const { register, handleSubmit, setValue } = useForm();

  const filtered = useMemo(
    () => menu.filter(m => m.menu.toLowerCase().includes(search.toLowerCase())),
    [menu, search]
  );

  /* open / close dialog */
  useEffect(() => {
    const dlg = dlgRef.current;
    if (!dlg) return;
    open ? dlg.showModal() : dlg.open && dlg.close();
  }, [open]);

  const openDialog  = () => { setSearch(''); setShowSearch(false); setOpen(true); };
  const closeDialog = () => setOpen(false);

  /* idle blur logic (2 s) */
  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
      idle.current = setTimeout(() => inputRef.current?.blur(), IDLE_BLUR_MS);
    }
    return () => clearTimeout(idle.current);
  }, [showSearch]);

  const restartIdle = () => {
    clearTimeout(idle.current);
    idle.current = setTimeout(() => inputRef.current?.blur(), IDLE_BLUR_MS);
  };

  /* pick menu: blur immediately, hide search after 0.5 s */
  const pickMenu = val => {
    setSelected(val);
    setValue('menu', val);
    inputRef.current?.blur();          // disable focus immediately
    clearTimeout(idle.current);

    setTimeout(() => {
      setSearch('');
      setShowSearch(false);            // return to main view (recentres)
    }, CLOSE_DELAY);
  };

  const deleteMenu = async m => {
    try {
      setLoading(true);
      await axiosPublic.delete('/menutoday', { data: { menu: m } });
      await Promise.all([refetchLunch(), refetchMenu()]);
    } finally {
      setLoading(false);
    }
  };

  const submitMenu = async data => {
    try {
      setLoading(true);
      await axiosPublic.patch('/menutoday', data);
      refetchLunch();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={openDialog} className="text-white text-3xl">🍔</button>

      <dialog ref={dlgRef} className="modal modal-middle" onCancel={closeDialog}>
        <div className="modal-box w-80 max-w-full relative">
          <button onClick={closeDialog}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

          {/* MAIN FORM */}
          {!showSearch && (
            <>
              <form onSubmit={handleSubmit(submitMenu)} className="space-y-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="w-12 text-gray-400">Menu:</span>

                  <input
                    readOnly
                    value={selected}
                    placeholder="Select menu…"
                    onClick={() => setShowSearch(true)}
                    className="flex-1 p-1 text-center rounded bg-slate-200 text-gray-600 border cursor-pointer"
                  />
                  <input type="hidden" {...register('menu', { required: true })} value={selected} />

                  <button
                    type="submit"
                    disabled={loading}
                    className={`${
                      loading
                        ? 'border w-16 shadow border-red-500 bg-blue-900 text-blue-300 rounded'
                        : 'border w-16 shadow border-gray-300 bg-blue-900 text-blue-300 rounded'
                    }`}
                  >
                    {loading ? '🫘' : '✓'}
                  </button>
                </div>
              </form>

              {/* day menus */}
              <div className="flex flex-wrap justify-center gap-1 mt-4">
                {lunches.menu?.map((m,i) => (
                  <span key={i} className="flex items-center gap-1">
                    <small className="border rounded px-2 text-gray-400">{m}</small>
                    <span onClick={() => deleteMenu(m)} className="text-red-500 cursor-pointer">❌</span>
                  </span>
                ))}
              </div>
            </>
          )}

          {/* SEARCH SCREEN */}
          {showSearch && (
            <>
              <input
                ref={inputRef}
                value={search}
                onChange={e => { setSearch(e.target.value); restartIdle(); }}
                onFocus={restartIdle}
                placeholder="Search menu…"
                className="w-full p-2 mt-6 mb-2 rounded bg-gray-800 text-gray-300 border placeholder-gray-500"
              />

              <div className="h-[36rem] sm:max-h-60 overflow-auto border rounded">
                {filtered.length ? (
                  filtered.map((m,i) => (
                    <div
                      key={i}
                      onClick={() => pickMenu(m.menu)}
                      className="px-4 py-2 border cursor-pointer hover:bg-gray-700 text-gray-400 text-center"
                    >
                      {i + 1}. {m.menu}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-center text-gray-500">No items found</div>
                )}
              </div>

              <button onClick={() => { setShowSearch(false); setSearch(''); }}
                      className="btn btn-sm bg-blue-800 text-white mt-3">
                Back
              </button>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
