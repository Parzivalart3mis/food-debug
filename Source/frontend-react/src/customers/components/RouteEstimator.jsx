import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function RouteEstimator({ restaurantId }) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { auth } = useSelector(store => store);
    const userId = auth.user?.id;

    console.log('RouteEstimator props →', { restaurantId, userId });

    useEffect(() => {
        if (!restaurantId || !userId) {
            return;
        }

        (async () => {
            setErrorMsg('');
            setLoading(true);

            try {
                const resp = await fetch(
                    `http://localhost:5454/api/route/auto?restaurantId=${restaurantId}&userId=${userId}`
                );

                // Always read as text first so we can log raw response
                const text = await resp.text();
                console.log('Raw response text:', text);

                if (!resp.ok) {
                    console.error(
                        `Route fetch failed [${resp.status} ${resp.statusText}]:`,
                        text
                    );
                    setErrorMsg(`Server error (${resp.status}): ${resp.statusText}`);
                    setResult(null);
                    return;
                }

                let data;
                try {
                    data = JSON.parse(text);
                } catch (parseErr) {
                    console.error('Failed to parse JSON:', parseErr);
                    setErrorMsg(`Malformed JSON from server: ${text}`);
                    setResult(null);
                    return;
                }

                setResult(data);
            } catch (networkErr) {
                console.error('Network error fetching route:', networkErr);
                setErrorMsg('Network error. Please check your connection.');
                setResult(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [restaurantId, userId]);

    if (!restaurantId || !userId) {
        return <p className="p-4">Waiting for restaurant or user data…</p>;
    }

    if (loading) {
        return <p className="p-4">Loading route…</p>;
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl mb-2">Route from Your Restaurant to You</h2>

            {errorMsg && (
                <p className="text-red-600 mb-2">{errorMsg}</p>
            )}

            {result ? (
                <>
                    <p><strong>Origin:</strong> {result.origin}</p>
                    <p><strong>Destination:</strong> {result.destination}</p>
                    <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(result.maps, null, 2)}
          </pre>
                </>
            ) : !errorMsg ? (
                <p>No route data available.</p>
            ) : null}
        </div>
    );
}
