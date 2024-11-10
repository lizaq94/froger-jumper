import './App.css';
import { Board } from './components/Board.tsx';

function App() {
	return (
		<>
			<h1 className="text-4xl font-bold underline mb-10">frog jumper</h1>
			<Board columns={10} rows={6} />
		</>
	);
}

export default App;
