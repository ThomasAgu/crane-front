import NavBar from '../../components/layout/NavBar';
import FlowChart from '../../components/laboratory/FlowChart';

export default function HomePage() {
    return (
        <NavBar>
            <main className="flex min-h-screen">
                <FlowChart />
            </main>
        </NavBar>
    );
}

/*
1. Faltaria agregar el selector de templates y/o el selector de proyectos previos
2. Depende lo que elija pinta en el flowchart.
*/
