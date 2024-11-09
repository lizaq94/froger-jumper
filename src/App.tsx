import './App.css';
import { Board } from './components/Board.tsx';

function App() {
	return (
		<>
			<h1 className="text-3xl font-bold underline border border-rose-500">frog jumper</h1>
			<Board columns={10} rows={6} />
		</>
	);
}

export default App;
