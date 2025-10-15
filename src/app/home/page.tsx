'use client'
import { useEffect } from 'react';
import NavBar from '../../components/layout/NavBar';

export default function HomePage() {
    useEffect(() => {
        const fetchApps = async () => {
            const stored = localStorage.getItem("access_token");
            if (!stored) return console.error("No hay token en localStorage");
            
            debugger
            try {
                const res = await fetch("http://127.0.0.1:8000/api/v1/roles/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${stored}`,
                    },
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Error ${res.status}: ${errorText}`);
                }

                const data = await res.json();
                console.log("✅ Apps:", data);
            } catch (err) {
                console.error("❌ Error:", err);
            }
        };

        fetchApps();
    }, []);

    return (
        <NavBar>
            <main className="flex min-h-screen">
                Hello from home
            </main>
        </NavBar>
    );
}
