import { useState, useEffect } from 'react';
import { getCategories } from '../api/events';

export default function EventForm({ initial = {}, onSubmit, loading }) {
    const [form, setForm] = useState({
        title: initial.title || '',
        description: initial.description || '',
        location: initial.location || '',
        startDate: initial.startDate ? initial.startDate.slice(0, 10) : '',
        categoryId: initial.categoryId || '',
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories().then(res => setCategories(res.data));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
                <label>Description</label>
                <input name="description" value={form.description} onChange={handleChange} required />
            </div>
            <div>
                <label>Location</label>
                <input name="location" value={form.location} onChange={handleChange} required />
            </div>
            <div>
                <label>Start Date</label>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
            </div>
            <div>
                <label>Category</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                    <option value="">Select a category</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
}
