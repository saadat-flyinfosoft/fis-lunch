// store.js
import { create }  from 'zustand';
import axios from 'axios';

const axiosPublic = axios.create({
    baseURL: 'https://fis-lunch-server.vercel.app'
});

const useStore = create((set) => ({
    users: [],
    lunches: [],
    menu: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
        set({ loading: true });
        try {
            const response = await axiosPublic.get('/users');
            set({ users: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchLunches: async () => {
        set({ loading: true });
        try {
            const response = await axiosPublic.get('/lunch');
            set({ lunches: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchMenu: async () => {
        set({ loading: true });
        try {
            const response = await axiosPublic.get('/menu');
            set({ menu: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    // Initial fetch on store creation
    initialize: async () => {
        const store = useStore.getState();
        await store.fetchUsers();
        await store.fetchLunches();
        await store.fetchMenu();
    }
}));

// Initialize the store on first load
useStore.getState().initialize();

export default useStore;