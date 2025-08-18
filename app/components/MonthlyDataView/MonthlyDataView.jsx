import React, { useMemo, useCallback } from 'react';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import useStore from '@/app/store';
import { Lunch_cost } from '@/app/utils';

const MonthlyDataView = ({ data, date }) => {
  /** ────────────────────────────────
   *  Store state
   *  ──────────────────────────────── */
  const users          = useStore(s => s.users);
  const approvedUsers  = useMemo(
    () => users.filter(u => u?.status === 'approve'),
    [users]
  );

  /** ────────────────────────────────
   *  Pre-compute lunch quantities
   *  ──────────────────────────────── */
  // 1. Build a map { email -> totalLunchQty } once
  const lunchQtyByEmail = useMemo(() => {
    const map = new Map();
    data.forEach(day =>
      day.data.forEach(({ email, lunchQuantity = 0 }) => {
        map.set(email, (map.get(email) || 0) + lunchQuantity);
      })
    );
    return map;        // stable reference until `data` changes
  }, [data]);

  // 2. Helper that just reads the memoised map
  const userTotalLunchQuantity = useCallback(
    email => lunchQtyByEmail.get(email) || 0,
    [lunchQtyByEmail]
  );

  // 3. Total lunches for the month (scalar)
  const totalLunchCount = useMemo(
    () =>
      [...lunchQtyByEmail.values()].reduce((sum, qty) => sum + qty, 0),
    [lunchQtyByEmail]
  );

  /** ────────────────────────────────
   *  Download handler
   *  ──────────────────────────────── */
  const axiosPublic = useAxiosPublic();
  const handleDownload = useCallback(
    async (email) => {
      try {
        const res = await axiosPublic.get('/download-user-excel', {
          params: { date, email },
          responseType: 'blob',
        });
        const url  = URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.xlsx';
        link.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Error downloading file:', err);
      }
    },
    [axiosPublic, date]
  );

  /** ────────────────────────────────
   *  Render
   *  ──────────────────────────────── */
  return (
    <div className="container mx-auto p-1 mt-0">
      <h2 className="font-bold mt-2">
        Monthly Data View ({approvedUsers.length})
      </h2>

      <table className="min-w-full border-x-2 border border-slate-500 text-left border-collapse">
        <thead>
          <tr>
            <th className="border border-slate-500 p-2">Name</th>
            <th className="border border-slate-500 p-2">Lunch Summary</th>
          </tr>
        </thead>

        <tbody>
          {approvedUsers.map((u) => (
            <tr className="hover:bg-slate-300" key={u.email}>
              <td className="p-2 capitalize flex justify-between">
                <span>{u.name}</span>
                <span
                  className="cursor-pointer hover:font-semibold p-1 flex gap-1"
                  onClick={() => handleDownload(u.email)}
                >
                  <span className="text-sm rounded-md">⏬</span>xlsx
                </span>
              </td>
              <td className="border-x-2 border-slate-500 p-2">
                {`Lunch: ${userTotalLunchQuantity(u.email)} (${userTotalLunchQuantity(u.email) * {Lunch_cost}} BDT)`}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td className="border border-slate-500 p-2 font-bold">
              Total Lunches
            </td>
            <td className="border border-slate-500 p-2 font-bold">
              {totalLunchCount} ({Lunch_cost} TK)
            </td>
          </tr>
          <tr>
            <td className="border border-slate-500 p-2 font-bold">Total Cost</td>
            <td className="border border-slate-500 p-2 font-bold">
              {totalLunchCount * {Lunch_cost}} BDT
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default MonthlyDataView;
