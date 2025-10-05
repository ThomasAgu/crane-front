import NavBar from '../components/NavBar';
import FlowChart from '../components/FlowChart';

export default function HomePage() {
    return (
        <NavBar>
            <main className="flex min-h-screen">
                <FlowChart />
            </main>
        </NavBar>
    );
}
