import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../styles/CareerCompare.css';

const CareerCompare = () => {
    const [course1, setCourse1] = useState('');
    const [course2, setCourse2] = useState('');
    const [comparison, setComparison] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCompare = async () => {
        if (!course1 || !course2) {
            return alert('Please enter both courses to compare.');
        }

        setLoading(true);
        setComparison('');
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/compare-courses', {
                course1,
                course2,
            });

            const table = res.data.table?.trim();

            if (!table || !table.includes('|')) {
                setError('⚠️ Invalid comparison data received.');
            } else {
                setComparison(table);
            }
        } catch (err) {
            console.error('Compare Error:', err);
            setError('⚠️ Error fetching comparison. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="compare-wrapper">
            <h1>⚖️ Compare Two Courses</h1>
            <p>Understand key differences and make the right academic choice.</p>

            <div className="compare-inputs">
                <input
                    type="text"
                    placeholder="Enter first course (e.g. MBA)"
                    value={course1}
                    onChange={(e) => setCourse1(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter second course (e.g. BBA)"
                    value={course2}
                    onChange={(e) => setCourse2(e.target.value)}
                />
                <button
                    className={`compare-btn ${loading ? 'loading' : ''}`}
                    onClick={handleCompare}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="loading-spinner">
                            <span className="bar bar1"></span>
                            <span className="bar bar2"></span>
                            <span className="bar bar3"></span>
                        </div>
                    ) : (
                        '🔍 Compare Now'
                    )}
                </button>


            </div>

            {error && <p className="error-text">{error}</p>}

            {comparison && (
                <div className="comparison-result markdown-table">
                    <ReactMarkdown
                        children={comparison}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                    />
                </div>
            )}
        </div>
    );
};

export default CareerCompare;
