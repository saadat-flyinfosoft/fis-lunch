import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import useStore from '@/app/store';

const SelectMenu = () => {
  /* Zustand data */
  const menu         = useStore(s => s.menu);
  const lunches      = useStore(s => s.lunches);
  const refetchMenu  = useStore(s => s.fetchMenu);
  const refetchLunch = useStore(s => s.fetchLunches);

  const axiosPublic  = useAxiosPublic();

  /* local UI state */
  const [open, setOpen]           = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [search,  setSearch]      = useState('');
  const [selected, setSelected]   = useState('');

  const dlgRef = useRef(null);

  /* RHF */
  const { register, handleSubmit, setValue } = useForm();

  /* filtered list */
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

  const openDialog    = () => { setSearch(''); setShowSearch(false); setOpen(true); };
  const closeDialog   = () => setOpen(false);

  /* events */
  const pickMenu = val => {
    setSelected(val);
    setValue('menu', val);
    setShowSearch(false);
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

  /* render */
  return (
    <>
      <button onClick={openDialog} className="text-white text-3xl">🍔</button>

      <dialog ref={dlgRef} className="modal modal-middle" onCancel={closeDialog}>
        <div className="modal-box w-80 max-w-full relative">
          {/* HEADER + close */}
          <button
            onClick={closeDialog}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            <span className="text-red-200">✕</span>
          </button>

          {/* ── MAIN SCREEN ─────────────────────────────── */}
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
                      ? 'border w-16 shadow border-red-500 bg-blue-900 hover:bg-blue-800 text-blue-300 text-sm font-semibold md:mx-2 py-1 px-2 rounded my-2'
                      : 'border w-16 shadow border-gray-300 bg-blue-900 hover:bg-blue-800 text-blue-300 text-sm font-semibold md:mx-2 py-1 px-2 rounded my-2'
                  }`}
                >
                  {loading ? '🫘' : '✓'}
                </button>
                </div>
              </form>

              {/* current day menus (delete) */}
              <div className="flex flex-wrap justify-center gap-1 mt-4">
                {lunches.menu?.map((menuName, i) => (
              <p className="flex items-center my-2" key={i}>
                <small
                  className={`${
                    loading
                      ? 'border border-red-500 w-24 flex justify-center items-center rounded-md text-gray-400 mx-1 text-center'
                      : 'border w-24 flex justify-center items-center rounded-md text-gray-400 mx-1 text-center'
                  }`}
                >
                  {menuName}
                </small>
                <span
                  onClick={() => deleteMenu(menuName)}
                  className="text-red-500 cursor-pointer"
                >
                  ❌
                </span>
              </p>
            ))}
              </div>
            </>
          )}

          {/* ── SEARCH SCREEN ──────────────────────────── */}
          {showSearch && (
            <>
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search menu…"
                className="w-full p-2 mt-4 mb-2 rounded bg-gray-800 text-gray-300 border placeholder-gray-500"
              />

              <div className="h-[36rem] sm:max-h-60 overflow-auto border rounded">
                {filtered.length ? (
                  filtered.map((m, i) => (
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

              <button
                onClick={() => setShowSearch(false)}
                className="btn btn-sm bg-blue-800 text-white mt-3"
              >
                Back
              </button>
            </>
          )}
        </div>
      </dialog>
    </>
  );
};

export default SelectMenu;
